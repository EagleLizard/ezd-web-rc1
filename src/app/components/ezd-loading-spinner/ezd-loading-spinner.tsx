
import './ezd-loading-spinner.css';

type EzdLoadingSpinnerProps = {
//
} & {};

export function EzdLoadingSpinner(props: EzdLoadingSpinnerProps) {
  return (
    <div className="ezd-loading-spinner">
      {/* loading... */}
      <div className="spinner"></div>
    </div>
  );
}
