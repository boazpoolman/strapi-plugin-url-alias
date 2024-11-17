import { AdminApp } from '@pluginpal/webtools-helper-plugin';
import pluginPkg from '../package.json';
import pluginId from './helpers/pluginId';
import EditView from './components/EditView';
import AdminRoute from './components/AdminRoute';
import NavLink from './components/NavLink';
import getTranslation from './helpers/getTranslation';

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
    app.getPlugin('content-manager').injectComponent('editView', 'right-links', {
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
  async registerTrads(app: any) {
    const { locales } = app;

    const importedTranslations = await Promise.all(
      (locales as string[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: getTranslation(data),
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

    return importedTranslations;
  },
};
