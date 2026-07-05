import { createFileRoute } from '@tanstack/react-router';
import { JcdProjectPage } from '../../app/sections/jcd/jcd-project-page/jcd-project-page';

export const Route = createFileRoute('/jcd/$project')({
  component: RouteComponent,
});

function RouteComponent() {
  const params = Route.useParams();
  return <JcdProjectPage projectRoute={params.project}/>;
}
