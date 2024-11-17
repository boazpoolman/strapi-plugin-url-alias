import * as React from 'react';

import {
  SubNavLink,
} from '@strapi/design-system';

const NavLink = () => {
  return (
    <SubNavLink href="/plugins/webtools/sitemap" active key="test">
      Sitemap
    </SubNavLink>
  );
};

export default NavLink;
