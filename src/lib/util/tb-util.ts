
/* typebox utils */

import type { StaticDecode, StaticParse, StaticType, TSchema } from 'typebox';
import { DecodeError, ParseError, Value } from 'typebox/value';
import { EzdError } from '../models/error/ezd-error';

export const tbUtil = {
  decodeWithSchema: decodeWithSchema,
  parseWithSchema: parseWithSchema,
  parseFn: parseFn,
} as const;

function parseFn<
  S extends TSchema,
  /* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
  T extends StaticType<[], 'Encode', {}, {}, S> = StaticParse<S>
>(schema: S): (val: unknown) => T {
  return (val: unknown): T => {
    return tbUtil.parseWithSchema<S, T>(schema, val);
  };
}

function parseWithSchema<
  S extends TSchema,
  /* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
  T extends StaticType<[], 'Encode', {}, {}, S> = StaticParse<S>
>(tschema: S, rawVal: unknown): T {
  let parsed: T;
  try {
    parsed = Value.Parse<S>(tschema, rawVal);
    let etc = Value.Parse<S>(tschema, rawVal);
    return parsed;
  } catch(e) {
    if(!(e instanceof ParseError)) {
      throw e;
    }
    let errMsg = `${e.cause.errors[0].message}, path: ${e.cause.errors[0].schemaPath}`;
    throw new EzdError(errMsg, 'EZDW_1.4', { cause: e });
  }
}

function decodeWithSchema<
  S extends TSchema,
  /* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
  T extends StaticType<[], 'Decode', {}, {}, S> = StaticDecode<S>
>(tschema: S, rawVal: unknown): StaticDecode<S> {
  let decoded: StaticDecode<S>;
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
