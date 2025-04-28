
export abstract class AbstractPriceService {
  abstract getPrice(currentCurrency: string): { price: number, currency: string };
};