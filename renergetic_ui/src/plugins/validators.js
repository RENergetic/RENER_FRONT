/**
 * i18n key: `validations`
 */
import * as validators from "@vuelidate/validators";
import i18n from "@/plugins/locales";

// or import { createI18nMessage } from '@vuelidate/validators' -> explicite import
const { createI18nMessage } = validators; //  implicite import

// Create your i18n message instance. Used for vue-i18n@9
const $t = i18n.global.t.bind(i18n);
const withI18nMessage = createI18nMessage({ t: $t });
const withParametrizedMessage = (v /*validator*/, args = { propertyPath: "validations.fields.", withArguments: false, validatorName: null }) => {
  let withArguments = args.withArguments == null ? false : args.withArguments;
  let p = args.propertyPath ? args.propertyPath : "validations.fields.";
  return withI18nMessage(v, {
    withArguments: withArguments,
    messagePath: ({ $validator }) => (args.validatorName ? `validations.${args.validatorName}` : `validations.${$validator}`),
    messageParams: (params) => {
      params = { ...args, ...params };
      params.property = $t(p + params.property);
      return params;
    },
  });
};
// validators that expect a parameter should have `{ withArguments: true }` passed as a second parameter, to annotate they should be wrapped
export const required = withParametrizedMessage(validators.required);
export const requiredTr = (path) => withParametrizedMessage(validators.required, { propertyPath: path });
//
export const maxValue = withParametrizedMessage(validators.maxValue, { withArguments: true });
export const maxValueTr = (path) => withParametrizedMessage(validators.maxValue, { propertyPath: path, withArguments: true });
//
export const minValue = withParametrizedMessage(validators.minValue, { withArguments: true });
export const minValueTr = (path) => withParametrizedMessage(validators.minValue, { propertyPath: path, withArguments: true });

export const minLength = withParametrizedMessage(validators.minLength, { withArguments: true });
//suffix `Tr` - add i18n path to property
export const minLengthTr = (path, name) =>
  withParametrizedMessage(validators.minLength, { validatorName: name, propertyPath: path, withArguments: true });
//
export const maxLength = withParametrizedMessage(validators.maxLength, { withArguments: true });
export const maxLengthTr = (path, name) =>
  withParametrizedMessage(validators.maxLength, { validatorName: name, propertyPath: path, withArguments: true });

//
export const url = withParametrizedMessage(validators.url);
export const urlTr = (path) => withParametrizedMessage(validators.url, { propertyPath: path });
export const email = withParametrizedMessage(validators.email);
export const emailTr = (path) => withParametrizedMessage(validators.email, { propertyPath: path });
//
export const sameAs = (key) => withParametrizedMessage(validators.sameAs, { same_as_property: key, withArguments: true });
export const sameAsTr = (path, key) => withParametrizedMessage(validators.sameAs, { same_as_property: key, propertyPath: path, withArguments: true });
