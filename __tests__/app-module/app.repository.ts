import { Inject, Injectable } from "../../src";
import schema from './mock/person.json' assert { type: 'json' };
import { IAbstractPriceService } from "./types/price-service.type";

@Injectable()
export class AppRepository {
  
  constructor(
    // ! You cannot use a class type for a property decorator to define the parameter type, only objects
    @Inject('PRICE_SERVICE') private priceService: IAbstractPriceService,
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