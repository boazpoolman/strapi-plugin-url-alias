import React from 'react';

import {
  Box,
} from '@strapi/design-system';
import ActionButton from './ActionButton';
import Dropdown from './Dropdown';

const Sidebar = ({
  children,
}) => {
  return (
    <Box
      aria-labelledby="webtools-sidebar-title"
      background="neutral0"
      borderColor="neutral150"
      hasRadius
      shadow="tableShadow"
    >
      {children}
    </Box>
  );
};

Sidebar.ActionButton = ActionButton;
Sidebar.Dropdown = Dropdown;

export default Sidebar;
