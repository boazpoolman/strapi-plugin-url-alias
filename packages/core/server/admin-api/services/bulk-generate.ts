import { Common, Attribute } from '@strapi/types';
// import { Attribute } from '@strapi/strapi';
import snakeCase from 'lodash/snakeCase';
import { getPluginService } from '../../util/getPluginService';
import { GenerationType } from '../../types';
import { duplicateCheck } from './url-alias';

export interface GenerateParams { types: Common.UID.ContentType[], generationType: GenerationType }

/**
 * Find related entity.
 *
 * @param {object} data the data.
 * @returns {void}
 */
const createLanguageLinksForUrlAliases = async () => {
  const urlAliases = await getPluginService('urlAliasService').findMany(true, {
    // @ts-ignore
    fields: ['id', 'contenttype', 'locale'],
  });

  await Promise.all(urlAliases.results.map(async (urlAlias) => {
    const relatedEntity = await getPluginService('urlAliasService').findRelatedEntity(urlAlias, {
      fields: [],
      populate: {
        // @ts-ignore
        localizations: {
          populate: {
            url_alias: {
              fields: ['id'],
            },
          },
        },
      },
    });

    if (!relatedEntity) {
      return;
    }

    // @ts-ignore
    const localizations = relatedEntity.localizations as Array<{
      url_alias: {
        id: number
      },
    }>;


    const urlAliasLocalizations = localizations
      ?.map((loc) => loc.url_alias?.id)
      ?.filter((loc) => loc) || [];

    /**
     * @todo
     * Call the Strapi entity service, instead of the db query.
     * Currently we can't because saving the localizations is not working.
     * Eventough the localizations are present at the moment of updating.
     */
    // eslint-disable-next-line no-await-in-loop, @typescript-eslint/no-unsafe-assignment
    await strapi.db.query('plugin::webtools.url-alias').update({
      where: {
        id: urlAlias.id,
      },
      data: {
        localizations: urlAliasLocalizations,
      },
    });
  }));
};

/**
 * generateUrlAliases.
 *
 * @param {number} id the id.
 * @returns {number} - the total amount generated URLs.
 */
const generateUrlAliases = async (parms: GenerateParams) => {
  const { types, generationType } = parms;
  let generatedCount = 0;

  // Map over all the types sent in the request.
  await Promise.all(types.map(async (type) => {
    const { collectionName, info } = strapi.contentTypes[type];
    const { singularName } = info;
    const newTransaction = await strapi.db.connection.transaction();

    if (generationType === 'all') {
      // Delete all the URL aliases for the given type.
      await newTransaction('wt_url_alias')
        .where('contenttype', type)
        .delete();
    }

    if (generationType === 'only_generated') {
      // Delete all the URL aliases for the given type.
      await newTransaction('wt_url_alias')
        .where('contenttype', type)
        .andWhere('generated', true)
        .delete();
    }

    let relations: string[] = [];
    let languages: string[] = [undefined];

    if (strapi.plugin('i18n')) {
      languages = [];
      const locales = await strapi.entityService.findMany('plugin::i18n.locale', {});
      languages = locales.map((locale) => locale.code);
    }
    await Promise.all(languages.map(async (lang) => {
      const urlPattern = await getPluginService('urlPatternService').findByUid(type, lang);
      const languageRelations = getPluginService('urlPatternService').getRelationsFromPattern(urlPattern);
      relations = [...relations, ...languageRelations];
    }));

    // Query all the entities of the type that do not have a corresponding URL alias.
    const entities = await newTransaction(collectionName)
      .leftJoin(`${collectionName}_url_alias_links`, `${collectionName}.id`, `${collectionName}_url_alias_links.${snakeCase(singularName)}_id`)
      .where(`${collectionName}_url_alias_links`, null)
      .select('*') as Attribute.GetValues<Common.UID.ContentType, Attribute.GetNonPopulatableKeys<Common.UID.ContentType>>[];

    /**
     * @todo
     * We should do a Promise.all(entities.map()) here to speed up the process.
     * Using that method we can create all the URL aliases in parallel.
     * Currently this is not possible due to the duplicateCheck function.
     * Race conditions can occur when two entities have the same URL path.
     */
    // For all those entities we will create a URL alias and connect it to the entity.
    // eslint-disable-next-line no-restricted-syntax
    await Promise.all(entities.map(async (entity) => {
      // @ts-ignore
      // eslint-disable-next-line no-await-in-loop, @typescript-eslint/no-unsafe-argument
      const urlPattern = await getPluginService('urlPatternService').findByUid(type, entity.locale);
      const generatedPath = getPluginService('urlPatternService').resolvePattern(type, entity, urlPattern);

      // eslint-disable-next-line no-await-in-loop
      const urlPath = await duplicateCheck(generatedPath);

      const newUrlAlias = await newTransaction('wt_url_alias').insert({
        generated: true,
        contenttype: type,
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        locale: entity.locale,
        url_path: urlPath,
      }, '*') as unknown as Attribute.GetValues<Common.UID.ContentType, Attribute.GetNonPopulatableKeys<Common.UID.ContentType>>[];

      // eslint-disable-next-line no-await-in-loop
      await newTransaction(`${collectionName}_url_alias_links`)
        .insert({
          [`${snakeCase(singularName)}_id`]: entity.id,
          url_alias_id: newUrlAlias[0].id,
        });

      generatedCount += 1;
    }));

    await newTransaction.commit();
  }));

  return generatedCount;
};


export default () => ({
  generateUrlAliases,
  createLanguageLinksForUrlAliases,
});
