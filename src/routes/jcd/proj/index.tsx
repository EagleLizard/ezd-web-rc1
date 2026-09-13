import { createFileRoute } from '@tanstack/react-router';
import { prim } from '../../../lib/util/validate-primitives';
import { JcdProjxPage } from '../../../app/sections/jcd/jcd-projx-page/jcd-projx-page';
import { JcdPage } from '../../../app/sections/jcd/jcd-page/jcd-page';

type JcdProjectsPageSearchParams = {
  proj?: string;
  ns?: string;
}

export const Route = createFileRoute('/jcd/proj/')({
  validateSearch: (searchParams): JcdProjectsPageSearchParams => {
    return {
      proj: prim.stringOrVoid(searchParams.proj),
      ns: prim.stringOrVoid(searchParams.ns),
    };
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <JcdPage>
      <JcdProjxPage/>
    </JcdPage>
  );
}
