import QuizCard from '@/components/quiz/card.component';
import { getUserInfo } from '@/repository/profile.repository';
import { getQuizTrending } from '@/repository/quiz.repository';
import type { IQuiz } from '@/utils/interfaces/quiz.interfaces';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import Image from 'next/image';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import TopQuizEmpty from '../../../assets/play/quiz/top-quiz-empty.jpg';

const TopQuiz = (): JSX.Element => {
  const { t } = useTranslation();
  const [topQuizes, setTopQuizes] = useState<IQuiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>();
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

  const getTopQuiz = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await getQuizTrending(userInfo?.preferredCurrency ?? 'IDR');
      if (resp.data !== undefined) {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (resp.data) {
          const resTopQuiz: IQuiz[] = resp.data;
          setTopQuizes(resTopQuiz);
        }
      }
    } catch (error) {
      toast(`ERROR fetch quiz ${error as string}`);
    } finally {
      setLoading(false);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo !== undefined) {
      void getTopQuiz();
    }
  }, [getTopQuiz]);

  return (
    <div className="w-full">
      <div className="mt-4">
        <h1 className="text-3xl font-semibold font-poppins mt-4">
          {t('quiz.topQuiz')}
        </h1>
        <p className="text-sm font-poppins">{t('quiz.topQuizDesc')}</p>
      </div>
      <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-3 mt-4">
        {topQuizes?.length === 0 && !loading ? (
          <div className="col-span-3">
            <Image src={TopQuizEmpty} width={500} alt="Top Quiz Empty" />
          </div>
        ) : null}
        {loading ? (
          <div className="col-span-3 flex items-center justify-center">
            <div className="animate-spinner w-5 h-5" />
          </div>
        ) : (
          topQuizes?.map(item => (
            <QuizCard
              item={item}
              key={item.id}
              currency={userInfo?.preferredCurrency ?? 'IDR'}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default memo(TopQuiz);
