'use strict';

require('reflect-metadata');

class TypeSpecifier {
    static isClass(input) {
        return (!TypeSpecifier.isFunction(input) &&
            !TypeSpecifier.isFunctionByTryCall(input) &&
            TypeSpecifier.isClassByStringLiteral(input));
    }
    static isClassByStringLiteral(input) {
        const functionString = input.toString();
        return !!functionString.startsWith('class');
    }
    static isFunction(input) {
        return typeof input !== 'function';
    }
    static isFunctionByTryCall(input) {
        try {
            input();
            return true;
        }
        catch (error) {
            return false;
        }
    }
}

class ModuleRef {
    parentContainer;
    module;
    controllers = new Map();
    providers = new Map();
    constructor(parentContainer, module) {
        this.parentContainer = parentContainer;
        this.module = module;
        this["registerProviders" /* E_REGISTER_CALL_ORDER.first */]();
        this["registerControllers" /* E_REGISTER_CALL_ORDER.second */]();
    }
    ;
    registerProviders() {
        const providers = this.module.providers;
        if (!providers)
            return;
        for (const provider of providers) {
            if (this.providers.has(provider))
                continue;
            const dependencyTokens = Reflect.getMetadata("design:paramtypes" /* E_TOKENS.DESIGN_PARAMTYPES */, provider);
            const dependencies = [];
            dependencyTokens?.forEach((dependencyToken, index) => {
                if (!TypeSpecifier.isClass(dependencyToken)) {
                    const injectTokens = Reflect.getMetadata("inject:tokens" /* E_TOKENS.INJECT_TOKENS */, provider) || [];
                    const injectToken = injectTokens.find((injectObject) => injectObject.index === index);
                    if (!this.parentContainer.providers.has(injectToken?.token))
                        return console.warn(`[WARN] (Inject) ${injectToken} is not provide in`, this.parentContainer);
                    dependencies.push(this.parentContainer.providers.get(injectToken?.token));
                }
                else {
                    if (!this.parentContainer.providers.has(dependencyToken))
                        return console.warn(`[WARN] (Injectable) ${dependencyToken} is not provide in`, this.parentContainer);
                    dependencies.push(this.parentContainer.providers.get(dependencyToken));
                }
            });
            let providerToken;
            let providerInstance;
            if (provider?.token) {
                const injectProvider = this.getInjectProviderWithInstance(provider);
                if (!injectProvider)
                    return console.warn(`[WARN] Provider type is not Inject. ${provider.token} is not provide in`, this.parentContainer);
                providerToken = injectProvider.token;
                providerInstance = injectProvider.instance;
                Reflect.defineMetadata(providerToken, providerInstance, this.module);
            }
            else {
                providerToken = provider;
                providerInstance = new provider(...dependencies);
                Reflect.defineMetadata(providerToken, provider, this.module);
            }
            this.providers.set(providerToken, providerInstance);
            return providerInstance;
        }
    }
    ;
    getInjectProviderWithInstance(injectProvider) {
        if (!injectProvider?.token)
            return null;
        let injectInstance;
        if (injectProvider?.useValue) {
            injectInstance = injectProvider.useValue;
        }
        if (injectProvider?.useFactory) {
            const factory = injectProvider.useFactory;
            try {
                if (TypeSpecifier.isClass(factory)) {
                    injectInstance = new injectProvider.useFactory();
                }
                else {
                    injectInstance = injectProvider.useFactory();
                }
            }
            catch (error) {
                console.error('A factory can be either a function or a class.', error);
                return null;
            }
        }
        return {
            token: injectProvider.token,
            instance: injectInstance,
        };
    }
    ;
    registerControllers() {
        const controllers = this.module.controllers;
        if (!controllers)
            return;
        for (const controller of controllers) {
            if (this.controllers.has(controller))
                continue;
            const dependencyTokens = Reflect.getMetadata("design:paramtypes" /* E_TOKENS.DESIGN_PARAMTYPES */, controller);
            const dependencies = [];
            dependencyTokens?.forEach((dependencyToken) => {
                if (!this.providers.has(dependencyToken))
                    return console.warn(`[WARN] ${dependencyToken} is not provide in`, String(this));
                dependencies.push(this.providers.get(dependencyToken));
            });
            const controllerToken = Reflect.getMetadata("controller:prefix" /* E_TOKENS.CONTROLLER_PREFIX */, controller) || controller;
            const controllerInstance = new controller(...dependencies);
            this.controllers.set(controllerToken, controllerInstance);
        }
    }
    ;
    getController(controllerToken) {
        return this.controllers.get(controllerToken);
    }
    ;
}

