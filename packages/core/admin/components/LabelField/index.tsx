import React, { useState, useEffect, FC } from 'react';
import { useIntl } from 'react-intl';
import { FormikErrors, FormikTouched } from 'formik';
import snakeCase from 'lodash/snakeCase';
import deburr from 'lodash/deburr';
import toLower from 'lodash/toLower';

import {
  TextInput,
  Box,
  TextButton,
  Typography,
  Field,
} from '@strapi/design-system';
import { PatternFormValues } from '../../types/url-patterns';

type Props = {
  values: PatternFormValues;
  setFieldValue: (field: string, value: any) => Promise<void | FormikErrors<PatternFormValues>>;
  errors: FormikErrors<PatternFormValues>;
  touched: FormikTouched<PatternFormValues>;
  code?: string;
};

const LabelField: FC<Props> = ({
  values,
  setFieldValue,
  errors,
  touched,
  code,
}) => {
  const [open, setOpen] = useState(false);
  const { formatMessage } = useIntl();
  const generatedCode = code || snakeCase(deburr(toLower(values.label || '')));

  useEffect(() => {
    if (errors.code) {
      setOpen(true);
    }
  }, [errors]);

  return (
    <Box>
      <Field.Root
        // @ts-ignore
        error={
          errors.label && touched.label
            ? formatMessage({ id: errors.label, defaultMessage: 'Invalid value' })
            : null
        }
      >
        <Field.Label>
          {formatMessage({
            id: 'webtools.settings.form.label.label',
            defaultMessage: 'Label',
          })}
        </Field.Label>
        <TextInput
          name="label"
          value={values.label || ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('label', e.target.value)}
        />
        <Field.Error />
      </Field.Root>
      {(generatedCode && !open) && (
        <Box style={{ display: 'flex', marginTop: 5 }}>
          <Typography>Machine name: {generatedCode}</Typography>
          <TextButton style={{ marginLeft: 5 }} onClick={() => setOpen(true)}>Edit</TextButton>
        </Box>
      )}

      {open && (
        <Box style={{ marginTop: 20 }}>
          <Field.Root
            // @ts-ignore
            error={
              errors.code
                ? formatMessage({ id: errors.code, defaultMessage: 'This value must be unique' })
                : null
            }
          >
            <Field.Label>
              {formatMessage({
                id: 'global.sde',
                defaultMessage: 'Code',
              })}
            </Field.Label>
            <TextInput
              name="code"
              value={values.code || generatedCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFieldValue('code', e.target.value)}
            />
            <Field.Error />
          </Field.Root>
        </Box>
      )}
    </Box>
  );
};

export default LabelField;
