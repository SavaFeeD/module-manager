declare const enum E_PROVIDER_TYPES {
    CONTROLLER = "controller",
    PROVIDER = "provider",
    INJECTABLE = "injectable",
    INJECT = "inject",
    MODULE = "module"
}

type ModuleToken = typeof AbstractModule;
type ControllerToken = any;
type ProviderToken = any;
type InjectToken = string;
type ControllerPrefix = string;
interface InjectTokenObject {
    index: number;
    token: InjectToken;
}
interface InjectProviderModel {
    token: InjectToken;
    useValue?: any;
    useFactory?: any;
}

declare class ModuleRef {
    private parentContainer;
    private module;
    private controllers;
    private providers;
    constructor(parentContainer: Container, module: typeof AbstractModule);
    private registerProviders;
    private getInjectProviderWithInstance;
    private registerControllers;
    getController<ControllerInstance>(controllerToken: ControllerPrefix | ControllerToken): ControllerInstance | undefined;
}

declare abstract class AbstractModule {
    static readonly name?: string;
    static readonly controllers?: any[];
    static readonly providers?: any[];
}
interface ModuleOptions {
    name?: string;
    providers?: any[];
    controllers?: any[];
}
interface FoundModuleDTO {
    token: ModuleToken;
    reference: ModuleRef;
}

declare class AuditContainer {
    providers: Map<ProviderToken, any>;
    private providersPool;
    addProviderToPool(type: E_PROVIDER_TYPES.INJECT | E_PROVIDER_TYPES.INJECTABLE, providerToken: ProviderToken): void;
    registerInnerInject(injectProvider: InjectProviderModel): void;
    protected processProvidersInPool(): void;
    protected dispatchRegisterProviders(providersByType: Record<E_PROVIDER_TYPES.INJECT | E_PROVIDER_TYPES.INJECTABLE, ProviderToken[]>, type: E_PROVIDER_TYPES.INJECT | E_PROVIDER_TYPES.INJECTABLE): void;
    protected registerGlobalInjectable(providerToken: ProviderToken): any;
    protected registerGlobalInject(injectProvider: InjectProviderModel): any;
}

declare class Container extends AuditContainer {
    private _modules;
    get modules(): Map<typeof AbstractModule, ModuleRef>;
    registerModule(module: typeof AbstractModule): void;
    getModuleByName(moduleName: string): {
        key: typeof AbstractModule;
        value: ModuleRef;
    } | undefined;
    getController<Co>(prefix: ControllerPrefix | ControllerToken): Co | undefined;
    findModuleByProviderToken(providerToken: ProviderToken): FoundModuleDTO | null;
}
declare const container: Container;

declare function Controller(prefix: ControllerPrefix): ClassDecorator;

declare function Module(options: ModuleOptions): ClassDecorator;

declare function Injectable(): ClassDecorator;
declare function Inject(token: InjectToken): ParameterDecorator;

declare function of<T, M>(mapper: Map<T, M>): {
    key: T;
    value: M;
}[];

declare const enum E_TOKENS {
    CONTROLLER_PREFIX = "controller:prefix",
    DESIGN_PARAMTYPES = "design:paramtypes",
    INJECT_TOKENS = "inject:tokens"
}

declare class Queue<T> {
    private _storage;
    private _oldestIndex;
    private _newestIndex;
    get count(): number;
    enqueue(data: T): void;
    dequeue(): T;
    toArray(): T[];
}

declare class TypeSpecifier {
    static isClass(input: any): boolean;
    static isClassByStringLiteral(input: any): boolean;
    static isFunction(input: any): boolean;
    static isFunctionByTryCall(input: any): boolean;
}

export { AbstractModule, Container, Controller, E_PROVIDER_TYPES, E_TOKENS, Inject, Injectable, Module, ModuleRef, Queue, TypeSpecifier, container, of };
export type { ControllerPrefix, ControllerToken, FoundModuleDTO, InjectProviderModel, InjectTokenObject, ModuleOptions, ModuleToken, ProviderToken };
