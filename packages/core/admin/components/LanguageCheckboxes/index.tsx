import * as React from 'react';

import {
  Flex,
  Checkbox,
  Field,
} from '@strapi/design-system';
import { getFetchClient } from '@strapi/strapi/admin';

import { EnabledContentTypes } from '../../types/enabled-contenttypes';

type Props = {
  selectedLanguages: string[];
  onChange: (selectedLanguages: string[]) => any;
  error?: any;
};

const LanguageCheckboxes = ({
  selectedLanguages,
  onChange,
  error,
}: Props) => {
  const [languages, setLanguages] = React.useState<EnabledContentTypes>([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  const { get } = getFetchClient();

  React.useEffect(() => {
    setLoading(true);
    get<EnabledContentTypes>('/webtools/info/getLanguages')
      .then((res) => {
        setLanguages(res.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return null;
  }

  return (
    <Field.Root name="password" error={error as string}>
      <Field.Label>Select the language</Field.Label>
      <Flex direction="column" alignItems="start" gap="1" marginTop="2">
        {languages.map((contentType) => (
          <Checkbox
            aria-label={`Select ${contentType.name}`}
            // @ts-ignore
            value={selectedLanguages.includes(contentType.uid)}
            onValueChange={() => {
              if (selectedLanguages.includes(contentType.uid)) {
                const newContentTypes = selectedLanguages
                  .filter((uid) => uid !== contentType.uid);

                onChange(newContentTypes);

                return;
              }
              onChange([...selectedLanguages, contentType.uid]);
            }}
          >
            {contentType.name}
          </Checkbox>
        ))}
        <Field.Error />
      </Flex>
    </Field.Root>
  );
};

export default LanguageCheckboxes;
