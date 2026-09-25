import { Module } from '../../src';
import { AppController } from './app.controller';
import { AppRepository } from './app.repository';
import { AppService } from './app.service';
import { PricingModule } from '../pricing-module/pricing.module';

@Module({
  name: 'app-module',
  imports: [PricingModule],
  providers: [
    AppService,
    AppRepository,
    {
      token: 'CONFIG_TOKEN',
      useValue: { configVersion: 1 },
    },
  ],
  controllers: [AppController],
})
export class AppModule {}
