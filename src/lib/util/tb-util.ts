
/* typebox utils */

import { Static, TSchema } from 'typebox';
import { DecodeError, Value } from 'typebox/value';
import { EzdError } from '../models/error/ezd-error';

export const tbUtil = {
  decodeWithSchema: decodeWithSchema,
} as const;

function decodeWithSchema<S extends TSchema>(tschema: S, rawVal: unknown): Static<S> {
  let decoded: Static<S>;
  try {
    decoded = Value.Decode(tschema, rawVal);
  } catch(e) {
    if(!(e instanceof DecodeError)) {
      throw e;
    }
    let errs = Value.Errors(tschema, rawVal);
    [ ...errs ].forEach((err, idx) => {
      console.log(err);
    });
    // throw new Error(`${e.error.message}, path: ${e.error.path}`, { cause: e });
    let errMsg = `${e.cause.errors[0].message}, path: ${e.cause.errors[0].schemaPath}`;
    throw new EzdError(errMsg, 'EZDW_0.1', {
      cause: e,
    });
  }
  return decoded;
}
