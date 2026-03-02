
import './top-nav.css';
import { Link } from '@tanstack/react-router';
import { useUserContext } from '../../../service/user-context';

type TopNavProps = {
  //
} & {};

export function TopNav(props: TopNavProps) {
  const userCtx = useUserContext();
  const activeUser = userCtx.activeUser;

  return (
    <div className="top-nav">
      <div className="top-nav-link">
        <Link to="/">home</Link>
      </div>
      <div className="top-nav-link">
        <Link to="/about">about</Link>
      </div>
      <div className="vert-sep"></div>
      { !activeUser && (
        <div className="top-nav-link">
          <Link to="/login">login</Link>
        </div>
      )}
      { activeUser && (
        <>
          <div className="top-nav-link">
            <Link to="/admin/{-$section}">
              admin
            </Link>
          </div>
          <div className="top-nav-link">
            <Link
              to="/user/$username"
              params={{username: activeUser.user_name}}
            >
              me
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
