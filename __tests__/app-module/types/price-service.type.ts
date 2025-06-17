
export abstract class AbstractPriceService {
  abstract getPrice(currentCurrency: string): { price: number, currency: string };
};

export interface IAbstractPriceService {
  getPrice(currentCurrency: string): { price: number, currency: string };
}