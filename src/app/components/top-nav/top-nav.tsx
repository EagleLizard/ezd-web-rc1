
import './top-nav.css';
import { useEffect, useState } from 'react';
import { Link } from '@tanstack/react-router';

import { useUserContext } from '../../../service/user-context';
import { userService } from '../../../service/user-service';
import { EzdPermission } from '../../../lib/models/authz/ezd-permission';

type TopNavProps = {
  //
} & {};

export function TopNav(props: TopNavProps) {
  const userCtx = useUserContext();
  const [ activeUserPerms, setActiveUserPerms ] = useState<EzdPermission[]>();
  const hasJcdPerm = activeUserPerms?.findIndex((ezdPerm) => {
    return ezdPerm.name === 'jcd.proj.read';
  }) !== -1;

  useEffect(() => {
    if(userCtx.activeUser === undefined) {
      return;
    }
    userService.getUserPerms(userCtx.activeUser.user_id).then((ezdPerms) => {
      console.log(ezdPerms);
      setActiveUserPerms(ezdPerms);
    });
  }, [ userCtx.activeUser ]);

  return (
    <div className="top-nav">
      <div className="top-nav-link">
        <Link to="/">home</Link>
      </div>
      {hasJcdPerm && (
        <div className="top-nav-link">
          <Link to="/jcd">jcd</Link>
        </div>
      )}
      <div className="top-nav-link">
        <Link to="/about">about</Link>
      </div>
      <div className="vert-sep"></div>
      { !userCtx.activeUser && (
        <div className="top-nav-link">
          <Link to="/login">login</Link>
        </div>
      )}
      { userCtx.activeUser && (
        <>
          <div className="top-nav-link">
            <Link to="/admin/{-$section}">
              admin
            </Link>
          </div>
          <div className="top-nav-link">
            <Link
              to="/user/$username"
              params={{username: userCtx.activeUser.user_name}}
            >
              me
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
