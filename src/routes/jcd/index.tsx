
import { createFileRoute } from '@tanstack/react-router';

import { prim } from '../../lib/util/validate-primitives';
import { JcdPage } from '../../app/sections/jcd/jcd-page';

type JcdPageSearchParams = {
  proj?: string;
}

export const Route = createFileRoute('/jcd/')({
  validateSearch: (searchParams): JcdPageSearchParams => {
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
    <JcdPage/>
  );
}
