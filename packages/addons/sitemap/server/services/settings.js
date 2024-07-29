'use strict';

import { Map } from 'immutable';

/**
 * Sitemap.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const createDefaultConfig = async () => {
  const pluginStore = strapi.store({
    environment: '',
    type: 'plugin',
    name: 'sitemap',
  });

  const value = {
    hostname: '',
    includeHomepage: true,
    excludeDrafts: true,
    defaultLanguageUrlType: '',
    defaultLanguageUrl: '',
    hostname_overrides: {},
    contentTypes: Map({}),
    customEntries: Map({}),
  };

  await pluginStore.set({ key: 'settings', value });

  return strapi
    .store({
      environment: '',
      type: 'plugin',
      name: 'sitemap',
    })
    .get({ key: 'settings' });
};

export default () => ({
  getConfig: async () => {
    let config = await strapi
      .store({
        environment: '',
        type: 'plugin',
        name: 'sitemap',
      })
      .get({ key: 'settings' });

    if (!config) {
      config = await createDefaultConfig();
    }

    return config;
  },
});
