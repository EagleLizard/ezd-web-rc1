import { createFileRoute } from '@tanstack/react-router';
import { LoginPage } from '../../app/sections/auth-n/login-page/login-page';

export const Route = createFileRoute('/login/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <LoginPage/>
  );
}
