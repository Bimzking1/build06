'use client';
import Welcome from '@/assets/play/quiz/Welcome.json';
import MicrositeQuizLayout from '@/components/microsite-quiz/micrositeQuizLayout';
import withAuth from '@/helpers/withAuth';
import useSoundEffect from '@/hooks/useSoundEffects';
import Lottie from 'lottie-react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
const WelcomeQuiz = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const id = router.query.id;
  const invitationCode = router.query.invitationCode;
  const useCoins = router.query.useCoins;
  const timeOut = () => {
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      router
        .replace(
          `/microsite-quiz/${id as string}/help-option?invitationCode=${
            invitationCode as string
          }&useCoins=${useCoins as string}`
        )
        .catch(err => {
          console.error('navigation error:', err);
        });
    }, 2000);
  };

  const baseUrl =
    process.env.NEXT_PUBLIC_DOMAIN ?? 'https://user-dev-gcp.seeds.finance';
  const audioConfig = {
    routeName: router.pathname,
    audioFiles: [
      {
        name: baseUrl + '/assets/quiz/sound/quiz_welcome_entry_signatures.mp3',
        isAutoPlay: true
      }
    ]
  };

  useSoundEffect(audioConfig);

  timeOut();

  return (
    <MicrositeQuizLayout withButton={false}>
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="text-5xl font-semibold text-white text-center w-72">
          {t('quiz.welcome')}
        </div>
        <div className="min-w-[300px] w-1/3">
          <Lottie animationData={Welcome} loop={true} width={400} />
        </div>
      </div>
    </MicrositeQuizLayout>
  );
};

export default withAuth(WelcomeQuiz);
