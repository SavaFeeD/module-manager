import { Module } from "../../src";
import { AppController } from "./app.controller";
import { AppRepository } from "./app.repository";
import { AppService } from "./app.service";

class PriceService {
  getPrice(currentCurrency: string) {
    return {
      price: 100,
      currency: currentCurrency,
    };
  }
}

@Module({
  name: 'app-module',
  providers: [
    AppService,
    AppRepository,
    {
      token: 'CONFIG_TOKEN',
      useValue: { configVersion: 1 },
    },
    {
      token: 'PRICE_SERVICE',
      useFactory: PriceService,
    }
  ],
  controllers: [AppController],
})
export class AppModule {};