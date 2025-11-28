
import { Outlet, createRootRoute } from '@tanstack/react-router';
import { AppRoot } from '../app/app-root/app-root';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <AppRoot>
        <Outlet />
      </AppRoot>
    </>
  );
}
