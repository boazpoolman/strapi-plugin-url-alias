import React from 'react';
import { SingleSelect, SingleSelectOption } from '@strapi/design-system';
import { EnabledContentTypes } from '../../../../../types/enabled-contenttypes';

type Props = {
  label: string,
  onChange: (value: string) => void,
  value: string,
  contentTypes: EnabledContentTypes,
};

const FilterInput = ({
  label = '',
  onChange,
  value = '',
  contentTypes,
}: Props) => {
  return (
    <SingleSelect key="type-filter" aria-label={label} onChange={(newValue) => onChange(String(newValue))} value={value}>
      {contentTypes.map((contentType) => (
        <SingleSelectOption key={contentType.uid} value={contentType.uid}>
          {contentType.name}
        </SingleSelectOption>
      ))}
    </SingleSelect>
  );
};

export default FilterInput;
