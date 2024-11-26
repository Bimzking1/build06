/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
'use-client';
import MicrositeQuizLayout from '@/components/microsite-quiz/micrositeQuizLayout';
import AnswerButtonComponent from '@/components/quiz/answer-button.component';
import QuizButton from '@/components/quiz/button.component';
import withAuth from '@/helpers/withAuth';
import useSoundEffect from '@/hooks/useSoundEffects';
import { getQuizReview } from '@/repository/quiz.repository';
import i18n from '@/utils/common/i18n';
import { type QuizReviewDTO } from '@/utils/interfaces/quiz.interfaces';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import 'swiper/css';
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';

const Review = () => {
  const router = useRouter();
  const id = router.query.id;
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [QuizReview, setQuizReview] = useState<QuizReviewDTO | null>(null);
  const fetchQuizReview = async (): Promise<void> => {
    try {
      const response = await getQuizReview(id as string);
      setQuizReview(response);
    } catch (error) {
      toast(`ERROR fetch quiz review ${error as string}`);
    }
  };

  const baseUrl =
    process.env.NEXT_PUBLIC_DOMAIN ?? 'https://user-dev-gcp.seeds.finance';
  const audioConfig = {
    routeName: router.pathname,
    audioFiles: [
      {
        name: baseUrl + '/assets/quiz/sound/Quiz_answer_review.mp3',
        isAutoPlay: true,
        isLoop: true
      }
    ]
  };

  useSoundEffect(audioConfig);

  useEffect(() => {
    if (typeof id === 'string') {
      void fetchQuizReview();
    }
  }, [id]);

  return (
    <MicrositeQuizLayout hideBackButton enableScroll>
      <div className="w-full h-full flex flex-col items-center font-poppins px-4 gap-4">
        <div className="w-full flex flex-row justify-center items-center gap-5">
          <div className="w-full bg-white relative rounded-full h-5 shadow-md">
            <div
              className="bg-[#67EB00] absolute h-5 rounded-full inset-0 transition-all"
              style={{
                width: `${
                  ((activeIndex + 1) / (QuizReview?.data.length ?? 1)) * 100
                }%`
              }}
            />
          </div>
          <div className="text-white text-xl">
            {activeIndex + 1}/{QuizReview?.data.length}
          </div>
        </div>
        <div className="max-w-full h-5/6 sm:h-fit">
          <Swiper
            spaceBetween={50}
            slidesPerView={1}
            // centeredSlides={true}
            onActiveIndexChange={swiper => {
              setActiveIndex(swiper.activeIndex);
            }}
          >
            {QuizReview?.data.map((item, i) => {
              const selectedData =
                item.data[i18n.language === 'id' ? 'id' : 'en'];
              const optionsArray = Object.values(selectedData?.options);
              return (
                <SwiperSlide key={i.toString()}>
                  <div className="w-full flex flex-col items-center bg-white rounded-3xl font-poppins p-4">
                    <div className="text-base text-[#262626] text-start w-full">
                      {selectedData.question}
                    </div>
                    <div className="w-full flex flex-col gap-4 mt-4">
                      {optionsArray.map((opt, j) => {
                        const prefix = ['A', 'B', 'C', 'D'];
                        return (
                          <AnswerButtonComponent
                            key={j.toString()}
                            title={`${prefix[j]}. ${opt?.option}`}
                            selected={
                              item?.answer_id === 0
                                ? true
                                : j + 1 === item?.answer_id
                            }
                            onClick={() => {}}
                            spillAnswer={true}
                            disabled={true}
                            rightAnswer={
                              item?.answer_id === 0 ? false : opt?.is_correct
                            }
                          />
                        );
                      })}
                    </div>
                    <div className="w-full flex flex-col gap-1.5 mt-4">
                      <div className="text-sm text-[#3AC4A0] font-semibold">
                        {t('quiz.explanation')}
                      </div>
                      <div
                        className="text-sm text-[#7C7C7C]"
                        dangerouslySetInnerHTML={{
                          __html: selectedData.description as string
                        }}
                      />
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
            <Paging />
          </Swiper>
        </div>
        <div className="w-full sm:w-1/3">
          <QuizButton
            title={t('button.label.done')}
            background="#67EB00"
            darkBackground="#4EC307"
            onClick={() => {
              void router.push(`/microsite-quiz/${id}/done`);
            }}
          />
        </div>
      </div>
    </MicrositeQuizLayout>
  );
};

const Paging = () => {
  const swiper = useSwiper();
  return (
    <div className="w-full lg:flex flex-row gap-4 items-center mt-2 justify-center hidden">
      <button
        onClick={() => {
          swiper.slidePrev();
        }}
      >
        <ChevronLeftIcon className="h-4 w-4 text-white" />
      </button>
      {swiper.slides.map((_, i) => (
        <button
          key={i}
          className={`${
            swiper.activeIndex === i
              ? 'text-[#3AC4A0] bg-[#DCFCE4]'
              : 'text-white'
          } text-xs w-6 h-6 text-center rounded-full transition-all`}
          onClick={() => {
            swiper.slideTo(i);
          }}
        >
          {i + 1}
        </button>
      ))}
      <button
        onClick={() => {
          swiper.slideNext();
        }}
      >
        <ChevronRightIcon className="h-4 w-4 text-white" />
      </button>
    </div>
  );
};

export default withAuth(Review);
