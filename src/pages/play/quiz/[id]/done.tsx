/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use-client';
import { QuizDone, YourScore, YourScoreMobile } from '@/assets/play/quiz';
import CCard from '@/components/CCard';
import Loading from '@/components/popup/Loading';
import ModalQuizWinner from '@/components/quiz/ModalQuizWinner';
import QuizLayoutComponent from '@/components/quiz/quiz-layout.component';
import ReccomendationCirclePopup from '@/components/quiz/recommendation-component';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import withAuth from '@/helpers/withAuth';
import { useOnLeavePageConfirmation } from '@/hooks/useOnLeaveConfirmation';
import useSoundEffect from '@/hooks/useSoundEffects';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import { getUserInfo } from '@/repository/profile.repository';
import { getQuizById, getQuizReview } from '@/repository/quiz.repository';
import LanguageContext from '@/store/language/language-context';
import {
  type IDetailQuiz,
  type QuizReviewDTO
} from '@/utils/interfaces/quiz.interfaces';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const DoneQuiz: React.FC = () => {
  useOnLeavePageConfirmation(false);
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isWinnerModalOpen, setIsWinnerModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const id = router.query.id;
  const width = useWindowInnerWidth();
  const handleOpen = (): void => {
    setIsOpen(!isOpen);
  };
  const handleWinnerModalOpen = (): void => {
    setIsWinnerModalOpen(!isOpen);
  };
  const [loading, setLoading] = useState(true);
  const [detailQuiz, setDetailQuiz] = useState<IDetailQuiz>();
  const [QuizReview, setQuizReview] = useState<QuizReviewDTO | null>(null);
  const [prize, setPrize] = useState<number>(0);
  const [isShowWinnerAlert, setIsShowWinnerAlert] = useState<boolean>(false);
  const [winningPosition, setWinningPosition] = useState<number>(0);
  const [winningLink, setWinningLink] = useState<string>('');
  const [ordinalName, setOrdinalName] = useState<string>('');
  const languageCtx = useContext(LanguageContext);

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

  useEffect(() => {
    if (typeof id === 'string') {
      void fetchQuizReview();
    }
  }, [id]);

  useEffect(() => {
    setTimeout(() => {
      setIsOpen(true);
    }, 2000);
  }, []);

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
    if (id !== null && userInfo !== undefined) {
      void getDetail(userInfo.preferredCurrency);
    }
  }, [id, userInfo]);

  useEffect(() => {
    if (
      detailQuiz?.status === 'ENDED' &&
      QuizReview?.rank != null &&
      QuizReview?.rank <= detailQuiz?.winners.length
    ) {
      setIsWinnerModalOpen(true);
    }
  }, [QuizReview?.rank, detailQuiz?.status, id, router, detailQuiz?.winners]);

  useEffect(() => {
    // Check if both detailQuiz and QuizReview are defined and valid
    if (
      detailQuiz != null &&
      QuizReview != null &&
      QuizReview.rank <= detailQuiz.prizes.length
    ) {
      const calculatedPrizeForRank = detailQuiz.prizes[QuizReview.rank - 1];
      setPrize(calculatedPrizeForRank);
    }
  }, [detailQuiz, QuizReview]);

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
      (detailQuiz?.duration_in_minute ?? 6000) -
      Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${
      Math.abs(minutes) < 10 ? `0${Math.abs(minutes)}` : Math.abs(minutes)
    }:${Math.abs(seconds) < 10 ? `0${Math.abs(seconds)}` : Math.abs(seconds)}`;
  }

  useEffect(() => {
    if (
      detailQuiz !== undefined &&
      userInfo !== undefined &&
      detailQuiz?.status === 'ENDED' &&
      detailQuiz?.prize_type === 'LINK'
    ) {
      const index = detailQuiz?.winners.indexOf(userInfo.id);
      if ((detailQuiz?.winners).includes(userInfo?.id)) {
        setIsShowWinnerAlert(true);
      }
      if (index !== -1) {
        setWinningPosition(index + 1);
        setWinningLink(detailQuiz?.winner_link_url[index] ?? '');
      }
      if (winningPosition === 1) {
        setOrdinalName('st');
      } else if (winningPosition === 2) {
        setOrdinalName('nd');
      } else if (winningPosition === 3) {
        setOrdinalName('rd');
      } else {
        setOrdinalName('th');
      }
    }
  }, [detailQuiz, userInfo, ordinalName, winningLink]);

  return (
    <PageGradient
      defaultGradient
      className="relative overflow-y-scroll h-full flex flex-col items-center sm:p-0 sm:pb-16 w-full"
    >
      {detailQuiz === undefined && loading && <Loading />}
      <ReccomendationCirclePopup open={isOpen} handleOpen={handleOpen} />
      <QuizLayoutComponent enableScroll={false} cancelButton>
        <div className="w-full h-fit font-poppins text-white text-center lg:relative lg:bottom-20">
          <div className="flex flex-col w-full px-6 items-center">
            <div className="flex justify-center">
              <Image
                src={QuizDone}
                alt="quiz done"
                className="w-[154px] h-[154px] max-w-[230px] max-h-[230px]"
              />
            </div>
            <Image
              src={
                width !== undefined && width > 720 ? YourScore : YourScoreMobile
              }
              alt="quiz done"
              className="w-[500px] h-[100px] relative bottom-10 z-10"
            />
            <CCard className="flex w-full h-fit flex-col md:mx-0 px-4 pt-4 md:px-5 md:pt-5 md:rounded-lg border-none bg-white relative bottom-[90px] rounded-xl max-w-[450px]">
              <div className="border border-[#FDBA22] w-full relative bottom-8 pb-10 rounded-xl">
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
                  <CCard className="bg-[#FDBA22] flex flex-col rounded-md w-[80px] py-1">
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
                  </CCard>
                  <CCard className="bg-[#4FE6AF] flex flex-col rounded-md w-[80px] py-1">
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
                  </CCard>
                  <CCard className="bg-[#FF3838] flex flex-col rounded-md w-[80px] py-1">
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
                  </CCard>
                </div>
                <div className="flex justify-center mt-4">
                  <div className="w-2/3 gap-4 flex flex-col">
                    <button
                      onClick={() => {
                        router
                          .push(`/play/quiz/${id as string}/leaderboard`)
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
                    {detailQuiz?.status === 'ENDED' ? (
                      <button
                        onClick={() => {
                          router.push(`/play/quiz`).catch(error => {
                            toast.error(`${error as string}`);
                          });
                        }}
                        className={`bg-[#A75CF4] relative flex items-center justify-center border-2 border-white w-full h-14 rounded-full shadow-sm shadow-gray-600 drop-shadow-sm hover:opacity-90`}
                      >
                        <div
                          className={`h-12 w-full bg-[#C286FF] rounded-full absolute inset-0`}
                        />
                        <div className="z-10 text-center text-xl font-semibold text-white">
                          {t('quiz.anotherQuiz')}
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          router
                            .push(`/play/quiz/${id as string}`)
                            .catch(error => {
                              toast.error(`${error as string}`);
                            });
                        }}
                        className={`bg-[#A75CF4] relative flex items-center justify-center border-2 border-white w-full h-14 rounded-full shadow-sm shadow-gray-600 drop-shadow-sm hover:opacity-90`}
                      >
                        <div
                          className={`h-12 w-full bg-[#C286FF] rounded-full absolute inset-0`}
                        />
                        <div className="z-10 text-center text-xl font-semibold text-white">
                          {loading ? 'Loading...' : t('quiz.playAgain')}
                        </div>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </CCard>
          </div>
        </div>
        <ModalQuizWinner
          quizId={id as string}
          open={isWinnerModalOpen}
          handleOpen={handleWinnerModalOpen}
          score={QuizReview?.score as number}
          prize={prize}
          isShowWinnerAlert={isShowWinnerAlert}
          winningPosition={winningPosition}
          winningLink={winningLink}
          winningImageSrc={
            winningPosition !== 0
              ? detailQuiz?.winner_image_url[winningPosition - 1] ?? ''
              : ''
          }
          ordinalName={ordinalName}
          language={languageCtx?.language ?? 'EN'}
          prizeType={detailQuiz?.prize_type ?? 'CASH'}
          preferredCurrency={userInfo?.preferredCurrency ?? 'IDR'}
          quizName={detailQuiz?.name ?? ''}
        />
      </QuizLayoutComponent>
    </PageGradient>
  );
};

export default withAuth(DoneQuiz);
