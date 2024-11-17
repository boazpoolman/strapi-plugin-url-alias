import React, { useState } from 'react';
import {
  Modal,
  Typography,
  Button,
} from '@strapi/design-system';

import Sidebar from '../Sidebar';

interface Props {
  onSubmit: Function,
  onCancel: Function,
  label: string,
  children: React.ReactNode
}

const SidebarModal: React.FC<Props> = ({
  label,
  children,
  onSubmit,
  onCancel,
}) => {
  const [opened, setOpened] = useState<boolean>(false);

  const onSave = () => {
    onSubmit();
    setOpened(false);
  };

  const onClose = () => {
    onCancel();
    setOpened(false);
  };

  return (
    <Sidebar>
      <Modal.Root>
        <Modal.Trigger>
          <Sidebar.ActionButton
            label={label}
            iconProps={{
              transform: !opened ? 'rotate(90deg)' : 'rotate(-90deg)',
            }}
          />
        </Modal.Trigger>
        <Modal.Content>
          <Modal.Header>
            <Typography fontWeight="bold" textColor="neutral800" id="title">
              {label}
            </Typography>
          </Modal.Header>
          <Modal.Body>
            {children}
          </Modal.Body>
          <Modal.Footer>
            <Modal.Close>
              <Button onClick={onClose} variant="tertiary">
                Cancel
              </Button>
            </Modal.Close>
            <Button onClick={onSave}>Save</Button>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </Sidebar>
  );
};

export default SidebarModal;
