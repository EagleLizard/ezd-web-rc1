
import './ezd-button.css';

type EzdButtonProps = {
  children?: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline';
} & Pick<React.ComponentProps<'button'>, (
  'className'
  | 'onClick'
  | 'type'
  | 'aria-label'
  | 'title'
)> & {};

export function EzdButton(props: EzdButtonProps) {
  const variant = props.variant ?? 'secondary';
  const tabIndex = 0;
  const classNameStr = [
    'ezd-button',
    variant,
    props.className ?? '',
  ].join(' ');
  return (
    <button
      className={classNameStr}
      type={props.type ?? 'button'}
      onClick={props?.onClick}
      tabIndex={tabIndex}
      aria-label={props['aria-label']}
      title={props.title}
    >
      { props.children }
    </button>
  );
}
