import React, { useEffect, useState } from 'react';
import { getFetchClient } from '@strapi/strapi/admin';

import { Config } from '../../../../server/admin-api/config';

import CopyLinkButton from '../../CopyLinkButton';

interface Props {
  path: string
}

const EditViewRightLinks: React.FC<Props> = ({ path }) => {
  const [url, setUrl] = useState<string>();
  const { get } = getFetchClient();

  useEffect(() => {
    get<Config>('/webtools/info/config')
      .then((response) => {
        const configData = response.data;
        setUrl(configData.website_url);
      })
      .catch((error) => {
        console.error('Failed to fetch config:', error);
      });
  }, [get]);

  if (!url) return null;

  return <CopyLinkButton url={`${url}${path}`} />;
};

export default EditViewRightLinks;
