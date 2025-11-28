
import React, { useEffect, useState } from 'react';
import { UserInfo } from '../lib/models/user-info';
import { userService } from './user-service';
import { WhoamiResp } from '../lib/models/whoami-resp';

export type UserContext = {
  user?: UserInfo;
  isLoading: boolean;
} & {};

const userContext = React.createContext<UserContext | undefined>(undefined);

type UserContextProviderProps = {
  children?: React.ReactNode;
} & {};

export function UserContextProvider(props: UserContextProviderProps) {
  const [ user, setUser ] = useState<UserInfo>();
  const [ isLoadingUser, setIsLoadingUser ] = useState<boolean>(false);

  const userCtx: UserContext = {
    user,
    isLoading: isLoadingUser,
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
    let user: UserInfo;
    if(isLoadingUser) {
      return;
    }
    setIsLoadingUser(true);
    try {
      user = await loadUser();
      setUser(user);
    } finally {
      setIsLoadingUser(false);
    }
  }

  async function loadUser(): Promise<UserInfo> {
    let whoamiResp: WhoamiResp;
    let userInfo: UserInfo;
    whoamiResp = await userService.getWhoami();
    userInfo = whoamiResp.user;
    return userInfo;
  }
}

export function useUserContext(): UserContext {
  const ctx = React.useContext(userContext);
  if(ctx === undefined) {
    throw new Error('undefined userContext, useUserContext() should be used inside of a UserContext.Provider');
  }
  return ctx;
}
