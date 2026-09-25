import { AbstractModule } from './module.abstract';

export type ModuleToken = typeof AbstractModule;
export type ControllerToken = any;
export type ProviderToken = any;
export type InjectToken = string;
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
