import React from 'react';

import { useIntl } from 'react-intl';
import { isEmpty } from 'lodash/fp';

import {
  Grid,
  SingleSelect,
  Checkbox,
  Field,
  SingleSelectOption,
} from '@strapi/design-system';

import SelectContentTypes from '../../SelectContentTypes';

import form from '../mapper';
import getSelectedContentType from '../../../helpers/getSelectedContentType';

const CollectionForm = (props) => {
  const { formatMessage } = useIntl();

  const {
    contentTypes,
    onChange,
    onCancel,
    id,
    modifiedState,
    uid,
    setUid,
    langcode,
    setLangcode,
  } = props;

  const handleSelectChange = (contentType, lang = 'und') => {
    setLangcode(lang);
    setUid(contentType);
    onCancel(false);
    onChange(contentType, lang, 'priority', modifiedState.getIn([contentType, 'languages', lang, 'priority'], form.priority.value));
  };

  return (
    <form>
      <Grid.Root gap={6}>
        <Grid.Item col={6} s={12}>
          <Grid.Root gap={4}>
            <Grid.Item col={12}>
              <SelectContentTypes
                contentTypes={contentTypes}
                onChange={(value) => handleSelectChange(value)}
                value={uid}
                disabled={!isEmpty(id)}
                modifiedContentTypes={modifiedState}
              />
            </Grid.Item>
          </Grid.Root>
        </Grid.Item>
        <Grid.Item col={6} s={12}>
          <Grid.Root gap={4}>
            {Object.keys(form).map((input) => (
              <Grid.Item col={12} key={input}>
                <Field.Root
                  hint={formatMessage({ id: `sitemap.Settings.Field.${input.replace(/^\w/, (c) => c.toUpperCase())}.Description`, defaultMessage: '' })}
                >
                  <Field.Label>{formatMessage({ id: `sitemap.Settings.Field.${input.replace(/^\w/, (c) => c.toUpperCase())}.Label`, defaultMessage: input.replace(/^\w/, (c) => c.toUpperCase()) })}</Field.Label>
                  <SingleSelect
                    name={input}
                    disabled={
                      !uid || (getSelectedContentType(contentTypes, uid).locales && !langcode)
                    }
                    onChange={(value) => onChange(uid, langcode, input, value)}
                    value={modifiedState.getIn([uid, 'languages', langcode, input], form[input].value)}
                  >
                    {form[input].options.map((option) => (
                      <SingleSelectOption value={option} key={option}>{option}</SingleSelectOption>
                    ))}
                  </SingleSelect>
                  <Field.Hint />
                </Field.Root>
              </Grid.Item>
            ))}
            <Grid.Item col={12}>
              <Field.Root
                hint={formatMessage({ id: 'sitemap.Settings.Field.IncludeLastmod.Description', defaultMessage: 'Adds a <lastmod> tag to all the URLs of this type.' })}
              >
                <Checkbox
                  onCheckedChange={(cbValue) => {
                    onChange(uid, langcode, 'includeLastmod', cbValue);
                  }}
                  value={modifiedState.getIn([uid, 'languages', langcode, 'includeLastmod'], true)}
                  disabled={
                    !uid || (getSelectedContentType(contentTypes, uid).locales && !langcode)
                  }
                >
                  {formatMessage({ id: 'sitemap.Settings.Field.IncludeLastmod.Label', defaultMessage: 'Lastmod' })}
                </Checkbox>
                <Field.Hint />
              </Field.Root>
            </Grid.Item>
          </Grid.Root>
        </Grid.Item>
      </Grid.Root>
    </form>
  );
};

export default CollectionForm;
