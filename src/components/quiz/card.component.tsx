import { isGuest } from '@/helpers/guest';
import type { IQuiz } from '@/utils/interfaces/quiz.interfaces';
import { ShareIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import TopQuizEmpty from '../../assets/play/quiz/top-quiz-empty.jpg';
import ModalShareQuiz from '../popup/ModalShareQuiz';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
const QuizCard = ({ item, currency }: { item: IQuiz; currency: string }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isShareModal, setIsShareModal] = useState<boolean>(false);

  return (
    <>
      {isShareModal && (
        <ModalShareQuiz
          onClose={() => {
            setIsShareModal(prev => !prev);
          }}
          url={item?.id ?? ''}
          playId={item?.quiz_unique_id ?? ''}
        />
      )}
      <div
        key={item.id}
        className="rounded-t-lg bg-gradient-to-r from-[#106B6E] to-[#96F7C1]"
      >
        <div className="w-full max-h-60">
          <Image
            src={
              // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
              item.banner?.image_url ? item.banner?.image_url : TopQuizEmpty
            }
            alt="banner"
            width={1000}
            height={500}
            className="object-cover h-44 bg-blue-gray-50 rounded-t-lg"
          />
        </div>
        <div className="bg-gradient-to-r from-[#106B6E] to-[#96F7C1] w-full font-poppins">
          <div className="flex flex-row justify-between px-4 py-2 border-b border-dashed border-white">
            <div className="text-white text-[12.5px] font-semibold">
              {item.name}
            </div>
            <button
              onClick={async () => {
                if (isGuest()) {
                  await router.push('/auth');
                } else {
                  setIsShareModal(true);
                }
              }}
              className="text-xs md:text-[10.71px] text-seeds-button-green flex items-center justify-center py-2 rounded-full font-semibold px-4 md:px-2 lg:px-4 w-fit md:w-32 lg:w-fit"
            >
              <ShareIcon width={20} height={20} className="text-white" />
            </button>
          </div>
          <div className="flex flex-row justify-between items-center px-2 py-2 pb-4">
            <div className="flex flex-row items-center gap-3 text-white text-xs lg:text-sm">
              <div>
                <div className="text-[8.93px]">{t('quiz.entryFee')}</div>
                <div className="font-semibold text-[10.71px]">
                  {item.admission_fee === 0
                    ? t('quiz.free')
                    : item.admission_fee.toLocaleString('id-ID', {
                        currency: currency?.length > 0 ? currency : 'IDR',
                        style: 'currency'
                      })}
                </div>
              </div>
              <div>
                <div className="text-[8.93px]">{t('quiz.duration')}</div>
                <div className="font-semibold text-[10.71px]">
                  {t('quiz.dayDuration', {
                    duration: Math.floor(
                      moment(item.ended_at).diff(
                        moment(item.started_at),
                        'days',
                        true
                      )
                    )
                  })}
                </div>
              </div>
              <div>
                <div className="text-[8.93px]">{t('quiz.players')}</div>
                <div className="font-semibold text-[10.71px]">
                  {item.participants}
                </div>
              </div>
            </div>
            <div>
              <button
                onClick={() => {
                  if (!item.is_played && item.status === 'ENDED') {
                    router
                      .push(`/play/quiz/${item.id}/leaderboard`)
                      .catch(error => {
                        toast.error(`${error as string}`);
                      });
                  } else if (item.is_played || item.status === 'ENDED') {
                    router.push(`/play/quiz/${item.id}/done`).catch(error => {
                      toast.error(`${error as string}`);
                    });
                  } else {
                    router.push(`/play/quiz/${item.id}`).catch(error => {
                      toast.error(`${error as string}`);
                    });
                  }
                }}
                className="bg-white text-sm md:text-[10.71px] lg:w-[76.77px] lg:h-[25px] text-seeds-button-green flex items-center justify-center py-2 rounded-full font-semibold w-32"
              >
                {item.is_played || item.status === 'ENDED'
                  ? t('quiz.leaderboard')
                  : t('quiz.play')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizCard;
