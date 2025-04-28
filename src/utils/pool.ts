import { of } from "./map-processing";

export type PoolFactory<Data> = (data: Data) => any;

export class Pool<Data> {
  private _pool: Map<Data, Data> = new Map();

  constructor(private factory: PoolFactory<Data>) {};

  acquire() {
    return of(this._pool)
      .map(({ value }) => value)
      .map(this.factory);
  };

  release(data: Data) {
    this._pool.delete(data);
  };

  append(data: Data) {
    this._pool.set(data, data);
  };

};