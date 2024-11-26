'use client';
import SliderCard from '@/components/SlideCard';
import type { ISlider } from '@/utils/interfaces/components.interfaces';
import { Button } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import success from 'public/assets/success.png';
import successSendEmail from 'public/assets/successSendEmail.png';
import { useTranslation } from 'react-i18next';

const SuccessCard = ({
  onSubmit,
  isSuccessSendEmail
}: {
  onSubmit: (props: any) => void;
  isSuccessSendEmail?: boolean;
}): React.ReactElement => {
  const { t } = useTranslation();
  const router = useRouter();

  const successScreen: ISlider = {
    image: success,
    text: t(`forgot.success.text`),
    title: t(`forgot.success.title`)
  };

  const successSendEmailScreen: ISlider = {
    image: successSendEmail,
    title: t(`forgot.successSendEmail.title`),
    text: t(`forgot.successSendEmail.text`)
  };

  return (
    <div className=" flex flex-col items-center justify-center">
      <SliderCard
        slide={
          isSuccessSendEmail ?? false ? successSendEmailScreen : successScreen
        }
      />
      <br className="lg:hidden" />
      <br className="lg:hidden" />
      <br className="lg:hidden" />
      <br className="lg:hidden" />
      <br className="lg:hidden" />
      <br className="lg:hidden" />
      <br className="lg:hidden" />
      <br className="lg:hidden" />
      <br className="lg:hidden" />
      <br className="lg:hidden" />

      <br />
      <br />
      {!(isSuccessSendEmail ?? false) && (
        <Button
          onClick={() => {
            router
              .push('/auth/login')
              .then()
              .catch(() => {});
          }}
          type="submit"
          color="green"
          className="bg-seeds-button-green w-full rounded-full"
        >
          {t('button.next')}
        </Button>
      )}
    </div>
  );
};

export default SuccessCard;
