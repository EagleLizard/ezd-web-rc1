
import './top-nav.css';
import { Link } from '@tanstack/react-router';

type TopNavProps = {
  //
} & {};

export function TopNav(props: TopNavProps) {

  return (
    <div className="top-nav">
      <div className="top-nav-link">
        <Link to="/">home</Link>
      </div>
      <div className="top-nav-link">
        <Link to="/about">about</Link>
      </div>
      <div className="top-nav-link">
        <Link to="/login">login</Link>
      </div>
    </div>
  );
}
