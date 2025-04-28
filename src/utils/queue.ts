export class Queue<T> {
  private _storage: Record<number, T> = {};
  private _oldestIndex: number = 1;
  private _newestIndex: number = 1;

  public get count() {
    return this._newestIndex - this._oldestIndex;
  }

  public enqueue(data: T) {
    this._storage[this._newestIndex] = data;
    this._newestIndex++;
  }

  public dequeue() {
    const oldestIndex = this._oldestIndex;
    const deletedData = this._storage[oldestIndex];
    delete this._storage[oldestIndex];
    this._oldestIndex++;
    return deletedData;
  }

  public toArray() {
    return Object.values(this._storage);
  }

}