
/* typebox utils */

import { Static, TSchema } from '@sinclair/typebox';
import { TransformDecodeCheckError, Value } from '@sinclair/typebox/value';

export const tbUtil = {
  decodeWithSchema: decodeWithSchema,
} as const;

function decodeWithSchema<S extends TSchema>(tschema: S, rawVal: unknown): Static<S> {
  let decoded: Static<S>;
  try {
    decoded = Value.Decode(tschema, rawVal);
  } catch(e) {
    if(!(e instanceof TransformDecodeCheckError)) {
      throw e;
    }
    let errs = Value.Errors(tschema, rawVal);
    [ ...errs ].forEach((err, idx) => {
      console.log(err);
    });
    throw new Error(`${e.error.message}, path: ${e.error.path}`, { cause: e });
  }
  return decoded;
}
