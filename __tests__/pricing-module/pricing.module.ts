import { Module } from '../../src';
import { AbstractPriceService } from '../app-module/types/price-service.type';

class PriceService implements AbstractPriceService {
  getPrice(currentCurrency: string) {
    return {
      price: 100,
      currency: currentCurrency,
    };
  }
}

@Module({
  name: 'pricing-module',
  providers: [
    {
      token: 'PRICE_SERVICE',
      useFactory: PriceService,
    },
  ],
  exports: ['PRICE_SERVICE'],
})
export class PricingModule {}
