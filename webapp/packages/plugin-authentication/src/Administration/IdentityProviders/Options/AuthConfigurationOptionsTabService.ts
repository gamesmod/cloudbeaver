/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { AuthConfigurationsResource } from '@cloudbeaver/core-authentication';
import { Bootstrap, injectable } from '@cloudbeaver/core-di';
import type { IExecutionContextProvider } from '@cloudbeaver/core-executor';

import { AuthConfigurationFormService } from '../AuthConfigurationFormService';
import { authConfigurationContext } from '../Contexts/authConfigurationContext';
import type { IAuthConfigurationFormFillConfigData, IAuthConfigurationFormSubmitData } from '../IAuthConfigurationFormProps';
import { AuthConfigurationOptions } from './AuthConfigurationOptions';

@injectable()
export class AuthConfigurationOptionsTabService extends Bootstrap {
  constructor(
    private readonly authConfigurationFormService: AuthConfigurationFormService,
    private readonly authConfigurationsResource: AuthConfigurationsResource,
  ) {
    super();
  }

  register(): void {
    this.authConfigurationFormService.tabsContainer.add({
      key: 'options',
      name: 'Options',
      order: 1,
      panel: () => AuthConfigurationOptions,
    });

    this.authConfigurationFormService.prepareConfigTask
      .addHandler(this.prepareConfig.bind(this));

    this.authConfigurationFormService.formValidationTask
      .addHandler(this.validate.bind(this));

    this.authConfigurationFormService.formSubmittingTask
      .addHandler(this.save.bind(this));

    this.authConfigurationFormService.fillConfigTask
      .addHandler(this.fillConfig.bind(this));
  }

  load(): void { }

  private async prepareConfig(
    {
      state,
    }: IAuthConfigurationFormSubmitData,
    contexts: IExecutionContextProvider<IAuthConfigurationFormSubmitData>
  ) {
    const config = contexts.getContext(authConfigurationContext);

    config.id = state.config.id;
    config.providerId = state.config.providerId;
    config.displayName = state.config.displayName;

    if (Object.keys(state.config.parameters).length) {
      config.parameters = state.config.parameters;
    }

    if (state.config.description) {
      config.description = state.config.description;
    }

    if (state.config.iconURL) {
      config.iconURL = state.config.iconURL;
    }
  }

  private async validate(
    {
      state,
    }: IAuthConfigurationFormSubmitData,
    contexts: IExecutionContextProvider<IAuthConfigurationFormSubmitData>
  ) {
    const validation = contexts.getContext(this.authConfigurationFormService.configurationValidationContext);

    if (!state.config.providerId) {
      validation.error("Field 'Provider' can't be empty");
    }

    if (!state.config.id.trim()) {
      validation.error("Field 'ID' can't be empty");
    }

    if (!state.config.displayName?.length) {
      validation.error("Field 'Name' can't be empty");
    }
  }

  private async save(
    {
      state,
    }: IAuthConfigurationFormSubmitData,
    contexts: IExecutionContextProvider<IAuthConfigurationFormSubmitData>
  ) {
    const status = contexts.getContext(this.authConfigurationFormService.configurationStatusContext);
    const config = contexts.getContext(authConfigurationContext);

    try {
      const configuration = await this.authConfigurationsResource.saveConfiguration(config);

      if (state.mode === 'create') {
        status.info('Configuration is created');
        status.info(configuration.displayName);
      } else {
        status.info('Configuration is updated');
        status.info(configuration.displayName);
      }
    } catch (exception) {
      status.error('connections_connection_create_fail', exception);
    }
  }

  private fillConfig(
    { state, updated }: IAuthConfigurationFormFillConfigData,
    contexts: IExecutionContextProvider<IAuthConfigurationFormFillConfigData>
  ) {
    if (!updated) {
      return;
    }

    if (!state.info) {
      return;
    }

    if (state.info.id) {
      state.config.id = state.info.id;
    }
    if (state.info.providerId) {
      state.config.providerId = state.info.providerId;
    }
    if (state.info.displayName) {
      state.config.displayName = state.info.displayName;
    }
    if (state.info.iconURL) {
      state.config.iconURL = state.info.iconURL;
    }
    if (state.info.description) {
      state.config.description = state.info.description;
    }

    if (state.info.parameters) {
      state.config.parameters = { ...state.info.parameters };
    }
  }
}
