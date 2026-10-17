import { Inject, Injectable } from '../../src';
import schema from './mock/person.json' assert { type: 'json' };
import { IAbstractPriceService } from './types/price-service.type';
import { PRICE_SERVICE } from '../pricing-module/pricing.module';

@Injectable()
export class AppRepository {
  constructor(@Inject(PRICE_SERVICE) private priceService: IAbstractPriceService) {}

  mock() {
    return schema || {};
  }

  getPrice() {
    const currentCurrency = 'USD';
    const { price, currency } = this.priceService.getPrice(currentCurrency);
    return `${price} ${currency}`;
  }
}
