import { AbstractModule, FoundModuleDTO } from "./types/module.abstract";
import { ModuleRef } from "./module.reference";
import {
  ControllerPrefix,
  ControllerToken,
  ModuleToken,
  ProviderToken,
} from "./types/tokens.types";
import { of } from "./utils/map-processing";
import { AuditContainer } from "./audit-container";


export class Container extends AuditContainer {
  private _modules: Map<ModuleToken, ModuleRef> = new Map();

  public get modules() {
    return this._modules;
  };

  registerModule(module: typeof AbstractModule) {
    if (this._modules.has(module)) return console.warn(`Module has in Container`);
    this.processProvidersInPool();
    const moduleInstance = new ModuleRef(this, module);
    this._modules.set(module, moduleInstance);
  };

  getModuleByName(moduleName: string) {
    return of<typeof AbstractModule, ModuleRef>(this._modules).find(({ key }) => moduleName === key.name);
  };

  getController<Co>(prefix: ControllerPrefix | ControllerToken) {
    return of<typeof AbstractModule, ModuleRef>(this._modules).map(({ value }) => {
      return value.getController<Co>(prefix);
    }).find((controller) => !!controller);
  };

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
  };

};

export const container = new Container();