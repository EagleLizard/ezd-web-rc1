
import { Link, Outlet, createRootRoute } from '@tanstack/react-router';
import { TopNav } from '../app/components/top-nav/top-nav';

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <TopNav/>
      <hr/>
      <Outlet />
    </>
  );
}
