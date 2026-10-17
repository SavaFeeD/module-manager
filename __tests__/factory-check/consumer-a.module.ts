import { Module } from '../../src';
import { FactoryCheckModule } from './factory.module';

@Module({
  name: 'factory-consumer-a',
  imports: [FactoryCheckModule],
})
export class ConsumerAModule {}
