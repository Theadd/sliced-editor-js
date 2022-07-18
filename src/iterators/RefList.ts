
export class RefList<T> {
  array: T[]
  index: number = 0
  capacity: number

  get Count (): number {
    return this.index
  }

  constructor (initialCapacity: number = 4) {
    this.capacity = initialCapacity
    this.array = new Array<T>(this.capacity)
  }

  GetArray (this: RefList<T>): T[] {
    return this.array
  }

  Add (this: RefList<T>, value: T) {
    if (this.index >= this.array.length) { this.Expand() }

    this.array[this.index++] = value
  }

  Get (this: RefList<T>, elementAt: number): T {
    return this.array[elementAt]
  }

  Set (this: RefList<T>, atIndex: number, value: T) {
    this.array[atIndex] = value
  }

  Expand (this: RefList<T>) {
    // let newArray: T[] = this.array.slice()
    // newArray.length += Math.min(this.array.length, 4096)

    // this.capacity = newArray.length
    // this.array = newArray

    this.array.length += Math.min(this.array.length, 4096)
    this.capacity = this.array.length
  }

  RemoveRange (this: RefList<T>, fromIndex: number, removeCount: number) {
    // const prevSize: number = this.index
    this.index -= removeCount

    if (fromIndex < this.index) { this.array.copyWithin(fromIndex, fromIndex + removeCount) }

    this.array.length = this.index
    // this.array.fill(null as unknown as T, fromIndex + removeCount, Math.min(prevSize, this.array.length))
  }

  InsertRange (this: RefList<T>, atIndex: number, collection: RefList<T>) {
    if (atIndex > this.index) { throw new Error('ArgumentOutOfRangeException') }

    if (collection && typeof collection === 'object') {
      // let count: number = collection.Count

      if (collection.Count > 0) {
        // while (this.array.length < this.index + count)
        // this.Expand();

        // if (atIndex < this.index) {

        this.array = [...(this.array.slice(0, atIndex)), ...(collection.array.slice(0, collection.index)), ...(this.array.slice(atIndex, this.index))]
        this.index = this.array.length
        this.capacity = this.array.length

        // Array.Copy((Array) this.array, atIndex, (Array) this.array, atIndex + count, this.index - atIndex);
        // }

        // if (this == objs)
        // {
        //     Array.Copy((Array) this.array, 0, (Array) this.array, atIndex, atIndex);
        //     Array.Copy((Array) this.array, atIndex + count, (Array) this.array, atIndex * 2, this.index - atIndex);
        // }
        // else
        //     objs.CopyTo(this.array, atIndex);
        // this.index += count;
      }
    } else {
      throw new Error('Unexpected behaviour.')

      // foreach (let obj: T in collection)
      //     this.Insert(atIndex++, obj);
    }
  }
}
