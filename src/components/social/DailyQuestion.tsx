import FalseAnswerBordered from '@/assets/social/false-answer-bordered.png';
import FalseAnswer from '@/assets/social/false-answer.svg';
import SeedyQuestion from '@/assets/social/seedy-question.png';
import TrueAnswerBordered from '@/assets/social/true-answer-bordered.png';
import TrueAnswer from '@/assets/social/true-answer.svg';
import { createPostCircleDetail } from '@/repository/circleDetail.repository';
import { submitAnswerDailyQuiz } from '@/repository/quiz.repository';
import { useAppSelector } from '@/store/redux/store';
import i18n from '@/utils/common/i18n';
import { type DailyQuizRes } from '@/utils/interfaces/quiz.interfaces';
import { type AxiosError } from 'axios';
import Image from 'next/image';
import React, { type Dispatch, type SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
interface props {
  data: DailyQuizRes | null;
  setDailyQuestionActive: Dispatch<SetStateAction<boolean>>;
  setGolId: Dispatch<SetStateAction<number>>;
}
const DailyQuestion: React.FC<props> = ({
  data,
  setGolId,
  setDailyQuestionActive
}) => {
  const [evaluation, setEvaluation] = useState<string>('flex');
  const [answer, setAnswer] = useState<boolean>(false);
  const [answerRecap, setAnswerRecap] = useState<number>(1);
  const [showPopUp, setShowPopUp] = useState<boolean>(false);
  const [showSuccessShared, setShowSuccessShared] = useState<boolean>(false);
  const options = ['A', 'B', 'C', 'D'];
  const { id } = useAppSelector(state => state.user.dataUser);
  const { t } = useTranslation();

  const handleClickOption = async (answerId: number): Promise<void> => {
    try {
      const response: DailyQuizRes = await submitAnswerDailyQuiz({
        question_id: data?.data.id as string,
        answer_id: answerId
      });

      if (response.data !== undefined) {
        setAnswer(response.data.is_correct);
        setEvaluation('hidden');
        setAnswerRecap(answerId);
      }
    } catch (error) {
      const err = error as AxiosError;
      toast(err.message ?? 'Unknown Error');
    }
  };

  const handleShareDailyQuiz = async (): Promise<void> => {
    try {
      const payload: {
        content_text: string;
        media_urls: string[];
        privacy: string;
        is_pinned: boolean;
        user_id: string;
        hashtags: string[];
        premium_fee: number;
      } = {
        content_text: `*[${answer ? 'WIN' : 'LOSE'}](${
          data?.participant_id as string
        })`,
        media_urls: [],
        privacy: 'public',
        is_pinned: false,
        hashtags: [],
        premium_fee: 0,
        user_id: id
      };

      const response = await createPostCircleDetail(payload);
      if (response !== undefined) {
        setShowPopUp(!showPopUp);
        setShowSuccessShared(!showSuccessShared);
      }
    } catch (error) {
      const err = error as AxiosError;
      toast(err.message ?? 'Unknown Error');
    }
  };
  return (
    <>
      <div
        className={`flex-col gap-3 my-3 pb-3 border-b border-[#dfdfdf] font-poppins ${evaluation}`}
      >
        <div className="flex items-center gap-2">
          <div className="p-2">
            <Image
              src={SeedyQuestion}
              alt="question-icon"
              className="w-12 h-12 lg:w-14 lg:h-14 object-contain"
            />
          </div>
          <div>
            <p className="font-semibold">Daily Quiz</p>
            <p className="font-normal break-all text-sm">
              {data?.data.daily_quiz[i18n.language as 'en' | 'id'].question}
            </p>
          </div>
        </div>
        {Array.from([1, 2, 3, 4]).map((el, i) => {
          return (
            data?.data.daily_quiz[i18n.language as 'en' | 'id'].options[
              `option_${el}` as 'option_1'
            ] !== undefined && (
              <div
                className="p-2 border-2 hover:border-black rounded-xl text-sm cursor-pointer"
                key={i}
                onClick={async () => {
                  await handleClickOption(
                    data?.data.daily_quiz[i18n.language as 'en' | 'id'].options[
                      `option_${el}` as 'option_1'
                    ].id
                  );
                }}
              >
                {options[i]}.{' '}
                {
                  data?.data.daily_quiz[i18n.language as 'en' | 'id'].options[
                    `option_${el}` as 'option_1'
                  ].option
                }
              </div>
            )
          );
        })}
      </div>
      {evaluation !== 'flex' && (
        <div
          className={`flex-col gap-3 my-3 pb-3 border-b border-[#dfdfdf] font-poppins flex`}
        >
          <div className="flex items-center gap-2">
            <div className="p-2">
              <Image
                src={answer ? TrueAnswerBordered : FalseAnswerBordered}
                alt="question-icon"
                className="w-12 h-12 lg:w-14 lg:h-14 object-contain"
              />
            </div>
            <div>
              <p className="font-semibold">Daily Quiz</p>
              <div className="font-normal break-all text-sm">
                {answer ? (
                  <p className="text-[#27A590]">
                    {t('social.dailyQuiz.rightAnswer')}
                  </p>
                ) : (
                  <p className="text-[#990A0A]">
                    {t('social.dailyQuiz.wrongAnswer')}
                  </p>
                )}
              </div>
              <p className="text-sm">
                {t('social.dailyQuiz.answer')}:{' '}
                {`(${options[answerRecap - 1]}) ${
                  data?.data.daily_quiz[i18n.language as 'en' | 'id'].options[
                    `option_${answerRecap}` as 'option_1'
                  ].option as string
                }`}
              </p>
            </div>
          </div>
          <div
            className={`break-all text-sm py-3 px-5 ${
              answer ? 'bg-[#BAFBD0]' : 'bg-[#FF9292]'
            } rounded-2xl`}
          >
            {data?.data.daily_quiz[i18n.language as 'en' | 'id'].description}
          </div>
          <div className="flex gap-3 flex-row justify-center items-center">
            <button
              className="w-32 px-3 py-2 border-2 border-[#392594] text-[#392594] rounded-3xl"
              onClick={() => {
                setShowPopUp(!showPopUp);
              }}
            >
              Share
            </button>
            <button
              className="w-32 px-3 py-2 text-white bg-[#3AC4A0] rounded-3xl"
              onClick={() => {
                setDailyQuestionActive(false);
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
      {showPopUp && (
        <div>
          <div className="fixed inset-0 bg-black opacity-50 z-40" />
          <div className="fixed inset-0 flex items-end justify-center sm:items-center z-50">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden w-full sm:w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/3 border-2">
              <div className="px-4 pt-4 flex justify-between items-center">
                <div className="flex justify-center items-center w-full">
                  <div
                    className="text-lg font-bold rounded-full bg-[#ececec] p-1 w-1/2 cursor-pointer flex sm:hidden"
                    onClick={() => {}}
                  />
                </div>
              </div>
              <div>
                <div className="flex list-none flex-col font-poppins gap-2 p-2 text-sm leading-5 justify-center items-center font-semibold px-5 sm:px-10 lg:px-14 xl:px-20">
                  <Image
                    src={answer ? TrueAnswer : FalseAnswer}
                    alt="popup-logo"
                    width={200}
                    height={200}
                    className="w-1/2"
                  />
                  <div className="text-sm sm:text-base md:text-lg text-black text-center">
                    {t('social.dailyQuiz.shareText')}
                  </div>
                  <div className="text-white w-full flex gap-5 text-base sm:text-lg">
                    <button
                      className="w-1/2 bg-[#ED0F29] rounded-2xl py-3"
                      onClick={() => {
                        setShowPopUp(!showPopUp);
                      }}
                    >
                      {t('social.dailyQuiz.cancel')}
                    </button>
                    <button
                      className="w-1/2 bg-[#27A590] rounded-2xl py-3"
                      onClick={handleShareDailyQuiz}
                    >
                      {t('social.dailyQuiz.accept')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showSuccessShared && (
        <div>
          <div className="fixed inset-0 bg-black opacity-50 z-40" />
          <div className="fixed inset-0 flex items-end justify-center sm:items-center z-50">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl overflow-hidden w-full sm:w-4/5 md:w-3/5 lg:w-2/5 xl:w-1/3 border-2">
              <div className="px-4 pt-4 flex justify-between items-center">
                <div className="flex justify-center items-center w-full">
                  <div
                    className="text-lg font-bold rounded-full bg-[#ececec] p-1 w-1/2 cursor-pointer flex sm:hidden"
                    onClick={() => {}}
                  />
                </div>
              </div>
              <div>
                <div className="flex list-none flex-col font-poppins gap-2 p-2 text-sm leading-5 justify-center items-center font-semibold px-5 sm:px-10 lg:px-14 xl:px-20">
                  <Image
                    src={answer ? TrueAnswer : FalseAnswer}
                    alt="popup-logo"
                    width={200}
                    height={200}
                    className="w-1/2"
                  />
                  <div className="text-sm sm:text-base md:text-lg text-black text-center">
                    {answer
                      ? t('social.dailyQuiz.shareWin')
                      : t('social.dailyQuiz.shareLose')}
                  </div>
                  <div className="text-white w-full flex gap-5 text-base sm:text-lg justify-center items-center">
                    <button
                      className="w-1/2 bg-[#27A590] rounded-2xl py-3"
                      onClick={() => {
                        setShowSuccessShared(!showSuccessShared);
                        setGolId(prev => prev++);
                        setDailyQuestionActive(false);
                      }}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DailyQuestion;
