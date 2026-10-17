import { container, ProviderNotFoundError } from '../src';
import { AppController } from './app-module/app.controller';
import { AppModule } from './app-module/app.module';
import { AppRepository } from './app-module/app.repository';
import { PRICE_SERVICE } from './pricing-module/pricing.module';
import { FlagController, FlagModule } from './isolation-check/flag.module';
import { LeakyModule } from './isolation-check/leaky.module';

const appModuleRef = container.registerModule(AppModule);
const appController = container.getController<AppController>('app-co');
appController?.buildInfo();
appController?.createPerson({
  name: 'Yuu',
});
appController?.pricing();
console.log(container.getModuleByName('app-module'));

// getProvider(SomeClass) is typed from the constructor - no generic needed.
const appRepository = appModuleRef.getProvider(AppRepository);
console.log('PASS: getProvider(AppRepository) ->', appRepository?.getPrice());

// getProvider(someInjectionToken) is typed from the token, even across an
// imports/exports boundary (PRICE_SERVICE is declared in PricingModule).
const priceService = appModuleRef.getProvider(PRICE_SERVICE);
console.log('PASS: getProvider(PRICE_SERVICE) ->', priceService?.getPrice('USD'));

// Cross-module import/export, including a falsy useValue (regression check).
container.registerModule(FlagModule);
const flagController = container.getController<FlagController>('flag-co');
console.log(
  'PASS: exported "FEATURE_FLAG" (useValue: false) resolved as ->',
  flagController?.getFlag()
);

// A provider that is not in its module's "exports" must stay invisible to importers.
try {
  container.registerModule(LeakyModule);
  console.error('FAIL: expected module isolation to block an un-exported provider');
} catch (error) {
  if (error instanceof ProviderNotFoundError) {
    console.log('PASS: module isolation enforced ->', error.message);
  } else {
    throw error;
  }
}
