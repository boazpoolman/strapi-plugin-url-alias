import React, { FC, useState } from 'react';
import {
  Typography,
  Box,
  Tr,
  Td,
  Flex,
  IconButton,
} from '@strapi/design-system';
import { useNotification, getFetchClient } from '@strapi/strapi/admin';
import { useIntl } from 'react-intl';
import { Trash, ExternalLink, Pencil } from '@strapi/icons';
import { useHistory } from 'react-router-dom';
import DeleteConfirmModal from '../DeleteConfirmModal';
import { Config } from '../../../../../server/admin-api/config';

type Props = {
  row: any;
  checked?: boolean;
  onDelete?: () => void;
  updateValue: () => any;
  config: Config;
};

const TableRow: FC<Props> = ({
  row,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  checked,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  updateValue,
  config,
  onDelete,
}) => {
  const { toggleNotification } = useNotification();
  const { get } = getFetchClient();
  const { formatMessage } = useIntl();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const { push } = useHistory();

  const handleClick = (path: string) => {
    get<{ link: string }>(`/webtools/url-alias/editLink?path=${path}`)
      .then((res) => {
        push(res.data.link);
      })
      .catch(() => { });
  };

  const handleDelete = (id: number) => {
    get(`/webtools/url-alias/delete/${id}`)
      .then(() => {
        if (onDelete) onDelete();
        toggleNotification({ type: 'success', message: formatMessage({ id: 'webtools.settings.success.url_alias.delete' }) });
      })
      .catch(() => {
        if (onDelete) onDelete();
        toggleNotification({ type: 'warning', message: formatMessage({ id: 'notification.error' }) });
      });
  };

  return (
    <Tr>
      {/* <Td>
        <BaseCheckbox
          aria-label={`Select ${row.url_path}`}
          value={checked}
          onValueChange={updateValue}
        />
      </Td> */}
      <Td>
        <Box style={{ marginTop: 5, marginBottom: 5 }}>
          <Typography>{row.url_path}</Typography>
        </Box>
      </Td>
      <Td>
        <Flex justifyContent="end">
          {config.website_url && (
            <IconButton
              onClick={() => window.open(`${config.website_url}${row.url_path}`, '_blank')}
              label={formatMessage(
                { id: 'webtools.settings.page.list.table.actions.edit', defaultMessage: 'Go to the front-end page' },
                { target: `${row.url_path}` },
              )}
            >
              <ExternalLink />
            </IconButton>
          )}
          <IconButton
            onClick={() => handleClick(row.url_path)}
            label={formatMessage(
              { id: 'webtools.settings.page.list.table.actions.goTo', defaultMessage: 'Edit {target}' },
              { target: `${row.url_path}` },
            )}
          >
            <Pencil />
          </IconButton>
          <IconButton
            onClick={() => setOpenDeleteModal(true)}
            label={formatMessage(
              { id: 'webtools.settings.page.list.table.actions.delete', defaultMessage: 'Delete {target}' },
              { target: `${row.url_path}` },
            )}
          >
            <Trash />
          </IconButton>
          <DeleteConfirmModal
            isOpen={openDeleteModal}
            onClose={() => setOpenDeleteModal(false)}
            onSubmit={() => handleDelete(row.id)}
          />
        </Flex>
      </Td>
    </Tr>
  );
};

export default TableRow;
