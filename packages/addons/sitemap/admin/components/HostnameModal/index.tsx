import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';

import {
  Modal,
  Typography,
  Button,
  TextInput,
  Grid,
  Field,
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
    <Modal.Root>
      <Modal.Content>
        <Modal.Header>
          <Typography textColor="neutral800" variant="omega" fontWeight="bold">
            {formatMessage({ id: 'sitemap.HostnameOverrides.Label', defaultMessage: 'Hostname overrides' })}
          </Typography>
        </Modal.Header>
        <Modal.Body>
          <Grid.Root gap={4}>
            {languages.map((language) => (
              <Grid.Item key={language.uid} col={6} s={12}>
                <Field.Root
                  hint={formatMessage({ id: 'sitemap.HostnameOverrides.Description', defaultMessage: 'Specify hostname per language' }, { langcode: language.uid })}
                >
                  <Field.Label>{`${language.name} hostname`}</Field.Label>
                  <TextInput
                    placeholder={`https://${language.uid}.strapi.io`}
                    name="hostname"
                    value={hostnames[language.uid]}
                    onChange={(e) => {
                      if (!e.target.value) {
                        delete hostnames[language.uid];
                      } else {
                        hostnames[language.uid] = e.target.value;
                      }

                      setHostnames({ ...hostnames });
                    }}
                  />
                  <Field.Hint />
                </Field.Root>
              </Grid.Item>
            ))}
          </Grid.Root>
        </Modal.Body>
      </Modal.Content>
      <Modal.Footer>
        <Modal.Close>
          <Button onClick={() => onCancel()} variant="tertiary">
            {formatMessage({ id: 'sitemap.Button.Cancel', defaultMessage: 'Cancel' })}
          </Button>
        </Modal.Close>
        <Button
          onClick={() => onSave(hostnames)}
          disabled={isEqual(hostnames, hostnameOverrides)}
        >
          {formatMessage({ id: 'sitemap.Button.Save', defaultMessage: 'Save' })}
        </Button>
      </Modal.Footer>
    </Modal.Root>
  );
};

export default ModalForm;
