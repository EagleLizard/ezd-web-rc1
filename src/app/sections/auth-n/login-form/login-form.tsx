
import './login-form.css';

import { useState } from 'react';

import { EzdButton } from '../../../components/ezd-button/ezd-button';
import { EzdInput } from '../../../components/ezd-input/ezd-input';
import { EzdLoadingSpinner } from '../../../components/ezd-loading-spinner/ezd-loading-spinner';
import { inputFormats } from '../../../../lib/input-formats';

export type LoginFormData = {
  username: string;
  password: string;
} & {};

type LoginFormProps = {
  onSubmit: (loginFormData: LoginFormData) => void;

  loading?: boolean;
} & {};

const username_err_msg = 'Invalid username';
const password_err_msg = 'Invalid password';

export function LoginForm(props: LoginFormProps) {
  const [ username, setUsername ] = useState<string>('');
  const [ password, setPassword ] = useState<string>('');

  const [ usernameError, setUsernameError ] = useState<string | undefined>();
  const [ passwordError, setPasswordError ] = useState<string | undefined>();
  const [ showPassword, setShowPassword ] = useState<boolean>(false);

  if(usernameError !== undefined && inputFormats.checkUsername(username)) {
    setUsernameError(undefined);
  }
  if(passwordError !== undefined && inputFormats.checkPassword(password)) {
    setPasswordError(undefined);
  }

  return (
    <div className="login-form">
      <div className="login-header">
        login {props.loading}
      </div>
      <form
        className="auth-form"
        onSubmit={handleLoginFormSubmit}
      >
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
          <EzdButton
            className="full-button"
            type="submit"
          >
            Log in
          </EzdButton>
          {props.loading && (
            <EzdLoadingSpinner/>
          )}
        </div>
      </form>
    </div>
  );
  function handleLoginFormSubmit($e: React.FormEvent<HTMLFormElement>) {
    $e.preventDefault(); // prevent page reload
    let validUsername = inputFormats.checkUsername(username);
    let validPassword = inputFormats.checkPassword(password);
    if(!validUsername) {
      setUsernameError(username_err_msg);
    }
    if(!validPassword) {
      setPasswordError(password_err_msg);
    }
    if(!validUsername || !validPassword) {
      return;
    }
    props.onSubmit({
      username: username,
      password: password,
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
}
