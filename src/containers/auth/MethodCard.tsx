'use client';
import PhoneInput from '@/components/PhoneInput';
import SliderCard from '@/components/SlideCard';
import type { ISlider } from '@/utils/interfaces/components.interfaces';
import type { IFormMethod } from '@/utils/interfaces/form.interfaces';
import { formMethodSchema } from '@/utils/validations/forgotPassword.schema';
import { Button, Input } from '@material-tailwind/react';
import { useFormik } from 'formik';
import forgot from 'public/assets/forgot.png';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const MethodCard = ({
  onSubmit,
  selectedCode,
  setSelectedCode,
  errorResponse
}: {
  onSubmit: (props: any) => Promise<void>;
  selectedCode: string;
  setSelectedCode: any;
  errorResponse: string;
}): React.ReactElement => {
  const { t } = useTranslation();

  const [payload, setPayload] = useState<IFormMethod>({
    email: '',
    phoneNumber: '',
    method: 'phoneNumber'
  });

  const handleChangePhoneNumber = (value: string): void => {
    const onlyNumber = value.replace(/[^0-9]/g, '');
    setPayload(c => ({ ...c, phoneNumber: onlyNumber }));
  };

  const methodHandler = useCallback((): void => {
    const updatePayload: IFormMethod = { ...payload };

    delete updatePayload.email;
    delete updatePayload.phoneNumber;

    if (payload.method === 'phoneNumber') {
      updatePayload.method = 'email';
    }
    if (payload.method === 'email') {
      updatePayload.method = 'phoneNumber';
    }
    setPayload(updatePayload);
  }, [payload]);

  const onChangeHandler = (e: React.FormEvent<HTMLInputElement>): void => {
    const { name, value } = e.target as HTMLInputElement;

    setPayload(c => ({ ...c, [name]: value }));
  };
  const forgotScreen: ISlider = {
    image: forgot,
    text: t(`forgot.${payload.method}`),
    title: ''
  };
  const inputProperties = useMemo(() => {
    if (payload.method === 'email')
      return {
        type: 'email',
        methodText: t('forgot.method.phoneNumber'),
        inputPlaceholder: t('input.placeholder.email'),
        inputLabel: t('input.type.email')
      };
    return {
      type: 'number',
      methodText: t('forgot.method.email'),
      inputPlaceholder: t('input.placeholder.phoneNumber'),
      inputLabel: t('input.type.phoneNumber')
    };
  }, [payload, t]);

  const formik = useFormik({
    initialValues: payload,
    enableReinitialize: true,
    validateOnBlur: true,
    onSubmit: async values => {
      await onSubmit(values);
    },
    validationSchema: formMethodSchema
  });

  const errorMessage = t(formik.errors?.[payload.method] ?? '');
  const error = errorMessage?.length > 0;
  return (
    <form
      onSubmit={formik.handleSubmit}
      className="flex flex-col items-center justify-center"
    >
      <SliderCard slide={forgotScreen} />
      <br />
      <br />
      <br />
      <br />
      {payload.method === 'email' ? (
        <div className="w-full">
          <Input
            error={error}
            onChange={onChangeHandler}
            name={payload.method}
            // type={inputProperties.type}
            color="green"
            variant="static"
            placeholder={inputProperties.inputPlaceholder ?? ''}
          />
          {error ? (
            <p className="!text-red-500 text-sm">{errorMessage}</p>
          ) : null}
          {errorResponse !== undefined ? (
            <p className="!text-red-500 text-sm">{errorResponse}</p>
          ) : null}
        </div>
      ) : (
        <div className="w-full">
          <PhoneInput
            selectedCode={selectedCode}
            setSelectedCode={setSelectedCode}
            onChangePhoneNumber={handleChangePhoneNumber}
            phoneValue={payload[payload.method] ?? ''}
            error={error}
          />
          {typeof error === 'string' && (
            <small className="text-[#ff515d] font-bold">{error}</small>
          )}
        </div>
      )}
      <div
        onClick={methodHandler}
        className="text-sm text-seeds-button-green cursor-pointer w-full text-left mt-2"
      >
        {inputProperties.methodText}
      </div>
      <br />
      <br />
      <Button
        type="submit"
        color="green"
        className="bg-seeds-button-green w-full rounded-full"
      >
        {t('button.next')}
      </Button>
    </form>
  );
};

export default MethodCard;
