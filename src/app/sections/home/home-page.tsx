
import './home-page.css';

import { useUserContext } from '../../../service/user-context';

type HomePageProps = {
  //
} & {};

export function HomePage(props: HomePageProps) {

  const userCtx = useUserContext();

  return (
    <div className="home-page">
      <div>
        home
      </div>
      <hr></hr>
      <div className="user-info">
        <span>
          You are logged in as:
        </span>
        &nbsp;
        <span className="user-name">
          {userCtx.activeUser?.user_name}
        </span>
      </div>
    </div>
  );
}
