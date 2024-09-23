import { Strapi } from '@strapi/strapi';

declare global {
  const strapi: Strapi;
}

export default global;
