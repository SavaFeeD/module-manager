import { AbstractModule, FoundModuleDTO } from './types/module.abstract';
import { ModuleRef } from './module.reference';
import {
  ControllerPrefix,
  ControllerToken,
  ModuleToken,
  ProviderToken,
} from './types/tokens.types';
import { of } from './utils/map-processing';
import { CircularImportError } from './errors';

export class Container {
  private _modules: Map<ModuleToken, ModuleRef> = new Map();

  public get modules() {
    return this._modules;
  }

  registerModule(module: typeof AbstractModule): ModuleRef {
    return this.registerModuleWithStack(module, []);
  }

  private registerModuleWithStack(
    module: typeof AbstractModule,
    resolutionStack: ModuleToken[]
  ): ModuleRef {
    const existing = this._modules.get(module);
    if (existing) return existing;

    if (resolutionStack.includes(module)) {
      throw new CircularImportError([...resolutionStack, module]);
    }

    const nextStack = [...resolutionStack, module];
    const importedModuleRefs = (module.imports ?? []).map((importedModule) =>
      this.registerModuleWithStack(importedModule, nextStack)
    );

    const moduleInstance = new ModuleRef(module, importedModuleRefs);
    this._modules.set(module, moduleInstance);
    return moduleInstance;
  }

  getModuleByName(moduleName: string) {
    return of<typeof AbstractModule, ModuleRef>(this._modules).find(
      ({ key }) => moduleName === key.name
    );
  }

  getController<Co>(prefix: ControllerPrefix | ControllerToken) {
    return of<typeof AbstractModule, ModuleRef>(this._modules)
      .map(({ value }) => {
        return value.getController<Co>(prefix);
      })
      .find((controller) => !!controller);
  }

  findModuleByProviderToken(providerToken: ProviderToken): FoundModuleDTO | null {
    let module: FoundModuleDTO | null = null;
    this._modules.forEach((moduleRef, moduleClass) => {
      if (moduleClass.providers?.includes(providerToken)) {
        module = {
          token: moduleClass,
          reference: moduleRef,
        };
      }
    });
    return module;
  }
}

export const container = new Container();
