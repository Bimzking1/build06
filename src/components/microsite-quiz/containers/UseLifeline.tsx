/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Helping from '@/assets/play/quiz/Helping.json';
import Voting from '@/assets/play/quiz/Voting.json';
import SeedyAnswer from '@/assets/play/quiz/seedy-answer.png';
import TheAnswer from '@/assets/play/quiz/the-answer.png';
import QuizButton from '@/components/quiz/button.component';
import useSoundEffect from '@/hooks/useSoundEffects';
import i18n from '@/utils/common/i18n';
import {
  LifelinesEnum,
  type IDetailQuiz,
  type LifelineRespI,
  type Option,
  type Options,
  type QuestionI,
  type UseLifelineState
} from '@/utils/interfaces/quiz.interfaces';
import { Typography } from '@material-tailwind/react';
import Lottie from 'lottie-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import MicrositeQuizLayout from '../micrositeQuizLayout';

const UseLifeline = ({
  useLifelineState,
  quizQuestions,
  expiryInSecond,
  detailQuiz,
  currentPage,
  finishUseLifeline
}: {
  useLifelineState?: UseLifelineState;
  quizQuestions: QuestionI[];
  expiryInSecond?: number;
  detailQuiz?: IDetailQuiz;
  currentPage: number;
  finishUseLifeline: (
    callbackData?: LifelineRespI[],
    currentPage?: number
  ) => void;
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [showAnimation, setShowAnimation] = useState(true);
  const [countDown, setCountDown] = useState<number>(60000);
  const baseUrl =
    process.env.NEXT_PUBLIC_DOMAIN ?? 'https://user-dev-gcp.seeds.finance';
  const audioConfig = {
    routeName: router.pathname,
    audioFiles: [
      {
        name: baseUrl + '/assets/quiz/sound/answer_correct.mp3'
      },
      {
        name: baseUrl + '/assets/quiz/sound/answer_wrong.mp3'
      }
    ]
  };

  const { playAudio } = useSoundEffect(audioConfig);

  const timeOut = useCallback(() => {
    playAudio({ name: baseUrl + '/assets/quiz/sound/answer_coming.mp3' });
    setTimeout(() => {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      setShowAnimation(false);
      playAudio({ name: baseUrl + '/assets/quiz/sound/answer_correct.mp3' });
      if (useLifelineState?.lifeline === LifelinesEnum['50_50']) {
        finishUseLifeline(useLifelineState.res, currentPage);
      }
    }, 2000);
  }, [useLifelineState]);

  useEffect(() => {
    timeOut();
    const countDownTime = Math.floor(expiryInSecond ?? 0) * 1000;
    setCountDown(countDownTime);
    const interval = setInterval(() => {
      setCountDown(prev => prev - 1000);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiryInSecond, detailQuiz, timeOut]);

  const generateTimer = (): { minutes: string; seconds: string } => {
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);
    return {
      minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
      seconds: seconds < 10 ? `0${seconds}` : `${seconds}`
    };
  };

  return showAnimation ? (
    <div className="w-full h-screen bg-[#F9F9F9]">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="text-5xl font-semibold text-[#3AC4A0] text-center w-72">
          Hello,
        </div>
        <div className="text-5xl font-semibold text-[#3AC4A0] text-center">
          Seedy will help you!
        </div>
        <div className="w-[400px]">
          <Lottie animationData={Helping} loop={true} width={400} />
        </div>
      </div>
    </div>
  ) : (
    <MicrositeQuizLayout withButton={false}>
      <div className="w-full h-full flex flex-col justify-center items-center gap-4">
        <Typography className="bg-white rounded-lg p-2 text-[#27A590] text-lg font-poppins">
          {`${t('quiz.remainingTime')} ${generateTimer().minutes} : ${
            generateTimer().seconds
          }`}
        </Typography>
        <div className="w-full sm:w-1/2 xl:w-3/12 flex items-center justify-center">
          {useLifelineState?.lifeline === LifelinesEnum.PHONE ? (
            <Phone
              useLifelineState={useLifelineState}
              quizQuestions={quizQuestions}
              currentPage={currentPage}
            />
          ) : (
            <Vote
              useLifelineState={useLifelineState}
              quizQuestions={quizQuestions}
              currentPage={currentPage}
            />
          )}
        </div>
        <div className="w-full sm:w-1/2 md:w-3/12">
          <QuizButton
            title="Ok"
            background="#C286FF"
            darkBackground="#A75CF4"
            onClick={finishUseLifeline}
          />
        </div>
      </div>
    </MicrositeQuizLayout>
  );
};

const Phone = ({
  useLifelineState,
  quizQuestions,
  currentPage
}: {
  useLifelineState?: UseLifelineState;
  quizQuestions?: QuestionI[];
  currentPage: number;
}) => {
  const { t } = useTranslation();
  const generateDescriptionText = (): string => {
    const desc =
      quizQuestions?.[currentPage]?.data?.[i18n.language === 'id' ? 'id' : 'en']
        ?.description ?? '';
    return desc.replace(/\\n/g, '\n');
  };

  const generateAnswerText = (): string => {
    let option: Option | undefined;
    let optionKey: string | undefined;
    useLifelineState?.res.forEach(item => {
      const options =
        quizQuestions?.[currentPage]?.data?.[
          i18n.language === 'id' ? 'id' : 'en'
        ]?.options;
      if (options) {
        for (const key in options) {
          if (Object.prototype.hasOwnProperty.call(options, key)) {
            const element = options[key as keyof Options];
            if (element.id === item.option_id) {
              option = element;
              optionKey = key;
            }
          }
        }
      }
    });
    const prefix = optionKey?.includes('1')
      ? 'A'
      : optionKey?.includes('2')
      ? 'B'
      : optionKey?.includes('3')
      ? 'C'
      : 'D';
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return `${prefix}. ${option?.option}`;
  };
  return (
    <div className="flex items-center justify-center relative bg-white rounded-2xl p-3.5 mt-12">
      <div className="absolute -top-12">
        <Image
          src={TheAnswer}
          alt="Answer"
          width={400}
          height={400}
          className="object-contain"
        />
      </div>
      <div className="rounded-2xl bg-white border border-[#FDBA22] w-full flex flex-col items-center justify-center p-2 gap-2">
        <div className="w-full flex justify-center">
          <Image
            src={SeedyAnswer}
            alt="The answer"
            width={500}
            height={500}
            className="object-contain !w-[200px] sm:w-6/12"
          />
        </div>
        <div className="font-poppins font-semibold text-[#3AC4A0] text-lg">
          {generateAnswerText()}
        </div>
        <div className="w-full bg-[#E9E9E9] px-4 py-2.5 rounded-xl">
          <div className="font-poppins font-semibold text-[#3AC4A0] text-sm">
            {t('quiz.description')}
          </div>
          <div className="font-poppins text-[#7C7C7C] text-xs">
            {generateDescriptionText()}
          </div>
        </div>
      </div>
    </div>
  );
};

const Vote = ({
  useLifelineState,
  quizQuestions,
  currentPage
}: {
  useLifelineState?: UseLifelineState;
  quizQuestions?: QuestionI[];
  currentPage: number;
}) => {
  const generatePercentage = (id: number): number => {
    const lifeline = useLifelineState?.res.find(item => item.option_id === id);
    return lifeline?.percentage ?? 0;
  };

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="w-64 -mb-5">
        <Lottie animationData={Voting} loop={true} width={400} />
      </div>
      <div className="w-full bg-white p-2 lg:p-4 rounded-3xl">
        <div className="font-poppins text-[#3AC4A0] text-xl font-semibold text-center">
          Seedy’s friends vote
        </div>
        <div className="w-full flex flex-col items-center justify-center gap-2 lg:gap-4 mt-4">
          {quizQuestions && quizQuestions?.length > 0 && (
            <>
              <VoteBox
                text={`A. ${
                  quizQuestions?.[currentPage]?.data?.[
                    i18n.language === 'id' ? 'id' : 'en'
                  ].options.option_1.option !== ''
                    ? quizQuestions[currentPage]?.data[
                        i18n.language === 'id' ? 'id' : 'en'
                      ].options.option_1.option ?? ''
                    : quizQuestions[currentPage]?.data[
                        i18n.language === 'id' ? 'id' : 'en'
                      ].option_image.option_1.option ?? ''
                }`}
                precentage={generatePercentage(
                  quizQuestions?.[currentPage]?.data?.[
                    i18n.language === 'id' ? 'id' : 'en'
                  ]?.options.option_1.id ?? 0
                )}
              />
              <VoteBox
                text={`B. ${
                  quizQuestions?.[currentPage]?.data?.[
                    i18n.language === 'id' ? 'id' : 'en'
                  ].options.option_2.option !== ''
                    ? quizQuestions[currentPage]?.data[
                        i18n.language === 'id' ? 'id' : 'en'
                      ].options.option_2.option ?? ''
                    : quizQuestions[currentPage]?.data[
                        i18n.language === 'id' ? 'id' : 'en'
                      ].option_image.option_2.option ?? ''
                }`}
                precentage={generatePercentage(
                  quizQuestions?.[currentPage]?.data?.[
                    i18n.language === 'id' ? 'id' : 'en'
                  ]?.options.option_2.id ?? 0
                )}
              />
              <VoteBox
                text={`C. ${
                  quizQuestions?.[currentPage]?.data?.[
                    i18n.language === 'id' ? 'id' : 'en'
                  ].options.option_3.option !== ''
                    ? quizQuestions[currentPage]?.data[
                        i18n.language === 'id' ? 'id' : 'en'
                      ].options.option_3.option ?? ''
                    : quizQuestions[currentPage]?.data[
                        i18n.language === 'id' ? 'id' : 'en'
                      ].option_image.option_3.option ?? ''
                }`}
                precentage={generatePercentage(
                  quizQuestions?.[currentPage]?.data?.[
                    i18n.language === 'id' ? 'id' : 'en'
                  ]?.options.option_3.id ?? 0
                )}
              />
              <VoteBox
                text={`D. ${
                  quizQuestions?.[currentPage]?.data?.[
                    i18n.language === 'id' ? 'id' : 'en'
                  ].options.option_4.option !== ''
                    ? quizQuestions[currentPage]?.data[
                        i18n.language === 'id' ? 'id' : 'en'
                      ].options.option_4.option ?? ''
                    : quizQuestions[currentPage]?.data[
                        i18n.language === 'id' ? 'id' : 'en'
                      ].option_image.option_4.option ?? ''
                }`}
                precentage={generatePercentage(
                  quizQuestions?.[currentPage]?.data?.[
                    i18n.language === 'id' ? 'id' : 'en'
                  ]?.options.option_4.id ?? 0
                )}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const VoteBox = ({
  text,
  precentage
}: {
  text: string;
  precentage: number;
}) => {
  return (
    <div
      className={`w-full rounded-full px-2 py-1 lg:px-4 lg:py-2 border bg-white full flex flex-row justify-between items-center relative`}
    >
      <div
        className="absolute inset-0 bg-[#DCFCE4] border border-[#E9E9E9] rounded-full"
        style={{ width: `${precentage}%` }}
      />
      <div className="text-xs text-[#3AC4A0] font-poppins text-clip truncate text mr-1 z-10">
        {text}
      </div>
      <div className="text-xs text-[#27A590] font poppins z-10">
        {precentage}%
      </div>
    </div>
  );
};

export default UseLifeline;
