import { InjectionToken, Module } from '../../src';

let factoryCallCount = 0;

export function getFactoryCallCount() {
  return factoryCallCount;
}

export const COUNTED_VALUE = new InjectionToken<number>('COUNTED_VALUE');

function createCountedValue() {
  factoryCallCount++;
  return factoryCallCount;
}

@Module({
  name: 'factory-check-module',
  providers: [{ token: COUNTED_VALUE, useFactory: createCountedValue }],
  exports: [COUNTED_VALUE],
})
export class FactoryCheckModule {}
