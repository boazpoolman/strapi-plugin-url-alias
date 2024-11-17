import React, {
  useMemo,
  useRef,
  useState,
} from 'react';
import { useIntl } from 'react-intl';

import {
  Button,
  Box,
  Flex,
} from '@strapi/design-system';
import { Filter } from '@strapi/icons';

import { Filters as StrapiFilters, SearchInput } from '@strapi/strapi/admin';
import FilterInput from './FilterInput';
import { EnabledContentTypes } from '../../../../types/enabled-contenttypes';

type Props = {
  contentTypes: EnabledContentTypes,
};

const Filters = ({ contentTypes }: Props) => {
  const { formatMessage } = useIntl();
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef();

  const filters = useMemo(() => {
    const newFilters = [];

    if (contentTypes.length > 0) {
      newFilters.push({
        name: 'contenttype',
        metadatas: {
          label: 'Content-Type',
          // eslint-disable-next-line react/no-unstable-nested-components
          customInput: (props: any) => <FilterInput contentTypes={contentTypes} {...props} />,
        },
        fieldSchema: {
          type: 'string',
        },
      });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return newFilters;
  }, [contentTypes]);


  return (
    <StrapiFilters.Root>
      <Flex gap="1" marginBottom="6">
        <SearchInput
          label={formatMessage({
            id: 'webtools.settings.page.list.filters.label',
            defaultMessage: 'Search',
          })}
          placeholder={formatMessage({
            id: 'webtools.settings.page.list.filters.placeholder',
            defaultMessage: 'Search...',
          })}
          trackedEvent="didSearch"
        />
        <Box paddingTop={1} paddingBottom={1}>
          <Button
            variant="tertiary"
            ref={buttonRef}
            startIcon={<Filter />}
            onClick={() => setIsVisible((prev) => !prev)}
            size="S"
          >
            {formatMessage({
              id: 'webtools.settings.button.filters',
              defaultMessage: 'Filters',
            })}
          </Button>
          {isVisible && (
            <StrapiFilters.Popover />
            // displayedFilters={filters}
            // isVisible={isVisible}
            // onToggle={() => setIsVisible((prev) => !prev)}
            // source={buttonRef}
          )}
        </Box>
        <StrapiFilters.List />
        {/* filtersSchema={filters} */}
      </Flex>
    </StrapiFilters.Root>
  );
};

export default Filters;
