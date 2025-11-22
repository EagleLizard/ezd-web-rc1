
import './login-page.css';
import React, { useState } from 'react';
import { Button, InputLabel, TextField } from '@mui/material';
import { EzdInput } from '../../../components/ezd-input/ezd-input';
import { EzdButton } from '../../../components/ezd-button/ezd-button';
import { inputFormats } from '../../../../lib/input-formats';
import { userService } from '../../../../service/user-service';
import { prim } from '../../../../lib/util/validate-primitives';
import { EzdLoadingSpinner } from '../../../components/ezd-loading-spinner/ezd-loading-spinner';
import { WhoamiResp, whoamiRespSchema } from '../../../../lib/models/whoami-resp';

type LoginPageProps = {
//
} & {};

const username_err_msg = 'Invalid username';
const password_err_msg = 'Invalid password';

export function LoginPage(props: LoginPageProps) {
  const [ username, setUsername ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');

  const [ usernameError, setUsernameError ] = useState<string | undefined>();
  const [ passwordError, setPasswordError ] = useState<string | undefined>();
  const [ authErrorMsg, setAuthErrorMsg ] = useState<string | undefined>();

  const [ showPassword, setShowPassword ] = useState<boolean>(false);

  const [ whoamiLoading, setWhoamiLoading ] = useState<boolean>(false);
  const [ loginLoading, setLoginLoading ] = useState<boolean>(false);

  const [ whoamiRes, setWhoamiRes ] = useState<WhoamiResp | undefined>();

  if(usernameError !== undefined && inputFormats.checkUsername(username)) {
    setUsernameError(undefined);
  }
  if(passwordError !== undefined && inputFormats.checkPassword(password)) {
    setPasswordError(undefined);
  }

  return (
    <div className="login-page">
      <div>
        login
      </div>
      {/* <div className="login-field">
        <TextField label="username" className="etc123"/>
        <Button onClick={handleShowHideClick}>
          {showPassword ? 'hide' : 'show'}
        </Button>
      </div> */}
      {authErrorMsg && (
        <div className="auth-error-banner">
          <div className="banner-close">
            <EzdButton onClick={() => {
              closeAuthErrorBanner();
            }}>
              X
            </EzdButton>
          </div>
          <div className="banner-message">
            {authErrorMsg}
          </div>
        </div>
      )}
      <form onSubmit={handleLoginFormSubmit}>
        <div className="login-field">
          <EzdInput
            label="username"
            invalid={usernameError !== undefined}
            errorMsg={usernameError}
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div className="login-field">
          <EzdInput
            label="password"
            invalid={passwordError !== undefined}
            errorMsg={passwordError}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
          />
          <EzdButton onClick={handleShowHideClick}>
            {showPassword ? 'hide' : 'show'}
          </EzdButton>
        </div>
        <div className="login-field">
          <EzdButton type="submit">
            Log in
          </EzdButton>
          {loginLoading && (
            <EzdLoadingSpinner/>
          )}
        </div>
      </form>
      <hr/>
      <div className="whoami">
        <div className="whoami-button">
          <EzdButton onClick={handleWhoamiClick}>
            whoami
          </EzdButton>
          {whoamiLoading && (
            <EzdLoadingSpinner/>
          )}
        </div>
        <div className="whoami-content">
          {whoamiRes && (
            <table className="prop-table">
              <thead>
                <tr>
                  <th>
                    <EzdButton onClick={handleWhoamiRespCloseClick}>
                      X
                    </EzdButton>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(whoamiRes.user).map(([ k, v ]) => {
                  return (
                    <tr key={k}>
                      <td>
                        <code>
                          {k}
                        </code>
                      </td>
                      <td>
                        <code>
                          {v}
                        </code>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
  function handleWhoamiRespCloseClick() {
    setWhoamiRes(undefined);
  }
  function handleWhoamiClick() {
    setWhoamiRes(undefined);
    setWhoamiLoading(true);
    userService.getWhoami().then(res => {
      let whoamiRes: WhoamiResp;
      console.log('whoami res:');
      console.log(res);
      whoamiRes = whoamiRespSchema.decode(res);
      setWhoamiRes(whoamiRes);
    }).catch(err => {
      console.log('whoami err');
      console.log(err);
    }).finally(() => {
      setWhoamiLoading(false);
    });
  }

  function handleLoginFormSubmit($e: React.FormEvent<HTMLFormElement>) {
    let validUsername: boolean;
    let validPassword: boolean;
    $e.preventDefault();
    validUsername = inputFormats.checkUsername(username);
    validPassword = inputFormats.checkPassword(password);
    if(!validUsername) {
      setUsernameError(username_err_msg);
    }
    if(!validPassword) {
      setPasswordError(password_err_msg);
    }
    if(!validUsername || !validPassword) {
      return;
    }
    setLoginLoading(true);
    setAuthErrorMsg(undefined);
    userService.logInUser({
      username,
      password,
    }).then(res => {
      let errorMsg: string | undefined;
      if(res.status !== 200) {
        if(prim.isObject(res.body) && prim.isString(res.body.message)) {
          errorMsg = res.body.message;
        } else {
          errorMsg = 'Log in error';
        }
        setAuthErrorMsg(errorMsg);
      }
    }).catch((err) => {
      console.log('err');
      console.log(err);
    }).finally(() => {
      setLoginLoading(false);
    });
    console.log({
      username,
      password,
    });
  }
  function handleUsernameChange($e: React.ChangeEvent<HTMLInputElement>) {
    setUsername($e.target.value);
  }
  function handlePasswordChange($e: React.ChangeEvent<HTMLInputElement>) {
    setPassword($e.target.value);
  }
  function handleShowHideClick($e: React.MouseEvent<HTMLButtonElement>) {
    // console.log($e);
    setShowPassword(!showPassword);
  }
  function closeAuthErrorBanner() {
    setAuthErrorMsg(undefined);
  }
}
