import React, { FC } from 'react';
import { Field, SingleSelect, SingleSelectOption } from '@strapi/design-system';
import { FormikErrors } from 'formik';

type ListItem = {
  uid: string,
  name: string,
};

type Props = {
  list?: ListItem[];
  name: string;
  label?: string;
  placeholder?: string;
  hint?: string;
  value?: string;
  error?: string | null;
  setFieldValue: (field: string, value: any) => Promise<void | FormikErrors<any>>;
};

const SelectComponent: FC<Props> = ({
  list,
  name,
  label,
  placeholder,
  hint,
  value,
  error,
  setFieldValue,
}) => {
  if (!list || list.length < 0) {
    return null;
  }

  return (
    <Field.Root
      hint={hint}
      // @ts-ignore
      error={error}
    >
      <Field.Label>
        {label}
      </Field.Label>
      <SingleSelect
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(v: any) => setFieldValue(name, v)}
      >
        {list.map((item) => (
          <SingleSelectOption key={item.uid} value={item.uid}>
            {item.name}
          </SingleSelectOption>
        ))}
      </SingleSelect>
      <Field.Hint />
      <Field.Error />
    </Field.Root>
  );
};

export default SelectComponent;
