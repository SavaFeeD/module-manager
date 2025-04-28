import { E_PROVIDER_TYPES } from "./types/provider-types.enum";
import { E_TOKENS } from "./types/tokens.enum";
import { InjectProviderModel, InjectTokenObject, ProviderToken, RegistrationModel } from "./types/tokens.types";
import { Pool } from "./utils/pool";
import { TypeSpecifier } from "./utils/type-specifier";


export class AuditContainer {
  public providers: Map<ProviderToken, any> = new Map();
  private providersPool: Pool<RegistrationModel> = new Pool((data) => data);
  
  public addProviderToPool(type: E_PROVIDER_TYPES.INJECT | E_PROVIDER_TYPES.INJECTABLE, providerToken: ProviderToken) {
    this.providersPool.append({
      provider: providerToken,
      type,
    });
  };

  registerInnerInject(injectProvider: InjectProviderModel) {
    this.registerGlobalInject(injectProvider);
  }

  protected processProvidersInPool() {
    const providers = this.providersPool.acquire();
    const providersByType: Record<E_PROVIDER_TYPES.INJECT | E_PROVIDER_TYPES.INJECTABLE, ProviderToken[]> = {
      [E_PROVIDER_TYPES.INJECT]: [],
      [E_PROVIDER_TYPES.INJECTABLE]: [],
    };

    providers.forEach(({ type, provider }) => {
      const condition = type === E_PROVIDER_TYPES.INJECTABLE || type === E_PROVIDER_TYPES.INJECT;
      if (condition) {
        providersByType[type].push(provider);
      }
    });
    
    this.dispatchRegisterProviders(providersByType, E_PROVIDER_TYPES.INJECT);
    this.dispatchRegisterProviders(providersByType, E_PROVIDER_TYPES.INJECTABLE);
  };

  protected dispatchRegisterProviders(
    providersByType: Record<E_PROVIDER_TYPES.INJECT | E_PROVIDER_TYPES.INJECTABLE, ProviderToken[]>,
    type: E_PROVIDER_TYPES.INJECT | E_PROVIDER_TYPES.INJECTABLE
  ) {
    providersByType[type].forEach((provider) => {
      switch(type) {
        case E_PROVIDER_TYPES.INJECT:
          this.registerGlobalInject(provider);
          break;
        case E_PROVIDER_TYPES.INJECTABLE:
          this.registerGlobalInjectable(provider);
          break;
      }
      this.providersPool.release(provider);
    });
  };

  protected registerGlobalInjectable(providerToken: ProviderToken) {
    if (providerToken?.token) {
      if (this.providers.has(providerToken.token)) return this.providers.get(providerToken.token);
    } else {
      if (this.providers.has(providerToken)) return this.providers.get(providerToken);
    }

    const dependencies: any[] = [];
    const dependenciesTokens = Reflect.getMetadata(E_TOKENS.DESIGN_PARAMTYPES, providerToken);
    const injectTokens: InjectTokenObject[] = Reflect.getMetadata(E_TOKENS.INJECT_TOKENS, providerToken);

    dependenciesTokens?.forEach((dependencyToken: any, index: number) => {
      const injectToken = injectTokens?.find((injectTokenObject) => injectTokenObject.index === index);
      let injectInstance = injectToken || dependencyToken;
      const dependency = this.registerGlobalInjectable(injectInstance);
      dependencies.push(dependency);
    });

    const provider = new providerToken(...dependencies);
    this.providers.set(providerToken, provider);
    return provider;
  };

  protected registerGlobalInject(injectProvider: InjectProviderModel) {
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
        return error;
      }
    }

    this.providers.set(injectProvider.token, injectInstance);
  };

};