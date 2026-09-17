
import { createFileRoute } from '@tanstack/react-router';
import { JcdEnvMain } from '../../../app/sections/jcd/jcd-env/jcd-env-main';
import { prim } from '../../../lib/util/validate-primitives';

type JcdEnvMainSearchParams = {
  env?: string;
  proj?: string;
  toenv?: string;
} & {};
export const Route = createFileRoute('/jcd/env/')({
  component: RouteComponent,
  validateSearch: (searchParams): JcdEnvMainSearchParams => {
    return {
      env: prim.stringOrVoid(searchParams.env),
      proj: prim.stringOrVoid(searchParams.proj),
      toenv: prim.stringOrVoid(searchParams.toenv),
    };
  },
});

function RouteComponent() {
  return <JcdEnvMain/>;
}
