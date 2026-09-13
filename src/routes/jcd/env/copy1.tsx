
import { createFileRoute } from '@tanstack/react-router';

import { JcdEnvCopy1 } from '../../../app/sections/jcd/jcd-env/jcd-env-copy1/jcd-env-copy1';
import { prim } from '../../../lib/util/validate-primitives';

type JcdEnvCopy1SearchParams = {
  env?: string;
  toenv?: string;
  ekind?: string;
  ename?: string;
  op?: string;
} & {};

export const Route = createFileRoute('/jcd/env/copy1')({
  component: RouteComponent,
  validateSearch: (searchParams): JcdEnvCopy1SearchParams => {
    return {
      op: prim.stringOrVoid(searchParams.op),
      env: prim.stringOrVoid(searchParams.env),
      toenv: prim.stringOrVoid(searchParams.toenv),
      ekind: prim.stringOrVoid(searchParams.ekind),
      ename: prim.stringOrVoid(searchParams.ename),
    };
  },
});

function RouteComponent() {
  return (
    <JcdEnvCopy1/>
  );
}
