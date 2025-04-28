import 'reflect-metadata';
import { ModuleOptions } from '../types/module.abstract';
import { container } from '../container';
import { E_PROVIDER_TYPES } from '../types/provider-types.enum';

export function Module(options: ModuleOptions): ClassDecorator {
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
};

function registerProviders(providers?: any[]) {
  providers?.forEach((provider) => {
    const isObjectProvider = typeof provider === 'object' && !!provider?.token;
    if (isObjectProvider) {
      container.addProviderToPool(E_PROVIDER_TYPES.INJECT, provider);
    }
  });
};