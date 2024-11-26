/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use-client';

import IconCopy from '@/assets/play/tournament/copyLink.svg';
import IconWarning from '@/assets/play/tournament/miniWarning.svg';
import IconPrizes from '@/assets/play/tournament/seedsPrizes.svg';
import IconCircle from '@/assets/play/tournament/seedsPrizesCircle.svg';
import CountdownTimer from '@/components/play/CountdownTimer';
import Loading from '@/components/popup/Loading';
import ModalShareTournament from '@/components/popup/ModalShareTournament';
import PromoCode from '@/components/promocode/promoCode';
import { standartCurrency } from '@/helpers/currency';
import { isGuest } from '@/helpers/guest';
import { useIsStarted } from '@/helpers/useIsStarted';
import withRedirect from '@/helpers/withRedirect';
import {
  getPlayById,
  getPlayByIdWithAuth,
  joinTournament,
  validateInvitationCode
} from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { getTransactionSummary } from '@/repository/seedscoin.repository';
import LanguageContext from '@/store/language/language-context';
import {
  selectPromoCodeValidationResult,
  setPromoCodeValidationResult
} from '@/store/redux/features/promo-code';
import {
  type IDetailTournament,
  type UserInfo
} from '@/utils/interfaces/tournament.interface';
import { ShareIcon } from '@heroicons/react/24/outline';
import { Switch, Typography } from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import goldSeedsCoin from '../../../../../public/assets/images/goldHome.svg';
import FirstMedal from '../../../../assets/play/quiz/Medal-1.svg';
import SecondMedal from '../../../../assets/play/quiz/Medal-2.svg';
import ThirdMedal from '../../../../assets/play/quiz/Medal-3.svg';
import OtherMedal from '../../../../assets/play/quiz/Medal-4-10.svg';

