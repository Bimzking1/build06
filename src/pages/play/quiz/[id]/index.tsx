/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use-client';

import ModalQuizWinnerAlert from '@/components/popup/ModalQuizWinnerAlert';
import ModalShareQuiz from '@/components/popup/ModalShareQuiz';
import PromoCode from '@/components/promocode/promoCode';
import TrackerEvent from '@/helpers/GTM';
import { isGuest } from '@/helpers/guest';
import withRedirect from '@/helpers/withRedirect';
import { getUserInfo } from '@/repository/profile.repository';
import {
  getQuizById,
  validateInvitationCode
} from '@/repository/quiz.repository';
import { getTransactionSummary } from '@/repository/seedscoin.repository';
import LanguageContext from '@/store/language/language-context';
import {
  selectPromoCodeValidationResult,
  setPromoCodeValidationResult
} from '@/store/redux/features/promo-code';
import i18n from '@/utils/common/i18n';
import { type IDetailQuiz } from '@/utils/interfaces/quiz.interfaces';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { ShareIcon } from '@heroicons/react/24/outline';
import { Switch } from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import goldSeedsCoin from '../../../../../public/assets/images/goldHome.svg';
import ListQuizEmpty from '../../../../assets/play/quiz/list-quiz-empty.jpg';
import QuizWinnerSection from './section/quiz-winner';

