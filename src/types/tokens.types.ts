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
  useFactory?: any;
}
