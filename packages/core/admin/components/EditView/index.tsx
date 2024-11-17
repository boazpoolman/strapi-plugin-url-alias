import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { SidebarModal } from '@pluginpal/webtools-helper-plugin';
import { unstable_useContentManagerContext, Page } from '@strapi/strapi/admin';
import getTrad from '../../helpers/getTrad';
import EditForm from '../EditForm';
import Permalink from './Permalink';
import { useCreateUrlAlias, useUpdateUrlAlias } from '../../api/url-alias';
import { isContentTypeEnabled } from '../../../server/util/enabledContentTypes';
import { UrlAliasEntity } from '../../types/url-aliases';
import pluginPermissions from '../../permissions';

const EditView = () => {
  const { formatMessage } = useIntl();
  const {
    contentType,
    form,
    slug,
  } = unstable_useContentManagerContext();

  const {
    values,
    initialValues,
    onChange,
  } = form;


  const modifiedDataUrlAliases = values.url_alias as UrlAliasEntity[];
  const i18nLang = new URLSearchParams(window.location.search).get('plugins[i18n][locale]');

  useEffect(() => {
    // Early return for when the i18n plugin is not enabled.
    if (!i18nLang) return;

    // Map through all url_aliases and clear those that do not match the current i18n language
    // If the URL alias is not the same language as the entity,
    // we should clear it. This happens when you're copying content
    // from a different locale.
    const updatedUrlAliases = modifiedDataUrlAliases?.map((alias) => {
      if (alias?.locale !== i18nLang) {
        return { ...alias, locale: null }; // Clear the alias if the locale doesn't match
      }
      return alias;
    });

    // If the URL aliases have changed, update the form data
    // We fire the onChange here because we don't want unnecessary re-renders
    if (JSON.stringify(updatedUrlAliases) !== JSON.stringify(modifiedDataUrlAliases)) {
      onChange('url_alias', updatedUrlAliases);
    }
  }, [modifiedDataUrlAliases, onChange, i18nLang]);

  const { createUrlAlias } = useCreateUrlAlias();
  const { updateUrlAliases } = useUpdateUrlAlias();

  if (!contentType) return null;

  if (!isContentTypeEnabled(contentType)) return null;
  const modifiedUrlAliases = values.url_alias as UrlAliasEntity[];
  const initialUrlAliases = initialValues.url_alias as UrlAliasEntity[];

  const onSubmit = async () => {
    if (!initialUrlAliases || initialUrlAliases?.length === 0) {
      // Create new URL aliases
      const newAliases = await Promise.all(
        modifiedUrlAliases.map(async (alias) => (await createUrlAlias(alias, slug)).data),
      );

      onChange('url_alias', newAliases);
    } else {
      // Update existing URL aliases
      await Promise.all(
        modifiedUrlAliases.map((alias) => updateUrlAliases(alias, slug)),
      );
    }
  };

  return (
    <Page.Protect permissions={pluginPermissions['edit-view.sidebar']}>
      <SidebarModal
        label={formatMessage({
          id: getTrad('plugin.name'),
          defaultMessage: 'URL alias',
        })}
        onSubmit={onSubmit}
        onCancel={() => {
          if (modifiedUrlAliases?.length > 0) {
            onChange('url_alias', modifiedUrlAliases);
          } else if (initialUrlAliases?.length > 0) {
            onChange('url_alias', initialUrlAliases);
          } else {
            onChange('url_alias', null);
          }
        }}
      >
        <EditForm />
      </SidebarModal>
      <Permalink
        path={modifiedUrlAliases?.length > 0 ? modifiedUrlAliases[0].url_path : ''}
      />
    </Page.Protect>
  );
};

export default EditView;
