
import './jcd-env-nav.css';
import { Link } from '@tanstack/react-router';
import { HorizSep } from '../../../../components/horiz-sep/horiz-sep';

type JcdEnvNavProps = {
  //
} & {};
export function JcdEnvNav(props: JcdEnvNavProps) {
  return (
    <div className="jcd-env-nav">
      <div className="heading">
        {/* <h2>env</h2> */}
      </div>
      <div className="nav-links">
        <Link to="/jcd/env/copy1">copy1</Link>
      </div>
      <HorizSep/>
    </div>
  );
}
