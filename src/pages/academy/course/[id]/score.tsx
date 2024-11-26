import PaymentPopup from '@/components/academy/PaymentPopup';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import withAuth from '@/helpers/withAuth';
import {
  enrollClass,
  getClassDetail,
  getPosttestScore,
  getPretestScore
} from '@/repository/academy.repository';
import { getUserInfo } from '@/repository/profile.repository';
import {
  type DetailClassI,
  type EnrollClassI,
  type PriceDataI
} from '@/utils/interfaces/academy.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const Score: React.FC = () => {
  const router = useRouter();
  const { id, testType } = router.query;
  const [dataPreTest, setDataPreTest] = useState('');
  const [dataPostTest, setDataPostTest] = useState('');
  const [dataClass, setDataClass] = useState<DetailClassI | undefined>(
    undefined
  );
  const { t } = useTranslation();
  const [enrollData, setEnrollData] = useState<EnrollClassI>({
    phone_number: ''
  });
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [showPopup, setShowPopup] = useState(false);

  const handleGetScore = async (): Promise<void> => {
    try {
      let response;
      if (testType === 'pretest') {
        response = await getPretestScore(id as string);
        setDataPreTest(response?.pre_test_score);
        const responseClass = await getClassDetail(id as string);
        setDataClass(responseClass);
        const responseUser = await getUserInfo();
        setUserInfo(responseUser);
        setEnrollData({
          phone_number: responseUser?.phoneNumber ?? ''
        });
        if (responseClass?.is_owned === false) {
          setShowPopup(true);
        }
      } else if (testType === 'posttest' || testType === undefined) {
        response = await getPosttestScore(id as string);
        setDataPostTest(response?.post_test_score);
      }
    } catch (error: any) {
      toast(error.message, { type: 'error' });
    }
  };

  const togglePopup = async (): Promise<void> => {
    if (
      dataClass?.is_owned === false &&
      (dataClass?.price?.idr !== 0 || dataClass?.price?.usd !== 0)
    ) {
      setShowPopup(!showPopup);
    } else {
      if (dataClass?.is_owned === false) {
        const response = await enrollClass(id as string, enrollData);
        if (response?.payment_status === 'SUCCESS') {
          void router.push(`/academy/course/${id as string}/learn`);
        }
      } else {
        void router.push(`/academy/course/${id as string}/learn`);
      }
    }
  };

  useEffect(() => {
    if (id !== undefined) {
      void handleGetScore();
    }
  }, [id, testType]);
  return (
    <PageGradient defaultGradient className="w-full">
      {testType === 'pretest' ? (
        <>
          <div className="relative font-bold bg-white text-[#262626] md:p-4 p-3 rounded-xl mt-5 md:mt-0 w-full text-center">
            {t('academy.test.score')}
          </div>
          <div className="bg-white p-3 rounded-xl mt-5 shadow-md">
            <div className="flex flex-col items-center w-full md:w-5/12 mx-auto gap-5 my-20">
              <Image
                src={'/assets/academy/Seedy.svg'}
                alt="score"
                width={500}
                height={500}
                className="h-60 w-60"
              />
              <div className="font-bold text-xl">
                {t('academy.test.grade')}: {dataPreTest}
              </div>
              <div className="text-[#7C7C7C]">{t('academy.test.desc')}</div>
              <button
                className="text-lg p-3 rounded-3xl bg-[#3AC4A0] w-full text-white font-medium"
                onClick={async () =>
                  await router.replace(`/academy/course/${id as string}`)
                }
              >
                {t('academy.test.back')}
              </button>
            </div>
          </div>
        </>
      ) : (
        <div
          style={{ backgroundImage: "url('/assets/academy/bg-pretest.png')" }}
          className="relative w-full bg-center bg-cover rounded-xl aspect-[1600/1900] sm:aspect-[1600/1700] md:aspect-[1600/1800] lg:aspect-[1600/1900] xl:aspect-[1600/900] shadow-md py-8"
        >
          <div className="flex flex-col justify-center items-center gap-2 mb-6 font-poppins">
            <div className="flex flex-col items-center gap-2 text-white">
              <Typography className="font-semibold text-3xl">
                {t('academy.score.title')}
              </Typography>
              <Typography className="text-base font-normal">
                {t('academy.score.description')}
              </Typography>
            </div>
            <Image
              src={'/assets/academy/post-test-score.svg'}
              alt="Seedy-Score"
              width={230}
              height={230}
            />
            <div className="flex flex-col items-center gap-2 text-white">
              <Typography className="text-base font-normal">
                {t('academy.score.totalScore')}
              </Typography>
              <Typography className="text-5xl font-semibold">
                {dataPostTest}
              </Typography>
            </div>
          </div>
          <div className="flex flex-col justify-center items-center gap-4">
            <button
              onClick={async () =>
                await router.push(`/academy/course/${id as string}`)
              }
              className="py-2 lg:w-[545px] w-[328px] bg-[#3AC4A0] text-white font-semibold rounded-full transition duration-300 ease-in-out hover:bg-[#5ED6BA] hover:shadow-lg"
            >
              {t('academy.score.OtherClass')}
            </button>
            <button
              onClick={async () =>
                await router.push(`/academy/course/${id as string}/posttest`)
              }
              className="py-2 lg:w-[545px] w-[328px] border-2 border-[#3AC4A0] text-white font-semibold rounded-full transition duration-300 ease-in-out hover:border-[#5ED6BA] hover:shadow-lg"
            >
              {t('academy.score.ReTest')}
            </button>
          </div>
        </div>
      )}
      <PaymentPopup
        isOpen={showPopup}
        onClose={togglePopup}
        classTitle={dataClass?.title as string}
        amount={dataClass?.price?.[
          userInfo?.preferredCurrency?.toLowerCase() as keyof PriceDataI
        ]?.toLocaleString('id-ID', {
          currency: userInfo?.preferredCurrency ?? 'IDR',
          style: 'currency'
        })}
        isUseCoins={false}
      />
    </PageGradient>
  );
};

export default withAuth(Score);
