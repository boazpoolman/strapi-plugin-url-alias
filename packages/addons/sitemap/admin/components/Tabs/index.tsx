import React from 'react';
import { Tabs, Box } from '@strapi/design-system';
import { useIntl } from 'react-intl';

import CollectionURLs from '../../tabs/CollectionURLs';
import CustomURLs from '../../tabs/CustomURLs';
import Settings from '../../tabs/Settings';

const SitemapTabs = () => {
  const { formatMessage } = useIntl();

  return (
    <Box padding={8}>
      <Tabs.Root id="tabs">
        <Tabs.List>
          <Tabs.Trigger value="url-bundles">{formatMessage({ id: 'sitemap.Settings.CollectionTitle', defaultMessage: 'URL bundles' })}</Tabs.Trigger>
          <Tabs.Trigger value="custom-urls">{formatMessage({ id: 'sitemap.Settings.CustomTitle', defaultMessage: 'Custom URLs' })}</Tabs.Trigger>
          <Tabs.Trigger value="settings">{formatMessage({ id: 'sitemap.Settings.SettingsTitle', defaultMessage: 'Settings' })}</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="url-bundles">
          <CollectionURLs />
        </Tabs.Content>
        <Tabs.Content value="custom-urls">
          <CustomURLs />
        </Tabs.Content>
        <Tabs.Content value="settings">
          <Box padding={6} background="neutral0" shadow="filterShadow">
            <Settings />
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </Box>
  );
};

export default SitemapTabs;
