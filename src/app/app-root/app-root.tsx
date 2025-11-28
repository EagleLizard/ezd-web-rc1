
import './app-root.css';

import React from 'react';
import { TopNav } from '../components/top-nav/top-nav';
import { UserContextProvider } from '../../service/user-context';

type AppRootProps = {
  children?: React.ReactNode;
} & {};

export function AppRoot(props: AppRootProps) {
  return (
    <div className="ezd-app-root">
      <UserContextProvider>
        <TopNav/>
        <hr/>
        {props.children}
      </UserContextProvider>
    </div>
  );
}
