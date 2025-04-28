import { ModuleRef } from "../module.reference";
import { ModuleToken } from "./tokens.types";

export abstract class AbstractModule {
  static readonly name?: string;
  static readonly controllers?: any[] = [];
  static readonly providers?: any[] = [];
};

export interface ModuleOptions {
  name?: string;
  providers?: any[];
  controllers?: any[];
};

export interface FoundModuleDTO {
  token: ModuleToken,
  reference: ModuleRef,
};