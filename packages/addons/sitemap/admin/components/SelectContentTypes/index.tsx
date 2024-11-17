import React from 'react';
import { SingleSelectOption, SingleSelect, Field } from '@strapi/design-system';
import { useIntl } from 'react-intl';

const SelectContentTypes = (props) => {
  const { formatMessage } = useIntl();

  const {
    contentTypes,
    onChange,
    disabled,
    value,
  } = props;

  return (
    <Field.Root
      hint={formatMessage({ id: 'sitemap.Settings.Field.SelectContentType.Description', defaultMessage: 'Select a content type.' })}
    >
      <Field.Label>
        {formatMessage({ id: 'sitemap.Settings.Field.SelectContentType.Label', defaultMessage: 'Content Type' })}
      </Field.Label>
      <SingleSelect
        name="select"
        disabled={disabled}
        onChange={(newValue) => onChange(newValue)}
        value={value}
        required
      >
        {contentTypes.map(({ uid, name }) => {
          return <SingleSelectOption value={uid} key={uid}>{name}</SingleSelectOption>;
        })}
      </SingleSelect>
      <Field.Hint />
    </Field.Root>
  );
};

export default SelectContentTypes;