const TournamentDetail: React.FC = () => {
  const router = useRouter();
  const id = router.query.id;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDetailAuth, setLoadingDetailAuth] = useState<boolean>(false);
  const [detailTournament, setDetailTournament] = useState<IDetailTournament>();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [isShareModal, setIsShareModal] = useState<boolean>(false);
  const languageCtx = useContext(LanguageContext);
  const [invitationCode, setInvitationCode] = useState<string>('');
  const [validInvit, setValidInvit] = useState<boolean>(false);
  const [useCoins, setUseCoins] = useState<boolean>(false);
  const [totalAvailableCoins, setTotalAvailableCoins] = useState<number>(0);
  const accessToken = localStorage.getItem('accessToken');
  const isStarted = useIsStarted(detailTournament?.play_time);

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
      if (detailTournament?.is_need_invitation_code && invitationCode !== '') {
        const validationResponse = await validateInvitationCode(
          detailTournament?.id ?? '',
          invitationCode
        );

        if (!validationResponse.is_valid) {
          toast.error('Invalid invitation code');
          setValidInvit(false);
        } else {
          setValidInvit(true);
          router.push(
            `/play/tournament/${
              id as string
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            }/payment?invitationCode=${invitationCode}&useCoins=${useCoins}`
          );
        }
      }
    } catch (error) {
      toast.error('Error joining tournament');
    }
  };

  const handleInvitationCodeFree = async (): Promise<void> => {
    try {
      if (detailTournament?.is_need_invitation_code && invitationCode !== '') {
        const validationResponse = await validateInvitationCode(
          detailTournament?.id ?? '',
          invitationCode
        );

        if (!validationResponse.is_valid) {
          toast.error('Invalid invitation code');
          setValidInvit(false);
        } else {
          setValidInvit(true);
          const response = await joinTournament(
            detailTournament?.id ?? '',
            userInfo?.preferredCurrency ?? '',
            '',
            '',
            '',
            '',
            invitationCode ?? '',
            false
          );
          if (response) {
            router.push(`/play/tournament/${id as string}/home`);
          }
        }
      }
    } catch (error) {
      toast.error('Error joining tournament');
    }
  };

  const handleJoinFreeTournament = async (): Promise<void> => {
    try {
      const response = await joinTournament(
        detailTournament?.id ?? '',
        userInfo?.preferredCurrency ?? '',
        '',
        '',
        '',
        '',
        '',
        false
      );
      if (response) {
        if (isStarted) {
          await router.push(`/play/tournament/${id as string}/home`);
        } else {
          toast.success('Join tournament successful');
        }
      }
    } catch (error) {
      toast.error('Error joining tournament');
    }
  };

  const getDetail = useCallback(async () => {
    try {
      setLoading(true);
      const resp: IDetailTournament = await getPlayById(id as string);
      setDetailTournament(resp);
    } catch (error) {
      toast(`Error fetch tournament ${error as string}`);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const getDetailWithAuth = useCallback(async () => {
    try {
      setLoadingDetailAuth(true);
      const resp: IDetailTournament = await getPlayByIdWithAuth(id as string);
      setDetailTournament(resp);
    } catch (error) {
      toast(`Error fetch tournament ${error as string}`);
    } finally {
      setLoadingDetailAuth(false);
    }
  }, [id]);

  useEffect(() => {
    if (id !== null && id !== undefined) {
      if (accessToken === null) {
        getDetail();
      } else {
        getDetailWithAuth();
      }
    }
    if (userInfo?.preferredCurrency !== undefined) {
      handleGetSeedsCoin();
    }
  }, [id, userInfo]);
  const handleCopyClick = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const textToCopy = `${detailTournament?.play_id}`;
    await navigator.clipboard.writeText(textToCopy).then(() => {
      toast('Play ID copied!');
    });
  };

  const handleRedirectPage = async (): Promise<void> => {
    if (localStorage.getItem('accessToken') !== null) {
      if (detailTournament?.is_joined === true) {
        if (isStarted) {
          router.push(`/play/tournament/${id as string}/home`);
        }
      } else {
        if (detailTournament?.admission_fee === 0) {
          if (isStarted) {
            if (detailTournament?.is_need_invitation_code) {
              if (invitationCode !== '') {
                handleInvitationCodeFree();
              }
            } else {
              await handleJoinFreeTournament();
            }
          } else {
            try {
              await handleJoinFreeTournament();
              window.location.reload();
            } catch (error) {
              toast.error(`Error joining free tournament: ${error as string}`);
            }
          }
        } else {
          if (detailTournament?.is_need_invitation_code) {
            if (invitationCode !== '') {
              handleInvitationCode();
            }
          } else {
            if (!validInvit) {
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              await router.push(
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                `/play/tournament/${id as string}/payment?useCoins=${useCoins}`
              );
            }
          }
        }
      }
    } else if (localStorage.getItem('accessToken') === null && isGuest()) {
      router.push('/auth');
    } else {
      withRedirect(router, { ti: id as string }, '/auth');
    }
  };

  const isDisabled = (): boolean => {
    if (localStorage.getItem('accessToken') !== null) {
      if (detailTournament?.is_joined === true) {
        if (isStarted) {
          return false;
        } else {
          return true;
        }
      } else {
        if (detailTournament?.admission_fee === 0) {
          if (isStarted) {
            if (detailTournament?.is_need_invitation_code) {
              if (invitationCode !== '') {
                return false;
              } else {
                return true;
              }
            } else {
              return false;
            }
          } else {
            return false;
          }
        } else {
          if (detailTournament?.is_need_invitation_code) {
            if (invitationCode !== '') {
              return false;
            } else {
              return true;
            }
          } else {
            if (!validInvit) {
              return false;
            } else {
              return true;
            }
          }
        }
      }
    } else if (localStorage.getItem('accessToken') === null && isGuest()) {
      return false;
    } else {
      return false;
    }
  };

  const buttonColor = (): string => {
    if (localStorage.getItem('accessToken') !== null) {
      if (detailTournament?.is_joined === true) {
        if (isStarted) {
          return 'bg-seeds-button-green text-white';
        } else {
          return 'bg-[#7d7d7d] text-[#262626]';
        }
      } else {
        if (detailTournament?.admission_fee === 0) {
          if (isStarted) {
            if (detailTournament?.is_need_invitation_code) {
              if (invitationCode !== '') {
                return 'bg-seeds-button-green text-white';
              } else {
                return 'bg-[#7d7d7d] text-[#262626]';
              }
            } else {
              return 'bg-seeds-button-green text-white';
            }
          } else {
            return 'bg-seeds-button-green text-white';
          }
        } else {
          if (detailTournament?.is_need_invitation_code) {
            if (invitationCode !== '') {
              return 'bg-seeds-button-green text-white';
            } else {
              return 'bg-[#7d7d7d] text-[#262626]';
            }
          } else {
            if (!validInvit) {
              return 'bg-seeds-button-green text-white';
            } else {
              return 'bg-[#7d7d7d] text-[#262626]';
            }
          }
        }
      }
    } else if (localStorage.getItem('accessToken') === null && isGuest()) {
      return 'bg-seeds-button-green text-white';
    } else {
      return 'bg-seeds-button-green text-white';
    }
  };

  return (
    <>
      {isShareModal && (
        <ModalShareTournament
          onClose={() => {
            setIsShareModal(prev => !prev);
          }}
          url={detailTournament?.id ?? ''}
          playId={detailTournament?.play_id ?? ''}
        />
      )}
      {detailTournament === undefined &&
        (accessToken !== null ? loadingDetailAuth : loading) && <Loading />}
      <div className="bg-gradient-to-bl from-[#50D4B2] to-[#E2E2E2] flex flex-col justify-center items-center relative overflow-hidden h-[420px] rounded-xl font-poppins">
        <div className="absolute bottom-[-25px] text-center">
          <Typography className="text-[26px] font-semibold font-poppins">
            {detailTournament?.name}
          </Typography>
          <div className="text-[14px] flex justify-center items-center gap-2 py-2">
            <Typography className="font-poppins">
              Play ID : {detailTournament?.play_id ?? '...'}
            </Typography>
            <button onClick={handleCopyClick}>
              <Image alt="" src={IconCopy} className="w-[20px]" />
            </button>
          </div>
          <Typography className="text-xl font-semibold font-poppins">
            {t('tournament.detailBannerTotalRewards')}
          </Typography>
          <Typography className="text-[34px] text-white font-semibold font-poppins">
            {detailTournament?.fixed_prize === 0
              ? t('tournament.free')
              : // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                `${userInfo?.preferredCurrency ?? 'IDR'}${standartCurrency(
                  detailTournament?.fixed_prize ?? 0
                ).replace('Rp', '')}`}
          </Typography>
          <Image alt="" src={IconPrizes} className="w-[250px]" />
        </div>
        <Image
          alt=""
          src={IconCircle}
          className="hidden xl:flex w-[250px] absolute bottom-[-20px] left-[-20px]"
        />
      </div>
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-4 mt-4 font-poppins">
        <div className="col-span-2 w-full bg-white rounded-xl px-8 py-4">
          {detailTournament !== undefined && (
            <div className="mt-4 flex justify-between">
              <div className="flex flex-col">
                <Typography className="text-lg font-semibold font-poppins">
                  {isStarted
                    ? t('tournament.detailRemaining')
                    : t('tournament.detailStarting')}
                </Typography>
                <CountdownTimer
                  deadline={
                    isStarted
                      ? detailTournament?.end_time
                        ? detailTournament.end_time.toString()
                        : ''
                      : detailTournament?.play_time
                      ? detailTournament.play_time.toString()
                      : ''
                  }
                />
              </div>
              <button className="bg-[#DCFCE4] rounded-full w-fit h-fit p-2">
                <ShareIcon
                  onClick={() => {
                    setIsShareModal(true);
                  }}
                  width={24}
                  height={24}
                  className="text-[#3AC4A0]"
                />
              </button>
            </div>
          )}
          <div className="mt-4">
            <Typography className="text-lg font-semibold font-poppins">
              {t('tournament.detailPeriod')}
            </Typography>
            <Typography className="text-lg text-[#7C7C7C] font-poppins">
              {moment(detailTournament?.play_time).format('D MMM YYYY, h a')}{' '}
              Jakarta -{' '}
              {moment(detailTournament?.end_time).format('D MMM YYYY, h a')}{' '}
              Jakarta
            </Typography>
          </div>
          <div className="mt-4 flex flex-row gap-8">
            {detailTournament?.sponsorship?.image_url ? (
              <div className="flex flex-col justify-center items-center gap-4">
                <Typography className="text-lg font-semibold font-poppins">
                  {'Sponsorship'}
                </Typography>
                <Image
                  src={detailTournament?.sponsorship?.image_url}
                  alt=""
                  width={1000}
                  height={1000}
                  className="object-contain max-h-16 max-w-16"
                />
              </div>
            ) : null}
            {detailTournament?.community?.image_url ? (
              <div className="flex flex-col justify-center items-center gap-4">
                <Typography className="text-lg font-semibold font-poppins">
                  {'Community'}
                </Typography>
                <Image
                  src={detailTournament?.community?.image_url}
                  alt=""
                  width={1000}
                  height={1000}
                  className="object-contain max-h-16 max-w-16"
                />
              </div>
            ) : null}
          </div>
          <div className="mt-4">
            <div className="mt-4">
              <Typography className="text-lg font-semibold font-poppins">
                {t('tournament.detailPrize')}
              </Typography>
              <table className="mt-2">
                {detailTournament?.prize?.slice(0, 3)?.map((item, index) => (
                  <tr key={index}>
                    <td className="inline-flex gap-2 border p-3 w-full">
                      <Image
                        src={
                          index === 0
                            ? FirstMedal
                            : index === 1
                            ? SecondMedal
                            : ThirdMedal
                        }
                        alt={`${index}-medal`}
                        width={200}
                        height={200}
                        className="object-contain max-h-5 max-w-5"
                      />
                      {t(
                        `tournament.${
                          index === 0
                            ? 'first'
                            : index === 1
                            ? 'second'
                            : 'third'
                        }`
                      )}
                    </td>
                    <td className="border p-3 w-full">
                      {userInfo?.preferredCurrency ?? 'IDR'}
                      {standartCurrency(item).replace('Rp', '')}
                    </td>
                  </tr>
                ))}
                {detailTournament?.prize?.slice(3, 10)?.map((item, index) => (
                  <tr key={index}>
                    <td className="inline-flex gap-2 border p-3 w-full">
                      <Image
                        src={OtherMedal}
                        alt={`${index}-medal`}
                        width={200}
                        height={200}
                        className="object-contain max-h-5 max-w-5"
                      />
                      {`${index + 4}th`}
                    </td>
                    <td className="border p-3 w-full">
                      {userInfo?.preferredCurrency ?? 'IDR'}
                      {standartCurrency(item).replace('Rp', '')}
                    </td>
                  </tr>
                ))}
              </table>
            </div>
            <div className="mt-4">
              <Typography className="text-lg font-semibold font-poppins">
                {t('tournament.participants')}
              </Typography>
              <div className="flex gap-2">
                <Typography className="text-lg text-[#7C7C7C] font-poppins font-semibold">
                  {detailTournament?.total_participants} /{' '}
                  {detailTournament?.max_participant}
                </Typography>
              </div>
            </div>
            <div className="w-full flex justify-start mt-2 gap-2">
              {detailTournament?.participants
                ?.slice(0, 5)
                .map((participant, index) => (
                  <div
                    key={index}
                    className="flex bg-white shadow-md rounded-full overflow-hidden w-[50px] h-[50px]"
                  >
                    <Image
                      src={participant.photo_url}
                      alt=""
                      width={100}
                      height={100}
                      className="object-contain h-full w-full"
                    />
                  </div>
                ))}
            </div>
          </div>
          <div className="mt-4">
            <Typography className="text-lg font-semibold font-poppins">
              {t('tournament.categoryAsset')}
            </Typography>
            <Typography className="text-lg text-[#7C7C7C] font-poppins">
              {detailTournament?.category}
            </Typography>
          </div>
          <div className="mt-4">
            <p className="text-lg font-semibold">
              {t('tournament.detailTerms')}
            </p>
            {languageCtx.language === 'ID' ? (
              <p className="text-[#7C7C7C]">{detailTournament?.tnc?.id}</p>
            ) : (
              <p className="text-[#7C7C7C]">{detailTournament?.tnc?.en}</p>
            )}
          </div>
          <div className="mt-4">
            <Typography className="text-lg font-semibold font-poppins">
              {t('tournament.detailResponsibility')}
            </Typography>
            <Typography className="text-[#7C7C7C] font-poppins">
              • {t('tournament.seedsResponsibility1')}
            </Typography>
            <Typography className="text-[#7C7C7C] font-poppins">
              • {t('tournament.seedsResponsibility2')}
            </Typography>
          </div>
        </div>
        <div className="w-full h-[300px] bg-white rounded-xl p-4 mb-32 md:mb-0">
          {userInfo !== undefined &&
            (detailTournament?.admission_fee ?? 0) > 0 && (
              <PromoCode
                userInfo={userInfo}
                id={id as string}
                spotType={'Paid Tournament'}
                useCoins={useCoins}
              />
            )}
          <div className="my-4">
            {detailTournament?.is_need_invitation_code && (
              <div>
                <input
                  type="text"
                  value={invitationCode}
                  onChange={e => {
                    setInvitationCode(e.target.value);
                  }}
                  placeholder="Invitation Code"
                  className="w-full border p-2 rounded-md"
                />
              </div>
            )}
          </div>
          <Typography className="text-sm text-[#7C7C7C] mt-2.5 font-poppins">
            {t('tournament.entranceFee')}
          </Typography>
          <Typography
            className={`${
              promoCodeValidationResult &&
              localStorage.getItem('accessToken') !== null
                ? 'text-[#7C7C7C] line-through decoration-2 text-md'
                : 'text-black text-xl font-semibold'
            } font-poppins`}
          >
            {detailTournament?.admission_fee === 0
              ? t('tournament.free')
              : // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                `${userInfo?.preferredCurrency ?? 'IDR'}${standartCurrency(
                  detailTournament?.admission_fee ?? 0
                ).replace('Rp', '')}`}
          </Typography>
          {promoCodeValidationResult !== 0 &&
            localStorage.getItem('accessToken') !== null && (
              <Typography className="font-semibold text-xl font-poppins">
                {detailTournament?.admission_fee === 0
                  ? t('tournament.free')
                  : (
                      promoCodeValidationResult?.response?.final_price ?? 0
                    ).toLocaleString('id-ID', {
                      currency: userInfo?.preferredCurrency ?? 'IDR',
                      style: 'currency'
                    })}
              </Typography>
            )}
          <div className="flex flex-row items-center justify-between mt-2.5">
            <div className="flex flex-row items-center">
              <Image src={goldSeedsCoin} alt="Next" width={30} height={30} />
              <div className="text-xs text-[#7C7C7C] lg:px-2">
                {totalAvailableCoins > 0
                  ? `Redeem ${totalAvailableCoins} seeds coin`
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
            onClick={async () => {
              await handleRedirectPage();
            }}
            disabled={isDisabled()}
            className={`px-10 py-2 rounded-full font-semibold mt-4 w-full ${buttonColor()}`}
          >
            {detailTournament?.is_joined === true
              ? isStarted
                ? t('tournament.start')
                : t('tournament.waiting')
              : t('tournament.join')}
          </button>
          <div className="flex gap-2 mt-4">
            <Image alt="" src={IconWarning} className="w-[14px]" />
            <Typography className="text-[#3C49D6] text-[14px] font-poppins">
              {t('tournament.detailCurrency')}{' '}
              {userInfo?.preferredCurrency ?? 'IDR'}
            </Typography>
          </div>
        </div>
      </div>
    </>
  );
};

export default TournamentDetail;