function of(mapper) {
    const entryList = Array.from(mapper.entries());
    return entryList.map((entry) => {
        return {
            key: entry[0],
            value: entry[1],
        };
    });
}

class Pool {
    factory;
    _pool = new Map();
    constructor(factory) {
        this.factory = factory;
    }
    ;
    acquire() {
        return of(this._pool)
            .map(({ value }) => value)
            .map(this.factory);
    }
    ;
    release(data) {
        this._pool.delete(data);
    }
    ;
    append(data) {
        this._pool.set(data, data);
    }
    ;
}

class AuditContainer {
    providers = new Map();
    providersPool = new Pool((data) => data);
    addProviderToPool(type, providerToken) {
        this.providersPool.append({
            provider: providerToken,
            type,
        });
    }
    ;
    registerInnerInject(injectProvider) {
        this.registerGlobalInject(injectProvider);
    }
    processProvidersInPool() {
        const providers = this.providersPool.acquire();
        const providersByType = {
            ["inject" /* E_PROVIDER_TYPES.INJECT */]: [],
            ["injectable" /* E_PROVIDER_TYPES.INJECTABLE */]: [],
        };
        providers.forEach(({ type, provider }) => {
            const condition = type === "injectable" /* E_PROVIDER_TYPES.INJECTABLE */ || type === "inject" /* E_PROVIDER_TYPES.INJECT */;
            if (condition) {
                providersByType[type].push(provider);
            }
        });
        this.dispatchRegisterProviders(providersByType, "inject" /* E_PROVIDER_TYPES.INJECT */);
        this.dispatchRegisterProviders(providersByType, "injectable" /* E_PROVIDER_TYPES.INJECTABLE */);
    }
    ;
    dispatchRegisterProviders(providersByType, type) {
        providersByType[type].forEach((provider) => {
            switch (type) {
                case "inject" /* E_PROVIDER_TYPES.INJECT */:
                    this.registerGlobalInject(provider);
                    break;
                case "injectable" /* E_PROVIDER_TYPES.INJECTABLE */:
                    this.registerGlobalInjectable(provider);
                    break;
            }
            this.providersPool.release(provider);
        });
    }
    ;
    registerGlobalInjectable(providerToken) {
        if (providerToken?.token) {
            if (this.providers.has(providerToken.token))
                return this.providers.get(providerToken.token);
        }
        else {
            if (this.providers.has(providerToken))
                return this.providers.get(providerToken);
        }
        const dependencies = [];
        const dependenciesTokens = Reflect.getMetadata("design:paramtypes" /* E_TOKENS.DESIGN_PARAMTYPES */, providerToken);
        const injectTokens = Reflect.getMetadata("inject:tokens" /* E_TOKENS.INJECT_TOKENS */, providerToken);
        dependenciesTokens?.forEach((dependencyToken, index) => {
            const injectToken = injectTokens?.find((injectTokenObject) => injectTokenObject.index === index);
            let injectInstance = injectToken || dependencyToken;
            const dependency = this.registerGlobalInjectable(injectInstance);
            dependencies.push(dependency);
        });
        const provider = new providerToken(...dependencies);
        this.providers.set(providerToken, provider);
        return provider;
    }
    ;
    registerGlobalInject(injectProvider) {
        let injectInstance;
        if (injectProvider?.useValue) {
            injectInstance = injectProvider.useValue;
        }
        if (injectProvider?.useFactory) {
            const factory = injectProvider.useFactory;
            try {
                if (TypeSpecifier.isClass(factory)) {
                    injectInstance = new injectProvider.useFactory();
                }
                else {
                    injectInstance = injectProvider.useFactory();
                }
            }
            catch (error) {
                console.error('A factory can be either a function or a class.', error);
                return error;
            }
        }
        this.providers.set(injectProvider.token, injectInstance);
    }
    ;
}

