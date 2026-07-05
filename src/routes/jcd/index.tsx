import { createFileRoute } from '@tanstack/react-router';
import { JcdPage } from '../../app/sections/jcd/jcd-page';

export const Route = createFileRoute('/jcd/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <JcdPage/>
  );
}
