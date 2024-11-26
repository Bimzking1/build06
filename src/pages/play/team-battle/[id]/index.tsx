import PopUpJoinBattle from '@/components/team-battle/PopUpJoinBattle';
import PopUpPrizeBattle from '@/components/team-battle/popUpPrizeBattle';
import PopUpRegistrationClosed from '@/components/team-battle/popUpRegistrationClosed';
import Triangle from '@/components/team-battle/triangle.component';
import { standartCurrency } from '@/helpers/currency';
import { getBattlePeriod } from '@/helpers/dateFormat';
import withAuth from '@/helpers/withAuth';
import { getUserInfo } from '@/repository/profile.repository';
import { getBattleDetail } from '@/repository/team-battle.repository';
import i18n from '@/utils/common/i18n';
import { type TeamBattleDetail } from '@/utils/interfaces/team-battle.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import BlueSeedy from 'public/assets/team-battle/blueseedy.svg';
import Versus from 'public/assets/team-battle/vsicon.svg';
import YellowSeedy from 'public/assets/team-battle/yellowseedy.svg';
import {
  ArrowTailessDown,
  ArrowTailessUp,
  BattleSecondMedal,
  BattleThirdMedal,
  GoldCrown,
  GreenGift,
  GroupIcon
} from 'public/assets/vector';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowBack, IoTriangleSharp } from 'react-icons/io5';
import { LuDot } from 'react-icons/lu';
import { toast } from 'react-toastify';

