import { createFileRoute } from '@tanstack/react-router';
import { JcdProjectPage } from '../../../app/sections/jcd/jcd-project-page/jcd-project-page';
import { JcdPage } from '../../../app/sections/jcd/jcd-page/jcd-page';

export const Route = createFileRoute('/jcd/proj/$project')({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  return (
    <JcdPage>
      <JcdProjectPage projectRoute={params.project}/>
    </JcdPage>
  );
}
