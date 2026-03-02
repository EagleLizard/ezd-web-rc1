import { createFileRoute } from '@tanstack/react-router';
import { AdminPage } from '../../app/sections/admin/admin-page';

export const Route = createFileRoute('/admin/{-$section}')({
  component: RouteComponent,
});

function RouteComponent() {
  let params = Route.useParams();
  return <AdminPage section={params.section}/>;
}
