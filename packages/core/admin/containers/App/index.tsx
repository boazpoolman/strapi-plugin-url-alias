import React from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';

import {
  SubNav,
  SubNavHeader,
  SubNavSections,
  SubNavSection,
  SubNavLink,
} from '@strapi/design-system';
import { Page, useStrapiApp, Layouts } from '@strapi/strapi/admin';


import pluginPermissions from '../../permissions';
import pluginId from '../../helpers/pluginId';
import Patterns from '../../screens/Patterns';
import List from '../../screens/List';
import Overview from '../../screens/Overview';

const App = () => {
  const history = useHistory();

  const getPlugin = useStrapiApp('MyComponent', (state) => state.getPlugin);

  const plugin = getPlugin(pluginId);
  const sidebarComponents = plugin?.getInjectedComponents('webtoolsSidebar', 'link');
  const routerComponents = plugin?.getInjectedComponents('webtoolsRouter', 'route');

  if (history.location.pathname === `/plugins/${pluginId}`) {
    history.replace(`/plugins/${pluginId}/overview`);
  }

  return (
    <Page.Protect permissions={pluginPermissions['settings.patterns']}>
      <Layouts.Root
        sideNav={(
          <SubNav>
            <SubNavHeader value="" label="Webtools" />
            <SubNavSections>
              <SubNavSection label="Core">
                <SubNavLink href="/plugins/webtools/overview" key="test">
                  Overview
                </SubNavLink>
                <SubNavLink href="/plugins/webtools/urls" key="test">
                  All URLs
                </SubNavLink>
                <SubNavLink href="/plugins/webtools/patterns" key="test">
                  Url Patterns
                </SubNavLink>
              </SubNavSection>
              <SubNavSection label="Addons">
                {sidebarComponents.map(({ Component }) => <Component />)}
                {/* <SubNavLink to="/test" active key="test">
                  Sitemap
                </SubNavLink> */}
              </SubNavSection>
            </SubNavSections>
          </SubNav>
        )}
      >
        <Switch>
          <Route path={[`/plugins/${pluginId}/overview`, `/plugins/${pluginId}`]} component={Overview} exact />
          <Route path={`/plugins/${pluginId}/urls`} component={List} exact />
          <Route
            path={`/plugins/${pluginId}/patterns`}
            component={Patterns}
          />
          {routerComponents.map(({ Component }) => <Component />)}
          {/* <Route path="" component={NotFound} /> */}
        </Switch>
      </Layouts.Root>
    </Page.Protect>
  );
};

export default App;
