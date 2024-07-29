import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';

import {
  ModalLayout,
  ModalFooter,
  ModalBody,
  ModalHeader,
  Typography,
  Button,
  TextInput,
  Grid,
  GridItem,
} from '@strapi/design-system';

import { isEqual } from 'lodash/fp';

const ModalForm = (props) => {
  const { formatMessage } = useIntl();
  const {
    onCancel,
    isOpen,
    languages,
    onSave,
    hostnameOverrides,
  } = props;

  const [hostnames, setHostnames] = useState({});

  useEffect(() => {
    if (isOpen) {
      setHostnames({ ...hostnameOverrides });
    } else {
      setHostnames({});
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <ModalLayout
      onClose={() => onCancel()}
      labelledBy="title"
    >
      <ModalHeader>
        <Typography textColor="neutral800" variant="omega" fontWeight="bold">
          {formatMessage({ id: 'sitemap.HostnameOverrides.Label', defaultMessage: 'Hostname overrides' })}
        </Typography>
      </ModalHeader>
      <ModalBody>
        <Grid gap={4}>
          {languages.map((language) => (
            <GridItem key={language.uid} col={6} s={12}>
              <TextInput
                placeholder={`https://${language.uid}.strapi.io`}
                label={`${language.name} hostname`}
                name="hostname"
                value={hostnames[language.uid]}
                hint={formatMessage({ id: 'sitemap.HostnameOverrides.Description', defaultMessage: 'Specify hostname per language' }, { langcode: language.uid })}
                onChange={(e) => {
                  if (!e.target.value) {
                    delete hostnames[language.uid];
                  } else {
                    hostnames[language.uid] = e.target.value;
                  }

                  setHostnames({ ...hostnames });
                }}
              />
            </GridItem>
          ))}
        </Grid>
      </ModalBody>
      <ModalFooter
        startActions={(
          <Button onClick={() => onCancel()} variant="tertiary">
            {formatMessage({ id: 'sitemap.Button.Cancel', defaultMessage: 'Cancel' })}
          </Button>
        )}
        endActions={(
          <Button
            onClick={() => onSave(hostnames)}
            disabled={isEqual(hostnames, hostnameOverrides)}
          >
            {formatMessage({ id: 'sitemap.Button.Save', defaultMessage: 'Save' })}
          </Button>
        )}
      />
    </ModalLayout>
  );
};

export default ModalForm;
