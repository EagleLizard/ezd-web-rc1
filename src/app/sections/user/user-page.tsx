
import './user-page.css';

import { useRouter } from '@tanstack/react-router';

import { EzdButton } from '../../components/ezd-button/ezd-button';
import { userService } from '../../../service/user-service';
import { useUserContext } from '../../../service/user-context';

type UserPageProps = {
  //
  username: string;
} & {};

export function UserPage(props: UserPageProps) {
  const router = useRouter();
  const userCtx = useUserContext();

  const isActiveUserPage = userCtx.activeUser?.user_name === props.username;

  // router.navigate({
  //   to: '/'
  // });

  return (
    <div className="user-page">
      <div>
        user page ~
      </div>
      <hr></hr>
      <h1>
        {props.username}
      </h1>

      {isActiveUserPage && (
        <div>
          <EzdButton onClick={handleLogoutClick}>
            logout
          </EzdButton>
        </div>
      )}
    </div>
  );

  function handleLogoutClick() {
    userService.logoutUser().then(() => {
      userCtx.setUser(undefined);
    });
  }
}
