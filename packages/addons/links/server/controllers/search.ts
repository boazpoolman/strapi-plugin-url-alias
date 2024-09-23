

import { Context } from 'koa';
import { Common } from '@strapi/strapi';
import { isContentTypeEnabled } from '../util/enabledContentTypes';

/**
 * Search controller
 */

export default {
  index: async (ctx: Context & { params: { id: number } }) => {
    const { q } = ctx.query;
    const { id } = ctx.params;
    let results = [];

    await Promise.all(Object.entries(strapi.contentTypes)
      .map(async ([uid, config]: [Common.UID.CollectionType, any]) => {
        const hasWT = isContentTypeEnabled(uid);

        console.log(uid, hasWT);

        if (!hasWT) {
          return;
        }

        console.log('goo');

        const coreStoreSettings = await strapi.query('strapi::core-store').findMany({
          where: {
            key: `plugin_content_manager_configuration_content_types::${uid}`,
          },
        });

        console.log('yes');

        if (!coreStoreSettings[0]) {
          // no settings for the contnet type.
          return;
        }

        console.log('no');

        // @ts-ignore
        const value = JSON.parse(coreStoreSettings[0].value);
        const { mainField } = value.settings;

        const entries = await strapi.entityService.findMany(uid, {
          filters: {
            [mainField]: {
              $containsi: q,
            },
          },
          fields: [mainField],
          populate: {
            url_alias: {
              fields: ['id'],
            },
          },
        }) as any[];

        results = [...results, ...entries];
      }));

    // @ts-ignore
    ctx.body = results;
  },
};
