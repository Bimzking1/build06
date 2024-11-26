/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use-client';
import QuizButton from '@/components/quiz/button.component';
import QuizLayoutComponent from '@/components/quiz/quiz-layout.component';
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
import Wallet from '../../../../assets/play/quiz/category-detail.png';

const DescriptionQuiz = () => {
  const router = useRouter();
  const id = router.query.id;
  const { t, i18n } = useTranslation();
  const [categoryDetail, setCategoryDetail] = useState<QuizCategoryI>();
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

  // const details = new Map<string, { title: string; desc: string }>([
  //   [
  //     'ALL',
  //     {
  //       title: t('quiz.quizCategory.all'),
  //       desc: t('quiz.quizCategory.allDesc')
  //     }
  //   ],
  //   [
  //     'MUTUAL_FUNDS',
  //     {
  //       title: t('quiz.quizCategory.mutualFunds'),
  //       desc: t('quiz.quizCategory.mutualFundsDesc')
  //     }
  //   ],
  //   [
  //     'INVESTMENT',
  //     {
  //       title: t('quiz.quizCategory.investment'),
  //       desc: t('quiz.quizCategory.investmentDesc')
  //     }
  //   ],
  //   [
  //     'STOCK',
  //     {
  //       title: t('quiz.quizCategory.stock'),
  //       desc: t('quiz.quizCategory.stockDesc')
  //     }
  //   ],
  //   [
  //     'US_STOCK',
  //     {
  //       title: t('quiz.quizCategory.usStock'),
  //       desc: t('quiz.quizCategory.usStockDesc')
  //     }
  //   ],
  //   [
  //     'ID_STOCK',
  //     {
  //       title: t('quiz.quizCategory.idStock'),
  //       desc: t('quiz.quizCategory.idStockDesc')
  //     }
  //   ],
  //   [
  //     'FINANCIAL',
  //     {
  //       title: t('quiz.quizCategory.financial'),
  //       desc: t('quiz.quizCategory.financialDesc')
  //     }
  //   ],
  //   [
  //     'GOLD',
  //     {
  //       title: t('quiz.quizCategory.gold'),
  //       desc: t('quiz.quizCategory.goldDesc')
  //     }
  //   ],
  //   [
  //     'CRYPTO',
  //     {
  //       title: t('quiz.quizCategory.crypto'),
  //       desc: t('quiz.quizCategory.cryptoDesc')
  //     }
  //   ],
  //   [
  //     'FOREX',
  //     {
  //       title: t('quiz.quizCategory.forex'),
  //       desc: t('quiz.quizCategory.forexDesc')
  //     }
  //   ],
  //   [
  //     'P2P',
  //     {
  //       title: t('quiz.quizCategory.p2p'),
  //       desc: t('quiz.quizCategory.p2pDesc')
  //     }
  //   ],
  //   [
  //     'FINANCIAL_BONDS',
  //     {
  //       title: t('quiz.quizCategory.financialBonds'),
  //       desc: t('quiz.quizCategory.financialBondsDesc')
  //     }
  //   ]
  // ]);

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
    <QuizLayoutComponent>
      <div className="flex flex-col h-full box-border justify-center items-center gap-3.5">
        <div className="w-[300px] lg:w-[400px]">
          <Image alt="wallet" src={Wallet} width={400} height={400} />
        </div>
        <div className="flex-auto flex flex-col items-center w-full relative bg-white rounded-[32px] p-3 md:p-8 text-poppins text-center">
          <div className="text-xl lg:text-3xl font-semibold text-[#3AC4A0] capitalize">
            {categoryDetail?.name ?? ''}
          </div>
          <div className="text-base lg:text-lg text-[#7C7C7C] mt-4 lg:px-20">
            {categoryDetail?.descriptions?.[
              i18n.language === 'id' ? 'id' : 'en'
            ] ?? ''}
          </div>
          <div className="mt-24 w-full lg:w-1/3">
            <QuizButton
              title={t('quiz.continue')}
              background="#C286FF"
              darkBackground="#A75CF4"
              onClick={() => {
                void router.replace(
                  `/play/quiz/${id as string}/question-explanation`
                );
              }}
            />
          </div>
        </div>
      </div>
    </QuizLayoutComponent>
  );
};

export default withAuth(DescriptionQuiz);
