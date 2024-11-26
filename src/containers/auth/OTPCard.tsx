'use client';
import SliderCard from '@/components/SlideCard';
import { useCountDown } from '@/hooks/useCountDown';
import { getOtp, verifyOtp } from '@/repository/auth.repository';
import type { ISlider } from '@/utils/interfaces/components.interfaces';
import type { IOTPMethod } from '@/utils/interfaces/form.interfaces';
import { formOtpSchema } from '@/utils/validations/forgotPassword.schema';
import { Button, Input } from '@material-tailwind/react';
import { useFormik } from 'formik';
import otpSms from 'public/assets/otpSms.png';
import otpWhatsapp from 'public/assets/otpWhatsapp.png';
import { createRef, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const OTPCard = ({
  onSubmit,
  phoneNumber
}: {
  onSubmit: (props: any) => void;
  phoneNumber: string;
}): React.ReactElement => {
  const { t } = useTranslation();

  const [payload, setPayload] = useState<IOTPMethod>({
    sms: '0000',
    whatsapp: '0000',
    method: 'whatsapp'
  });

  const methodHandler = useCallback((): void => {
    const updatePayload: IOTPMethod = { ...payload };
    updatePayload.sms = '0000';
    updatePayload.whatsapp = '0000';

    if (payload.method === 'whatsapp') {
      updatePayload.method = 'sms';
    }
    if (payload.method === 'sms') {
      updatePayload.method = 'whatsapp';
    }
    setPayload(updatePayload);
  }, [payload]);

  const otpScreen: ISlider = {
    image: payload.method === 'whatsapp' ? otpWhatsapp : otpSms,
    text: t(`forgot.otp.${payload.method}`),
    title: ''
  };
  const inputProperties = useMemo(() => {
    if (payload.method === 'sms')
      return {
        type: 'number',
        methodText: t('forgot.method.whatsapp'),
        inputPlaceholder: t('input.placeholder.sms'),
        inputLabel: t('input.type.sms')
      };
    return {
      type: 'number',
      methodText: t('forgot.method.sms'),
      inputPlaceholder: t('input.placeholder.whatsapp'),
      inputLabel: t('input.type.whatsapp')
    };
  }, [payload, t]);

  const formik = useFormik({
    initialValues: payload,
    enableReinitialize: true,
    validateOnBlur: true,
    onSubmit: async values => {
      try {
        const isMatch = payload[payload.method] === otp;
        await verifyOtp({
          method: payload.method,
          msisdn: phoneNumber,
          otp: payload[payload.method] ?? ''
        });
        onSubmit({
          status: isMatch,
          otp: payload[payload.method]
        });
        setPayload({
          sms: '0000',
          whatsapp: '0000',
          method: 'whatsapp'
        });
      } catch (error) {
        console.log(error);
        return false;
      }
    },
    validationSchema: formOtpSchema
  });

  const errorMessage = formik.errors[payload.method];
  const error = typeof errorMessage === 'string';

  const inputRef1 = createRef();
  const inputRef2 = createRef();
  const inputRef3 = createRef();
  const inputRef4 = createRef();
  const refs: any = {
    0: inputRef1,
    1: inputRef2,
    2: inputRef3,
    3: inputRef4
  };

  const codeHandler = (newCode: string, idx: number = 0): void => {
    const code: string = payload[payload.method] ?? '';
    if (typeof code !== 'string') return;
    const arrayOfCode = code.split('');
    if (newCode === '') arrayOfCode[idx] = '0';
    else arrayOfCode[idx] = newCode;
    setPayload(c => ({ ...c, [c.method]: arrayOfCode.join('') }));
    if (newCode.length > 0 && idx < 3) refs[idx + 1].current.focus();
    if (newCode.length === 0 && idx > 0) refs[idx - 1].current.focus();
  };

  const { countdownText, resetCountdown, countdown } = useCountDown(30);

  const fetchOtp = useCallback(async (): Promise<void> => {
    try {
      if (phoneNumber?.length === 0) return;
      const res = await getOtp({
        phoneNumber,
        method: payload.method
      });
      setOtp(res.otp);
    } catch (error) {
      console.log(error);
    }
  }, [phoneNumber, payload.method]);

  const resendHandler = async (): Promise<void> => {
    console.log(countdown);

    if (countdown > 0) {
      resetCountdown();
      await fetchOtp();
    }
  };

  const [otp, setOtp] = useState('');

  useEffect(() => {
    resetCountdown();
    void fetchOtp();
  }, [fetchOtp]);
  return (
    <form
      onSubmit={formik.handleSubmit}
      className=" flex flex-col items-center justify-center"
    >
      <SliderCard slide={otpScreen} />
      <br />
      <br />
      <br />
      <br />
      <div className="w-full grid grid-cols-4 gap-3">
        {payload[payload.method]
          ?.split('')
          ?.map((code: string, idx: number) => (
            <div key={idx} className="max-w-[70px] overflow-hidden">
              <Input
                inputRef={refs[idx]}
                maxLength={1}
                onChange={e => {
                  codeHandler(e.target.value, idx);
                }}
                className="max-w-[70px] text-center text-black font-extrabold"
                style={{ fontWeight: '700' }}
                error={error}
                name={payload.method}
                color="green"
                variant="static"
              />
            </div>
          ))}
      </div>

      <br />
      <div className="w-full flex justify-between items-center">
        <div>{countdownText}</div>
        <div
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={resendHandler}
          className="text-seeds-button-green cursor-pointer underline capitalize"
        >
          {t('forgot.otp.resend')}
        </div>
      </div>

      <br />
      <br />
      <div
        onClick={methodHandler}
        className="text-seeds-button-green cursor-pointer underline capitalize"
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
      <br />
      <br />
    </form>
  );
};

export default OTPCard;
