import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import {
  Typography, Grid, Flex, Link,
} from '@strapi/design-system';
import { ExternalLink } from '@strapi/icons';
import { Page, getFetchClient, Layouts } from '@strapi/strapi/admin';

import pluginPermissions from '../../permissions';
import { WebtoolsAddonInfo } from '../../types/addons';
import packageJson from '../../../package.json';

const List = () => {
  const [addons, setAddons] = useState<WebtoolsAddonInfo[] | null>(null);
  const { get } = getFetchClient();
  const { formatMessage } = useIntl();

  useEffect(() => {
    get<WebtoolsAddonInfo[]>('/webtools/info/addons')
      .then((res) => {
        setAddons(res.data);
      })
      .catch(() => {
      });
  }, []);

  // TODO: fix loading state
  if (!addons) {
    return (
      <div>Loading...</div>
    );
  }
  return (
    <Page.Protect permissions={pluginPermissions['settings.patterns']}>
      <Layouts.Header
        title={formatMessage({ id: 'webtools.settings.page.overview.title', defaultMessage: 'Overview' })}
        subtitle={formatMessage({ id: 'webtools.settings.page.overview.description', defaultMessage: 'Webtools global information' })}
      />
      <Layouts.Content>
        <Flex direction="column" alignItems="stretch" gap={6}>
          <Flex
            direction="column"
            alignItems="stretch"
            gap={4}
            hasRadius
            background="neutral0"
            shadow="tableShadow"
            paddingTop={6}
            paddingBottom={6}
            paddingRight={7}
            paddingLeft={7}
          >
            <Typography variant="delta">
              {formatMessage({
                id: 'global.details',
                defaultMessage: 'Details',
              })}
            </Typography>

            <Grid.Root gap={5}>
              <Grid.Item col={6} s={12}>
                <Typography variant="sigma" textColor="neutral600">
                  {formatMessage({
                    id: 'webtools.settings.application.strapiVersion',
                    defaultMessage: 'strapi version',
                  })}
                </Typography>
                <Flex gap={3} direction="column" alignItems="start">
                  <Typography>v{packageJson.version}</Typography>
                </Flex>
              </Grid.Item>
              <Grid.Item col={6} s={12}>
                <Typography variant="sigma" textColor="neutral600">
                  {formatMessage({
                    id: 'TODO_REPLACE',
                    defaultMessage: 'Links',
                  })}
                </Typography>
                <Flex>
                  <Link
                    href="https://www.pluginpal.io/plugin/webtools"
                    isExternal
                    endIcon={<ExternalLink />}
                  >
                    {formatMessage({
                      id: 'TODO_REPLACE',
                      defaultMessage: 'Website',
                    })}
                  </Link>
                </Flex>
                <Flex>
                  <Link
                    href="https://github.com/pluginpal/strapi-webtools"
                    isExternal
                    endIcon={<ExternalLink />}
                  >
                    {formatMessage({
                      id: 'TODO_REPLACE',
                      defaultMessage: 'Github',
                    })}
                  </Link>
                </Flex>
              </Grid.Item>
            </Grid.Root>
          </Flex>
        </Flex>
        {/* <Box
          hasRadius
          background="neutral0"
          shadow="tableShadow"
          paddingTop={6}
          paddingBottom={6}
          paddingRight={7}
          paddingLeft={7}
        >
          <Typography variant="delta" as="h3">
            {formatMessage({
              id: 'TODO_REPLACE',
              defaultMessage: 'Addons',
            })}
          </Typography>
          <Typography variant="pi" textColor="neutral600">
            {formatMessage(
              {
                id: 'TODO_REPLACE',
                defaultMessage: 'All the installed addons',
              },
            )}
          </Typography>
          <Flex>
            {Object.values(addons).map((addon) => (
              <div>{addon.info.addonName}</div>
            ))}
          </Flex>
        </Box> */}
      </Layouts.Content>
    </Page.Protect>
  );
};

export default List;
