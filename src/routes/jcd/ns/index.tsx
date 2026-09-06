
import { createFileRoute } from '@tanstack/react-router';
import { JcdPage } from '../../../app/sections/jcd/jcd-page/jcd-page';
import { JcdEnvMain } from '../../../app/sections/jcd/jcd-env/jcd-env-main';
import { prim } from '../../../lib/util/validate-primitives';

type JcdEnvMainSearchParams = {
  env?: string;
  toenv?: string;
  ekind?: string;
  ename?: string;
} & {};

export const Route = createFileRoute('/jcd/ns/')({
  component: RouteComponent,
  validateSearch: (searchParams): JcdEnvMainSearchParams => {
    let env: string | undefined;
    let toenv: string | undefined;
    let ekind: string | undefined;
    let ename: string | undefined;
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
      env: env,
      toenv: toenv,
      ekind: ekind,
      ename: ename,
    };
  },
});

function RouteComponent() {
  return (
    <JcdPage>
      <JcdEnvMain/>
    </JcdPage>
  );
}
