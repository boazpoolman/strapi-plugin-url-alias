import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Page } from '@strapi/strapi/admin';
import pluginId from '../../helpers/pluginId';
import pluginPermissions from '../../permissions';
import PatternsListPage from './ListPage';
import PatternsEditPage from './EditPage';
import PatternsCreatePage from './CreatePage';

const Patterns = () => (
  <Page.Protect permissions={pluginPermissions['settings.patterns']}>
    <Switch>
      <Route
        path={`/plugins/${pluginId}/patterns/new`}
        component={PatternsCreatePage}
        exact
      />
      <Route path={`/plugins/${pluginId}/patterns/:id`} component={PatternsEditPage} exact />
      <Route path={`/plugins/${pluginId}/patterns`} component={PatternsListPage} exact />
      {/* <Route path="" component={NotFound} /> */}
    </Switch>
  </Page.Protect>
);

export default Patterns;
