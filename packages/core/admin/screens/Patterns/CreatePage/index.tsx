import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  Formik,
  Form,
  FormikProps,
  FormikErrors,
} from 'formik';
import { useHistory } from 'react-router-dom';

import {
  ContentLayout,
  HeaderLayout,
  Box,
  Link,
  Button,
  Stack,
  Typography,
  GridItem,
  Grid,
  Loader,
} from '@strapi/design-system';
import { ArrowLeft, Check } from '@strapi/icons';
import { useNotification, useFetchClient } from '@strapi/helper-plugin';
import schema from './utils/schema';
import { ErrorResponse } from '../../../types/error-response';
import pluginId from '../../../helpers/pluginId';
import Center from '../../../components/Center';
import Select from '../../../components/Select';
import LabelField from '../../../components/LabelField';
import PatternField from '../../../components/PatternField';
import { PatternFormValues, ValidatePatternResponse } from '../../../types/url-patterns';
import { EnabledContentTypes } from '../../../types/enabled-contenttypes';
import LanguageCheckboxes from '../../../components/LanguageCheckboxes';
import HiddenLocalizedField from '../../../components/HiddenLocalizedField';

const CreatePatternPage = () => {
  const { push } = useHistory();
  const toggleNotification = useNotification();
  const [loading, setLoading] = useState(false);
  const [contentTypes, setContentTypes] = useState<EnabledContentTypes>([]);
  const { formatMessage } = useIntl();
  const { get, post } = useFetchClient();

  useEffect(() => {
    setLoading(true);
    get<EnabledContentTypes>('/webtools/info/getContentTypes')
      .then((res) => {
        const { data } = res;
        setContentTypes(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [get]);

  const handleCreateSubmit = (
    values: PatternFormValues,
    { setSubmitting, setErrors }: FormikProps<PatternFormValues>,
  ) => {
    post('/webtools/url-pattern/create', {
      data: values,
    })
      .then(() => {
        push(`/plugins/${pluginId}/patterns`);
        toggleNotification({ type: 'success', message: { id: 'webtools.settings.success.create' } });
        setSubmitting(false);
      })
      .catch((err: ErrorResponse) => {
        if (err.response?.payload?.[0]?.message === 'This attribute must be unique') {
          setErrors({ code: err.response.payload[0].message as string });
        } else {
          toggleNotification({ type: 'warning', message: { id: 'notification.error' } });
        }
        setSubmitting(false);
      });
  };

  const validatePattern = async (values: PatternFormValues) => {
    const errors: FormikErrors<PatternFormValues> = {};

    await post<ValidatePatternResponse>('/webtools/url-pattern/validate', {
      data: {
        pattern: values.pattern,
        modelName: values.contenttype,
      },
    })
      .then((res) => {
        const response = res.data;
        if (response.valid === false) {
          errors.pattern = response.message;
        }
      })
      .catch(() => {});

    return errors;
  };

  if (loading || !contentTypes) {
    return (
      <Center>
        <Loader>{formatMessage({ id: 'webtools.settings.loading', defaultMessage: 'Loading content...' })}</Loader>
      </Center>
    );
  }

  const getSelectedContentType = (uid: string) => {
    const selectedContentType = contentTypes.filter(
      (type) => type.uid === uid,
    )[0];

    return selectedContentType;
  };

  return (
    <Formik<PatternFormValues>
      enableReinitialize
      initialValues={{
        label: '', pattern: '', contenttype: '', languages: [], localized: false,
      }}
      onSubmit={handleCreateSubmit}
      validationSchema={schema}
      validate={validatePattern}
    >
      {({
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
        setFieldValue,
      }) => (
        <Form noValidate onSubmit={handleSubmit} placeholder={null}>
          <HeaderLayout
            title={formatMessage({
              id: 'webtools.settings.page.patterns.create.title',
              defaultMessage: 'Add new pattern',
            })}
            subtitle={formatMessage({
              id: 'webtools.settings.page.patterns.create.description',
              defaultMessage: 'Add a pattern for automatic URL alias generation.',
            })}
            as="h2"
            navigationAction={(
              <Link startIcon={<ArrowLeft />} to={`/plugins/${pluginId}/patterns`}>
                {formatMessage({
                  id: 'global.back',
                  defaultMessage: 'Back',
                })}
              </Link>
                          )}
            primaryAction={(
              <Button type="submit" loading={isSubmitting} startIcon={<Check />}>
                {formatMessage({
                  id: 'global.save',
                  defaultMessage: 'Save',
                })}
              </Button>
                          )}
          />
          <ContentLayout>
            <Stack spacing={7}>
              <Box
                background="neutral0"
                hasRadius
                shadow="filterShadow"
                paddingTop={6}
                paddingBottom={6}
                paddingLeft={7}
                paddingRight={7}
              >
                <Stack spacing={4}>
                  <Typography variant="delta" as="h2">
                    {formatMessage({
                      id: 'webtools.settings.page.patterns.create.subtitle',
                      defaultMessage: 'Pattern details',
                    })}
                  </Typography>
                  <Grid gap={4}>
                    <GridItem col={6}>
                      <Select
                        name="contenttype"
                        list={contentTypes}
                        value={values.contenttype || ''}
                        setFieldValue={setFieldValue}
                        label={formatMessage({
                          id: 'webtools.settings.form.contenttype.label',
                          defaultMessage: 'Content type',
                        })}
                        error={
                            errors.contenttype && touched.contenttype
                              ? formatMessage({ id: String(errors.contenttype), defaultMessage: 'Invalid value' })
                              : null
                        }
                      />
                    </GridItem>
                    <GridItem col={12} />
                    <GridItem col={6}>
                      <LabelField
                        values={values}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        touched={touched}
                      />
                    </GridItem>
                    <GridItem col={12} />
                    {(values.contenttype !== '') && (
                    <GridItem col={6}>
                      <PatternField
                        values={values}
                        uid={values.contenttype}
                        setFieldValue={setFieldValue}
                        error={
                                  errors.pattern && touched.pattern
                                    ? errors.pattern
                                    : null
                              }
                      />
                    </GridItem>
                    )}
                    <HiddenLocalizedField
                      localized={getSelectedContentType(values.contenttype)?.localized}
                      setFieldValue={setFieldValue}
                    />
                    {values.localized && (
                      <GridItem col={12}>
                        <GridItem col={6}>
                          <LanguageCheckboxes
                            onChange={(newLanguages) => setFieldValue('languages', newLanguages)}
                            selectedLanguages={values.languages}
                          />
                        </GridItem>
                      </GridItem>
                    )}
                  </Grid>
                </Stack>
              </Box>
            </Stack>
          </ContentLayout>
        </Form>
      )}
    </Formik>
  );
};

export default CreatePatternPage;
