
import './ezd-input.css';
import React from 'react';

type EzdTextInputProps = {
  label?: React.ReactNode;
  invalid?: boolean;
  errorMsg?: React.ReactNode;
} & Pick<React.ComponentProps<'input'>, (
    'type'
    | 'className'
    | 'id'
    // | 'name'
    | 'value'
    | 'onChange'
  )> & {};

export function EzdInput(props: EzdTextInputProps) {
  let classNames: string[];
  let errMsgId: string | undefined;
  const id = props.id ?? React.useId();
  const labelId = `${id}-label`;
  classNames = [
    'ezd-input',
  ];
  if(props.className !== undefined) {
    classNames.push(props.className);
  }
  if(props.invalid) {
    classNames.push('ezd-error');
  }
  const classNameStr = classNames.join(' ');

  if(props.errorMsg) {
    errMsgId = `${id}-errormsg`;
  }
  return (
    <div
      className={classNameStr}
    >
      {props.label && (
        <label
          className="ezd-input-label"
          id={labelId}
          htmlFor={id}
        >
          {props.label}
        </label>
      )}
      <input
        id={id}
        aria-invalid={props.invalid || undefined}
        aria-errormessage={errMsgId}
        // name={props.name}
        value={props.value}
        type={props.type ?? 'text'}
        onChange={props.onChange}
      />
      {(props.invalid && props.errorMsg) && (
        <div
          id={errMsgId}
          className="ezd-input-errormsg"
        >
          {props.errorMsg}
        </div>
      )}
    </div>
  );
}
