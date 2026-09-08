
import { createFileRoute } from '@tanstack/react-router';

import { JcdEnvMain } from '../../../app/sections/jcd/jcd-env/jcd-env-main';
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
    let op: string | undefined;
    let env: string | undefined;
    let toenv: string | undefined;
    let ekind: string | undefined;
    let ename: string | undefined;
    if(prim.isString(searchParams.op)) {
      op = searchParams.op;
    }
    if(prim.isString(searchParams.env)) {
      env = searchParams.env;
    }
    if(prim.isString(searchParams.toenv)) {
      toenv = searchParams.toenv;
    }
    if(prim.isString(searchParams.ekind)) {
      ekind = searchParams.ekind;
    }
    if(prim.isString(searchParams.ename)) {
      ename = searchParams.ename;
    }
    return {
      op: op,
      env: env,
      toenv: toenv,
      ekind: ekind,
      ename: ename,
    };
  },
});

function RouteComponent() {
  return (
    <JcdEnvMain/>
  );
}
