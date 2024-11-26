/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use-client';
import QuizButton from '@/components/quiz/button.component';
import QuizLayoutComponent from '@/components/quiz/quiz-layout.component';
import withAuth from '@/helpers/withAuth';
import useSoundEffect from '@/hooks/useSoundEffects';
import { getUserInfo } from '@/repository/profile.repository';
import { getQuizById } from '@/repository/quiz.repository';
import { type IDetailQuiz } from '@/utils/interfaces/quiz.interfaces';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import Wallet from '../../../../assets/play/quiz/category-detail.png';

const QuestionExplanation = () => {
  const router = useRouter();
  const id = router.query.id;
  const { t } = useTranslation();
  const [detailQuiz, setDetailQuiz] = useState<IDetailQuiz>();
  const [userInfo, setUserInfo] = useState<any>();
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const dataInfo = await getUserInfo();

        setUserInfo(dataInfo);
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, []);

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

  const getDetail = useCallback(
    async (currency: string) => {
      try {
        const detailQuiz: IDetailQuiz = await getQuizById({
          id: id as string,
          currency
        });
        setDetailQuiz(detailQuiz);
      } catch (error) {
        toast(`ERROR fetch quiz ${error as string}`);
      }
    },
    [id]
  );

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      getDetail(userInfo.preferredCurrency);
    }
  }, [id, userInfo]);

  return (
    <QuizLayoutComponent>
      <div className="flex flex-col h-full box-border justify-center items-center gap-3.5 px-4">
        <div className="w-[300px] lg:w-[400px]">
          <Image alt="wallet" src={Wallet} width={400} height={400} />
        </div>
        <div className="flex-auto flex flex-col items-start w-full lg:w-[50%] relative bg-white rounded-[32px] p-3 md:p-8 text-poppins">
          <div className="text-xl lg:text-3xl font-semibold text-[#3AC4A0] capitalize">
            {t('quiz.questionLevel')}
          </div>
          <div className="text-base lg:text-lg text-[#7C7C7C] mt-4 ">
            {t('quiz.questionDescription1')}
            {` ${detailQuiz?.total_questions ?? 0} `}
            {t('quiz.questionDescription2')}
          </div>
          <div className="self-center w-full grid grid-cols-3 text-center gap-2 mt-2 lg:mt-4">
            <div className="font-semibold rounded-md w-full p-3 bg-[#D8F9A8] text-[#4DA81C]">
              {t('quiz.easy')} ({(detailQuiz?.total_questions ?? 0) / 3})
            </div>
            <div className="font-semibold rounded-md w-full p-3 bg-[#FEEBA6] text-[#D89918]">
              {t('quiz.medium')} ({(detailQuiz?.total_questions ?? 0) / 3})
            </div>
            <div className="font-semibold rounded-md w-full p-3 bg-[#FFBEBE] text-[#BB1616]">
              {t('quiz.hard')} ({(detailQuiz?.total_questions ?? 0) / 3})
            </div>
          </div>
        </div>
        <div className="my-12 w-full lg:w-1/3">
          <QuizButton
            title={t('quiz.continue')}
            background="#C286FF"
            darkBackground="#A75CF4"
            onClick={() => {
              void router.replace(`/play/quiz/${id as string}/waiting`);
            }}
          />
        </div>
      </div>
    </QuizLayoutComponent>
  );
};

export default withAuth(QuestionExplanation);
