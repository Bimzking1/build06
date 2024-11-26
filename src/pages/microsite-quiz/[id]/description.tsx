/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use-client';
import Wallet from '@/assets/play/quiz/Wallet.png';
import MicrositeQuizLayout from '@/components/microsite-quiz/micrositeQuizLayout';
import QuizButton from '@/components/quiz/button.component';
import withAuth from '@/helpers/withAuth';
import useSoundEffect from '@/hooks/useSoundEffects';
import { getUserInfo } from '@/repository/profile.repository';
import { getQuizById, getQuizCategoryById } from '@/repository/quiz.repository';
import {
  type IDetailQuiz,
  type QuizCategoryI
} from '@/utils/interfaces/quiz.interfaces';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const DescriptionQuiz = () => {
  const router = useRouter();
  const id = router.query.id;
  const { t, i18n } = useTranslation();
  const [isDesc, setDesc] = useState(true);
  const [categoryDetail, setCategoryDetail] = useState<QuizCategoryI>();
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
        const resCategory: QuizCategoryI = await getQuizCategoryById(
          detailQuiz.category
        );
        setDetailQuiz(detailQuiz);
        setCategoryDetail(resCategory);
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
    <>
      <MicrositeQuizLayout hideBackButton>
        <div className="flex flex-col h-full justify-center items-center gap-3.5">
          <Image
            alt="wallet"
            src={Wallet}
            width={400}
            height={400}
            className="w-1/4 min-w-[300px]"
          />
          <div
            className={`flex-auto flex flex-col items-center justify-between w-full bg-white rounded-t-[36px] ${
              isDesc ? 'p-8 gap-4' : 'p-4 gap-2'
            }`}
          >
            {isDesc ? (
              <div className="font-poppins text-center">
                <div className="text-lg lg:text-4xl font-semibold text-[#3AC4A0] capitalize">
                  {categoryDetail?.name ?? ''}
                </div>
                <div className="text-base lg:text-2xl font-normal text-[#7C7C7C]">
                  {categoryDetail?.descriptions?.[
                    i18n.language === 'id' ? 'id' : 'en'
                  ] ?? ''}
                </div>
              </div>
            ) : (
              <>
                <div className="text-xl lg:text-3xl font-semibold text-[#3AC4A0] font-poppins capitalize">
                  {t('quiz.questionLevel')}
                </div>
                <div className="text-base lg:text-lg text-[#7C7C7C] font-poppins font-normal">
                  {t('quiz.questionDescription1')}
                  {` ${detailQuiz?.total_questions ?? 0} `}
                  {t('quiz.questionDescription2')}
                </div>
                <div className="self-center w-full grid grid-cols-3 text-center gap-2">
                  <div className="font-semibold font-poppins text-xs sm:text-base rounded-md w-full p-3 bg-[#D8F9A8] text-[#4DA81C]">
                    {t('quiz.easy')} ({(detailQuiz?.total_questions ?? 0) / 3})
                  </div>
                  <div className="font-semibold font-poppins text-xs sm:text-base rounded-md w-full p-3 bg-[#FEEBA6] text-[#D89918]">
                    {t('quiz.medium')} ({(detailQuiz?.total_questions ?? 0) / 3}
                    )
                  </div>
                  <div className="font-semibold font-poppins text-xs sm:text-base rounded-md w-full p-3 bg-[#FFBEBE] text-[#BB1616]">
                    {t('quiz.hard')} ({(detailQuiz?.total_questions ?? 0) / 3})
                  </div>
                </div>
              </>
            )}

            <div className="w-full sm:w-1/3">
              <QuizButton
                title={t('quiz.continue')}
                background="#C286FF"
                darkBackground="#A75CF4"
                onClick={() => {
                  if (isDesc) {
                    setDesc(false);
                  } else {
                    void router.replace(
                      `/microsite-quiz/${id as string}/waiting`
                    );
                  }
                }}
              />
            </div>
          </div>
        </div>
      </MicrositeQuizLayout>
    </>
  );
};

export default withAuth(DescriptionQuiz);
