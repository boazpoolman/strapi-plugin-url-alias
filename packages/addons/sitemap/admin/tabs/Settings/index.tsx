import React, { useState } from 'react';
import { Map } from 'immutable';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

import {
  Button,
  Typography,
  Toggle,
  Grid,
  TextInput,
  SingleSelect,
  SingleSelectOption,
  Field,
} from '@strapi/design-system';

import { onChangeSettings } from '../../state/actions/Sitemap';
import HostnameModal from '../../components/HostnameModal';
import { DEFAULT_LANGUAGE_URL_TYPE_DEFAULT_LOCALE, DEFAULT_LANGUAGE_URL_TYPE_OTHER } from '../../config/constants';

const Settings = () => {
  const { formatMessage } = useIntl();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const languages = useSelector((store: any) => store.getIn(['sitemap', 'languages'], {}));
  const settings = useSelector((state: any) => state.getIn(['sitemap', 'settings'], Map()));
  const hostnameOverrides = useSelector((state: any) => state.getIn(['sitemap', 'settings', 'hostname_overrides'], {}));
  const [inputVisible, setInputVisible] = useState(settings.get('defaultLanguageUrlType') === DEFAULT_LANGUAGE_URL_TYPE_OTHER);

  const saveHostnameOverrides = (hostnames) => {
    dispatch(onChangeSettings('hostname_overrides', hostnames));
    setOpen(false);
  };

  const handleDefaultLanguageUrlTypeChange = (value = '') => {
    dispatch(onChangeSettings('defaultLanguageUrlType', value));
    if (value === DEFAULT_LANGUAGE_URL_TYPE_OTHER) dispatch(onChangeSettings('defaultLanguageUrl', undefined));
    setInputVisible(value === DEFAULT_LANGUAGE_URL_TYPE_OTHER);
  };

  return (
    <Grid.Root gap={4}>
      <Grid.Item col={6} s={12}>
        <Field.Root
          hint={formatMessage({ id: 'sitemap.Settings.Field.Hostname.Description', defaultMessage: 'The URL of your website' })}
        >
          <Field.Label>
            {formatMessage({ id: 'sitemap.Settings.Field.Hostname.Label', defaultMessage: 'Hostname' })}
          </Field.Label>
          <TextInput
            placeholder="https://www.strapi.io"
            name="hostname"
            value={settings.get('hostname')}
            onChange={(e) => dispatch(onChangeSettings('hostname', e.target.value))}
          />
        </Field.Root>
        <Field.Hint />
      </Grid.Item>
      {languages.length > 1 && (
        <Grid.Item col={12} s={12}>
          <Typography variant="pi" fontWeight="bold">
            {formatMessage({ id: 'sitemap.Settings.Field.HostnameOverrides.Label', defaultMessage: 'Hostname overrides' })}
          </Typography>
          <Button
            onClick={() => setOpen(true)}
            variant="tertiary"
            style={{ marginTop: '5px', marginBottom: '3px' }}
          >
            {formatMessage({ id: 'sitemap.Settings.Field.HostnameOverrides.Button', defaultMessage: 'Configure' })}
          </Button>
          <Typography variant="pi">
            {formatMessage({ id: 'sitemap.Settings.Field.HostnameOverrides.Description', defaultMessage: 'Specify hostname per language' })}
          </Typography>
          <HostnameModal
            isOpen={open}
            languages={languages}
            hostnameOverrides={hostnameOverrides}
            onSave={saveHostnameOverrides}
            onCancel={() => setOpen(false)}
          />
        </Grid.Item>
      )}
      <Grid.Item col={12} s={12}>
        <Field.Root
          hint={formatMessage({ id: 'sitemap.Settings.Field.IncludeHomepage.Description', defaultMessage: 'Include a \'/\' entry when none is present.' })}
        >
          <Field.Label>
            {formatMessage({ id: 'sitemap.Settings.Field.IncludeHomepage.Label', defaultMessage: 'Include home page' })}
          </Field.Label>
          <Toggle
            name="includeHomepage"
            onLabel="on"
            offLabel="off"
            checked={settings.get('includeHomepage')}
            onChange={(e) => dispatch(onChangeSettings('includeHomepage', e.target.checked))}
          />
          <Field.Hint />
        </Field.Root>
      </Grid.Item>
      <Grid.Item col={12} s={12}>
        <Field.Root
          hint={formatMessage({ id: 'sitemap.Settings.Field.ExcludeDrafts.Description', defaultMessage: 'Remove all draft entries from the sitemap.' })}
        >
          <Field.Label>
            {formatMessage({ id: 'sitemap.Settings.Field.ExcludeDrafts.Label', defaultMessage: 'Exclude drafts' })}
          </Field.Label>
          <Toggle
            name="excludeDrafts"
            onLabel="on"
            offLabel="off"
            checked={settings.get('excludeDrafts')}
            onChange={(e) => dispatch(onChangeSettings('excludeDrafts', e.target.checked))}
          />
          <Field.Hint />
        </Field.Root>
      </Grid.Item>
      <Grid.Item col={6} s={12}>
        <Field.Root
          hint={formatMessage({ id: 'sitemap.Settings.Field.DefaultLanguageUrlType.Description', defaultMessage: 'Generate a link tag and attribute hreflang=x-default with the URL of your choice.' })}
        >
          <Field.Label>
            {formatMessage({ id: 'sitemap.Settings.Field.DefaultLanguageUrlType.Label', defaultMessage: 'Default language URL type' })}
          </Field.Label>
          <SingleSelect
            clearLabel="Clear"
            name="defaultLanguageUrlType"
            // onLabel="on"
            // offLabel="off"
            value={settings.get('defaultLanguageUrlType')}
            onChange={handleDefaultLanguageUrlTypeChange}
            // onClear={handleDefaultLanguageUrlTypeChange}
          >
            <SingleSelectOption value="">
              {formatMessage({ id: 'sitemap.Settings.Field.DefaultLanguageUrlType.Option.Disabled', defaultMessage: 'Disabled' })}
            </SingleSelectOption>
            <SingleSelectOption value={DEFAULT_LANGUAGE_URL_TYPE_DEFAULT_LOCALE}>
              {formatMessage({ id: 'sitemap.Settings.Field.DefaultLanguageUrlType.Option.DefaultLocale', defaultMessage: 'Default language URL of bundles (generated from default locale URL)' })}
            </SingleSelectOption>
            <SingleSelectOption value={DEFAULT_LANGUAGE_URL_TYPE_OTHER}>
              {formatMessage({ id: 'sitemap.Settings.Field.DefaultLanguageUrlType.Option.Other', defaultMessage: 'Other' })}
            </SingleSelectOption>
          </SingleSelect>
          <Field.Hint />
        </Field.Root>
      </Grid.Item>
      {inputVisible && (
        <Grid.Item col={12} s={12}>
          <Field.Root
            hint={formatMessage({ id: 'sitemap.Settings.Field.DefaultLanguageUrl.Description', defaultMessage: 'E.g. URL of your website language selector.' })}
          >
            <Field.Label>
              {formatMessage({ id: 'sitemap.Settings.Field.DefaultLanguageUrl.Label', defaultMessage: 'Custom default language URL' })}
            </Field.Label>
            <TextInput
              placeholder="https://www.strapi.io/language-selector"
              name="defaultLanguageUrl"
              required
              value={settings.get('defaultLanguageUrl')}
              onChange={(e) => dispatch(onChangeSettings('defaultLanguageUrl', e.target.value))}
            />
            <Field.Hint />
          </Field.Root>
        </Grid.Item>
      )}
    </Grid.Root>
  );
};

export default Settings;
