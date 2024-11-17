/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getFetchClient, useNotification } from '@strapi/strapi/admin';

import Tabs from '../../components/Tabs';
import Header from '../../components/Header';
import Info from '../../components/Info';

import {
  getContentTypes,
  getSettings,
  getSitemapInfo,
  getLanguages,
} from '../../state/actions/Sitemap';
import Loader from '../../components/Loader';

const App = () => {
  const loading = useSelector((state: any) => state.getIn(['sitemap', 'loading'], false));

  const dispatch = useDispatch();
  const { toggleNotification } = useNotification();
  const { get } = getFetchClient();

  useEffect(() => {
    dispatch(getSettings(toggleNotification, get));
    dispatch(getLanguages(toggleNotification, get));
    dispatch(getContentTypes(toggleNotification, get));
    dispatch(getSitemapInfo(toggleNotification, get));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  return (
    <div style={{ position: 'relative' }}>
      {loading && <Loader />}
      <Header />
      <Info />
      <Tabs />
    </div>
  );
};

export default App;
