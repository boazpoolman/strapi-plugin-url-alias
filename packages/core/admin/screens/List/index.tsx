import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { Button } from '@strapi/design-system';

import {
  Page,
  useNotification,
  getFetchClient,
  Layouts,
} from '@strapi/strapi/admin';

import pluginPermissions from '../../permissions';
import Table from './components/Table';
import { Config } from '../../../server/admin-api/config';
import GeneratePathsModal from './components/GeneratePathsModal';
import { EnabledContentType, EnabledContentTypes } from '../../types/enabled-contenttypes';
import { GenerationType } from '../../../server/types';
import Loader from '../../components/Loader';

export type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

const List = () => {
  const [queryCount, setQueryCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [paths, setPaths] = useState<any[] | null>(null);
  const [config, setConfig] = useState<Config | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { post } = getFetchClient();

  const history = useHistory();
  const { formatMessage } = useIntl();
  const { get } = getFetchClient();
  const [contentTypes, setContentTypes] = useState<EnabledContentTypes>([]);
  const { toggleNotification } = useNotification();

  useEffect(() => {
    get('/webtools/info/getContentTypes')
      .then((res: { data: EnabledContentTypes }) => {
        setContentTypes(res.data);
      })
      .catch(() => {
        toggleNotification({ type: 'warning', message: formatMessage({ id: 'notification.error' }) });
      });
  }, [get, toggleNotification]);

  useEffect(() => {
    get<any>(`/webtools/url-alias/findMany${history.location.search}`)
      .then((res) => {
        setPaths(res.data.results);
        setPagination(res.data.pagination);
      })
      .catch(() => {
        toggleNotification({ type: 'warning', message: formatMessage({ id: 'notification.error' }) });
      });
  }, [history.location.search, queryCount, toggleNotification]);

  useEffect(() => {
    get<Config>('/webtools/info/config')
      .then((res) => {
        setConfig(res.data);
      })
      .catch(() => {
        toggleNotification({ type: 'warning', message: formatMessage({ id: 'notification.error' }) });
      });
  }, [toggleNotification]);

  const handleGeneratePaths = async (types: EnabledContentType['uid'][], generationType: GenerationType) => {
    setLoading(true);
    await post('/webtools/url-alias/generate', { types, generationType })
      .then((response: { data: { message: string } }) => {
        toggleNotification({ type: 'success', message: formatMessage({ id: 'webtools.success.url-alias.generate', defaultMessage: response.data.message }) });
        setLoading(false);
      })
      .catch(() => {
        toggleNotification({ type: 'warning', message: formatMessage({ id: 'notification.error' }) });
        setLoading(false);
      });

    setQueryCount(queryCount + 1);
  };

  if (!paths || !config || !pagination) {
    return (
      <Loader />
    );
  }

  return (
    <Page.Protect permissions={pluginPermissions['settings.patterns']}>
      {loading && <Loader />}
      <Layouts.Header
        title={formatMessage({ id: 'webtools.settings.page.list.title', defaultMessage: 'URLs' })}
        subtitle={formatMessage({ id: 'webtools.settings.page.list.description', defaultMessage: 'A list of all the known URL aliases.' })}
        // TODO: Generate all button.
        primaryAction={(
          <Button onClick={() => setOpenModal(true)} size="L">
            {formatMessage({
              id: 'webtools.settings.button.generate_paths',
              // defaultMessage: 'Generate paths',
            })}
          </Button>
        )}
      />
      <Layouts.Content>
        <Table
          paths={paths}
          pagination={pagination}
          onDelete={() => setQueryCount(queryCount + 1)}
          config={config}
          contentTypes={contentTypes}
        />
      </Layouts.Content>
      <GeneratePathsModal
        isOpen={openModal}
        // @ts-ignore
        onSubmit={handleGeneratePaths}
        onClose={() => setOpenModal(false)}
        contentTypes={contentTypes}
      />
    </Page.Protect>
  );
};

export default List;
