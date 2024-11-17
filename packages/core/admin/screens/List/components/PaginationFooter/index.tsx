import React from 'react';
import { Box, Flex } from '@strapi/design-system';
import { Pagination as StrapiPagination } from '@strapi/strapi/admin';
import type { Pagination } from '../..';

type Props = {
  pagination: Pagination;
};

const PaginationFooter = ({ pagination }: Props) => {
  return (
    <Box paddingTop={4}>
      <Flex alignItems="flex-end" justifyContent="space-between">
        <StrapiPagination.Root>
          <StrapiPagination.PageSize />
          <StrapiPagination.Links />
        </StrapiPagination.Root>
      </Flex>
    </Box>
  );
};

export default PaginationFooter;
