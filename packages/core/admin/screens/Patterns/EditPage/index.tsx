import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { Formik, Form, FormikProps } from 'formik';
import { useRouteMatch, useHistory } from 'react-router-dom';
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
import { useFetchClient, useNotification } from '@strapi/helper-plugin';
import { ArrowLeft, Check } from '@strapi/icons';
import { ErrorResponse } from '../../../types/error-response';
import schema from './utils/schema';
import pluginId from '../../../helpers/pluginId';
import Center from '../../../components/Center';
import Select from '../../../components/Select';
import LabelField from '../../../components/LabelField';
import PatternField from '../../../components/PatternField';
import { PatternEntity, PatternFormValues, ValidatePatternResponse } from '../../../types/url-patterns';
import { EnabledContentTypes } from '../../../types/enabled-contenttypes';
import HiddenLocalizedField from '../../../components/HiddenLocalizedField';
import LanguageCheckboxes from '../../../components/LanguageCheckboxes';

const EditPatternPage = () => {
  const { push } = useHistory();
  const toggleNotification = useNotification();
  const [loading, setLoading] = useState(false);
  const [patternEntity, setPatternEntity] = useState<null | PatternEntity>(null);
  const [contentTypes, setContentTypes] = useState<EnabledContentTypes>([]);
  const { formatMessage } = useIntl();
  const { get, put, post } = useFetchClient();

  const {
    params: { id },
  } = useRouteMatch<{ id: string }>(`/plugins/${pluginId}/patterns/:id`)!;

  useEffect(() => {
    setLoading(true);
    get<EnabledContentTypes>('/webtools/info/getContentTypes', { method: 'GET' })
      .then((res) => {
        const { data } = res;
        setContentTypes(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [get]);

  useEffect(() => {
    setLoading(true);
    get<PatternEntity>(`/webtools/url-pattern/findOne/${id}`, { method: 'GET' })
      .then((res) => {
        const { data } = res;
        setPatternEntity(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [get, id]);

  const handleEditSubmit = (
    values: PatternFormValues,
    { setSubmitting, setErrors }: FormikProps<PatternFormValues>,
  ) => {
    put(`/webtools/url-pattern/update/${patternEntity.id}`, {
      data: values,
    })
      .then(() => {
        push(`/plugins/${pluginId}/patterns`);
        toggleNotification({
          type: 'success',
          message: { id: 'webtools.settings.success.edit' },
        });
        setSubmitting(false);
      })
      .catch((err: ErrorResponse) => {
        if (err.response.payload[0].message === 'This attribute must be unique') {
          setErrors({ code: err.response.payload[0].message as string });
        } else {
          toggleNotification({
            type: 'warning',
            message: { id: 'notification.error' },
          });
        }
        setSubmitting(false);
      });
  };

  const validatePattern = async (values: PatternFormValues) => {
    const errors: Record<string, any> = {};

    await post('/webtools/url-pattern/validate', {
      pattern: values.pattern,
      modelName: values.contenttype,
    })
      .then((res) => {
        const response = res.data as unknown as ValidatePatternResponse;
        if (response.valid === false) {
          errors.pattern = response.message;
        }
      })
      .catch(() => { });

    return errors;
  };

  if (loading || !contentTypes || !patternEntity) {
    return (
      <Center>
        <Loader>
          {formatMessage({
            id: 'webtools.settings.loading',
            defaultMessage: 'Loading content...',
          })}
        </Loader>
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
        label: patternEntity.label,
        pattern: patternEntity.pattern,
        contenttype: patternEntity.contenttype,
        languages: patternEntity.languages,
        code: patternEntity.code,
        localized: false,
      }}
      onSubmit={handleEditSubmit}
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
              id: 'webtools.settings.page.patterns.edit.title',
              defaultMessage: 'Edit pattern',
            })}
            subtitle={formatMessage({
              id: 'webtools.settings.page.patterns.edit.description',
              defaultMessage:
                                'Edit this pattern for automatic URL alias generation.',
            })}
            as="h2"
            navigationAction={(
              <Link
                startIcon={<ArrowLeft />}
                to={`/plugins/${pluginId}/patterns`}
              >
                {formatMessage({
                  id: 'global.back',
                  defaultMessage: 'Back',
                })}
              </Link>
                        )}
            primaryAction={(
              <Button
                type="submit"
                loading={isSubmitting}
                startIcon={<Check />}
              >
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
                      id: 'webtools.settings.page.patterns.edit.subtitle',
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
                              ? formatMessage({
                                id:
                                        typeof errors.contenttype === 'string'
                                          ? errors.contenttype
                                          : undefined,
                                defaultMessage: 'Invalid value',
                              })
                              : null
                        }
                      />
                    </GridItem>
                    <GridItem col={12} />
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
                    {values.contenttype !== '' && (
                    <GridItem col={6}>
                      <PatternField
                        values={values}
                        uid={values.contenttype}
                        setFieldValue={setFieldValue}
                        error={
                            errors.pattern
                            && touched.pattern
                            && typeof errors.pattern === 'string'
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

export default EditPatternPage;
