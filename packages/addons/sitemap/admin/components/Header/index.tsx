import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Map } from 'immutable';
import { useIntl } from 'react-intl';

import { useNotification, getFetchClient, Layouts } from '@strapi/strapi/admin';
import { Box, Button } from '@strapi/design-system';
import { Check } from '@strapi/icons';

import { discardAllChanges, submit } from '../../state/actions/Sitemap';

const Header = () => {
  const settings = useSelector((state: any) => state.getIn(['sitemap', 'settings'], Map()));
  const initialData = useSelector((state: any) => state.getIn(['sitemap', 'initialData'], Map()));
  const { toggleNotification } = useNotification();
  const { put } = getFetchClient();

  const dispatch = useDispatch();
  const { formatMessage } = useIntl();

  const disabled = JSON.stringify(settings) === JSON.stringify(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submit(settings.toJS(), toggleNotification, put));
  };

  const handleCancel = (e) => {
    e.preventDefault();
    dispatch(discardAllChanges());
  };

  return (
    <Box background="neutral100">
      <Layouts.Header
        primaryAction={(
          <Box style={{ display: 'flex' }}>
            <Button
              onClick={handleCancel}
              disabled={disabled}
              size="L"
              variant="secondary"
            >
              {formatMessage({ id: 'sitemap.Button.Cancel', defaultMessage: 'Cancel' })}
            </Button>
            <Button
              style={{ marginLeft: '10px' }}
              onClick={handleSubmit}
              disabled={disabled}
              type="submit"
              startIcon={<Check />}
              size="L"
            >
              {formatMessage({ id: 'sitemap.Button.Save', defaultMessage: 'Save' })}
            </Button>
          </Box>
        )}
        title={formatMessage({ id: 'sitemap.Header.Title', defaultMessage: 'Sitemap' })}
        subtitle={formatMessage({ id: 'sitemap.Header.Description', defaultMessage: 'Settings for the sitemap XML' })}
      />
    </Box>
  );
};

export default Header;
