import { createFileRoute } from '@tanstack/react-router'
import { JcdPage } from '../../../app/sections/jcd/jcd-page/jcd-page';

export const Route = createFileRoute('/jcd/ns/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <JcdPage>
      <div>ns</div>
    </JcdPage>
  );
}
