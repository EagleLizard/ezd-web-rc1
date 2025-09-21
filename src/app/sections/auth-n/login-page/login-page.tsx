
import './login-page.css';
import React, { useState } from 'react';
import { Button, InputLabel, TextField } from '@mui/material';
import { EzdInput } from '../../../components/ezd-input/ezd-input';
import { EzdButton } from '../../../components/ezd-button/ezd-button';
import { inputFormats } from '../../../../lib/input-formats';
import { userService } from '../../../../service/user-service';
import { prim } from '../../../../lib/util/validate-primitives';

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
          <div className="banner-message">
            {authErrorMsg}
          </div>
          <div className="banner-close">
            <EzdButton onClick={() => {
              closeAuthErrorBanner();
            }}>
              X
            </EzdButton>
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
        </div>
      </form>
      <hr/>
      <div>
        <EzdButton onClick={handleWhoamiClick}>
          whoami
        </EzdButton>
      </div>
    </div>
  );
  function handleWhoamiClick() {
    userService.getWhoami().then(res => {
      console.log('whoami res:');
      console.log(res);
    }).catch(err => {
      console.log('whoami err');
      console.log(err);
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
