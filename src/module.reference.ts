import 'reflect-metadata';
import { AbstractModule } from './types/module.abstract';
import {
  ControllerPrefix,
  ControllerToken,
  InjectProviderModel,
  InjectTokenObject,
  ProviderToken,
} from './types/tokens.types';
import { E_TOKENS } from './types/tokens.enum';
import { TypeSpecifier } from './utils/type-specifier';
import {
  CircularDependencyError,
  InvalidFactoryError,
  ModuleManagerError,
  ProviderNotFoundError,
  describeToken,
} from './errors';

function isInjectProviderModel(declaration: any): declaration is InjectProviderModel {
  return !!declaration && typeof declaration === 'object' && 'token' in declaration;
}

export class ModuleRef {
  private controllers: Map<ControllerPrefix | ControllerToken, any> = new Map();
  private providers: Map<ProviderToken, any> = new Map();
  private resolutionStack: ProviderToken[] = [];

  constructor(
    private module: typeof AbstractModule,
    private importedModules: ModuleRef[]
  ) {
    this.registerProviders();
    this.registerControllers();
  }

  private declarationKey(declaration: any): ProviderToken {
    return isInjectProviderModel(declaration) ? declaration.token : declaration;
  }

  private findOwnDeclaration(token: ProviderToken): any {
    return (this.module.providers ?? []).find(
      (declaration) => this.declarationKey(declaration) === token
    );
  }

  private canExport(token: ProviderToken): boolean {
    return (this.module.exports ?? []).includes(token);
  }

  private resolve(token: ProviderToken): any {
    if (this.providers.has(token)) return this.providers.get(token);

    const ownDeclaration = this.findOwnDeclaration(token);
    if (ownDeclaration) return this.construct(ownDeclaration, token);

    for (const importedModule of this.importedModules) {
      if (importedModule.canExport(token)) return importedModule.resolve(token);
    }

    throw new ProviderNotFoundError(token, this.module.name);
  }

  private construct(declaration: any, cacheKey: ProviderToken): any {
    if (this.resolutionStack.includes(cacheKey)) {
      throw new CircularDependencyError([...this.resolutionStack, cacheKey]);
    }

    this.resolutionStack.push(cacheKey);
    try {
      const instance = isInjectProviderModel(declaration)
        ? this.constructInjectProvider(declaration)
        : this.constructClassProvider(declaration);
      this.providers.set(cacheKey, instance);
      return instance;
    } finally {
      this.resolutionStack.pop();
    }
  }

  private constructInjectProvider(declaration: InjectProviderModel): any {
    if ('useValue' in declaration) {
      return declaration.useValue;
    }

    if (declaration.useFactory) {
      try {
        return TypeSpecifier.isClass(declaration.useFactory)
          ? new declaration.useFactory()
          : declaration.useFactory();
      } catch (error) {
        throw new InvalidFactoryError(declaration.token, error);
      }
    }

    throw new ModuleManagerError(
      `Provider "${describeToken(declaration.token)}" in module "${this.module.name}" must define either "useValue" or "useFactory".`
    );
  }

  private constructClassProvider(providerClass: ProviderToken): any {
    if (!Reflect.getMetadata(E_TOKENS.INJECTABLE, providerClass)) {
      throw new ModuleManagerError(
        `Class "${describeToken(providerClass)}" is used as a provider in module "${this.module.name}" but is not decorated with @Injectable().`
      );
    }

    return new providerClass(...this.resolveDependencies(providerClass));
  }

  private resolveDependencies(target: any): any[] {
    const dependencyTokens: ProviderToken[] | undefined = Reflect.getMetadata(
      E_TOKENS.DESIGN_PARAMTYPES,
      target
    );
    if (!dependencyTokens) return [];

    const injectTokens: InjectTokenObject[] =
      Reflect.getMetadata(E_TOKENS.INJECT_TOKENS, target) || [];

    return dependencyTokens.map((dependencyToken, index) => {
      const injectToken = injectTokens.find((injectObject) => injectObject.index === index);
      return this.resolve(injectToken ? injectToken.token : dependencyToken);
    });
  }

  private registerProviders() {
    for (const declaration of this.module.providers ?? []) {
      this.resolve(this.declarationKey(declaration));
    }
  }

  private registerControllers() {
    for (const controller of this.module.controllers ?? []) {
      const controllerToken: ControllerPrefix | ControllerToken =
        Reflect.getMetadata(E_TOKENS.CONTROLLER_PREFIX, controller) || controller;
      this.controllers.set(
        controllerToken,
        new controller(...this.resolveDependencies(controller))
      );
    }
  }

  public getController<ControllerInstance>(
    controllerToken: ControllerPrefix | ControllerToken
  ): ControllerInstance | undefined {
    return this.controllers.get(controllerToken) as ControllerInstance;
  }
}
