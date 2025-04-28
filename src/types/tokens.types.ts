import { AbstractModule } from "./module.abstract";
import { E_PROVIDER_TYPES } from "./provider-types.enum";

export type ModuleToken = typeof AbstractModule;
export type ControllerToken = any;
export type ProviderToken = any;
export type InjectToken = string;
export type ControllerPrefix = string;

export interface InjectTokenObject {
  index: number;
  token: InjectToken;
};

export interface InjectProviderModel {
  token: InjectToken;
  useValue?: any;
  useFactory?: any;
};

export interface RegistrationModel {
  type: E_PROVIDER_TYPES.INJECT | E_PROVIDER_TYPES.INJECTABLE;
  provider: ProviderToken;
};