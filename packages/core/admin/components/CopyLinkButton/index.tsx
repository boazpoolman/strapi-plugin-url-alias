import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useNotification } from '@strapi/strapi/admin';
import { LinkButton } from '@strapi/design-system';
import { Link as LinkIcon } from '@strapi/icons';
import getTrad from '../../helpers/getTrad';

interface Props {
  url: string,
}

const CopyLinkButton: React.FC<Props> = ({ url }) => {
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();

  return (
    <CopyToClipboard
      text={url}
      onCopy={() => {
        toggleNotification({
          type: 'success',
          message: formatMessage({
            id: getTrad('notification.success.permalink_copied'),
            defaultMessage: 'Permalink copied to the clipboard',
          }),
        });
      }}
    >
      <LinkButton
        size="S"
        startIcon={<LinkIcon />}
        variant="secondary"
        style={{ width: '100%' }}
      >
        { formatMessage({
          id: getTrad('settings.button.copy_permalink'),
          defaultMessage: 'Copy permalink',
        }) }
      </LinkButton>
    </CopyToClipboard>
  );
};

CopyLinkButton.propTypes = {
  url: PropTypes.string.isRequired,
};

export default memo(CopyLinkButton);
