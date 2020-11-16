/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observable, computed } from 'mobx';

import { UsersResource } from '@cloudbeaver/core-authentication';
import {
  injectable, IInitializableController, IDestructibleController
} from '@cloudbeaver/core-di';
import { NotificationService } from '@cloudbeaver/core-events';
import { GQLErrorCatcher, AdminUserInfo, ResourceKeyUtils, ResourceKey } from '@cloudbeaver/core-sdk';

@injectable()
export class UserEditController
implements IInitializableController, IDestructibleController {
  @observable isLoading = true;
  @observable user: AdminUserInfo | null = null;

  @computed get isDisabled() {
    return this.usersResource.isDataLoading(this.userId);
  }

  userId!: string;

  readonly error = new GQLErrorCatcher();

  constructor(
    private notificationService: NotificationService,
    private usersResource: UsersResource
  ) {
    this.updateUser = this.updateUser.bind(this);
  }

  async init(id: string): Promise<void> {
    this.userId = id;

    await this.loadUser();
    this.usersResource.onItemAdd.addHandler(this.updateUser);
  }

  destruct(): void {
    this.usersResource.onItemAdd.removeHandler(this.updateUser);
  }

  private async loadUser() {
    try {
      // we create a copy to protect the current value from mutation
      await this.usersResource.load(this.userId);
      this.updateUser(this.userId);
    } catch (exception) {
      this.notificationService.logException(exception, `Can't load user ${this.userId}`);
    }
  }

  private async updateUser(key: ResourceKey<string>) {
    if (!ResourceKeyUtils.includes(key, this.userId)) {
      return;
    }
    this.user = JSON.parse(JSON.stringify(await this.usersResource.load(this.userId)));
  }
}
