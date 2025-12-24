
import './login-page.css';

import { useState } from 'react';

import { userService } from '../../../../service/user-service';
import { prim } from '../../../../lib/util/validate-primitives';
import { LoginForm, LoginFormData } from '../login-form/login-form';
import { Whoami } from '../whoami/whoami';
import { AuthErrorBanner } from '../auth-error-banner/auth-error-banner';
import { useUserContext } from '../../../../service/user-context';
import { UserInfoSchema } from '../../../../lib/models/user-info';
import { useRouter } from '@tanstack/react-router';

type LoginPageProps = {
//
} & {};

export function LoginPage(props: LoginPageProps) {
  const [ authErrorMsg, setAuthErrorMsg ] = useState<string | undefined>();

  const [ loginLoading, setLoginLoading ] = useState<boolean>(false);

  const router = useRouter();
  const userCtx = useUserContext();

  return (
    <div className="login-page">
      <section className="auth-n">
        <LoginForm
          onSubmit={handleLoginSubmit}
          loading={loginLoading}
        />
        {authErrorMsg && (
          <div className="auth-errors">
            <AuthErrorBanner
              message={authErrorMsg}
              onClose={closeAuthErrorBanner}
            />
          </div>
        )}
      </section>
      <hr/>
      <Whoami/>
    </div>
  );

  function handleLoginSubmit(loginFormData: LoginFormData) {
    setLoginLoading(true);
    setAuthErrorMsg(undefined);
    userService.logInUser({
      username: loginFormData.username,
      password: loginFormData.password,
    }).then((res) => {
      let errMsg: string | undefined;
      if(res.status !== 200) {
        if(prim.isObject(res.body) && prim.isString(res.body.message)) {
          errMsg = res.body.message;
        } else {
          errMsg = 'Login error';
        }
        setAuthErrorMsg(errMsg);
        return;
      }
      if(!prim.isObject(res.body)) {
        errMsg = 'Malformed login response';
        setAuthErrorMsg(errMsg);
        return;
      }
      let user = UserInfoSchema.decode(res.body.user);
      userCtx.setUser(user);
      router.navigate({
        to: '/',
      });
    }).catch((err) => {
      console.error('err');
      console.error(err);
    }).finally(() => {
      setLoginLoading(false);
    });
  }

  function closeAuthErrorBanner() {
    setAuthErrorMsg(undefined);
  }
}
