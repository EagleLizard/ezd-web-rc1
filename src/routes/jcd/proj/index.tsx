import { createFileRoute } from '@tanstack/react-router';
import { prim } from '../../../lib/util/validate-primitives';
import { JcdProjxPage } from '../../../app/sections/jcd/jcd-projx-page/jcd-projx-page';
import { JcdPage } from '../../../app/sections/jcd/jcd-page/jcd-page';

type JcdProjectsPageSearchParams = {
  proj?: string;
}

export const Route = createFileRoute('/jcd/proj/')({
  validateSearch: (searchParams): JcdProjectsPageSearchParams => {
    let proj: string | undefined;
    if(prim.isString(searchParams.proj)) {
      proj = searchParams.proj;
    }
    return {
      proj: proj,
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
