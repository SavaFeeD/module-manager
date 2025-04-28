import { Inject, Injectable } from "../../src";
import schema from './mock/person.json' assert { type: 'json' };
import { AbstractPriceService } from "./types/price-service.type";

@Injectable()
export class AppRepository {
  
  constructor(
    @Inject('PRICE_SERVICE') private priceService: AbstractPriceService,
  ) {};
  
  mock() {
    return schema || {};
  }

  getPrice() {
    const currentCurrency = 'USD';
    const { price, currency } = this.priceService.getPrice(currentCurrency);
    return `${price} ${currency}`;
  }

}