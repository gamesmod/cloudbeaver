/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2023 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
import { injectable } from '@cloudbeaver/core-di';
import { CachedDataResource } from '@cloudbeaver/core-resource';
import { DataTransferDefaultExportSettings, GraphQLService } from '@cloudbeaver/core-sdk';

@injectable()
export class DefaultExportOutputSettingsResource extends CachedDataResource<DataTransferDefaultExportSettings | null> {
  constructor(private readonly graphQLService: GraphQLService) {
    super(() => null);
  }

  async loader() {
    return (await this.graphQLService.sdk.getDataTransferDefaultParameters()).settings;
  }
}
