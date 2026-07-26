
import './app-root.css';

import React from 'react';
import { TopNav } from '../components/top-nav/top-nav';
import { UserContextProvider } from '../../service/user-context';
import { HorizSep } from '../components/horiz-sep/horiz-sep';

type AppRootProps = {
  children?: React.ReactNode;
} & {};

export function AppRoot(props: AppRootProps) {
  return (
    <div className="ezd-app-root">
      <UserContextProvider>
        <TopNav/>
        <HorizSep/>
        <div className="app-content">
          {props.children}
        </div>
      </UserContextProvider>
    </div>
  );
}
