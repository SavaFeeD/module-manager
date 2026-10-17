import { Module } from '../../src';
import { FactoryCheckModule } from './factory.module';

@Module({
  name: 'factory-consumer-b',
  imports: [FactoryCheckModule],
})
export class ConsumerBModule {}
