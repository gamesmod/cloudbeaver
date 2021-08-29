/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import styled from 'reshadow';

import type { AdministrationItemDrawerProps } from '@cloudbeaver/core-administration';
import { Tab, TabTitle, TabIcon } from '@cloudbeaver/core-blocks';
import { Translate } from '@cloudbeaver/core-localization';
import { useStyles } from '@cloudbeaver/core-theming';

export const AuthConfigurationsDrawerItem: React.FC<AdministrationItemDrawerProps> = function AuthConfigurationsDrawerItem({
  item, onSelect, style, disabled,
}) {
  return styled(useStyles(...style))(
    <Tab tabId={item.name} disabled={disabled} onOpen={() => onSelect(item.name)}>
      <TabIcon icon='/icons/account.svg' />
      <TabTitle><Translate token='administration_identity_providers_tab_title' /></TabTitle>
    </Tab>
  );
};