class Container extends AuditContainer {
    _modules = new Map();
    get modules() {
        return this._modules;
    }
    ;
    registerModule(module) {
        if (this._modules.has(module))
            return console.warn(`Module has in Container`);
        this.processProvidersInPool();
        const moduleInstance = new ModuleRef(this, module);
        this._modules.set(module, moduleInstance);
    }
    ;
    getModuleByName(moduleName) {
        return of(this._modules).find(({ key }) => moduleName === key.name);
    }
    ;
    getController(prefix) {
        return of(this._modules).map(({ value }) => {
            return value.getController(prefix);
        }).find((controller) => !!controller);
    }
    ;
    findModuleByProviderToken(providerToken) {
        let module = null;
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
    ;
}
const container = new Container();

function Controller(prefix) {
    return (target) => {
        Reflect.defineMetadata("controller:prefix" /* E_TOKENS.CONTROLLER_PREFIX */, prefix, target);
    };
}

function Module(options) {
    return (target) => {
        Reflect.defineProperty(target, 'name', {
            value: options.name,
            writable: false,
            configurable: false,
        });
        Reflect.defineProperty(target, 'controllers', {
            value: options.controllers,
            writable: false,
            configurable: false,
        });
        Reflect.defineProperty(target, 'providers', {
            value: options.providers,
            writable: false,
            configurable: false,
        });
        registerProviders(options.providers);
    };
}
function registerProviders(providers) {
    providers?.forEach((provider) => {
        const isObjectProvider = typeof provider === 'object' && !!provider?.token;
        if (isObjectProvider) {
            container.addProviderToPool("inject" /* E_PROVIDER_TYPES.INJECT */, provider);
        }
    });
}

function Injectable() {
    return (target) => {
        container.addProviderToPool("injectable" /* E_PROVIDER_TYPES.INJECTABLE */, target);
    };
}
function Inject(token) {
    return (target, _, parameterIndex) => {
        const tokens = Reflect.getMetadata("inject:tokens" /* E_TOKENS.INJECT_TOKENS */, target) || [];
        tokens.push({
            index: parameterIndex,
            token,
        });
        Reflect.defineMetadata("inject:tokens" /* E_TOKENS.INJECT_TOKENS */, tokens, target);
    };
}

class AbstractModule {
    static name;
    static controllers = [];
    static providers = [];
}

class Queue {
    _storage = {};
    _oldestIndex = 1;
    _newestIndex = 1;
    get count() {
        return this._newestIndex - this._oldestIndex;
    }
    enqueue(data) {
        this._storage[this._newestIndex] = data;
        this._newestIndex++;
    }
    dequeue() {
        const oldestIndex = this._oldestIndex;
        const deletedData = this._storage[oldestIndex];
        delete this._storage[oldestIndex];
        this._oldestIndex++;
        return deletedData;
    }
    toArray() {
        return Object.values(this._storage);
    }
}

exports.AbstractModule = AbstractModule;
exports.Container = Container;
exports.Controller = Controller;
exports.Inject = Inject;
exports.Injectable = Injectable;
exports.Module = Module;
exports.ModuleRef = ModuleRef;
exports.Queue = Queue;
exports.TypeSpecifier = TypeSpecifier;
exports.container = container;
exports.of = of;
//# sourceMappingURL=index.cjs.js.map
