import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { Box, Checkbox } from '@strapi/design-system';
import { SidebarDropdown } from '@pluginpal/webtools-helper-plugin';
import { unstable_useContentManagerContext, getFetchClient } from '@strapi/strapi/admin';

import getTrad from '../../helpers/getTrad';

const CMEditViewExclude = () => {
  const [sitemapSettings, setSitemapSettings] = useState<any>({});
  const { formatMessage } = useIntl();
  const { get } = getFetchClient();
  const { form, ...props } = unstable_useContentManagerContext();
  const { values, onChange } = form;

  useEffect(() => {
    const getSitemapSettings = async () => {
      const settings = await get('/webtools-addon-sitemap/settings/');
      setSitemapSettings(settings.data);
    };

    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    getSitemapSettings();
  }, [get]);

  if (!sitemapSettings.contentTypes) return null;
  if (!sitemapSettings.contentTypes[props.slug]) return null;

  return (
    <SidebarDropdown
      label={formatMessage({
        id: getTrad('plugin.name'),
        defaultMessage: 'Sitemap',
      })}
    >
      <Box>
        <Checkbox
          onCheckedChange={(value) => {
            onChange('sitemap_exclude', value);
          }}
          value={values.sitemap_exclude}
          name="exclude-from-sitemap"
        >
          {formatMessage({ id: getTrad('EditView.ExcludeFromSitemap'), defaultMessage: 'Exclude from sitemap' })}
        </Checkbox>
      </Box>
    </SidebarDropdown>
  );
};

export default CMEditViewExclude;
