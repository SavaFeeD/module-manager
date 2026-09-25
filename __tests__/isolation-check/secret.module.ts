import { Module } from '../../src';

@Module({
  name: 'secret-module',
  providers: [
    { token: 'SECRET_TOKEN', useValue: 'top-secret' },
    { token: 'FEATURE_FLAG', useValue: false },
  ],
  // SECRET_TOKEN is intentionally not exported - it must stay invisible to importers.
  exports: ['FEATURE_FLAG'],
})
export class SecretModule {}
