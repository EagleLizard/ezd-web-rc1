
export const prim = {
  isObject: isObject,
  isString: isString,
  isPromise: isPromise,

  stringOrVoid,
} as const;

function isObject(val: unknown): val is Record<string | number | symbol, unknown> {
  return (
    (val !== null)
    && ((typeof val) === 'object')
  );
}

function isString(val: unknown): val is string {
  return (typeof val) === 'string';
}

export function isPromise<T>(val: unknown): val is Promise<T> {
  if(!prim.isObject(val)) {
    return false;
  }
  if(val instanceof Promise) {
    return true;
  }
  return (typeof val?.then) === 'function';
}

/*
====================
== TS Parse Utils ==
====================
_*/

function stringOrVoid(val: unknown): string | undefined {
  return prim.isString(val) ? val : undefined;
}
