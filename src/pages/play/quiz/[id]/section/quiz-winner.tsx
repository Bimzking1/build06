'use-client';

import FirstMedal from '@/assets/play/quiz/Medal-1.svg';
import SecondMedal from '@/assets/play/quiz/Medal-2.svg';
import ThirdMedal from '@/assets/play/quiz/Medal-3.svg';
import SubsequentMedal from '@/assets/play/quiz/Medal-4-10.svg';
import { type IDetailQuiz } from '@/utils/interfaces/quiz.interfaces';
import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface QuizWinnerProps {
  detailQuiz: IDetailQuiz;
  preferredCurrency: string;
}

const QuizWinnerSection: React.FC<QuizWinnerProps> = ({
  detailQuiz,
  preferredCurrency
}) => {
  const { t } = useTranslation();
  return (
    <>
      {(detailQuiz?.prize_type === 'CASH' || detailQuiz?.prize_type === '') && (
        <div className="mt-4">
          <div className="text-lg font-semibold">{t('quiz.quizPrize')}</div>
          <table className="mt-2">
            {detailQuiz?.prizes?.map((item, i) => (
              <tr key={i}>
                <td className="inline-flex gap-2 border p-3 w-full">
                  <Image
                    src={
                      i === 0
                        ? FirstMedal
                        : i === 1
                        ? SecondMedal
                        : i === 2
                        ? ThirdMedal
                        : SubsequentMedal
                    }
                    alt={`${i}-medal`}
                    width={200}
                    height={200}
                    className="object-contain max-h-5 max-w-5"
                  />
                  {i <= 2
                    ? t(
                        `quiz.${
                          i === 0 ? 'first' : i === 1 ? 'second' : 'third'
                        }`
                      )
                    : `${i + 1}th`}
                </td>
                <td className="border p-3 w-full">
                  {item?.toLocaleString('id-ID', {
                    currency: preferredCurrency ?? 'IDR',
                    style: 'currency'
                  })}
                </td>
              </tr>
            ))}
          </table>
        </div>
      )}
      {detailQuiz?.prize_type === 'LINK' && (
        <div className="mt-4">
          <div className="text-lg font-semibold">{t('quiz.quizPrize')}</div>
          {detailQuiz?.winner_link_url !== null &&
            detailQuiz?.winner_link_url[0] === '' && (
              <div className="rounded-lg overflow-hidden relative flex justify-center items-center bg-seeds-button-green mt-2">
                {detailQuiz?.winner_image_url[0] !== '' ? (
                  <img
                    src={detailQuiz?.winner_image_url[0]}
                    alt=""
                    width={200}
                    height={200}
                    className="object-contain w-full max-h-[500px]"
                  />
                ) : (
                  <div className="w-full h-[200px] animate-pulse-slow bg-seeds-button-green border-2 border-seeds-green" />
                )}
                <div className="absolute top-1 flex justify-center items-center gap-2 text-md w-[100px] h-[30px] text-center rounded-full font-semibold text-white bg-seeds-button-green border-2 border-seeds-green">
                  <div className="flex justify-center items-center w-[25px] h-[25px]">
                    <Image
                      src={FirstMedal}
                      alt={`1-medal`}
                      width={200}
                      height={200}
                      className="object-contain w-full max-h-[500px]"
                    />
                  </div>
                  1st
                </div>
              </div>
            )}
          {detailQuiz?.winner_link_url !== null &&
            detailQuiz?.winner_link_url[0] !== '' && (
              <a
                href={detailQuiz?.winner_link_url[0] ?? ''}
                target="_blank"
                className="rounded-lg overflow-hidden relative flex justify-center items-center bg-seeds-button-green animate-shadow-move mt-2"
              >
                {detailQuiz?.winner_image_url[0] !== '' ? (
                  <img
                    src={detailQuiz?.winner_image_url[0]}
                    alt=""
                    width={200}
                    height={200}
                    className="object-contain w-full max-h-[500px]"
                  />
                ) : (
                  <div className="w-full h-[200px] animate-pulse-slow bg-seeds-button-green border-2 border-seeds-green" />
                )}
                <div className="absolute top-1 flex justify-center items-center gap-2 text-md w-[100px] h-[30px] text-center rounded-full font-semibold text-white bg-seeds-button-green border-2 border-seeds-green">
                  <div className="flex justify-center items-center w-[25px] h-[25px]">
                    <Image
                      src={FirstMedal}
                      alt={`1-medal`}
                      width={200}
                      height={200}
                      className="object-contain w-full max-h-[500px] cursor-pointer"
                    />
                  </div>
                  1st
                </div>
              </a>
            )}
          {detailQuiz?.winner_link_url === null && (
            <div className="rounded-lg overflow-hidden relative flex justify-center items-center bg-seeds-button-green">
              {detailQuiz?.winner_image_url[0] !== '' ? (
                <img
                  src={detailQuiz?.winner_image_url[0]}
                  alt=""
                  width={200}
                  height={200}
                  className="object-contain w-full max-h-[500px]"
                />
              ) : (
                <div className="w-full h-[200px] animate-pulse-slow bg-seeds-button-green border-2 border-seeds-green" />
              )}
              <div className="absolute top-1 flex justify-center items-center gap-2 text-md w-[100px] h-[30px] text-center rounded-full font-semibold text-white bg-seeds-button-green border-2 border-seeds-green">
                <div className="flex justify-center items-center w-[25px] h-[25px]">
                  <Image
                    src={FirstMedal}
                    alt={`1-medal`}
                    width={200}
                    height={200}
                    className="object-contain w-full max-h-[500px] cursor-pointer"
                  />
                </div>
                1st
              </div>
            </div>
          )}
          <div className="flex flex-col gap-2 justify-start items-center mt-4 pb-8 md:pb-0 md:grid md:grid-cols-2 w-full">
            {detailQuiz?.winner_image_url
              ?.slice(1)
              .map((item: string | number, i: number) => {
                const adjustedIndex = i + 1;
                const imageUrl = detailQuiz?.winner_image_url[adjustedIndex];
                // const linkUrl = detailQuiz?.winner_link_url ? detailQuiz?.winner_link_url[adjustedIndex] : null;
                const linkUrl =
                  Array.isArray(detailQuiz?.winner_link_url) &&
                  adjustedIndex >= 0 &&
                  adjustedIndex < detailQuiz.winner_link_url.length
                    ? detailQuiz.winner_link_url[adjustedIndex]
                    : null;
                const isPrimary = adjustedIndex === 1;
                // const titleSuffix = (['nd', 'rd'][i].length > 0) || 'th';
                const suffixArray = ['nd', 'rd'];
                const titleSuffix =
                  i >= 0 && i < suffixArray.length ? suffixArray[i] : 'th';
                const containerClasses =
                  'w-full h-[150px] flex justify-center items-center border-2 rounded-lg overflow-hidden';
                const emptyClasses =
                  'w-full h-[150px] rounded-lg border-2 flex justify-center items-center overflow-hidden border-2 border-seeds-button-green';

                return (
                  <div
                    key={adjustedIndex}
                    className={`${
                      isPrimary ? 'text-md' : 'text-sm'
                    } flex flex-col justify-center items-center w-full relative text-white`}
                  >
                    <div className="h-[150px] w-full flex justify-center items-center rounded-lg bg-seeds-button-green">
                      {imageUrl.length > 0 ? (
                        linkUrl !== null && linkUrl !== '' ? (
                          <a
                            href={linkUrl}
                            target="_blank"
                            className={`${containerClasses} cursor-pointer shadow-2xl animate-shadow-move`}
                          >
                            <img
                              src={imageUrl}
                              alt=""
                              width={200}
                              height={200}
                              className="object-contain w-full border-2 border-seeds-button-green"
                            />
                          </a>
                        ) : (
                          <div className={containerClasses}>
                            <img
                              src={imageUrl}
                              alt=""
                              width={200}
                              height={200}
                              className="object-contain w-full border-2 border-seeds-button-green"
                            />
                          </div>
                        )
                      ) : linkUrl !== null && linkUrl !== '' ? (
                        <a
                          href={linkUrl}
                          target="_blank"
                          className={emptyClasses}
                        />
                      ) : (
                        <div className={emptyClasses} />
                      )}
                    </div>
                    <div className="absolute top-1 flex justify-center items-center gap-2 text-md w-[100px] h-[30px] text-center rounded-full font-semibold border-2 border-seeds-green bg-seeds-button-green">
                      {(adjustedIndex === 1 || adjustedIndex === 2) && (
                        <div className="flex justify-center items-center w-[25px] h-[25px]">
                          <Image
                            src={adjustedIndex === 1 ? SecondMedal : ThirdMedal}
                            alt={`${adjustedIndex + 1}${titleSuffix}`}
                            width={200}
                            height={200}
                            className="object-contain w-full max-h-[500px] cursor-pointer"
                          />
                        </div>
                      )}
                      {adjustedIndex + 1}
                      {titleSuffix}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </>
  );
};

export default QuizWinnerSection;
