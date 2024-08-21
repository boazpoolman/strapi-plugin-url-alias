import * as yup from 'yup';
import { translatedErrors } from '@strapi/helper-plugin';

const schema = yup.object().shape({
  label: yup.string().required(translatedErrors.required),
  pattern: yup.string().required(translatedErrors.required),
  contenttype: yup.string().required(translatedErrors.required),
});

export default schema;
