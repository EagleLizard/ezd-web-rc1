
import { createFileRoute } from '@tanstack/react-router';
import { UserPage } from '../../app/sections/user/user-page';

export const Route = createFileRoute('/user/$username')({
  component: RouteComponent,
});
export type UsernameRouteType = typeof Route;

function RouteComponent() {
  const params = Route.useParams();
  return <UserPage username={params.username}/>;
}