const MainTeamBattle = (): React.ReactElement => {
  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation();
  // const languageCtx = useContext(LanguageContext);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [showTnc, setShowTnc] = useState<boolean>(false);
  const [showPeriod, setShowPeriod] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPopUpJoinBattle, setShowPopUpJoinBattle] = useState<boolean>(false);
  const [showPopUpPrizeBattle, setShowPopUpPrizeBattle] = useState<boolean>(false);
  const [showPopUpRegistrationClosed, setShowPopUpRegistrationClosed] = useState<boolean>(false);
  const [data, setData] = useState<TeamBattleDetail>();
  const [selectedSponsor, setSelectedSponsor] = useState('');

  const handleShowPopUpJoinBattle = (): void => {
    setShowPopUpJoinBattle(!showPopUpJoinBattle);
  };

  const handleShowPopUpPrizeBattle = (): void => {
    setShowPopUpPrizeBattle(!showPopUpPrizeBattle);
  };
  
  const handleShowPopUpRegistrationClosed = (): void => {
    setShowPopUpRegistrationClosed(!showPopUpRegistrationClosed);
  };

  const handleGetDetailBattle = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getBattleDetail(id as string);
      setData(response);
    } catch (error: any) {
      toast(error.message, { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const handleRedirectJoin = async (): Promise<void> => {
    if (data?.is_joined ?? false) {
      if (isStarted()) {
        await router.push(`/play/team-battle/${id as string}/stage`);
      } else {
        await router.push(`/play/team-battle/${id as string}/waiting`);
      }
    } else {
      if (isRegistrationClosed()) {
        handleShowPopUpRegistrationClosed()
      } else {
        handleShowPopUpJoinBattle();
      }
    }
  };

  const isStarted = (): boolean => {
    const playTime = data?.elimination_start ?? '2024-12-31T17:00:00Z';
    const timeStart = new Date(playTime).getTime();
    const timeNow = Date.now();

    return timeStart < timeNow;
  };

  const isRegistrationClosed = (): boolean => {
    const eliminationTime = data?.elimination_end ?? '2024-12-31T17:00:00Z';
    const timeRegistrationOpen = new Date(eliminationTime).getTime();
    const timeNow = Date.now();

    return timeRegistrationOpen < timeNow;
  };

  const handleSelectedSponsor = (sponsor: string): void => {
    if (selectedSponsor === sponsor) {
      setSelectedSponsor('');
    } else {
      setSelectedSponsor(sponsor);
    }
  };

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (id !== undefined) {
      void handleGetDetailBattle();
    }
  }, [id]);

  return (
    <>
      <div className="w-full h-full p-4">
        <div className="flex justify-center items-center relative">
          <div
            className="absolute text-white left-0 lg:w-[50px] lg:h-[50px] w-[24px] h-[24px] hover:opacity-80 transform scale-100 hover:scale-110 transition-transform duration-300 cursor-pointer"
            onClick={async() => {
              await router.push('/play/team-battle');
            }}
          >
            <IoArrowBack size={30} />
          </div>
          <Typography className="text-white font-poppins font-semibold text-lg sm:text-xl lg:text-2xl">
            {t('teamBattle.battleCompetition')}
          </Typography>
        </div>

        <div className="flex lg:hidden justify-center items-end border-2 border-white rounded-3xl py-4 px-2 bg-white/20 relative mt-4">
          <div className="flex flex-col justify-center items-center w-[30%]">
            <div className="flex gap-1">
              <div className="flex justify-center items-center">
                <Image
                  className="w-[20px] h-[20px]"
                  src={BattleSecondMedal}
                  width={100}
                  height={100}
                  alt={'BattleSecondMedal'}
                />
              </div>
              <div className='font-poppins'>2nd</div>
            </div>
            <div className="font-semibold">
              {`${standartCurrency(data?.prize[1]?.amount ?? 0).replace(
                'Rp',
                ''
              )}`}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center border-x-[1px] border-white w-[40%]">
            <div className="flex gap-1 justify-center items-end">
              <div className="flex justify-center items-center">
                <Image
                  className="w-[40px] h-[40px]"
                  src={GoldCrown}
                  width={100}
                  height={100}
                  alt={'GoldCrown'}
                />
              </div>
              <div className='font-poppins'>1st</div>
            </div>
            <div className="font-semibold text-lg">
              {`${standartCurrency(data?.prize[0]?.amount ?? 0).replace(
                'Rp',
                ''
              )}`}
            </div>
          </div>
          <div className="flex flex-col justify-center items-center w-[30%]">
            <div className="flex gap-1">
              <div className="flex justify-center items-center">
                <Image
                  className="w-[20px] h-[20px]"
                  src={BattleThirdMedal}
                  width={100}
                  height={100}
                  alt={'BattleThirdMedal'}
                />
              </div>
              <div className='font-poppins'>3rd</div>
            </div>
            <div className="font-semibold">
              {`${standartCurrency(data?.prize[2]?.amount ?? 0).replace(
                'Rp',
                ''
              )}`}
            </div>
          </div>
          <div
            onClick={handleShowPopUpPrizeBattle}
            className="absolute right-[10px] top-[10px] flex justify-center items-center bg-white bg-opacity-35 w-[30px] h-[30px] rounded-lg cursor-pointer hover:bg-opacity-70 duration-300"
          >
            <Image
              className="w-[20px] h-[20px]"
              src={GreenGift}
              width={100}
              height={100}
              alt={'GreenGift'}
            />
          </div>
        </div>

        <div className="lg:flex lg:gap-8 lg:mt-4">
          <div className="flex flex-col lg:w-full justify-center items-center gap-2 mt-28 lg:mt-24 border-b-2 border-x-2 border-white rounded-b-2xl py-8 px-2 bg-white/30 relative">
            <div className="absolute w-full left-0 -top-20 flex justify-center items-center">
              <Triangle />
              <Image
                src={Versus}
                alt="versus-icon"
                width={300}
                height={300}
                className="absolute -top-6 lg:-top-6 w-52"
              />
              <Image
                src={BlueSeedy}
                alt="blue-seedy"
                width={1000}
                height={1000}
                className="absolute w-28 h-32 -left-9 -bottom-14"
              />
              <Image
                src={YellowSeedy}
                alt="yellow-seedy"
                width={1000}
                height={1000}
                className="absolute w-28 h-32 -right-6 -bottom-14"
              />
            </div>
            {isLoading ? (
              <div className="w-full flex justify-center h-fit my-8">
                <div className="h-[60px]">
                  <div className="animate-spinner w-16 h-16 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
                </div>
              </div>
            ) : (
              <>
                <div className="flex flex-col justify-center items-center gap-4">
                  <Typography className="text-[#3D3D3D] font-poppins text-xl sm:text-2xl font-semibold">
                    {t('teamBattle.timeTo')}
                  </Typography>
                  <Typography className="text-[#407F74] font-poppins text-3xl sm:text-5xl font-bold">
                    {t('teamBattle.battle')}
                  </Typography>
                </div>
                <div className="text-xs sm:text-sm xl:text-lg text-[#3D3D3D] font-semibold font-poppins">
                  <div className="w-full my-10">
                    <table className="w-full border-none my-4 text-[#3D3D3D] border-separate border-spacing-y-4">
                      <tbody className="font-semibold">
                        <tr>
                          <td className="flex items-center space-x-1">
                            <LuDot size={30} className="hidden lg:flex" />
                            <span>{t('teamBattle.mainPage.period')}</span>
                          </td>
                          <td>
                            :{' '}
                            {data?.elimination_start !== undefined
                              ? getBattlePeriod(
                                  new Date(data.elimination_start) ??
                                    '2024-12-31T23:59:00Z'
                                )
                              : ''}{' '}
                            -{' '}
                            {data?.final_end !== undefined
                              ? getBattlePeriod(
                                  new Date(data.final_end) ??
                                    '2024-12-31T23:59:00Z'
                                )
                              : ''}
                          </td>
                          <td className="relative">
                            <div
                              className="bg-[#407F74] w-[25px] h-[25px] flex justify-center items-center rounded-md cursor-pointer hover:bg-opacity-70 duration-300 lg:hidden absolute inset-y-1/2 transform -translate-y-1/2"
                              onClick={() => {
                                setShowPeriod(!showPeriod);
                              }}
                            >
                              <Image
                                className="w-[15px] h-[15px]"
                                src={
                                  showPeriod ? ArrowTailessUp : ArrowTailessDown
                                }
                                width={100}
                                height={100}
                                alt={
                                  showPeriod
                                    ? 'ArrowTailessUp'
                                    : 'ArrowTailessDown'
                                }
                              />
                            </div>
                          </td>
                        </tr>
                        <tr
                          className={`${
                            showPeriod ? '' : 'hidden lg:table-row'
                          }`}
                        >
                          <td className="flex items-center space-x-1">
                            <LuDot size={30} className="hidden lg:flex" />
                            <span>{t('teamBattle.mainPage.registration')}</span>
                          </td>
                          <td>
                            :{' '}
                            {data?.registration_start !== undefined
                              ? getBattlePeriod(
                                  new Date(data.registration_start) ??
                                    '2024-12-31T23:59:00Z'
                                )
                              : ''}{' '}
                            -{' '}
                            {data?.registration_end !== undefined
                              ? getBattlePeriod(
                                  new Date(data.registration_end) ??
                                    '2024-12-31T23:59:00Z'
                                )
                              : ''}
                          </td>
                        </tr>
                        <tr
                          className={`${
                            showPeriod ? '' : 'hidden lg:table-row'
                          }`}
                        >
                          <td className="flex items-center space-x-1">
                            <LuDot size={30} className="hidden lg:flex" />
                            <span>{t('teamBattle.mainPage.elimination')}</span>
                          </td>
                          <td>
                            :{' '}
                            {data?.elimination_start !== undefined
                              ? getBattlePeriod(
                                  new Date(data.elimination_start) ??
                                    '2024-12-31T23:59:00Z'
                                )
                              : ''}{' '}
                            -{' '}
                            {data?.elimination_end !== undefined
                              ? getBattlePeriod(
                                  new Date(data.elimination_end) ??
                                    '2024-12-31T23:59:00Z'
                                )
                              : ''}
                          </td>
                        </tr>
                        <tr
                          className={`${
                            data?.type !== 'PROVINCE'
                              ? showPeriod
                                ? 'table-row'
                                : 'hidden lg:table-row'
                              : 'hidden'
                          }
                          `}
                        >
                          <td className="flex items-center space-x-1">
                            <LuDot size={30} className="hidden lg:flex" />
                            <span>{t('teamBattle.mainPage.semifinal')}</span>
                          </td>
                          <td>
                            :{' '}
                            {data?.semifinal_start !== undefined
                              ? getBattlePeriod(
                                  new Date(data.semifinal_start) ??
                                    '2024-12-31T23:59:00Z'
                                )
                              : ''}{' '}
                            -{' '}
                            {data?.semifinal_end !== undefined
                              ? getBattlePeriod(
                                  new Date(data.semifinal_end) ??
                                    '2024-12-31T23:59:00Z'
                                )
                              : ''}
                          </td>
                        </tr>
                        <tr
                          className={`${
                            showPeriod ? '' : 'hidden lg:table-row'
                          }`}
                        >
                          <td className="flex items-center space-x-1">
                            <LuDot size={30} className="hidden lg:flex" />
                            <span>{t('teamBattle.mainPage.final')}</span>
                          </td>
                          <td>
                            :{' '}
                            {data?.final_start !== undefined
                              ? getBattlePeriod(
                                  new Date(data.final_start) ??
                                    '2024-12-31T23:59:00Z'
                                )
                              : ''}{' '}
                            -{' '}
                            {data?.final_end !== undefined
                              ? getBattlePeriod(
                                  new Date(data.final_end) ??
                                    '2024-12-31T23:59:00Z'
                                )
                              : ''}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="flex flex-col justify-center items-center text-sm mt-4">
                    <div className="text-xl font-semibold font-poppins">
                      {t('teamBattle.mainPage.participants')}
                    </div>
                    <div className="flex justify-center items-start gap-1 mt-2 text-[#407f74]">
                      <div className="w-[40px] h-[40px]">
                        <Image
                          className="w-full h-full"
                          src={GroupIcon}
                          width={100}
                          height={100}
                          alt={'GroupIcon'}
                        />
                      </div>
                      <div className="text-lg">{data?.participants ?? 0}</div>
                    </div>
                  </div>
                  <div className="mt-4 hidden lg:flex">
                    <Button
                      onClick={handleRedirectJoin}
                      className={`${isRegistrationClosed() ? 'bg-[#D9D9D9]' : 'bg-[#2934B2]'} w-full rounded-full border-[2px] border-white text-sm font-semibold font-poppins`}
                    >
                      {data?.is_joined ?? false
                        ? t('teamBattle.mainPage.play')
                        : t('teamBattle.mainPage.join')}
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="hidden lg:flex flex-col w-[400px] justify-center items-center gap-2 border-2 border-x-white border-b-white rounded-lg py-8 px-2 bg-white/30 relative mt-12">
            {isLoading ? (
              <div className="w-full flex justify-center h-fit my-8">
                <div className="h-[60px]">
                  <div className="animate-spinner w-16 h-16 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
                </div>
              </div>
            ) : (
              <>
                <div className="w-full flex flex-col justify-center items-center px-2 font-poppins">
                  <div className="flex gap-2 justify-center items-end">
                    <div className="flex justify-center items-center">
                      <Image
                        className="w-[50px] h-[50px]"
                        src={GoldCrown}
                        width={100}
                        height={100}
                        alt={'GoldCrown'}
                      />
                    </div>
                    <div>1st</div>
                  </div>
                  <div className="font-bold text-lg">
                    {`${standartCurrency(data?.prize[0]?.amount ?? 0).replace(
                      'Rp',
                      ''
                    )}`}
                  </div>
                </div>
                <div className="w-full flex justify-between px-2">
                  <div className="flex flex-col justify-center items-center font-poppins">
                    <div className="flex gap-2">
                      <div className="flex justify-center items-center">
                        <Image
                          className="w-[30px] h-[30px]"
                          src={BattleSecondMedal}
                          width={100}
                          height={100}
                          alt={'BattleSecondMedal'}
                        />
                      </div>
                      <div>2nd</div>
                    </div>
                    <div className="font-bold text-lg">
                      {`${standartCurrency(data?.prize[1]?.amount ?? 0).replace(
                        'Rp',
                        ''
                      )}`}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-center font-poppins">
                    <div className="flex gap-2">
                      <div className="flex justify-center items-center">
                        <Image
                          className="w-[30px] h-[30px]"
                          src={BattleThirdMedal}
                          width={100}
                          height={100}
                          alt={'BattleThirdMedal'}
                        />
                      </div>
                      <div>3rd</div>
                    </div>
                    <div className="font-bold text-lg">
                      {`${standartCurrency(data?.prize[2]?.amount ?? 0).replace(
                        'Rp',
                        ''
                      )}`}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center gap-2">
                  <div className="text-lg text-[#3D3D3D] font-semibold font-poppins">
                    {(data?.sponsors?.length ?? 0) > 1
                      ? t('teamBattle.mainPage.sponsors')
                      : t('teamBattle.mainPage.sponsor')}
                  </div>
                  <div className="flex flex-wrap justify-center items-center gap-2">
                    {data?.sponsors?.map((item, i) => {
                      return (
                        <div
                          key={i}
                          onClick={() => {
                            handleSelectedSponsor(item.name);
                          }}
                          className="relative"
                        >
                          <Image
                            src={item.logo}
                            alt="sponsor-logo"
                            width={300}
                            height={300}
                            className={`w-12 xl:w-14 2xl:w-16 h-12 xl:h-14 2xl:h-16 object-contain rounded-xl bg-white cursor-pointer ${
                              selectedSponsor === item.name
                                ? 'border-4'
                                : 'border-2'
                            } border-[#76a5d0]`}
                          />
                          <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                            <div
                              className={`relative flex-col justify-center items-center mt-1 ${
                                selectedSponsor === item.name
                                  ? 'flex'
                                  : 'hidden'
                              }`}
                            >
                              <IoTriangleSharp className="text-white absolute -top-2" />
                              <div className="w-auto rounded p-2 bg-white border-none text-xs">
                                {item.name}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div
                  onClick={() => {
                    setShowTnc(!showTnc);
                  }}
                  className="flex flex-col gap-2 justify-start items-center mt-4 border-2 rounded-lg p-2 border-dashed border-[#2934B2] w-full h-full max-h-80 font-poppins"
                >
                  <div className="font-semibold">
                    {t('teamBattle.mainPage.tnc')}
                  </div>
                  <div
                    className="flex flex-col justify-start items-start gap-2 text-xs overflow-y-auto h-full w-full team-battle-scroll"
                    dangerouslySetInnerHTML={{
                      __html: data?.tnc?.[
                        i18n.language === 'id' ? 'id' : 'en'
                      ] as string
                    }}
                  />
                </div>

                <div
                  onClick={handleShowPopUpPrizeBattle}
                  className="absolute right-[10px] top-[10px] flex justify-center items-center bg-white bg-opacity-35 w-[30px] h-[30px] rounded-md cursor-pointer hover:bg-opacity-70 duration-300"
                >
                  <Image
                    className="w-[20px] h-[20px]"
                    src={GreenGift}
                    width={100}
                    height={100}
                    alt={'GreenGift'}
                  />
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col lg:hidden">
          <div className="flex flex-col justify-center items-center gap-2 mt-4">
            <div className="text-md text-[#3D3D3D] font-semibold">
              {(data?.sponsors?.length ?? 0) > 1
                ? t('teamBattle.mainPage.sponsors')
                : t('teamBattle.mainPage.sponsor')}
            </div>
            <div className="flex flex-wrap justify-center items-center gap-2 max-w-[400px]">
              {data?.sponsors?.map((item, i) => {
                return (
                  <div
                    key={i}
                    onClick={() => {
                      handleSelectedSponsor(item.name);
                    }}
                    className="relative"
                  >
                    <Image
                      src={item.logo}
                      alt="sponsor-logo"
                      width={300}
                      height={300}
                      className={`w-16 h-16 object-contain rounded-xl bg-white cursor-pointer ${
                        selectedSponsor === item.name ? 'border-4' : 'border-2'
                      } border-[#76a5d0]`}
                    />
                    <div className="absolute left-1/2 transform -translate-x-1/2">
                      <div
                        className={`relative flex-col justify-center items-center mt-1 ${
                          selectedSponsor === item.name ? 'flex' : 'hidden'
                        }`}
                      >
                        <IoTriangleSharp className="text-white absolute -top-2" />
                        <div className="w-auto rounded p-2 bg-white border-none text-xs">
                          {item.name}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div
            onClick={() => {
              setShowTnc(!showTnc);
            }}
            className="flex gap-2 justify-center items-center mt-4 font-poppins"
          >
            <div>{t('teamBattle.mainPage.tnc')}</div>
            <div className="bg-[#407F74] w-[25px] h-[25px] flex justify-center items-center rounded-md cursor-pointer hover:bg-opacity-70 duration-300">
              <Image
                className="w-[15px] h-[15px]"
                src={showTnc ? ArrowTailessUp : ArrowTailessDown}
                width={100}
                height={100}
                alt={showTnc ? 'ArrowTailessUp' : 'ArrowTailessDown'}
              />
            </div>
          </div>

          {showTnc && (
            <div
              className="flex flex-col justify-start items-start gap-2 border-2 mt-4 text-sm border-white rounded-2xl py-2 pt-4 px-8 bg-white/30 h-fit max-h-[200px] overflow-y-scroll w-full font-poppins"
              dangerouslySetInnerHTML={{
                __html: data?.tnc?.[
                  i18n.language === 'id' ? 'id' : 'en'
                ] as string
              }}
            />
          )}

          <div className="mt-6">
            <Button
              onClick={handleRedirectJoin}
              className={`${isRegistrationClosed() ? 'bg-[#D9D9D9]' : 'bg-[#2934B2]'} w-full rounded-full border-[2px] border-white text-sm font-semibold font-poppins`}
            >
              {data?.is_joined ?? false
                ? t('teamBattle.mainPage.play')
                : t('teamBattle.mainPage.join')}
            </Button>
          </div>
        </div>
      </div>
      <PopUpJoinBattle
        isOpen={showPopUpJoinBattle}
        onClose={handleShowPopUpJoinBattle}
        battleId={id as string}
      />
      {userInfo !== undefined && data !== undefined && (
        <PopUpPrizeBattle
          isOpen={showPopUpPrizeBattle}
          onClose={handleShowPopUpPrizeBattle}
          userInfo={userInfo}
          data={data}
        />
      )}
      <PopUpRegistrationClosed
        isOpen={showPopUpRegistrationClosed}
        onClose={handleShowPopUpRegistrationClosed}
        currentStage={data?.status ?? ''}
      />
    </>
  );
};

export default withAuth(MainTeamBattle);
