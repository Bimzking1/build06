'use client';
import InputPassword from '@/components/InputPassword';
import { passwordRequirements } from '@/utils/common';
import type { ICreateNewPassword } from '@/utils/interfaces/form.interfaces';
import { formCreateNewPasswordSchema } from '@/utils/validations/forgotPassword.schema';
import { Button, Typography } from '@material-tailwind/react';
import { useFormik } from 'formik';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
const CreateNewPassword = ({
  onSubmit
}: {
  onSubmit: (value: ICreateNewPassword) => Promise<void>;
}): React.ReactElement => {
  const [payload, setPayload] = useState({
    password: '',
    rePassword: ''
  });

  const { t } = useTranslation();

  const onChangeHandler = (e: React.FormEvent<HTMLInputElement>): void => {
    const { name, value } = e.target as HTMLInputElement;

    setPayload(c => ({ ...c, [name]: value }));
  };

  const formik = useFormik({
    initialValues: payload,
    enableReinitialize: true,
    validateOnBlur: true,
    onSubmit: async values => {
      await onSubmit(values);
    },
    validationSchema: formCreateNewPasswordSchema
  });

  const passErrorMessage = t(formik.errors?.password ?? '');
  const passError = passErrorMessage?.length > 0;
  const rePassErrorMessage = t(formik.errors?.password ?? '');
  const rePassError = rePassErrorMessage?.length > 0;

  const isMatch = payload.password === payload.rePassword;
  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="w-full py-8">
        <div className="font-bold tracking-wide text-3xl">
          {t('forgot.createNewPassword.1')}
        </div>

        <br />
        <div className="font-extralight tracking-wide">
          {t('forgot.createNewPassword.2')}{' '}
        </div>
        <br />
        <br />
        <div className="flex gap-2">
          <Typography className="font-bold text-lg">
            {t('forgot.createNewPassword.3')}
          </Typography>
          <span className="text-red-900 text-lg font-bold">*</span>
        </div>
        <InputPassword
          errorMessage={passError ? passErrorMessage : undefined}
          error={passError}
          name="password"
          onChange={onChangeHandler}
          placeholder={t('forgot.createNewPassword.4')}
        />
        <br />
        <div className="flex gap-2">
          <Typography className="font-bold text-lg">
            {t('forgot.createNewPassword.5')}
          </Typography>
          <span className="text-red-900 text-lg font-bold">*</span>
        </div>
        <InputPassword
          errorMessage={rePassError ? rePassErrorMessage : undefined}
          error={rePassError}
          name="rePassword"
          onChange={onChangeHandler}
          placeholder={t('forgot.createNewPassword.6')}
        />
        <br />
        <div className="font-semibold mb-1">
          {t('forgot.createNewPassword.7')}
        </div>
        {passwordRequirements.map((text, idx) => (
          <div
            key={idx}
            className="flex items-center font-light tracking-wider"
          >
            <div className="h-[8px] w-[8px] bg-[#3C49D6] rounded-full mr-3" />
            <div>{t(text)}</div>
          </div>
        ))}
        <br />
        <br />
        <Button
          type="submit"
          disabled={
            !isMatch ||
            (payload.password.length === 0 &&
              payload.rePassword?.length === 0) ||
            payload.password !== payload.rePassword
          }
          className="bg-seeds-button-green rounded-full w-full disabled:bg-[#BDBDBD]"
        >
          Continue
        </Button>
      </div>
    </form>
  );
};

export default CreateNewPassword;
