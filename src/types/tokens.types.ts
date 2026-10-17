import { AbstractModule } from './module.abstract';
import { InjectionToken } from '../injection-token';

export type ModuleToken = typeof AbstractModule;
export type ControllerToken = any;
export type ProviderToken = any;
export type InjectToken = string | InjectionToken<any>;
export type ControllerPrefix = string;

export interface InjectTokenObject {
  index: number;
  token: InjectToken;
}

export interface InjectProviderModel {
  token: InjectToken;
  useValue?: any;
  useClass?: new (...args: any[]) => any;
  useFactory?: (...args: any[]) => any;
}

/**
 * The type `moduleRef.getProvider(token)` infers for a given token:
 * the wrapped type for an `InjectionToken<T>`, the instance type for a
 * (possibly abstract) class, and `any` for anything else (e.g. a raw string).
 */
export type ResolvedProvider<Token> =
  Token extends InjectionToken<infer T>
    ? T
    : Token extends abstract new (...args: any[]) => infer T
      ? T
      : any;
