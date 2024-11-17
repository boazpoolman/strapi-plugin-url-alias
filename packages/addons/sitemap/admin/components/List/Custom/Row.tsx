import React from 'react';

import { Pencil, Trash } from '@strapi/icons';
import {
  Box,
  Flex,
  Tr,
  Td,
  Typography,
  IconButton,
} from '@strapi/design-system';

const CustomRow = ({ openModal, entry }) => {
  const handleEditClick = (e) => {
    openModal(entry.name);
    e.stopPropagation();
  };

  const handleDeleteClick = (e) => {
    entry.onDelete(entry.name);
    e.stopPropagation();
  };

  return (
    <Tr key={entry.id}>
      <Td>
        <Typography variant="omega" textColor="neutral800">{entry.name}</Typography>
      </Td>
      <Td>
        <Typography variant="omega" textColor="neutral800">{entry.priority}</Typography>
      </Td>
      <Td>
        <Typography variant="omega" textColor="neutral800">{entry.changefreq}</Typography>
      </Td>
      <Td>
        <Flex marginLeft="auto">
          <IconButton
            onClick={handleEditClick}
            label="Edit"
          >
            <Pencil />
          </IconButton>
          <Box paddingLeft={1}>
            <IconButton
              onClick={handleDeleteClick}
              label="Delete"
            >
              <Trash />
            </IconButton>
          </Box>
        </Flex>
      </Td>
    </Tr>
  );
};

export default CustomRow;
