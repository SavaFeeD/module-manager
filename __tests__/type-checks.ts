import { ModuleRef } from '../src';
import { AppRepository } from './app-module/app.repository';
import { PRICE_SERVICE } from './pricing-module/pricing.module';

abstract class AbstractCheckBase {
  abstract ping(): void;
}

type IsAny<T> = 0 extends 1 & T ? true : false;

/**
 * Never called at runtime. Its only job is to make `tsc` fail the build if
 * ModuleRef#getProvider regresses to `any` for a class with constructor
 * arguments, an abstract class, or an InjectionToken.
 */
function assertGetProviderTypes(moduleRef: ModuleRef) {
  const classWithCtorArgs = moduleRef.getProvider(AppRepository);
  const abstractClass = moduleRef.getProvider(AbstractCheckBase);
  const token = moduleRef.getProvider(PRICE_SERVICE);

  const classWithCtorArgsIsNotAny: false = {} as IsAny<typeof classWithCtorArgs>;
  const abstractClassIsNotAny: false = {} as IsAny<typeof abstractClass>;
  const tokenIsNotAny: false = {} as IsAny<typeof token>;

  return {
    classWithCtorArgs,
    abstractClass,
    token,
    classWithCtorArgsIsNotAny,
    abstractClassIsNotAny,
    tokenIsNotAny,
  };
}
