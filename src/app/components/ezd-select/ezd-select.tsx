
import './ezd-select.css';

import React from 'react';
import { prim } from '../../../lib/util/validate-primitives';


/*
initial aim: basic interface similar to mantine NativeSelect:
  https://mantine.dev/core/native-select
_*/
type EzdSelectBasicItem = {
  value: string;
  label?: string;
  disabled?: boolean;
} & {};
// type EzdSelectGroupItem = {
//   group: string;
//   items: (string | EzdSelectBasicItem)[];
// };
type EzdSelectPropItem = (
  string
  | (EzdSelectBasicItem & {})
  // | EzdSelectGroupItem
) & {};

type EzdSelectItem = ({
  value: string;
  label: string;
  disabled?: boolean;
} & {});

type EzdSelectProps = {
  // children: React.ReactElement<HTMLOptionElement> | React.ReactElement<HTMLOptionElement>[];
  data?: (EzdSelectPropItem & {})[];
} & Pick<React.ComponentProps<'select'>, (
  'className'
  | 'id'
  | 'value'
  | 'onChange'
)> & {};
export function EzdSelect(props: EzdSelectProps) {
  const id = props.id ?? React.useId();
  let classNames: string[] = [
    'ezd-select',
  ];
  if(props.className !== undefined) {
    classNames.push(props.className);
  }
  const classNameStr = classNames.join(' ');

  const selectItems = props.data?.map(item => getSelectItem(item)) ?? [];
  return (
    <select
      id={id}
      className={classNameStr}
      value={props.value}
      onChange={props.onChange}
    >
      {selectItems.map((item) => (
        <option key={item.value} value={item.value} disabled={item.disabled}>
          {item.label}
        </option>
      ))}
    </select>
  );
}

function getSelectItem(item: EzdSelectPropItem): EzdSelectItem {
  if(prim.isString(item)) {
    return { value: item, label: item };
  }
  return {
    value: item.value,
    label: prim.isString(item.label) ? item.label : `${item.value}`,
    disabled: item.disabled,
  };
}
