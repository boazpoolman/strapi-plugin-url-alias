import React from 'react';

import { Pencil, Trash } from '@strapi/icons';
import { Box, Flex, Tr, Td, Typography, IconButton } from '@strapi/design-system';
import { useSelector } from 'react-redux';
import getSelectedContentType from '../../../helpers/getSelectedContentType';

const CustomRow = ({ openModal, entry }) => {
  const contentTypes = useSelector((store) => store.getIn(['sitemap', 'contentTypes'], {}));

  const handleEditClick = (e) => {
    openModal(entry.name, entry.langcode);
    e.stopPropagation();
  };

  const handleDeleteClick = (e) => {
    entry.onDelete(entry.name, entry.langcode);
    e.stopPropagation();
  };

  return (
    <Tr key={entry.id}>
      <Td>
        <Typography variant="omega" textColor="neutral800">{getSelectedContentType(contentTypes, entry.name) && getSelectedContentType(contentTypes, entry.name).name}</Typography>
      </Td>
      <Td>
        <Flex>
          <Flex marginLeft="auto">
            <IconButton onClick={handleEditClick} label="Edit" noBorder icon={<Pencil />} />
            <Box paddingLeft={1}>
              <IconButton onClick={handleDeleteClick} label="Delete" noBorder icon={<Trash />} />
            </Box>
          </Flex>
        </Flex>
      </Td>
    </Tr>
  );
};

export default CustomRow;
