import 'reflect-metadata';
import { ModuleOptions } from '../types/module.abstract';

export function Module(options: ModuleOptions): ClassDecorator {
  return (target) => {
    Reflect.defineProperty(target, 'name', {
      value: options.name,
      writable: false,
      configurable: false,
    });

    Reflect.defineProperty(target, 'controllers', {
      value: options.controllers ?? [],
      writable: false,
      configurable: false,
    });

    Reflect.defineProperty(target, 'providers', {
      value: options.providers ?? [],
      writable: false,
      configurable: false,
    });

    Reflect.defineProperty(target, 'imports', {
      value: options.imports ?? [],
      writable: false,
      configurable: false,
    });

    Reflect.defineProperty(target, 'exports', {
      value: options.exports ?? [],
      writable: false,
      configurable: false,
    });
  };
}
