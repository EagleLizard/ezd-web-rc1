
import React, { useEffect, useState } from 'react';
import { UserInfo } from '../lib/models/user-info';
import { userService } from './user-service';

export type UserContext = {
  activeUser?: UserInfo;
  isLoading: boolean;
  setUser: (user: UserInfo | undefined) => void;
} & {};

const userContext = React.createContext<UserContext | undefined>(undefined);

type UserContextProviderProps = {
  children?: React.ReactNode;
} & {};

export function UserContextProvider(props: UserContextProviderProps) {
  const [ activeUser, setActiveUser ] = useState<UserInfo | undefined>();
  const [ isLoadingUser, setIsLoadingUser ] = useState<boolean>(false);

  const userCtx: UserContext = {
    activeUser: activeUser,
    isLoading: isLoadingUser,
    setUser: _setUser,
  };

  useEffect(() => {
    initUserCtx();
  }, []);

  return (
    <userContext.Provider value={userCtx}>
      {props.children}
    </userContext.Provider>
  );

  async function initUserCtx() {
    if(isLoadingUser) {
      return;
    }
    setIsLoadingUser(true);
    try {
      let whoamiResp = await userService.getWhoami();
      setActiveUser(whoamiResp?.user);
    } finally {
      setIsLoadingUser(false);
    }
  }

  /*
    Used by login, logout
  _*/
  function _setUser(user: UserInfo | undefined) {
    setActiveUser(user);
  }
}

export function useUserContext(): UserContext {
  const ctx = React.useContext(userContext);
  if(ctx === undefined) {
    throw new Error('undefined userContext, useUserContext() should be used inside of a UserContext.Provider');
  }
  return ctx;
}
