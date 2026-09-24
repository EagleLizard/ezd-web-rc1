import { createFileRoute, Outlet } from '@tanstack/react-router';
import { JcdPage } from '../../../app/sections/jcd/jcd-page/jcd-page';

export const Route = createFileRoute('/jcd/proj')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <JcdPage>
        <Outlet/>
      </JcdPage>
    </div>
  );
}
