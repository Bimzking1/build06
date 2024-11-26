import {
  countrycode,
  email,
  passwordPattern,
  phoneNumber,
  seedsTag
} from '@/utils/common/pattern';
import type { IRegisterFormdata } from '@/utils/interfaces/form.interfaces';
import type { Shape } from '@/utils/validations/common.schema';
import * as Yup from 'yup';

export const formRegisterPersonalInfoSchema: any = Yup.object<
  Shape<IRegisterFormdata>
>().shape({
  countryCode: Yup.string()
    .required('required')
    .matches(countrycode, 'invalid Country Code'),
  phoneNumber: Yup.string()
    .required('required')
    .matches(phoneNumber, 'invalid Phone Number')
    .min(6, 'Email must have at least 10 characters length')
    .max(20, 'Email must have at most 20 characters length'),
  email: Yup.string().required().matches(email, 'Invalid Email'),
  birthdate: Yup.string()
    .required()
    .test(
      'is-before-today',
      'Birthdate must be before today',
      function (value) {
        if (value.length === 0) return false;
        const today = new Date();
        const selectedDate = new Date(value);
        return selectedDate <= today;
      }
    )
});

export const formConfigureSeedsUserSchema: any = Yup.object<
  Shape<IRegisterFormdata>
>().shape({
  name: Yup.string().required(),
  seedsTag: Yup.string()
    .required()
    .test(
      'no-spaces',
      'SeedsTag cannot contain spaces, please delete your spaces!',
      value => {
        if (typeof value === 'string') {
          return !/\s/.test(value);
        }
        return false;
      }
    )
    .matches(seedsTag, "Don't need to add '@'")
    .min(2, 'Seeds Tag must contain text')
    .max(20, 'Seeds Tag must have at most 20 characters length'),
  referralCode: Yup.string()
});

export const formCreatePasswordSchema: any = Yup.object<
  Shape<IRegisterFormdata>
>().shape({
  password: Yup.string()
    .required()
    .matches(passwordPattern, 'invalid Input Password'),
  rePassword: Yup.string()
    .required()
    .matches(passwordPattern, 'invalid Confirm Password')
});
