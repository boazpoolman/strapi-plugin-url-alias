import { Strapi } from '@strapi/strapi';

export default ({ strapi }: { strapi: Strapi }) => {
  strapi.customFields.register({
    name: 'link',
    plugin: 'webtools-addon-links',
    type: 'string',
  });
};
