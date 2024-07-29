import { prefixPluginTranslations } from '@strapi/helper-plugin';
import { AdminApp } from '@pluginpal/webtools-helper-plugin';
import pluginPkg from '../package.json';
import pluginId from './helpers/pluginId';
import EditView from './components/EditView';
import AdminRoute from './components/AdminRoute';
import NavLink from './components/NavLink';

const pluginDescription = pluginPkg.strapi.description || pluginPkg.description;
const { name } = pluginPkg.strapi;

export default {
  register(app: AdminApp) {
    app.registerPlugin({
      description: pluginDescription,
      id: pluginId,
      isReady: true,
      isRequired: pluginPkg.strapi.required || false,
      name,
    });
  },
  bootstrap(app: AdminApp) {
    app.injectContentManagerComponent('editView', 'right-links', {
      name: 'sitemap-edit-view',
      Component: EditView,
    });

    app.getPlugin('webtools').injectComponent('webtoolsSidebar', 'link', {
      name: 'navigation-link',
      Component: NavLink,
    });

    app.getPlugin('webtools').injectComponent('webtoolsRouter', 'route', {
      name: 'settings-route',
      Component: AdminRoute,
    });
  },
  async registerTrads({ locales }: { locales: string[] }) {
    const importedTrads = await Promise.all(
      locales.map((locale) => {
        return import(
          /* webpackChunkName: "url-alias-translation-[request]" */ `./translations/${locale}.json`
        )
          .then(({ default: data }) => {
            return {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      }),
    );

    return Promise.resolve(importedTrads);
  },
};
