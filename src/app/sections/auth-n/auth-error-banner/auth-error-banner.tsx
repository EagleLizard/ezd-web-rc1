
import './auth-error-banner.css';

import { EzdButton } from '../../../components/ezd-button/ezd-button';

type AuthErrorBannerProps = {
  message: string;

  onClose: () => void;
} & {};

export function AuthErrorBanner(props: AuthErrorBannerProps) {
  return (
    <div className="auth-error-banner">
      <div className="banner-close">
        <EzdButton onClick={props.onClose}>
          X
        </EzdButton>
      </div>
      <div className="banner-message">
        {props.message}
      </div>
    </div>
  );
}
