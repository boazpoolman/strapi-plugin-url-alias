import React, { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';

import {
  Modal,
  Button,
  Typography,
} from '@strapi/design-system';

import CustomForm from './Custom';
import CollectionForm from './Collection';
import getSelectedContentType from '../../helpers/getSelectedContentType';

const ModalForm = (props) => {
  const [uid, setUid] = useState('');
  const [langcode, setLangcode] = useState('und');
  const { formatMessage } = useIntl();

  const {
    onSubmit,
    onCancel,
    isOpen,
    id,
    lang,
    type,
    contentTypes,
  } = props;

  useEffect(() => {
    if (id && !uid) {
      setUid(id);
    } else {
      setUid('');
    }
    if (lang && langcode === 'und') {
      setLangcode(lang);
    } else {
      setLangcode('und');
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const form = () => {
    switch (type) {
      case 'collection':
        return (
          <CollectionForm
            uid={uid}
            setUid={setUid}
            langcode={langcode}
            setLangcode={setLangcode}
            {...props}
          />
        );
      case 'custom':
        return <CustomForm uid={uid} setUid={setUid} {...props} />;
      default:
        return null;
    }
  };

  return (
    <Modal.Root>
      <Modal.Content>
        <Modal.Header>
          <Typography textColor="neutral800" variant="omega" fontWeight="bold">
            {formatMessage({ id: 'sitemap.Modal.HeaderTitle', defaultMessage: 'Sitemap entries' })} - {type}
          </Typography>
        </Modal.Header>
        <Modal.Body>
          {form()}
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button onClick={() => onCancel()} variant="tertiary">
              {formatMessage({ id: 'sitemap.Button.Cancel', defaultMessage: 'Cancel' })}
            </Button>
          </Modal.Close>
          <Button
            onClick={onSubmit}
            disabled={
              !uid ||
              (contentTypes && getSelectedContentType(contentTypes, uid).locales && !langcode)
            }
          >
            {formatMessage({ id: 'sitemap.Button.Save', defaultMessage: 'Save' })}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

export default ModalForm;
