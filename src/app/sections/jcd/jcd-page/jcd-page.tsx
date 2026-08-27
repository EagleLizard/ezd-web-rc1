
import React from 'react';
import './jcd-page.css';
import { JcdNav } from '../jcd-nav/jcd-nav';

type JcdPageProps = {
  children: React.ReactElement;
} & {};
export function JcdPage(props: JcdPageProps) {
  return (
    <div className="jcd-page">
      <JcdNav/>
      {props.children}
    </div>
  );
}
