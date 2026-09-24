
import { createFileRoute } from '@tanstack/react-router';
import { prim } from '../../../lib/util/validate-primitives';
import { JcdProjxPage } from '../../../app/sections/jcd/jcd-projx-page/jcd-projx-page';

type JcdProjectsPageSearchParams = {
  proj?: string;
  env?: string;
}

export const Route = createFileRoute('/jcd/proj/')({
  validateSearch: (searchParams): JcdProjectsPageSearchParams => {
    return {
      proj: prim.stringOrVoid(searchParams.proj),
      env: prim.stringOrVoid(searchParams.env),
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <JcdProjxPage/>
  );
}
