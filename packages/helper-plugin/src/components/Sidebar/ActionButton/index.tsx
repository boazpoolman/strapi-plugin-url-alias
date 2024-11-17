import React, { MouseEvent } from 'react';

import {
  Typography,
  Flex,
} from '@strapi/design-system';
import { Play } from '@strapi/icons';

type Props = {
  label: string,
  onClick?: (event: MouseEvent<Element>) => void,
  iconProps?: object
};

const ActionButton: React.FC<Props> = ({
  label,
  onClick,
  iconProps,
}) => {
  return (
    <Flex
      onClick={onClick}
      padding={4}
      style={{
        cursor: 'pointer',
      }}
    >
      <Typography
        textColor="neutral600"
        variant="sigma"
        id="webtools-sidebar-title"
      >
        {label}
      </Typography>
      <Play
        width="0.5rem"
        height="0.5rem"
        {...iconProps}
      />
    </Flex>
  );
};

export default ActionButton;
