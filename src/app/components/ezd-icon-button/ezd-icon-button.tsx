
import './ezd-icon-button.css';

type EzdIconButtonProps = {
  children?: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline';
} & Pick<React.ComponentProps<'button'>, (
  'className'
  | 'onClick'
  | 'type'
  | 'aria-label'
  | 'title'
)> & {};
export function EzdIconButton(props: EzdIconButtonProps) {
  const variant = props.variant ?? 'default';
  const tabIndex = 0;
  const classNameStr = [
    'ezd-icon-button',
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
      <div>
        {props.children}
      </div>
    </button>
  );
}
