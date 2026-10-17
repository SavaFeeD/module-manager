import { InjectionToken, Module } from '../../src';

export const SECRET_TOKEN = new InjectionToken<string>('SECRET_TOKEN');
export const FEATURE_FLAG = new InjectionToken<boolean>('FEATURE_FLAG');

@Module({
  name: 'secret-module',
  providers: [
    { token: SECRET_TOKEN, useValue: 'top-secret' },
    { token: FEATURE_FLAG, useValue: false },
  ],
  // SECRET_TOKEN is intentionally not exported - it must stay invisible to importers.
  exports: [FEATURE_FLAG],
})
export class SecretModule {}
