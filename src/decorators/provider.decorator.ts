import 'reflect-metadata';
import { container } from '../container';
import { InjectToken, InjectTokenObject } from '../types/tokens.types';
import { E_TOKENS } from '../types/tokens.enum';
import { E_PROVIDER_TYPES } from '../types/provider-types.enum';

export function Injectable(): ClassDecorator {
  return (target) => {
    container.addProviderToPool(E_PROVIDER_TYPES.INJECTABLE, target);   
  };
};

export function Inject(token: InjectToken): ParameterDecorator {
  return (target, _, parameterIndex) => {
    const tokens: InjectTokenObject[] = Reflect.getMetadata(E_TOKENS.INJECT_TOKENS, target) || [];
    tokens.push({
      index: parameterIndex,
      token,
    });
    Reflect.defineMetadata(E_TOKENS.INJECT_TOKENS, tokens, target);
  };
};