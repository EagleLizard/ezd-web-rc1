
import './ezd-button.css';

type EzdButtonProps = {
  children?: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline';
  color?: 'default' | 'delete'
} & Pick<React.ComponentProps<'button'>, (
  'className'
  | 'onClick'
  | 'type'
  | 'aria-label'
  | 'title'
  | 'disabled'
)> & {};

export function EzdButton(props: EzdButtonProps) {
  const variant = props.variant ?? 'default';
  const tabIndex = 0;
  let classNames = [
    'ezd-button',
    variant,
  ];
  if(props.className !== undefined) {
    classNames.push(props.className);
  }
  switch(props.color) {
    case 'delete':
      classNames.push('color-delete');
      break;
  }
  const classNameStr = classNames.join(' ');
  return (
    <button
      className={classNameStr}
      type={props.type ?? 'button'}
      onClick={props?.onClick}
      tabIndex={tabIndex}
      aria-label={props['aria-label']}
      title={props.title}
      disabled={props.disabled}
    >
      { props.children }
    </button>
  );
}
