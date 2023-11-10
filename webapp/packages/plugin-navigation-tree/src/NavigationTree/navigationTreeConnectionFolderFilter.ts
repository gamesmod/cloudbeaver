/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2023 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
import { ConnectionInfoResource, getConnectionFolderId } from '@cloudbeaver/core-connections';
import type { NavNodeInfoResource, NavTreeResource } from '@cloudbeaver/core-navigation-tree';

import type { IElementsTreeFilter } from './ElementsTree/useElementsTree';

export function navigationTreeConnectionFolderFilter(
  navTreeResource: NavTreeResource,
  navNodeInfoResource: NavNodeInfoResource,
  connectionInfoResource: ConnectionInfoResource,
): IElementsTreeFilter {
  return (tree, filter, node, children, state) => {
    if (filter === '') {
      return children;
    }

    const matchedConnections = connectionInfoResource.values.filter(
      connection => connection.folder && connection.name.toLowerCase().includes(filter.toLowerCase()),
    );

    const matchedNodes = matchedConnections
      .map(connection => {
        const folderId = getConnectionFolderId({ folderId: connection.folder!, projectId: connection.projectId });
        return [...navNodeInfoResource.getParents(folderId), folderId];
      })
      .flat();

    const originalChildren = navTreeResource.get(node.id) || [];
    const matchedChildren = originalChildren.filter(child => matchedNodes.includes(child));
    const uniqueChildren = new Set([...children, ...matchedChildren]);

    return [...uniqueChildren];
  };
}
