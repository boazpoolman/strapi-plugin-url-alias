import React from 'react';

import { useIntl } from 'react-intl';

import {
  Grid,
  TextInput,
  SingleSelect,
  SingleSelectOption,
  Field,
} from '@strapi/design-system';

import form from '../mapper';

const CustomForm = (props) => {
  const { formatMessage } = useIntl();

  const {
    onChange,
    onCancel,
    modifiedState,
    id,
    uid,
    setUid,
  } = props;

  const handleCustomChange = (e) => {
    let contentType = e.target.value;

    if (contentType.match(/^[A-Za-z0-9-_.~/]*$/)) {
      setUid(contentType);
    } else {
      contentType = uid;
    }

    // Set initial values
    onCancel(false);
    Object.keys(form).forEach((input) => {
      onChange(contentType, input, form[input].value);
    });
  };

  return (
    <form>
      <Grid.Root gap={6}>
        <Grid.Item col={6} s={12}>
          <Field.Root
            hint={formatMessage({ id: 'sitemap.Settings.Field.URL.Description', defaultMessage: 'This field forces the UID type regex' })}
          >
            <Field.Label>
              {formatMessage({ id: 'sitemap.Settings.Field.URL.Label', defaultMessage: 'Slug' })}
            </Field.Label>
            <TextInput
              name="url"
              value={uid}
              disabled={id}
              onChange={(e) => handleCustomChange(e)}
            />
            <Field.Hint />
          </Field.Root>
        </Grid.Item>
        <Grid.Item col={6} s={12}>
          <Grid.Root gap={4}>
            {Object.keys(form).map((input) => (
              <Grid.Item col={12} key={input}>
                <Field.Root
                  hint={formatMessage({ id: `sitemap.Settings.Field.${input.replace(/^\w/, (c) => c.toUpperCase())}.Description`, defaultMessage: '' })}
                >
                  <Field.Label>
                    {formatMessage({ id: `sitemap.Settings.Field.${input.replace(/^\w/, (c) => c.toUpperCase())}.Label`, defaultMessage: input.replace(/^\w/, (c) => c.toUpperCase()) })}
                  </Field.Label>
                  <SingleSelect
                    name={input}
                    disabled={!uid}
                    onChange={(value) => onChange(uid, input, value)}
                    value={modifiedState.getIn([uid, input], form[input].value)}
                  >
                    {form[input].options.map((option) => (
                      <SingleSelectOption value={option} key={option}>{option}</SingleSelectOption>
                    ))}
                  </SingleSelect>
                  <Field.Hint />
                </Field.Root>
              </Grid.Item>
            ))}
          </Grid.Root>
        </Grid.Item>
      </Grid.Root>
    </form>
  );
};

export default CustomForm;
