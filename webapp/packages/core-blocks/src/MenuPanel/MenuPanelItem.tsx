/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2023 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
import { observer } from 'mobx-react-lite';
import styled, { use } from 'reshadow';

import type { IMenuItem } from '@cloudbeaver/core-dialogs';
import type { ComponentStyle } from '@cloudbeaver/core-theming';

import { Checkbox } from '../FormControls/Checkboxes/Checkbox';
import { Radio } from '../FormControls/Radio';
import { Icon } from '../Icon';
import { IconOrImage } from '../IconOrImage';
import { Loader } from '../Loader/Loader';
import { useTranslate } from '../localization/useTranslate';
import { useStyles } from '../useStyles';
import { menuPanelStyles } from './menuPanelStyles';

interface MenuPanelItemProps {
  menuItem: IMenuItem;
  style?: ComponentStyle;
}

export const MenuPanelItem = observer<MenuPanelItemProps>(function MenuPanelItem({ menuItem, style = [] }) {
  const translate = useTranslate();

  const title = translate(menuItem.title);
  let control = null;

  if (menuItem.type === 'radio') {
    control = <Radio checked={menuItem.isChecked} mod={['primary', 'menu']} ripple={false} />;
  } else if (menuItem.type === 'checkbox') {
    control = <Checkbox checked={menuItem.isChecked} mod={['primary', 'small']} style={style} ripple={false} />;
  }

  return styled(useStyles(menuPanelStyles, style))(
    <menu-panel-item {...use({ separator: menuItem.separator })}>
      <menu-item-content>{menuItem.icon ? <IconOrImage icon={menuItem.icon} /> : control}</menu-item-content>
      <menu-item-text title={title}>{title}</menu-item-text>
      <menu-item-content>
        {menuItem.panel && (menuItem.isProcessing ? <Loader small fullSize /> : <Icon name="arrow" viewBox="0 0 16 16" />)}
      </menu-item-content>
    </menu-panel-item>,
  );
});
