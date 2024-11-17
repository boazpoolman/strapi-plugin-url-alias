import React, {
  FC,
  useEffect,
  useState,
} from 'react';
import { useIntl } from 'react-intl';

import {
  Table,
  Tr,
  Thead,
  Th,
  Typography,
  Tbody,
  Button,
  Flex,
  EmptyStateLayout,
} from '@strapi/design-system';

import TableRow from '../TableRow';
import PaginationFooter from '../PaginationFooter';
import type { Pagination } from '../..';
import Filters from '../Filters';
import { Config } from '../../../../../server/admin-api/config';

type Props = {
  paths: any[],
  onDelete: () => void,
  pagination: Pagination,
  contentTypes: any[],
  config: Config,
};

const TableComponent: FC<Props> = (props) => {
  const {
    paths,
    pagination,
    onDelete,
    config,
    contentTypes,
  } = props;

  const { formatMessage } = useIntl();
  const [checkedItems, setCheckedItems] = useState<boolean[]>([]);

  // Initiate the checked items.
  useEffect(() => {
    const newCheckedItems = [];
    for (let i = 0; i < pagination.pageSize; i++) {
      newCheckedItems.push(false);
    }
    setCheckedItems(newCheckedItems);
  }, [pagination.pageSize]);

  const allChecked = checkedItems && checkedItems.every(Boolean);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isIndeterminate = checkedItems.some(Boolean) && !allChecked;
  const amountChecked = checkedItems.filter((item) => item).length;

  return (
    <div>
      <Filters contentTypes={contentTypes} />
      {amountChecked > 0 && (
        <Flex marginBottom="6" gap="3">
          <Typography variant="omega" textColor="neutral600">
            {amountChecked} {formatMessage({
              id: 'webtools.settings.page.list.table.delete.entries_selected',
              defaultMessage: 'Entries selected',
            })}
          </Typography>
          <Button variant="danger-light">
            {formatMessage({
              id: 'webtools.settings.button.delete',
              defaultMessage: 'Delete',
            })}
          </Button>
        </Flex>
      )}
      {paths && paths.length > 0 ? (
        <Table colCount={1} rowCount={pagination.pageSize}>
          <Thead>
            <Tr>
              {/* <Th>
                <BaseCheckbox
                  aria-label={formatMessage({ id: 'config-sync.ConfigList.SelectAll' })}
                  indeterminate={isIndeterminate}
                  onValueChange={
                    (value: boolean) => setCheckedItems(checkedItems.map(() => value))
                  }
                  value={allChecked}
                />
              </Th> */}
              <Th>
                <Typography variant="sigma" textColor="neutral600">
                  {formatMessage({ id: 'webtools.settings.page.patterns.table.head.label', defaultMessage: 'Path' })}
                </Typography>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {paths.map((path, index) => (
              <TableRow
                key={path.url_path}
                row={path}
                checked={checkedItems[index]}
                onDelete={onDelete}
                config={config}
                updateValue={() => {
                  checkedItems[index] = !checkedItems[index];
                  setCheckedItems([...checkedItems]);
                }}
              />
            ))}
          </Tbody>
        </Table>
      ) : (
        <EmptyStateLayout
          content={formatMessage({
            id: 'webtools.settings.page.list.table.empty',
            defaultMessage: 'You don\'t have any URL paths yet.',
          })}
          shadow="tableShadow"
          hasRadius
        />
      )}
      <PaginationFooter pagination={pagination} />
    </div>
  );
};

export default TableComponent;
