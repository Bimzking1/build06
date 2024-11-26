/* eslint-disable @typescript-eslint/explicit-function-return-type */
import StartAnimation from '@/assets/play/quiz/Start.json';
import MicrositeQuizLayout from '@/components/microsite-quiz/micrositeQuizLayout';
import QuizButton from '@/components/quiz/button.component';
import withAuth from '@/helpers/withAuth';
import useSoundEffect from '@/hooks/useSoundEffects';
import { startQuiz } from '@/repository/quiz.repository';
import Lottie from 'lottie-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

const StartQuiz = () => {
  const router = useRouter();
  const id = router.query.id;
  const { t } = useTranslation();

  const baseUrl =
    process.env.NEXT_PUBLIC_DOMAIN ?? 'https://user-dev-gcp.seeds.finance';
  const audioConfig = {
    routeName: router.pathname,
    audioFiles: [
      {
        name: baseUrl + '/assets/quiz/sound/quiz_background.mp3',
        isAutoPlay: true,
        isLoop: true
      }
    ]
  };

  useSoundEffect(audioConfig);

  const handleContinue = async () => {
    const start = await startQuiz(id as string);
    if (start) {
      void router.replace(`/microsite-quiz/${id as string}/description`);
    }
  };
  return (
    <MicrositeQuizLayout hideBackButton>
      <div className="flex flex-col h-full justify-center items-center gap-6">
        <div className="font-poppins text-white text-center flex flex-col gap-2">
          <div className="text-4xl font-semibold font-poppins text-white">
            Seeds Quiz
          </div>
          <div className="text-xl lg:text-2xl font-normal font-poppins text-white">
            {t('quiz.testInvestment')}
          </div>
        </div>
        <div className="min-w-[300px] w-3/12">
          <Lottie animationData={StartAnimation} loop={true} width={400} />
        </div>
        <div className="w-full sm:w-1/3">
          <QuizButton
            title={t('quiz.startTheGame')}
            background="#67EB00"
            darkBackground="#4EC307"
            onClick={handleContinue}
          />
        </div>
      </div>
    </MicrositeQuizLayout>
  );
};

export default withAuth(StartQuiz);
