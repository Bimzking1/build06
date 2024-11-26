import { successCircle } from '@/constants/assets/icons';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const SuccessPage = (): JSX.Element => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div
      className="flex flex-col text-center items-center justify-center
                            md:mx-32 lg:mx-40 xl:mx-56"
    >
      <Image
        alt=""
        src={successCircle.src}
        height={0}
        width={0}
        className="mt-10 h-1/2 w-1/2"
      />

      <Typography className="text-[16px] font-semibold mb-1 mt-12 md:text-xl lg:text-lg text-black">
        {t('circle.success.title')}
      </Typography>
      <Typography className="text-sm font-normal mb-12 md:text-md lg:text-lg text-[#7C7C7C]">
        {t('circle.success.subtitle')}
      </Typography>

      <Button
        className="text-xs font-semibold w-[90%] bg-[#3AC4A0] rounded-full lg:text-base"
        onClick={() => {
          void router.push('/connect');
        }}
      >
        Continue
      </Button>
    </div>
  );
};

export default SuccessPage;
