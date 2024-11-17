import React, { ChangeEvent } from 'react';
import { useIntl } from 'react-intl';

import {
  Modal,
  Button,
  Typography,
  Checkbox,
  Radio,
  Flex,
  Box,
} from '@strapi/design-system';

import { EnabledContentType, EnabledContentTypes } from '../../../../types/enabled-contenttypes';
import { GenerationType } from '../../../../../server/types';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (types: EnabledContentType['uid'][], generationType?: GenerationType) => void;
  contentTypes: EnabledContentTypes;
};

const GeneratePathsModal = ({
  isOpen,
  onClose,
  onSubmit,
  contentTypes,
}: Props) => {
  const { formatMessage } = useIntl();
  const [selectedContentTypes, setSelectedContentTypes] = React.useState<EnabledContentType['uid'][]>([]);
  const [selectedGenerationType, setSelectedGenerationType] = React.useState<GenerationType>();
  if (!isOpen) return null;

  return (
    <Modal.Root>
      <Modal.Content>
        <Modal.Header>
          <Typography textColor="neutral800" variant="omega" fontWeight="bold">
            {formatMessage({
              id: 'webtools.settings.page.list.generate_paths_modal.title',
              defaultMessage: 'Generate URL aliases',
            })}
          </Typography>
        </Modal.Header>
        <Modal.Body>
          <Flex direction="column" alignItems="start" gap="7">
            <Flex direction="column" alignItems="start" gap="2">
              <Typography variant="delta">
                {formatMessage({
                  id: 'webtools.settings.page.list.generate_paths_modal.types.title',
                  defaultMessage: 'Content types',
                })}
              </Typography>
              <Typography variant="omega">
                {formatMessage({
                  id: 'webtools.settings.page.list.generate_paths_modal.types.body',
                  defaultMessage: 'Select the content types you want to generate the URLs for.',
                })}
              </Typography>
              <Flex direction="column" alignItems="start" gap="1" marginTop="2">
                {contentTypes.map((contentType) => (
                  <Checkbox
                    aria-label={`Select ${contentType.name}`}
                    // @ts-ignore
                    value={selectedContentTypes.includes(contentType.uid)}
                    onValueChange={() => {
                      if (selectedContentTypes.includes(contentType.uid)) {
                        const newContentTypes = selectedContentTypes
                          .filter((uid) => uid !== contentType.uid);

                        setSelectedContentTypes(newContentTypes);

                        return;
                      }

                      setSelectedContentTypes([...selectedContentTypes, contentType.uid]);
                    }}
                  >
                    {contentType.name}
                  </Checkbox>
                ))}
              </Flex>
            </Flex>
            <Flex direction="column" alignItems="start" gap="2">
              <Typography variant="delta">
                {formatMessage({
                  id: 'webtools.settings.page.list.generate_paths_modal.generation_type.title',
                  defaultMessage: 'Generation type',
                })}
              </Typography>
              <Typography variant="omega">
                {formatMessage({
                  id: 'webtools.settings.page.list.generate_paths_modal.generation_type.body',
                  defaultMessage: 'Select how you would like to generate the URLs.',
                })}
              </Typography>
              <Box marginTop="2">
                <Radio.Group onChange={(e: ChangeEvent<HTMLInputElement>) => setSelectedGenerationType(e.target.value as GenerationType)} value={selectedGenerationType} name="meal">
                  <Flex direction="column" alignItems="start" gap="2">
                    <Radio.Item value="only_without_alias">
                      {formatMessage({
                        id: 'webtools.settings.page.list.generate_paths_modal.generation_type.only_without_alias',
                        defaultMessage: 'Generate only for pages without an URL alias',
                      })}
                    </Radio.Item>
                    <Radio.Item value="only_generated">
                      {formatMessage({
                        id: 'webtools.settings.page.list.generate_paths_modal.generation_type.only_generated',
                        defaultMessage: 'Re-generate only URL alias that were auto-generated',
                      })}
                    </Radio.Item>
                    <Radio.Item value="all">
                      {formatMessage({
                        id: 'webtools.settings.page.list.generate_paths_modal.generation_type.all',
                        defaultMessage: 'Re-generate all URL aliases',
                      })}
                    </Radio.Item>
                  </Flex>
                </Radio.Group>
              </Box>
            </Flex>
          </Flex>
        </Modal.Body>
        <Modal.Footer>
          <Modal.Close>
            <Button onClick={onClose} variant="tertiary">
              {formatMessage({
                id: 'webtools.settings.button.cancel',
                defaultMessage: 'Cancel',
              })}
            </Button>
          </Modal.Close>
          <Button
            onClick={() => {
              onSubmit(selectedContentTypes, selectedGenerationType);
              onClose();
            }}
          >
            {formatMessage({
              id: 'webtools.settings.button.generate_paths',
              defaultMessage: 'Generate paths',
            })}
          </Button>
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

export default GeneratePathsModal;
