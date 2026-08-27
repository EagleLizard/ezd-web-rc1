
import { Link } from '@tanstack/react-router';
import './jcd-nav.css';
import { HorizSep } from '../../../components/horiz-sep/horiz-sep';
import { VertSep } from '../../../components/vert-sep/vert-sep';

type JcdNavProps = {
  //
} & {};
export function JcdNav(props: JcdNavProps) {
  return (
    <div className="jcd-nav">
      <div>
        <h1>
          jcd
        </h1>
      </div>
      <div className="nav-links">
        <Link to="/jcd/proj">
          Projects
        </Link>
        <VertSep/>
        <Link to="/jcd/ns">
          NS
        </Link>
      </div>
      <HorizSep/>
    </div>
  );
}
