
import { createFileRoute } from '@tanstack/react-router';

import { JcdMain } from '../../app/sections/jcd/jcd-main';
import { JcdPage } from '../../app/sections/jcd/jcd-page/jcd-page';

export const Route = createFileRoute('/jcd/')({
  beforeLoad: () => {
    throw Route.redirect({
      to: '/jcd/proj',
    });
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <JcdPage>
      <JcdMain/>
    </JcdPage>
  );
}
