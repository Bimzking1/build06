/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use-client';
import FiftySeedy from '@/assets/play/quiz/5050-seedy.png';
import Easy from '@/assets/play/quiz/easy.json';
import Fifty from '@/assets/play/quiz/fifty.svg';
import Hard from '@/assets/play/quiz/hard.json';
import Medium from '@/assets/play/quiz/medium.json';
import PhoneSeedy from '@/assets/play/quiz/phone-seedy.png';
import Phone from '@/assets/play/quiz/phone.svg';
import QuizSubmitConfirm from '@/assets/play/quiz/quiz-submit-confirmation.png';
import Timer from '@/assets/play/quiz/timer.svg';
import VoteSeedy from '@/assets/play/quiz/vote-seedy.png';
import Vote from '@/assets/play/quiz/vote.svg';
import AnswerButtonComponent from '@/components/microsite-quiz/playing-microsite-quiz/answerButton';
import QuizButton from '@/components/quiz/button.component';
import HelpBox from '@/components/quiz/help-box.component';
import Modal from '@/components/ui/modal/Modal';
import { useOnLeavePageConfirmation } from '@/hooks/useOnLeaveConfirmation';
import useQuiz from '@/hooks/useQuiz';
import useSoundEffect from '@/hooks/useSoundEffects';
import {
  fetchUseLifeline,
  getQuizById,
  getQuizQuestions
} from '@/repository/quiz.repository';
import i18n from '@/utils/common/i18n';
import {
  LifelinesEnum,
  type IDetailQuiz,
  type Option,
  type Options,
  type QuestionI,
  type UseLifelineState
} from '@/utils/interfaces/quiz.interfaces';
import Lottie from 'lottie-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import MicrositeQuizLayout from '../micrositeQuizLayout';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
const QuizPlay = ({
  onUseLifeline,
  fromLifeline
}: {
  onUseLifeline: (
    useLifelineState: UseLifelineState,
    quizQuestions: QuestionI[],
    expiryInSecond: number,
    detailQuiz: IDetailQuiz,
    currentPage: number
  ) => void;
  fromLifeline?: { page?: number; lifeline?: UseLifelineState };
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const id = router.query.id;
  const [detailQuiz, setDetailQuiz] = useState<IDetailQuiz>();
  const [quizQuestions, setQuizQuestions] = useState<QuestionI[]>([]);
  const [lastAnswer, setLastAnswer] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [expiryInSecond, setExpiryInSecond] = useState<number>();
  const [countDown, setCountDown] = useState<number>(60000);
  const [selectedLL, setSelectedLL] = useState<LifelinesEnum>();
  const [spillAnswer, setSpillAnswer] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState<string>();
  const [selectedAnswer, setSelectedAnswer] = useState<number>();
  const [confirmSubmit, setConfirmSubmit] = useState(false);
  const [confirmUseLifeline, setConfirmUseLifeline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prevLevel, setPrevLevel] = useState('');
  const [showLevelUp, setShowLevelUp] = useState(false);
  const { submitQuizAnswer, submitLoading, score } = useQuiz();
  // if (id === undefined) {
  //   console.log(quitQuiz);
  // }
  const baseUrl =
    process.env.NEXT_PUBLIC_DOMAIN ?? 'https://user-dev-gcp.seeds.finance';
  const audioConfig = {
    routeName: router.pathname,
    audioFiles: [
      {
        name: baseUrl + '/assets/quiz/sound/quiz_background.mp3',
        isAutoPlay: true,
        isLoop: true
      },
      {
        name: baseUrl + '/assets/quiz/sound/answer_correct.mp3'
      },
      {
        name: baseUrl + '/assets/quiz/sound/answer_wrong.mp3'
      }
    ]
  };

  const { playAudio } = useSoundEffect(audioConfig);

  const handleWrongAnswerAudio = () => {
    playAudio({ name: baseUrl + '/assets/quiz/sound/answer_wrong.mp3' });
  };

  const handleCorrectAnswerAudio = () => {
    playAudio({ name: baseUrl + '/assets/quiz/sound/answer_correct.mp3' });
  };

  const handleReductedAnswerAudio = () => {
    playAudio({
      name: baseUrl + '/assets/quiz/sound/Answer_reducted_effect.mp3'
    });
  };

  useEffect(() => {
    if (detailQuiz) {
      const threeQLVup =
        detailQuiz.total_questions === 3 &&
        (currentPage === 1 || currentPage === 2 || currentPage === 3);
      const sixQLVup =
        detailQuiz.total_questions === 6 &&
        (currentPage === 1 || currentPage === 3 || currentPage === 5);
      const nineQLVup =
        detailQuiz.total_questions === 9 &&
        (currentPage === 1 || currentPage === 4 || currentPage === 7);
      const twelveQLVup =
        detailQuiz.total_questions === 12 &&
        (currentPage === 1 || currentPage === 5 || currentPage === 9);
      const fifteenQLVup =
        detailQuiz.total_questions === 15 &&
        (currentPage === 1 || currentPage === 6 || currentPage === 11);
      if (threeQLVup || sixQLVup || nineQLVup || twelveQLVup || fifteenQLVup) {
        playAudio({
          name: baseUrl + '/assets/quiz/sound/quiz_level_upgrade.mp3'
        });
      }
      if (quizQuestions[currentPage]?.difficulty !== prevLevel) {
        setShowLevelUp(true);
        setTimeout(() => {
          setShowLevelUp(false);
        }, 2000);
      }
      setPrevLevel(quizQuestions[currentPage]?.difficulty);
    }
  }, [currentPage, detailQuiz]);

  useEffect(() => {
    if (
      fromLifeline?.lifeline?.lifeline === LifelinesEnum['50_50'] &&
      fromLifeline?.page === currentPage
    ) {
      handleReductedAnswerAudio();
    }
  }, [fromLifeline, currentPage]);

  useOnLeavePageConfirmation(currentPage + 1 === quizQuestions.length);

  const lifelinesDesc = new Map<LifelinesEnum, string>([
    [LifelinesEnum['50_50'], t('quiz.fiftyfifty')],
    [LifelinesEnum.PHONE, t('quiz.phone')],
    [LifelinesEnum.VOTE, t('quiz.vote')]
  ]);

  const seedyImage = () => {
    if (selectedLL === LifelinesEnum.PHONE) {
      return PhoneSeedy;
    }
    if (selectedLL === LifelinesEnum['50_50']) {
      return FiftySeedy;
    }
    return VoteSeedy;
  };

  const getDetail = useCallback(
    async (currency: string) => {
      try {
        const resp: IDetailQuiz = await getQuizById({
          id: id as string,
          currency
        });
        setDetailQuiz(resp);
      } catch (error) {
        toast(`ERROR fetch quiz ${error as string}`);
      }
    },
    [id]
  );

  const getQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const resp = await getQuizQuestions(id as string);
      const dataQuestion: QuestionI[] = resp.data;
      setQuizQuestions(dataQuestion);
      setExpiryInSecond(resp.expiry_in_second);
      setLastAnswer(resp.last_answer);
    } catch (error) {
      toast('Get questions error!');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getDetail('IDR');
      getQuestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (detailQuiz && quizQuestions.length !== 0) {
      const countDownTime = Math.floor(expiryInSecond ?? 0) * 1000;
      setCountDown(countDownTime);
      const interval = setInterval(() => {
        setCountDown(prev => prev - 1000);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [expiryInSecond, quizQuestions.length, detailQuiz]);

  useEffect(() => {
    if (countDown < 0) {
      void router.replace(`/microsite-quiz/${id}/review`);
    }
  }, [countDown]);

  useEffect(() => {
    if (detailQuiz && quizQuestions.length !== 0) {
      setCurrentPage(lastAnswer ?? 1);
    }
  }, [lastAnswer, quizQuestions, detailQuiz]);

  const generateTimer = (): string => {
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
    return `${minutes < 10 ? `0${minutes}` : minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`;
  };

  const handleSubmit = async () => {
    const res = await submitQuizAnswer({
      quiz_id: id as string,
      answer_id: selectedAnswer ?? 0,
      question_id: quizQuestions[currentPage].quiz_question_id
    });
    if (res) {
      setSpillAnswer(true);
      for (const key in res?.en.options) {
        if (Object.prototype.hasOwnProperty.call(res?.en.options, key)) {
          const options = res?.en.options;
          const element: Option = options[key as keyof Options];
          if (element.is_correct) {
            setCorrectAnswer(key);
          }
        }
      }

      res.is_correct ? handleCorrectAnswerAudio() : handleWrongAnswerAudio();
      setConfirmSubmit(false);
    }
  };

  const handleUseLifeline = async () => {
    try {
      const resp = await fetchUseLifeline({
        lifeline_name: selectedLL ?? LifelinesEnum.PHONE,
        quiz_id: detailQuiz?.id ?? '',
        question_id: quizQuestions[currentPage].quiz_question_id
      });
      onUseLifeline(
        { lifeline: selectedLL ?? LifelinesEnum.PHONE, res: resp.Data },
        quizQuestions,
        expiryInSecond ?? 6000,
        detailQuiz as IDetailQuiz,
        currentPage
      );
    } catch (error) {
      toast('Use lifeline error!', { type: 'error' });
    }
  };

  const handleContinue = () => {
    setCurrentPage(prev => prev + 1);
    setSpillAnswer(false);
    setCorrectAnswer(undefined);
    setSelectedAnswer(undefined);
  };

  return (
    <>
      <MicrositeQuizLayout
        hideBackButton
        centerContent={
          <div className="ml-10 flex flex-col items-center justify-center lg:gap-2 gap-0.5 font-poppins text-white">
            <div className="text-base lg:text-2xl font-semibold capitalize">
              {`${quizQuestions?.[currentPage]?.difficulty} ${
                quizQuestions.length / 3
              }`}
            </div>
            <div className="text-sm lg:text-xl">
              {currentPage + 1}/{quizQuestions.length}
            </div>
          </div>
        }
        enableScroll={false}
        isQuestionHasMedia={
          quizQuestions[currentPage]?.data?.[
            i18n.language === 'id' ? 'id' : 'en'
          ]?.question_video !== '' ||
          quizQuestions[currentPage]?.data?.[
            i18n.language === 'id' ? 'id' : 'en'
          ]?.question_image !== ''
        }
      >
        {loading && quizQuestions.length === 0 ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="animate-spinner w-10 h-10" />
          </div>
        ) : (
          <div className="flex flex-col h-full box-border justify-between items-center font-poppins">
            <div className="flex flex-col w-full justify-center items-center font-poppins">
              <div className="w-full flex items-center justify-center">
                <div
                  style={{
                    backgroundImage: "url('/assets/quiz/bg-score.png')"
                  }}
                  className="w-full lg:w-1/3 flex flex-col justify-center items-center bg-center bg-cover bg-no-repeat p-2"
                >
                  <div className="text-lg text-white">
                    {t('quiz.currentScore')}
                  </div>
                  <div className="text-2xl text-[#D8F9A8] font-semibold">
                    {score}
                  </div>
                </div>
              </div>
              {/* <div className="w-[125px] lg:w-[220px]">
              <Image
                alt="Quiz Playing"
                src={PlayAnimation}
                width={400}
                height={400}
              />
            </div> */}
              {quizQuestions[currentPage]?.data?.[
                i18n.language === 'id' ? 'id' : 'en'
              ]?.question_video !== '' && (
                <video controls className="w-[400px] h-[300px] object-fit">
                  <source
                    src={
                      quizQuestions[currentPage]?.data?.[
                        i18n.language === 'id' ? 'id' : 'en'
                      ]?.question_video
                    }
                    type="video/mp4"
                  />
                  Browser Anda tidak mendukung tag video.
                </video>
              )}
              {quizQuestions[currentPage]?.data?.[
                i18n.language === 'id' ? 'id' : 'en'
              ]?.question_image !== '' && (
                <Image
                  alt="Quiz Playing"
                  src={
                    quizQuestions[currentPage]?.data?.[
                      i18n.language === 'id' ? 'id' : 'en'
                    ]?.question_image
                  }
                  width={400}
                  height={300}
                />
              )}
              <div className="text-[#262626] text-base text-center lg:text-xl w-full lg:w-5/6 mt-4 bg-white px-3 py-4 rounded-lg">
                {
                  quizQuestions[currentPage]?.data?.[
                    i18n.language === 'id' ? 'id' : 'en'
                  ]?.question
                }
              </div>
              <div className="flex flex-row justify-center items-center gap-2 lg:gap-6 mt-2">
                {detailQuiz?.participant_lifelines?.map((item, i) => {
                  const icon =
                    item.name === '50_50'
                      ? Fifty
                      : item.name === 'PHONE'
                      ? Phone
                      : Vote;
                  return !item.is_used ? (
                    <HelpBox
                      title=""
                      icon={icon}
                      selected={false}
                      onClick={() => {
                        if (!item.is_used) {
                          setSelectedLL(item.name);
                          setConfirmUseLifeline(true);
                        }
                      }}
                      background={
                        item.name === LifelinesEnum.PHONE
                          ? '#95DB56'
                          : item.name === LifelinesEnum.VOTE
                          ? '#B798FF'
                          : '#7B8BFC'
                      }
                      darkBackground={
                        item.name === LifelinesEnum.PHONE
                          ? '#4DA81C'
                          : item.name === LifelinesEnum.VOTE
                          ? '#7555DA'
                          : '#3C49D6'
                      }
                    />
                  ) : null;
                })}
              </div>
            </div>

            <div className=" flex flex-col items-center justify-end w-full relative bg-white rounded-t-[32px] p-5 text-poppins text-center">
              <div className="w-full absolute -top-9 flex items-center justify-center">
                <div className="w-[76px] h-[76px] rounded-full border-2 border-[#106B6E] bg-white flex flex-col justify-center items-center">
                  <Image alt="timer" src={Timer} width={15} height={15} />
                  <div className="text-base text-[#262626]">
                    {generateTimer()}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center w-full mt-10 gap-2 lg:mt-4">
                {fromLifeline?.lifeline?.lifeline === LifelinesEnum['50_50'] &&
                fromLifeline?.page === currentPage ? (
                  fromLifeline?.lifeline?.res
                    .sort((a, b) => a.option_id - b.option_id)
                    .map((item, i) => {
                      let option: Option | undefined;
                      let optionKey: string | undefined;
                      let qId = 1;
                      const options =
                        quizQuestions[currentPage]?.data[
                          i18n.language === 'id' ? 'id' : 'en'
                        ].options;
                      for (const key in options) {
                        if (
                          Object.prototype.hasOwnProperty.call(options, key)
                        ) {
                          const element = options[key as keyof Options];
                          if (element.id === item.option_id) {
                            option = element;
                            optionKey = key;
                            qId = Number(key.split('_')[1]);
                          }
                        }
                      }
                      const prefix = optionKey?.includes('1')
                        ? 'A'
                        : optionKey?.includes('2')
                        ? 'B'
                        : optionKey?.includes('3')
                        ? 'C'
                        : 'D';
                      return (
                        <AnswerButtonComponent
                          key={i.toString()}
                          title={`${prefix}. ${option?.option}`}
                          selected={selectedAnswer === qId}
                          onClick={() => {
                            setSelectedAnswer(qId);
                          }}
                          spillAnswer={spillAnswer}
                          disabled={spillAnswer}
                          rightAnswer={correctAnswer === optionKey}
                        />
                      );
                    })
                ) : (
                  <OptionAnswer
                    quizQuestions={quizQuestions}
                    currentPage={currentPage}
                    spillAnswer={spillAnswer}
                    correctAnswer={correctAnswer}
                    selectedAnswer={selectedAnswer}
                    setSelectedAnswer={setSelectedAnswer}
                    language={i18n.language}
                  />
                )}
                <div className="w-full lg:w-1/3">
                  <QuizButton
                    disabled={selectedAnswer === undefined || submitLoading}
                    title={
                      spillAnswer
                        ? currentPage + 1 === quizQuestions.length
                          ? t('quiz.finish')
                          : t('quiz.continue')
                        : t('quiz.submit')
                    }
                    background="#67EB00"
                    darkBackground="#4EC307"
                    onClick={() => {
                      if (spillAnswer) {
                        if (currentPage + 1 === quizQuestions.length) {
                          void router.replace(`/microsite-quiz/${id}/review`);
                        } else {
                          handleContinue();
                        }
                      } else {
                        setConfirmSubmit(true);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </MicrositeQuizLayout>
      {confirmSubmit && (
        <Modal
          onClose={() => {
            setConfirmSubmit(false);
          }}
          modalClasses="z-30 animate-slide-down fixed top-[35%] lg:left-[30%] mt-[-12.35rem] w-full lg:w-[40%] h-fit p-4 text-center rounded-3xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white"
        >
          <div className="w-full flex flex-col gap-6 justify-center items-center">
            <Image
              src={QuizSubmitConfirm}
              alt={'Confirm submit quiz'}
              width={200}
              height={200}
              className="object-contain w-80"
            />
            <div className="font-poppins text-center">
              <div className="text-lg text-neutral-medium font-semibold">
                {t('quiz.sureSubmit')}
              </div>
              <div className="text-base text-neutral-soft mt-2">
                {t('quiz.sureSubmitDesc')}
              </div>
            </div>
            <div className="flex flex-row items-center justify-center gap-3 w-full">
              <QuizButton
                title={t('quiz.cancel')}
                background="#FE4B60"
                darkBackground="#ED0F29"
                onClick={() => {
                  setConfirmSubmit(false);
                }}
                disabled={submitLoading}
              />
              <QuizButton
                title={t('quiz.select')}
                background="#67EB00"
                darkBackground="#4EC307"
                onClick={handleSubmit}
                disabled={submitLoading}
              />
            </div>
          </div>
        </Modal>
      )}
      {confirmUseLifeline && (
        <Modal
          onClose={() => {
            setConfirmUseLifeline(false);
          }}
          modalClasses="z-30 animate-slide-down fixed top-[35%] lg:left-[30%] mt-[-12.35rem] w-full lg:w-[40%] h-fit p-4 text-center rounded-3xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white"
        >
          <div className="w-full flex flex-col gap-6 justify-center items-center">
            <Image
              src={seedyImage()}
              alt={selectedLL ?? ''}
              width={200}
              height={200}
              className="object-contain w-80"
            />
            <div className="font-poppins text-center">
              <div className="text-lg text-neutral-medium font-semibold">
                {t('quiz.sureNeedHelp')}
              </div>
              <div className="text-base text-neutral-soft mt-2">
                {lifelinesDesc.get(selectedLL ?? LifelinesEnum.PHONE)}
              </div>
            </div>
            <div className="flex flex-row items-center justify-center gap-3 w-full">
              <QuizButton
                title={t('quiz.cancel')}
                background="#FE4B60"
                darkBackground="#ED0F29"
                onClick={() => {
                  setConfirmUseLifeline(false);
                  setSelectedLL(undefined);
                }}
              />
              <QuizButton
                title={t('quiz.select')}
                background="#67EB00"
                darkBackground="#4EC307"
                onClick={handleUseLifeline}
              />
            </div>
          </div>
        </Modal>
      )}
      {showLevelUp && (
        <Modal
          onClose={() => {
            setConfirmUseLifeline(false);
          }}
          modalClasses="z-30 animate-slide-down fixed top-[35%] lg:left-[40%] mt-[-12.35rem] w-full lg:w-[23%] h-fit p-4 text-center bg-transparent"
        >
          <Lottie
            animationData={
              quizQuestions[currentPage]?.difficulty === 'easy'
                ? Easy
                : quizQuestions[currentPage]?.difficulty === 'medium'
                ? Medium
                : Hard
            }
            loop={true}
            width={400}
          />
        </Modal>
      )}
    </>
  );
};

const OptionAnswer = memo(
  ({
    quizQuestions,
    currentPage,
    selectedAnswer,
    spillAnswer,
    correctAnswer,
    setSelectedAnswer,
    language
  }: {
    quizQuestions: QuestionI[];
    currentPage: number;
    spillAnswer: boolean;
    selectedAnswer?: number;
    correctAnswer?: string;
    setSelectedAnswer: React.Dispatch<React.SetStateAction<number | undefined>>;
    language: string;
  }) => {
    return (
      <>
        <div className="flex w-full gap-2">
          <AnswerButtonComponent
            title={`A. ${
              quizQuestions[currentPage]?.data[language === 'id' ? 'id' : 'en']
                .options.option_1.option
            }`}
            selected={selectedAnswer === 1}
            onClick={() => {
              setSelectedAnswer(1);
            }}
            spillAnswer={spillAnswer}
            disabled={spillAnswer}
            rightAnswer={correctAnswer === 'option_1'}
          />
          <AnswerButtonComponent
            title={`B. ${
              quizQuestions[currentPage]?.data[language === 'id' ? 'id' : 'en']
                .options.option_2.option
            }`}
            selected={selectedAnswer === 2}
            onClick={() => {
              setSelectedAnswer(2);
            }}
            spillAnswer={spillAnswer}
            disabled={spillAnswer}
            rightAnswer={correctAnswer === 'option_2'}
          />
        </div>
        <div className="flex w-full gap-2">
          <AnswerButtonComponent
            title={`C. ${
              quizQuestions[currentPage]?.data[language === 'id' ? 'id' : 'en']
                .options.option_3.option
            }`}
            selected={selectedAnswer === 3}
            onClick={() => {
              setSelectedAnswer(3);
            }}
            spillAnswer={spillAnswer}
            disabled={spillAnswer}
            rightAnswer={correctAnswer === 'option_3'}
          />
          <AnswerButtonComponent
            title={`D. ${
              quizQuestions[currentPage]?.data[language === 'id' ? 'id' : 'en']
                .options.option_4.option
            }`}
            selected={selectedAnswer === 4}
            onClick={() => {
              setSelectedAnswer(4);
            }}
            spillAnswer={spillAnswer}
            disabled={spillAnswer}
            rightAnswer={correctAnswer === 'option_4'}
          />
        </div>
      </>
    );
  }
);

export default memo(QuizPlay);
