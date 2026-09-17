
import './ezd-combobox.css';
import React, { useEffect, useState } from 'react';
import { Combobox } from '@base-ui/react';
import { prim } from '../../../lib/util/validate-primitives';

type EzdComboBasicItem = {
  value: string;
  label?: string;
  disabled?: boolean;
} & {};
/*
  todo: support groups
_*/
type EzdComboPropItem = (
  string
  | (EzdComboBasicItem & {})
) & {};

export type EzdComboItem = ({
  value: string;
  label: string;
  disabled?: boolean;
} & {});

type EzdComboboxProps<Value = string | string[] | EzdComboItem, Multiple extends boolean | undefined = false, Item = Value> = {
  items?: (EzdComboPropItem & {})[];
  id?: string;
  placeholder?: string;
  label?: string;
  onChange?: (value: string | undefined, event?: Combobox.Root.ChangeEventDetails) => void;
} & Pick<Combobox.Root.Props<Value, Multiple, Item>, 'disabled' | 'value'> & {};
export function EzdCombobox<
  Value = string,
  Multiple extends boolean | undefined = false,
  Item = Value
>(props: EzdComboboxProps<Value, Multiple, Item>) {
  const id = props.id ?? React.useId();
  const items = props.items?.map(getComboItem);
  const selected = items?.find(item => item.value === props.value);

  return (
    <Combobox.Root
      items={items}
      disabled={props.disabled}
      value={selected ?? null}
      isItemEqualToValue={(itemValue, value) => {
        return itemValue.value === value.value;
      }}
      onValueChange={(value, $e) => {
        return props.onChange?.(value?.value, $e);
      }}
    >
      <div className="ezd-combobox">
        {props.label && (
          <label className="combobox-label" htmlFor={id}>{props.label}</label>
        )}
        <Combobox.InputGroup className="input-group">
          <Combobox.Input id={id} className="combobox-input" placeholder={props.placeholder}/>
          <div className="combobox-actions">
            <Combobox.Clear className="combo-btn">
              🞪
            </Combobox.Clear>
            <Combobox.Trigger className="combo-btn" aria-label="Open popup">
              ▼
            </Combobox.Trigger>
          </div>
        </Combobox.InputGroup>
      </div>
      <Combobox.Portal>
        <Combobox.Positioner className="combobox-positioner" align="start">
          <Combobox.Popup className="ezd-combobox-popup">
            <div className="popup-content">
              <Combobox.Empty>
                <div className="empty">No results</div>
              </Combobox.Empty>
              <Combobox.List>
                {(item: EzdComboItem) => (
                  <Combobox.Item key={item.value} value={item} className="combobox-item">
                    <Combobox.ItemIndicator className="item-indicator">
                      x
                    </Combobox.ItemIndicator>
                    <div className="item-text">
                      {item.label}
                    </div>
                  </Combobox.Item>
                )}
              </Combobox.List>
            </div>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}

function getComboItem(item: EzdComboPropItem): EzdComboItem {
  if(prim.isString(item)) {
    return { value: item, label: item };
  }
  return {
    value: item.value,
    label: prim.isString(item.label) ? item.label : `${item.value}`,
    disabled: item.disabled,
  };
}
