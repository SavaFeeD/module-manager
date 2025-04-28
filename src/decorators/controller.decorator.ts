import 'reflect-metadata';
import { E_TOKENS } from '../types/tokens.enum';
import { ControllerPrefix } from '../types/tokens.types';

export function Controller(prefix: ControllerPrefix): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(E_TOKENS.CONTROLLER_PREFIX, prefix, target);
  };
}