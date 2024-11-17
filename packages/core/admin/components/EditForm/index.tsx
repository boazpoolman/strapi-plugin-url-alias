import * as React from 'react';
import { useIntl } from 'react-intl';

import { unstable_useContentManagerContext } from '@strapi/strapi/admin';

import {
  Box,
  Flex,
  TextInput,
  Checkbox,
  Link,
  Accordion,
  Field,
} from '@strapi/design-system';

import getTrad from '../../helpers/getTrad';
import { UrlAliasEntity } from '../../types/url-aliases';

const EditForm = () => {
  const { form } = unstable_useContentManagerContext();

  const { values, onChange } = form;

  const modifiedDataUrlAliases =
    (values.url_alias as UrlAliasEntity[])?.length
      ? values.url_alias as UrlAliasEntity[]
      : [{
        generated: true,
      }] as UrlAliasEntity[];
  const { formatMessage } = useIntl();

  const updateValue = (index: number, name: string, value: string | number) => {
    const updatedUrlAliases = [...modifiedDataUrlAliases];

    updatedUrlAliases[index] = {
      ...updatedUrlAliases[index],
      [name]: value,
    };
    onChange('url_alias', updatedUrlAliases);
  };

  const [expanded, setExpanded] = React.useState<number | null>(0);
  // eslint-disable-next-line max-len
  const toggle = (index: number) => setExpanded((prevExpanded) => (prevExpanded === index ? null : index));

  return (
    <Flex>
      <Accordion.Root
        size="S"
      >
        {modifiedDataUrlAliases?.map((alias, index) => (
          <Accordion.Item
            key={alias.id}
            value={`acc-${alias.id}`}
          >
            <Accordion.Header>
              <Accordion.Trigger
                description={alias.url_path ? alias.url_path : 'Initial URL alias'}
              >
                {`Alias #${index + 1}`}
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Content>
              <Box>
                <Checkbox
                  onValueChange={(value: string) => {
                    updateValue(index, 'generated', value);
                  }}
                  // @ts-ignore
                  value={alias.generated !== undefined ? alias.generated : true}
                  name={`generated-${index}`}
                  hint="Uncheck this to create a custom alias below."
                >
                  {formatMessage({
                    id: getTrad('EditView.ExcludeFromSitemap'),
                    defaultMessage: ' Generate automatic URL alias',
                  })}
                </Checkbox>
                <Link href="/plugins/webtools/patterns">Configure URL alias patterns.</Link>
              </Box>
              <Box paddingTop={4}>
                <Field.Root
                  hint='Specify a path by which this data can be accessed in the browser. For example, type "/about" when writing an about page.'
                >
                  <Field.Label>
                    URL alias
                  </Field.Label>
                  <TextInput
                    name={`path-${index}`}
                    disabled={alias.generated !== undefined ? alias.generated : true}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.value.match(/^[A-Za-z0-9-_.~[\]/]*$/)) {
                        updateValue(index, 'url_path', e.target.value);
                      }
                    }}
                    value={alias.url_path}
                  />
                  <Field.Hint />
                </Field.Root>
              </Box>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </Flex>
  );
};

export default EditForm;
