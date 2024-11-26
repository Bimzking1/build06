'use-client';

import IconProcessed from '@/assets/my-profile/earning/paymentProcess.svg';
import withAuth from '@/helpers/withAuth';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const WithdrawStatus = (): React.ReactElement => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center rounded-xl p-5 bg-white py-16 lg:py-32">
        <Image
          alt=""
          src={IconProcessed}
          width={100}
          height={100}
          className="w-[200px] h-[200px] md:w-[250px] md:h-[250px]"
        />
        <p className="font-semibold text-black">
          {t('earning.withdrawOnProgress')}
        </p>
        <p className="text-[#7C7C7C] text-center">
          {t('earning.withdrawOnProgressDescription')}
        </p>
        <div
          onClick={async () => await router.push('/my-profile/my-earnings')}
          className="mt-8 bg-seeds-button-green py-2 w-[200px] md:w-[350px] text-white font-poppins text-center rounded-full cursor-pointer hover:shadow-lg duration-300"
        >
          {t('earning.back')}
        </div>
      </div>
    </>
  );
};

export default withAuth(WithdrawStatus);
