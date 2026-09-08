
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { JcdPage } from '../../../app/sections/jcd/jcd-page/jcd-page';
import { JcdEnvNav } from '../../../app/sections/jcd/jcd-env/jcd-env-nav/jcd-env-nav';

export const Route = createFileRoute('/jcd/env')({
  component: RouteComponent,
  loader: () => {
    // throw Route.redirect({ to: '/jcd/env/copy1' });
  }
});

function RouteComponent() {
  return (
    <div>
      <JcdPage>
        <>
          <JcdEnvNav/>
          <Outlet/>
        </>
      </JcdPage>
    </div>
  );
}
