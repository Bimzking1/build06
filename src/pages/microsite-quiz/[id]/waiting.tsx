import SeedyLoading from '@/assets/play/quiz/seedy-loading.png';
import MicrositeQuizLayout from '@/components/microsite-quiz/micrositeQuizLayout';
import withAuth from '@/helpers/withAuth';
import { Progress } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
const QuizWaiting = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const id = router.query.id;
  const [fakeLoading, setFakeLoading] = useState(0);
  const [intervalState, setIntervalState] = useState<NodeJS.Timer>();

  useEffect(() => {
    setTimeout(() => {
      void router.replace(`/microsite-quiz/${id as string}/playing`);
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
    <MicrositeQuizLayout hideBackButton>
      <div className="flex flex-col h-full box-border items-center gap-6 p-4">
        <div className="font-poppins text-white text-center">
          <div className="text-3xl lg:text-4xl font-semibold">
            {t('quiz.areYouReady')}
          </div>
          <div className="text-xl lg:text-2xl font-normal">
            {t('quiz.millionaire')}
          </div>
        </div>
        <Image
          alt="Quiz loading"
          src={SeedyLoading}
          width={500}
          height={500}
          className="w-1/4 min-w-[300px]"
        />
        <Progress
          value={fakeLoading}
          className="w-full md:w-1/3 shadow-md"
          size="lg"
          barProps={{ className: 'bg-[#67EB00]' }}
        />
        <div className="font-poppins text-white text-center">
          <div className="text-xl font-semibold">{fakeLoading}%</div>
          <div className="text-base font-normal">Loading...</div>
        </div>
      </div>
    </MicrositeQuizLayout>
  );
};

export default withAuth(QuizWaiting);
