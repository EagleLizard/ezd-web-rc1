
import { createFileRoute } from '@tanstack/react-router';
import { JcdProjectPage } from '../../../app/sections/jcd/jcd-project-page/jcd-project-page';
import { prim } from '../../../lib/util/validate-primitives';

type JcdProjectPageSearchParams = {
  env?: string;
}
export const Route = createFileRoute('/jcd/proj/$project')({
  component: RouteComponent,
  validateSearch: (searchParams): JcdProjectPageSearchParams => {
    return {
      env: prim.stringOrVoid(searchParams.env),
    };
  }
});

function RouteComponent() {
  const params = Route.useParams();
  return (
    <JcdProjectPage projectRoute={params.project}/>
  );
}
