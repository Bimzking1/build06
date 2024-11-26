/* eslint-disable @typescript-eslint/explicit-function-return-type */
import QuizButton from '@/components/quiz/button.component';
import QuizLayoutComponent from '@/components/quiz/quiz-layout.component';
import withAuth from '@/helpers/withAuth';
import useSoundEffect from '@/hooks/useSoundEffects';
import { startQuiz } from '@/repository/quiz.repository';
import Lottie from 'lottie-react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import StartAnimation from '../../../../assets/play/quiz/Start.json';

const StartQuiz = () => {
  const router = useRouter();
  const id = router.query.id;
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    const start = await startQuiz(id as string);
    if (start) {
      void router.replace(`/play/quiz/${id as string}/description`);
    }
    setLoading(false);
  };
  return (
    <QuizLayoutComponent hideBackButton>
      <div className="flex flex-col h-full justify-center items-center gap-4 lg:gap-6 px-3 md:p-8">
        <div className="font-poppins text-white text-center flex flex-col gap-1 lg:gap-2">
          <div className="text-3xl lg:text-4xl font-semibold">Seeds Quiz</div>
          <div className="text-xl lg:text-2xl">{t('quiz.testInvestment')}</div>
        </div>
        <div className="w-[200px] md:w-[400px]">
          <Lottie animationData={StartAnimation} loop={true} width={400} />
        </div>
        <div className="w-full lg:w-1/3">
          <QuizButton
            title={t('quiz.startTheGame')}
            background="#67EB00"
            darkBackground="#4EC307"
            onClick={handleContinue}
            disabled={loading}
          />
        </div>
      </div>
    </QuizLayoutComponent>
  );
};

export default withAuth(StartQuiz);
