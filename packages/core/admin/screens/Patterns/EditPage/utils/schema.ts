import * as yup from 'yup';
import { translatedErrors } from '@strapi/strapi/admin';

const schema = yup.object().shape({
  label: yup.string().required(translatedErrors.required),
  pattern: yup.string().required(translatedErrors.required),
  contenttype: yup.string().required(translatedErrors.required),
  languages: yup.array().when('localized', {
    is: true,
    then: yup.array().min(1, 'Select at least one language'),
    otherwise: yup.array().notRequired(),
  }),
});

export default schema;
