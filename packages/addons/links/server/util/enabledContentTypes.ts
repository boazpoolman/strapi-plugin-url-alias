import _ from 'lodash';
import { Common, Schema } from '@strapi/strapi';

export const isContentTypeEnabled = (ct: Common.UID.ContentType | Schema.ContentType) => {
  let contentType: Schema.ContentType;

  if (typeof ct === 'string') {
    contentType = strapi.contentTypes[ct];
  } else {
    contentType = ct;
  }

  const { pluginOptions } = contentType;
  const enabled = _.get(pluginOptions, ['webtools', 'enabled'], false) as boolean;

  if (!enabled) return false;

  return true;
};
