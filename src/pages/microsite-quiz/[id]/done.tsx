/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use-client';
import { QuizDone, YourScore, YourScoreMobile } from '@/assets/play/quiz';
import MicrositeQuizLayout from '@/components/microsite-quiz/micrositeQuizLayout';
import Loading from '@/components/popup/Loading';
import withAuth from '@/helpers/withAuth';
import { useOnLeavePageConfirmation } from '@/hooks/useOnLeaveConfirmation';
import useSoundEffect from '@/hooks/useSoundEffects';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import { getUserInfo } from '@/repository/profile.repository';
import { getQuizById, getQuizReview } from '@/repository/quiz.repository';
import {
  type IDetailQuiz,
  type QuizReviewDTO
} from '@/utils/interfaces/quiz.interfaces';
import { Card, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const DoneQuiz: React.FC = () => {
  useOnLeavePageConfirmation(false);
  const { t } = useTranslation();
  const router = useRouter();
  const id = router.query.id;
  const width = useWindowInnerWidth();
  const [loading, setLoading] = useState(true);
  const [detailQuiz, setDetailQuiz] = useState<IDetailQuiz>();
  const [QuizReview, setQuizReview] = useState<QuizReviewDTO | null>(null);

  const baseUrl =
    process.env.NEXT_PUBLIC_DOMAIN ?? 'https://user-dev-gcp.seeds.finance';
  const audioConfig = {
    routeName: router.pathname,
    audioFiles: [
      {
        name: baseUrl + '/assets/quiz/sound/Waiting_time_loop.mp3',
        isAutoPlay: true,
        isLoop: true
      }
    ]
  };
  const { playAudio } = useSoundEffect(audioConfig);

  const fetchQuizReview = async (): Promise<void> => {
    try {
      const response = await getQuizReview(id as string);
      if (response.rank > 4) {
        playAudio({
          name: baseUrl + '/assets/quiz/sound/you_lose.mp3',
          isLoop: false
        });
      } else {
        playAudio({
          name: baseUrl + '/assets/quiz/sound/You_win.mp3',
          isLoop: false
        });
      }
      setQuizReview(response);
    } catch (error) {
      toast(`ERROR fetch quiz review ${error as string}`);
    }
  };

  const getDetail = useCallback(
    async (currency: string) => {
      try {
        setLoading(true);
        const resp: IDetailQuiz = await getQuizById({
          id: id as string,
          currency
        });
        setDetailQuiz(resp);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    if (typeof id === 'string') {
      void fetchQuizReview();
    }
  }, [id]);

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

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      void getDetail(userInfo.preferredCurrency);
    }
  }, [id, userInfo]);

  const answerFilter = (
    data: any[]
  ): { correct: number; inCorrect: number } => {
    const correct = data?.filter(el => el.is_correct === true);
    const inCorrect = data?.filter(el => el.is_correct === false);
    return {
      correct: correct === undefined ? 0 : correct?.length,
      inCorrect: inCorrect === undefined ? 0 : inCorrect?.length
    };
  };

  function calculateTimeDifference(startTime: string, endTime: string): string {
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();

    const diff = end - start;
    const minutes =
      ((detailQuiz?.duration_in_minute as number) * 60000 - diff) / 60000;
    const seconds = Math.floor((minutes - Math.floor(minutes)) * 60);
    return `${
      Math.abs(Math.floor(minutes)) < 10
        ? `0${Math.abs(Math.floor(minutes))}`
        : Math.abs(Math.floor(minutes))
    }:${Math.abs(seconds) < 10 ? `0${Math.abs(seconds)}` : Math.abs(seconds)}`;
  }

  return (
    <>
      {detailQuiz === undefined && loading && <Loading />}
      <MicrositeQuizLayout hideBackButton>
        <div className="w-full font-poppins text-white text-center relative -top-24">
          <Image
            src={QuizDone}
            alt="quiz done"
            className="absolute top-0 right-1/2 translate-x-1/2 w-[154px] h-[154px] max-w-[230px] max-h-[230px]"
          />
          <Image
            src={
              width !== undefined && width > 720 ? YourScore : YourScoreMobile
            }
            alt="quiz done"
            className="absolute top-32 right-1/2 translate-x-1/2 w-[500px] h-[100px] z-10"
          />
          <Card className="absolute top-44 right-1/2 translate-x-1/2 flex w-full h-fit flex-col md:mx-0 px-4 pt-4 md:px-5 md:pt-5 border-none bg-white rounded-xl max-w-[450px]">
            <div className="border border-[#FDBA22] w-full relative bottom-9 pb-10 rounded-xl">
              <div className="flex justify-center mt-10">
                <div className="border-y border-l rounded-full border-[#10A8AD]">
                  <div className="bg-quiz-gradient rounded-full p-10 ml-1">
                    <Typography className="text-5xl font-poppins font-semibold text-white">
                      {QuizReview?.score}
                    </Typography>
                    <Typography className="text-2xl font-poppins font-normal text-white">
                      Point
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-2">
                <Typography className="text-base font-poppins font-normal text-[#3AC4A0]">
                  {t('quiz.currentRank')} : #{QuizReview?.rank}
                </Typography>
              </div>
              <div className="flex justify-center mt-2">
                <Typography className="text-xs font-poppins font-normal text-[#3C49D6]">
                  {t('quiz.remainingTime')}{' '}
                  {calculateTimeDifference(
                    QuizReview?.started_at as string,
                    QuizReview?.ended_at as string
                  )}
                </Typography>
              </div>
              <div className="flex justify-center mt-2 gap-1">
                <Card className="bg-[#FDBA22] flex flex-col rounded-md w-[80px] py-1">
                  <div className="flex justify-center">
                    <Typography className="text-lg font-poppins font-semibold text-white">
                      {QuizReview?.data?.length}
                    </Typography>
                  </div>
                  <div className="flex justify-center">
                    <Typography className="text-xs font-poppins font-normal text-white">
                      {t('quiz.questions')}
                    </Typography>
                  </div>
                </Card>
                <Card className="bg-[#4FE6AF] flex flex-col rounded-md w-[80px] py-1">
                  <div className="flex justify-center">
                    <Typography className="text-lg font-poppins font-semibold text-white">
                      {answerFilter(QuizReview?.data as any[]).correct}
                    </Typography>
                  </div>
                  <div className="flex justify-center">
                    <Typography className="text-xs font-poppins font-normal text-white">
                      {t('quiz.correct')}
                    </Typography>
                  </div>
                </Card>
                <Card className="bg-[#FF3838] flex flex-col rounded-md w-[80px] py-1">
                  <div className="flex justify-center">
                    <Typography className="text-lg font-poppins font-semibold text-white">
                      {answerFilter(QuizReview?.data as any[]).inCorrect}
                    </Typography>
                  </div>
                  <div className="flex justify-center">
                    <Typography className="text-xs font-poppins font-normal text-white">
                      {t('quiz.incorrect')}
                    </Typography>
                  </div>
                </Card>
              </div>
              <div className="flex justify-center mt-4">
                <div className="w-2/3 gap-4 flex flex-col">
                  <button
                    onClick={() => {
                      router
                        .push(`/microsite-quiz/${id as string}/leaderboard`)
                        .catch(error => {
                          toast.error(`${error as string}`);
                        });
                    }}
                    className={`bg-[#4EC307] relative flex items-center justify-center border-2 border-white w-full h-14 rounded-full shadow-sm shadow-gray-600 drop-shadow-sm hover:opacity-90`}
                  >
                    <div
                      className={`h-12 w-full bg-[#67EB00] rounded-full absolute inset-0`}
                    />
                    <div className="z-10 text-center text-xl font-semibold text-white">
                      {t('quiz.leaderboard')}
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </MicrositeQuizLayout>
    </>
  );
};

export default withAuth(DoneQuiz);
