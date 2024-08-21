

import { EntityService, Entity, Common } from '@strapi/types';
import { getPluginService } from '../../util/getPluginService';

/**
 * Finds a path from the original path that is unique
 */
export const duplicateCheck = async (
  originalPath: string,
  ignoreId?: Entity.ID,
  ext: number = -1,
): Promise<string> => {
  const extension = ext >= 0 ? `-${ext}` : '';
  const newPath = originalPath + extension;
  const pathAlreadyExists = await getPluginService('urlAliasService').findByPath(newPath, ignoreId);

  if (pathAlreadyExists) {
    return duplicateCheck(originalPath, ignoreId, ext + 1);
  }

  return newPath;
};

/**
   * Create.
   *
   * @param {object} data the data.
   * @returns {void}
   */
const create = async (data: EntityService.Params.Pick<'plugin::webtools.url-alias', 'data'>['data']) => {
  const urlPath = await duplicateCheck(data.url_path);

  const pathEntity = await strapi.entityService.create('plugin::webtools.url-alias', {
    data: {
      ...data,
      url_path: urlPath,
    },
  });

  return pathEntity;
};

/**
 * Find related entity.
 *
 * @param {object} data the data.
 * @returns {void}
 */
const findRelatedEntity = async (urlAlias: EntityService.GetValues<'plugin::webtools.url-alias'>, query: EntityService.Params.Pick<Common.UID.ContentType, 'fields' | 'populate' | 'sort' | 'filters' | '_q' | 'publicationState' | 'plugin'> = {}) => {
  const type = urlAlias.contenttype as Common.UID.ContentType;
  const entity = await strapi.entityService.findMany(type, {
    locale: 'all',
    ...query,
    filters: {
      ...query?.filters,
      // @ts-ignore
      url_alias: urlAlias.id,
    },
  });

  if (!entity[0]) return null;

  return entity[0];
};

/**
 * findOne.
 *
 * @param {number} id the id.
 * @returns {void}
 */
const findOne = async (id: number | string) => {
  const pathEntity = await strapi.entityService.findOne('plugin::webtools.url-alias', id);

  return pathEntity;
};

/**
 * findMany.
 *
 * @param {boolean} showDrafts wheter to include the drafts.
 * @param {object} query the entity service query.
 * @returns {void}
 */
const findMany = async (showDrafts: boolean = false, query: EntityService.Params.Pick<'plugin::webtools.url-alias', 'fields' | 'populate' | 'pagination' | 'sort' | 'filters' | '_q' | 'publicationState' | 'plugin'> = {}) => {
  const excludeDrafts = false;

  // Check drafAndPublish setting.
  if (!showDrafts) {
    // TODO:
    // Exclude draft URLs.
    // We need to check the publication status of the linked entity.
  }

  const { results, pagination } = await strapi.entityService.findPage('plugin::webtools.url-alias', {
    ...query,
    locale: 'all',
    filters: {
      ...query?.filters,
      published_at: excludeDrafts ? {
        $notNull: true,
      } : {},
    },
  });

  return { results, pagination };
};

/**
 * findByPath.
 *
 * @param {string} path the path.
 * @param {number} id the id to ignore.
 */
const findByPath = async (path: string, id: Entity.ID = 0) => {
  const pathEntity = await strapi.entityService.findMany('plugin::webtools.url-alias', {
    filters: {
      url_path: path,
      id: {
        $not: id,
      },
    },
    limit: 1,
  });

  return pathEntity[0];
};

/**
 * Update.
 *
 * @param {number} id the id.
 * @param {object} data the data.
 * @returns {void}
 */
const update = async (id: Entity.ID, data: EntityService.Params.Pick<'plugin::webtools.url-alias', 'data'>['data']) => {
  const urlPath = await duplicateCheck(data.url_path, id);

  const pathEntity = await strapi.entityService.update('plugin::webtools.url-alias', id, {
    data: {
      ...data,
      url_path: urlPath,
    },
  });

  return pathEntity;
};

/**
 * Delete.
 *
 * @param {number} id the id.
 * @returns {void}
 */
const deleteUrlAlias = async (id: number | string) => {
  await strapi.entityService.delete('plugin::webtools.url-alias', id);
};

export default () => ({
  create,
  update,
  findOne,
  findMany,
  findByPath,
  findRelatedEntity,
  delete: deleteUrlAlias,
});
