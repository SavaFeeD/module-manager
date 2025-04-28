import 'reflect-metadata';
import { AbstractModule } from "./types/module.abstract";
import { ControllerPrefix, ControllerToken, InjectProviderModel, InjectTokenObject, ProviderToken } from './types/tokens.types';
import { E_TOKENS } from './types/tokens.enum';
import { Container } from './container';
import { TypeSpecifier } from './utils/type-specifier';

const enum E_REGISTER_CALL_ORDER {
  first = 'registerProviders',
  second = 'registerControllers',
};

export class ModuleRef {
  private controllers: Map<ControllerPrefix | ControllerToken, any> = new Map();
  private providers: Map<ProviderToken, any> = new Map();

  constructor(
    private parentContainer: Container,
    private module: typeof AbstractModule
  ) {
    this[E_REGISTER_CALL_ORDER.first]();
    this[E_REGISTER_CALL_ORDER.second]();
  };

  private registerProviders() {
    const providers = this.module.providers;
    if (!providers) return;

    for (const provider of providers) {
      if (this.providers.has(provider)) continue;
      const dependencyTokens: ProviderToken[] | undefined =  Reflect.getMetadata(E_TOKENS.DESIGN_PARAMTYPES, provider);
      const dependencies: any[] = [];
      dependencyTokens?.forEach((dependencyToken, index) => {
        if (!TypeSpecifier.isClass(dependencyToken)) {
          const injectTokens: InjectTokenObject[] = Reflect.getMetadata(E_TOKENS.INJECT_TOKENS, provider) || [];
          const injectToken = injectTokens.find((injectObject) => injectObject.index === index);
          if (!this.parentContainer.providers.has(injectToken?.token)) return console.warn(`[WARN] (Inject) ${injectToken} is not provide in`, this.parentContainer);
          dependencies.push(this.parentContainer.providers.get(injectToken?.token));
        } else {
          if (!this.parentContainer.providers.has(dependencyToken)) return console.warn(`[WARN] (Injectable) ${dependencyToken} is not provide in`, this.parentContainer);
          dependencies.push(this.parentContainer.providers.get(dependencyToken));
        }
      });
      
      let providerToken: ProviderToken;
      let providerInstance: any;

      if (provider?.token) {
        const injectProvider = this.getInjectProviderWithInstance(provider);
        if (!injectProvider) return console.warn(`[WARN] Provider type is not Inject. ${provider.token} is not provide in`, this.parentContainer);
        providerToken = injectProvider.token;
        providerInstance = injectProvider.instance;
        Reflect.defineMetadata(providerToken, providerInstance, this.module);
      } else {
        providerToken = provider;
        providerInstance = new provider(...dependencies);
        Reflect.defineMetadata(providerToken, provider, this.module);
      }

      this.providers.set(providerToken, providerInstance);
    };
  };

  private getInjectProviderWithInstance(injectProvider: InjectProviderModel) {
    if (!injectProvider?.token) return null;

    let injectInstance: any;
    
    if (injectProvider?.useValue) {
      injectInstance = injectProvider.useValue;
    }
    
    if (injectProvider?.useFactory) {
      const factory = injectProvider.useFactory;
      try {
        if (TypeSpecifier.isClass(factory)) {
          injectInstance = new injectProvider.useFactory();
        } else {
          injectInstance = injectProvider.useFactory();
        }
      } catch(error) {
        console.error('A factory can be either a function or a class.', error);
        return null;
      }
    }

    return {
      token: injectProvider.token,
      instance: injectInstance,
    };
  };

  private registerControllers() {
    const controllers = this.module.controllers;    
    if (!controllers) return;

    for (const controller of controllers) {
      if (this.controllers.has(controller)) continue;
      const dependencyTokens: ProviderToken[] | undefined =  Reflect.getMetadata(E_TOKENS.DESIGN_PARAMTYPES, controller);
      const dependencies: any[] = [];
      dependencyTokens?.forEach((dependencyToken) => {
        if (!this.providers.has(dependencyToken)) return console.warn(`[WARN] ${dependencyToken} is not provide in`, String(this));
        dependencies.push(this.providers.get(dependencyToken));
      });
      const controllerToken: ControllerPrefix | ControllerToken = Reflect.getMetadata(E_TOKENS.CONTROLLER_PREFIX, controller) || controller;
      const controllerInstance = new controller(...dependencies);
      this.controllers.set(controllerToken, controllerInstance);
    };
  };

  public getController<ControllerInstance>(controllerToken: ControllerPrefix | ControllerToken): ControllerInstance | undefined {
    return this.controllers.get(controllerToken) as ControllerInstance;
  };

};