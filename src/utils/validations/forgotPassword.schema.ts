import { passwordPattern } from '@/utils/common/pattern';
import type { Shape } from '@/utils/validations/common.schema';
import * as Yup from 'yup';
import type {
  ICreateNewPassword,
  IFormMethod,
  IOTPMethod
} from '../interfaces/form.interfaces';

const invalidEmail = 'errorMessage.invalidEmail';
const requiredEmail = 'errorMessage.requiredEmail';
const invalidPhoneNumber = 'errorMessage.invalidPhoneNumber';
const requiredPhoneNumber = 'errorMessage.requiredPhoneNumber';
const requiredPassword = 'errorMessage.requiredPassword';
const requiredRePassword = 'errorMessage.requiredRePassword';
const invalidPassword = 'errorMessage.invalidPassword';
const unmatchPassword = 'errorMessage.unmatchPassword';

export const formMethodSchema: any = Yup.object<Shape<IFormMethod>>().shape({
  method: Yup.string().required(),
  email: Yup.string().when('method', {
    is: 'email',
    then: schema => schema.email(invalidEmail).required(requiredEmail),
    otherwise: schema => schema.email(invalidEmail)
  }),
  phoneNumber: Yup.number().when('method', {
    is: 'phoneNumber',
    then: schema =>
      schema.typeError(invalidPhoneNumber).required(requiredPhoneNumber),
    otherwise: schema => schema.typeError(invalidPhoneNumber)
  })
});
export const formOtpSchema: any = Yup.object<Shape<IOTPMethod>>().shape({
  method: Yup.string().required(),
  sms: Yup.string().when('method', {
    is: 'whatsapp',
    then: schema => schema.min(4).max(4).required(requiredEmail)
  }),
  whatsapp: Yup.string().when('method', {
    is: 'whatsapp',
    then: schema => schema.min(4).max(4).required(requiredPhoneNumber)
  })
});

export const formCreateNewPasswordSchema: any = Yup.object<
  Shape<ICreateNewPassword>
>().shape({
  password: Yup.string()
    .required(requiredPassword)
    .matches(passwordPattern, invalidPassword),
  rePassword: Yup.string()
    .required(requiredRePassword)
    .matches(passwordPattern, invalidPassword)
    .oneOf([Yup.ref('password')], unmatchPassword)
});
