

````ts
/**
 * Yeldable filter-map-reduce implementation.
 * 
 *  Source: https://medium.com/better-programming/build-our-own-functional-programming-library-from-scratch-with-es6-iterator-protocol-292085f66df2#e2b5
 * 
 * NOTE: This article also comes with pipe-able and curry-able implementation (functional programming). 
 */

export const LazyMap = function* (f: Function, iter: any[]) {
  for (const a of iter) {
    yield f(a)
  }
}

export const LazyFilter = function* (f: Function, iter: any[]) {
  for (const a of iter) {
    if (f(a)) yield a
  }
}
```