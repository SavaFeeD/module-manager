import 'reflect-metadata';
import { InjectToken, InjectTokenObject } from '../types/tokens.types';
import { E_TOKENS } from '../types/tokens.enum';

export function Injectable(): ClassDecorator {
  return (target) => {
    Reflect.defineMetadata(E_TOKENS.INJECTABLE, true, target);
  };
}

export function Inject(token: InjectToken): ParameterDecorator {
  return (target, _, parameterIndex) => {
    const tokens: InjectTokenObject[] = Reflect.getMetadata(E_TOKENS.INJECT_TOKENS, target) || [];
    tokens.push({
      index: parameterIndex,
      token,
    });
    Reflect.defineMetadata(E_TOKENS.INJECT_TOKENS, tokens, target);
  };
}
