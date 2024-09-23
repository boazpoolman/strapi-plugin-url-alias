import { prefixPluginTranslations } from '@strapi/helper-plugin';
import { AdminApp } from '@pluginpal/webtools-helper-plugin';
import pluginPkg from '../package.json';
import pluginId from './helpers/pluginId';
import getTrad from './helpers/getTrad';
import Icon from './components/Icon';

const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
const { name } = pluginPkg.strapi;

export default {
  register(app: AdminApp) {
    app.customFields.register({
      name: 'link',
      pluginId: 'webtools-addon-links', // the custom field is created by a webtools-addon-links plugin
      type: 'string', // the link will be stored as a string
      intlLabel: {
        id: 'webtools-addon-links.link.label',
        defaultMessage: 'Link',
      },
      intlDescription: {
        id: 'webtools-addon-links.link.description',
        defaultMessage: 'For internal and external links',
      },
      icon: Icon, // don't forget to create/import your icon component
      components: {
        Input: async () => import(
          /* webpackChunkName: "input-component" */ "./components/Input"
        ),
      },
      options: {
        // declare options here
      },
    });
  },
  bootstrap(app: AdminApp) {

  },
  // async registerTrads({ locales }: { locales: string[] }) {
  //   const importedTrads = await Promise.all(
  //     locales.map((locale) => {
  //       try {
  //         // eslint-disable-next-line import/no-dynamic-require, global-require
  //         const data = require(`./translations/${locale}.json`) as Record<string, string>;
  //         return {
  //           data: prefixPluginTranslations(data, pluginId),
  //           locale,
  //         };
  //       } catch {
  //         return {
  //           data: {},
  //           locale,
  //         };
  //       }
  //     }),
  //   );

  //   return Promise.resolve(importedTrads);
  // },
};