const QuizDetail = (): React.ReactElement => {
  const router = useRouter();
  const id = router.query.id;
  const count = useRef(0);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [detailQuiz, setDetailQuiz] = useState<IDetailQuiz>();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [invitationCode, setInvitationCode] = useState<string>('');
  const [isShareModal, setIsShareModal] = useState<boolean>(false);
  const [isShowWinnerAlert, setIsShowWinnerAlert] = useState<boolean>(false);
  const [winningPosition, setWinningPosition] = useState<number>(0);
  const [winningLink, setWinningLink] = useState<string>('');
  const [ordinalName, setOrdinalName] = useState<string>('');
  const languageCtx = useContext(LanguageContext);
  const currentUnixTime = Date.now() / 1000;
  const expiredUnixTime = parseInt(
    window.localStorage.getItem('expiresAt') as string
  );
  const [useCoins, setUseCoins] = useState<boolean>(false);
  const [totalAvailableCoins, setTotalAvailableCoins] = useState<number>(0);

  const handleGetSeedsCoin = async (): Promise<void> => {
    try {
      const dataCoins = await getTransactionSummary();
      setTotalAvailableCoins(dataCoins?.data?.total_available_coins || 0);
    } catch (error: any) {
      toast.error(
        `Error get data coins: ${error?.response?.data?.message as string}`
      );
    }
  };

  useEffect(() => {
    if (
      window.localStorage.getItem('accessToken') === null ||
      expiredUnixTime < currentUnixTime
    ) {
      window.localStorage.removeItem('accessToken');
      window.localStorage.removeItem('expiresAt');
      window.localStorage.removeItem('refreshToken');
    }
  }, []);

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});

    if (promoCodeValidationResult?.id !== id) {
      dispatch(setPromoCodeValidationResult(0));
    }
  }, []);

  const promoCodeValidationResult = useSelector(
    selectPromoCodeValidationResult
  );

  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const handleInvitationCode = async (): Promise<void> => {
    try {
      if (detailQuiz?.is_need_invitation_code && invitationCode !== '') {
        const validationResponse = await validateInvitationCode(
          detailQuiz?.id ?? '',
          invitationCode
        );

        if (!validationResponse.is_valid) {
          toast.error('Invalid invitation code');
        } else {
          router.push(
            `/play/quiz/${
              id as string
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            }/welcome?invitationCode=${invitationCode}&useCoins=${useCoins}`
          );
        }
      }
    } catch (error) {
      toast.error('Error joining tournament');
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
        toast(`ERROR fetch quiz ${error as string}`);
      } finally {
        setLoading(false);
      }
    },
    [id]
  );

  useEffect(() => {
    if (id) {
      getDetail(userInfo?.preferredCurrency ?? '');
    }
    if (userInfo?.preferredCurrency !== undefined) {
      handleGetSeedsCoin();
    }
  }, [id, userInfo]);

  useEffect(() => {
    if (
      detailQuiz !== undefined &&
      userInfo !== undefined &&
      count.current === 0
    ) {
      const formattedText = (text: string): string => {
        return text.replaceAll(/[^a-zA-Z0-9_-]/g, '_');
      };
      TrackerEvent({
        event: 'SW_quiz_page_detail',
        quizData: {
          ...detailQuiz,
          name: formattedText(detailQuiz?.name)
        },
        userData: userInfo
      });
      count.current = 1;
    }
  }, [detailQuiz]);

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

  if (detailQuiz === undefined && loading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <div className="animate-spinner w-10 h-10" />
      </div>
    );
  }

  return (
    <>
      {isShareModal && (
        <ModalShareQuiz
          onClose={() => {
            setIsShareModal(prev => !prev);
          }}
          url={detailQuiz?.id ?? ''}
          playId={detailQuiz?.quiz_unique_id ?? ''}
        />
      )}
      {isShowWinnerAlert && (
        <ModalQuizWinnerAlert
          onClose={() => {
            setIsShowWinnerAlert(prev => !prev);
          }}
          quizName={detailQuiz?.name ?? ''}
          winningPosition={winningPosition ?? 0}
          ordinalName={ordinalName ?? ''}
          language={languageCtx?.language ?? 'EN'}
          winningLink={winningLink}
        />
      )}
      <Image
        src={
          detailQuiz?.banner?.image_url
            ? detailQuiz.banner.image_url
            : ListQuizEmpty
        }
        alt={detailQuiz?.name ?? ''}
        height={1000}
        width={1000}
        className="object-cover w-full rounded-3xl"
      />
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 mt-4 font-poppins">
        <div className="col-span-2 w-full bg-white rounded-xl px-8 py-4">
          <div className="flex items-center justify-center">
            <div className="grid grid-cols-3 w-full lg:w-3/4 xl:w-2/3 border border-[#E9E9E9] rounded-xl">
              <div className="flex flex-col justify-center items-center p-4 border-r border-[#E9E9E9]">
                <div className="text-xl font-semibold">
                  {detailQuiz?.total_questions}
                </div>
                <div className="text-sm text-[#7C7C7C]">
                  {t('quiz.questions')}
                </div>
              </div>
              <div className="flex flex-col justify-center items-center p-4 border-r border-[#E9E9E9]">
                <div className="text-xl font-semibold">
                  {detailQuiz?.total_played}
                </div>
                <div className="text-sm text-[#7C7C7C]">{t('quiz.played')}</div>
              </div>
              <div className="flex flex-col justify-center items-center p-4">
                <div className="text-xl font-semibold text-center">
                  {t('quiz.dayDuration', {
                    duration: Math.floor(
                      moment(detailQuiz?.ended_at).diff(
                        moment(detailQuiz?.started_at),
                        'days',
                        true
                      )
                    )
                  })}
                </div>
                <div className="text-sm text-[#7C7C7C]">
                  {t('quiz.duration')}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-lg font-semibold">{t('quiz.quizPeriod')}</div>
            <div className="text-lg text-[#7C7C7C]">
              {moment(detailQuiz?.started_at).format('D MMM YYYY, h a')} Jakarta
              - {moment(detailQuiz?.ended_at).format('D MMM YYYY, h a')} Jakarta
            </div>
          </div>
          <div className="mt-4">
            <div className="text-lg font-semibold">{t('quiz.tnc')}</div>

            <div
              className="text-lg text-[#7C7C7C]"
              dangerouslySetInnerHTML={{
                __html: detailQuiz?.tnc
                  ? detailQuiz?.tnc[
                      i18n.language === 'id' ? 'id' : 'en'
                    ].replace(/\n/g, '<br />')
                  : '-'
              }}
            />
          </div>

          {/* Winner Section */}
          {detailQuiz !== null && detailQuiz !== undefined && (
            <QuizWinnerSection
              detailQuiz={detailQuiz}
              preferredCurrency={userInfo?.preferredCurrency ?? 'IDR'}
            />
          )}

          <div className="mt-4 flex flex-row gap-8">
            {detailQuiz?.sponsors?.image_url ? (
              <div className="flex flex-col justify-center items-center gap-4">
                <div className="text-lg font-semibold">
                  {t('quiz.sponsors')}
                </div>
                <Image
                  src={detailQuiz?.sponsors?.image_url}
                  alt=""
                  width={200}
                  height={200}
                  className="object-contain max-h-16 max-w-16"
                />
              </div>
            ) : null}
            {detailQuiz?.communities?.image_url ? (
              <div className="flex flex-col justify-center items-center gap-4">
                <div className="text-lg font-semibold">
                  {t('quiz.community')}
                </div>
                <Image
                  src={detailQuiz?.communities?.image_url}
                  alt=""
                  width={200}
                  height={200}
                  className="object-contain max-h-16 max-w-16"
                />
              </div>
            ) : null}
          </div>
        </div>
        <div className="w-full h-[300px] bg-white rounded-xl p-4 mb-32 md:mb-0">
          <div
            className={`flex flex-row justify-between items-start gap-2 ${
              (detailQuiz?.admission_fee ?? 0) > 0 ? 'mt-4' : ''
            }`}
          >
            <div className="text-2xl lg:text-xl xl:text-2xl font-semibold">
              {detailQuiz?.name}
            </div>
            <button
              onClick={() => {
                setIsShareModal(true);
              }}
            >
              <ShareIcon width={24} height={24} />
            </button>
          </div>
          <div className="my-4">
            {userInfo !== undefined && (detailQuiz?.admission_fee ?? 0) > 0 && (
              <PromoCode
                userInfo={userInfo}
                id={id as string}
                spotType={'Paid Quiz'}
                useCoins={useCoins}
              />
            )}
          </div>
          <div className="my-4">
            {detailQuiz?.is_need_invitation_code && (
              <div>
                <input
                  type="text"
                  value={invitationCode}
                  onChange={e => {
                    setInvitationCode(e.target.value);
                  }}
                  placeholder={`${t('quiz.invitationCodePlaceholder')}`}
                  className="w-full border p-2 rounded-md mt-2"
                />
              </div>
            )}
          </div>
          <div className="text-sm text-[#7C7C7C] mt-2.5">
            {t('quiz.entranceFee')}
          </div>
          <div
            className={`${
              promoCodeValidationResult &&
              localStorage.getItem('accessToken') !== null
                ? 'text-[#7C7C7C] line-through decoration-2 text-md'
                : 'text-black text-xl font-semibold'
            }`}
          >
            {detailQuiz?.admission_fee === 0
              ? t('quiz.free')
              : detailQuiz?.admission_fee?.toLocaleString('id-ID', {
                  currency: userInfo?.preferredCurrency ?? 'IDR',
                  style: 'currency'
                })}
          </div>
          {promoCodeValidationResult !== 0 &&
            localStorage.getItem('accessToken') !== null && (
              <div className="font-semibold text-xl">
                {detailQuiz?.admission_fee === 0
                  ? t('quiz.free')
                  : (
                      promoCodeValidationResult?.response?.final_price ?? 0
                    ).toLocaleString('id-ID', {
                      currency: userInfo?.preferredCurrency ?? 'IDR',
                      style: 'currency'
                    })}
              </div>
            )}
          <div className="flex flex-row items-center justify-between mt-2.5">
            <div className="flex flex-row items-center">
              <Image src={goldSeedsCoin} alt="Next" width={30} height={30} />
              <div className="text-xs text-[#7C7C7C] lg:px-2">
                {totalAvailableCoins > 0
                  ? t('quiz.seedsCoin', { data: totalAvailableCoins })
                  : `Coin cannot be redeemed`}
              </div>
            </div>
            <div>
              <Switch
                disabled={totalAvailableCoins <= 0}
                checked={useCoins}
                onChange={() => {
                  setUseCoins(!useCoins);
                  dispatch(setPromoCodeValidationResult(0));
                }}
              />
            </div>
          </div>
          <button
            disabled={loading}
            onClick={() => {
              if (localStorage.getItem('accessToken') !== null) {
                if (detailQuiz?.participant_status === 'JOINED') {
                  router.push(`/play/quiz/${id as string}/start`);
                } else {
                  if (detailQuiz?.is_need_invitation_code) {
                    handleInvitationCode();
                  } else {
                    router.push(
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      `/play/quiz/${id as string}/welcome?useCoins=${useCoins}`
                    );
                  }
                }
              } else if (
                localStorage.getItem('accessToken') === null &&
                isGuest()
              ) {
                router.push('/auth');
              } else {
                withRedirect(router, { qi: id as string }, '/auth');
              }
            }}
            className={`text-white px-10 py-2 rounded-full font-semibold mt-4 w-full ${
              invitationCode === '' &&
              detailQuiz?.is_need_invitation_code === true
                ? 'bg-[#7d7d7d]'
                : 'bg-seeds-button-green text-white'
            }`}
          >
            {loading
              ? t('quiz.loading')
              : detailQuiz?.participant_status === 'JOINED'
              ? t('quiz.start')
              : t('quiz.join')}
          </button>
        </div>
      </div>
    </>
  );
};

export default QuizDetail;
