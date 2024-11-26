import QuizLayoutComponent from '@/components/quiz/quiz-layout.component';
import withAuth from '@/helpers/withAuth';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SeedyLoading from '../../../../assets/play/quiz/seedy-loading.png';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
const QuizWaiting = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const id = router.query.id;
  const [fakeLoading, setFakeLoading] = useState(0);
  const [intervalState, setIntervalState] = useState<NodeJS.Timer>();

  useEffect(() => {
    setTimeout(() => {
      void router.replace(`/play/quiz/${id as string}/playing`);
    }, 2000);

    const interval = setInterval(() => {
      setFakeLoading(prev => prev + 5);
    }, 100);
    setIntervalState(interval);
    return () => {
      clearInterval(intervalState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fakeLoading > 80 && intervalState !== undefined) {
      clearInterval(intervalState);
    }
  }, [fakeLoading, intervalState]);

  return (
    <QuizLayoutComponent>
      <div className="flex flex-col h-full box-border items-center gap-6 p-3 md:p-8">
        <div className="font-poppins text-white text-center">
          <div className="text-3xl lg:text-4xl font-semibold">
            {t('quiz.areYouReady')}
          </div>
          <div className="text-xl lg:text-2xl">{t('quiz.millionaire')}</div>
        </div>
        <div className="w-[300px] lg:w-[400px]">
          <Image
            alt="Quiz loading"
            src={SeedyLoading}
            width={500}
            height={500}
          />
        </div>
        <div className="w-full lg:w-1/3 bg-white relative rounded-full h-5 shadow-md">
          <div
            className="bg-[#67EB00] absolute h-4 rounded-full top-0.5 left-0.5"
            style={{ width: `${fakeLoading}%` }}
          />
        </div>
        <div className="font-poppins text-white text-center">
          <div className="text-xl font-semibold">{fakeLoading}%</div>
          <div className="text-base">Loading...</div>
        </div>
      </div>
    </QuizLayoutComponent>
  );
};

export default withAuth(QuizWaiting);
