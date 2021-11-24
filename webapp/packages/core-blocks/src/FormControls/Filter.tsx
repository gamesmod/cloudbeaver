/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useState } from 'react';
import styled, { css, use } from 'reshadow';

import { composes, useStyles } from '@cloudbeaver/core-theming';

import { IconButton } from '../IconButton';
import { useFocus } from '../useFocus';
import { InputField } from './InputField';

const styles = css`
  filter-container {
    position: relative;
    min-width: 24px;
    min-height: 24px;
  }
  InputField {
    display: none;
    width: 300px;
    &[|max] {
      width: 100%;
    }
    &[|toggled] {
      display: block;
    }
  }
  IconButton {
    position: absolute;
    right: 0;
    top: 0;
    margin: 0;
    width: 24px;
    height: 24px;
    border-radius: 2px;
    cursor: auto;

    &[|toggled] {
      right: 2px;
      top: 2px;
      border-radius: unset;
    }
  }
`;

const toggleModeButtonStyle = composes(
  css`
    IconButton {
      composes: theme-background-primary theme-text-on-primary from global;
    }
  `,
  css`
    IconButton {
      cursor: pointer;
    }
`);

const innerInputStyle = css`
  input {
    height: 28px;
    padding-right: 24px !important;
  }
`;

interface BaseProps {
  toggleMode?: boolean;
  placeholder?: string;
  disabled?: boolean;
  max?: boolean;
  className?: string;
  onToggle?: (status: boolean) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

type ControlledProps = BaseProps & {
  name?: string;
  value?: string;
  state?: never;
  onFilter?: (value: string, name?: string) => void;
};

type ObjectsProps<TKey extends keyof TState, TState> = BaseProps & {
  name: TKey;
  state: TState;
  value?: never;
  onFilter?: (value: TState[TKey], name: TKey) => void;
};

export const Filter = observer<ControlledProps | ObjectsProps<any, any>>(function Filter({
  state,
  name,
  value: valueControlled,
  toggleMode,
  placeholder,
  disabled,
  max,
  className,
  onFilter,
  onToggle,
  onKeyDown,
}) {
  const [inputRef] = useFocus<HTMLInputElement>({});
  const [toggled, setToggled] = useState(!toggleMode);

  const filter = useCallback((value: string | number, name?: string) => {
    value = String(value);

    if (state && name) {
      state[name] = value;
    }

    if (onFilter) {
      onFilter(value, name);
    }
  }, [onFilter, state]);

  const toggle = useCallback(() => {
    if (!toggleMode) {
      return;
    }

    if (toggled) {
      filter('');
    }

    setToggled(!toggled);

    if (onToggle) {
      onToggle(!toggled);
    }
  }, [toggleMode, toggled, onToggle, filter]);

  useEffect(() => {
    if (toggled && toggleMode) {
      inputRef.current?.focus();
    }
  }, [toggled, toggleMode, inputRef]);

  let value: any = valueControlled;

  if (state && name !== undefined && name in state) {
    value = state[name];
  }

  return styled(useStyles(styles, toggleMode && toggleModeButtonStyle))(
    <filter-container className={className}>
      <InputField
        ref={inputRef}
        style={innerInputStyle}
        placeholder={placeholder}
        disabled={disabled}
        name={name}
        value={value}
        onChange={filter}
        onKeyDown={onKeyDown}
        {...use({ toggled, max })}
      />
      <IconButton
        name='search'
        disabled={disabled}
        onClick={toggle}
        {...use({ toggled })}
      />
    </filter-container>
  );
});
