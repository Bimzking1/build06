import PopUpPrizeBattle from '@/components/team-battle/popUpPrizeBattle';
import { standartCurrency } from '@/helpers/currency';
import withAuth from '@/helpers/withAuth';
import { getUserInfo } from '@/repository/profile.repository';
import { getBattleDetail } from '@/repository/team-battle.repository';
import i18n from '@/utils/common/i18n';
import { type TeamBattleDetail } from '@/utils/interfaces/team-battle.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { format } from 'date-fns';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { FaUserGroup } from 'react-icons/fa6';
import { IoArrowBack } from 'react-icons/io5';
import { LuDot } from 'react-icons/lu';
import { RiGiftFill } from 'react-icons/ri';
import { toast } from 'react-toastify';
import Second from '../../../../../public/assets/team-battle/2nd-battle.svg';
import Third from '../../../../../public/assets/team-battle/3rd-battle.svg';
import Crown from '../../../../../public/assets/team-battle/battle-crown.svg';

const BattleInformation: React.FC = () => {
  const { t } = useTranslation();
  const [showTnc, setShowTnc] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const [showPopUpPrizeBattle, setShowPopUpPrizeBattle] =
    useState<boolean>(false);
  const router = useRouter();
  const [data, setData] = useState<TeamBattleDetail | undefined>(undefined);
  const [userInfo, setUserInfo] = useState<UserInfo>();

  const handleShowTnc = (): void => {
    setShowTnc(!showTnc);
  };

  const handleShowPopUpPrizeBattle = (): void => {
    setShowPopUpPrizeBattle(!showPopUpPrizeBattle);
  };

  useEffect(() => {
    const handleResize = (): void => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const { id } = router.query;
  const handleGetDetailBattle = async (): Promise<void> => {
    try {
      const response = await getBattleDetail(id as string);
      setData(response);
    } catch (error: any) {
      toast(error.message, { type: 'error' });
    }
  };

  const formatDate = (dateString: string): string => {
    return format(new Date(dateString), 'dd MMMM yyyy');
  };

  const fetchUser = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  useEffect(() => {
    if (id !== undefined) {
      void handleGetDetailBattle();
      void fetchUser();
    }
  }, [id]);

  return (
    <>
      {userInfo !== undefined && data !== undefined && (
        <PopUpPrizeBattle
          isOpen={showPopUpPrizeBattle}
          onClose={handleShowPopUpPrizeBattle}
          userInfo={userInfo}
          data={data}
        />
      )}
      <div className="px-2 my-5 font-poppins">
        <div className="text-xl text-white grid grid-cols-3">
          <div
            className="flex justify-start items-center transform scale-100 hover:scale-110 transition-transform duration-300 cursor-pointer"
            onClick={async() => {
              await router.push(`/play/team-battle/${id as string}/stage`);
            }}
          >
            <IoArrowBack size={30} />
          </div>
          <div className="text-center font-semibold text-lg sm:text-xl lg:text-2xl col-span-1 font-poppins">
            {t('teamBattle.battleCompetition')}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-5 my-10">
          <div className="col-span-2 border-2 border-white rounded-2xl px-1 py-5 lg:px-10 bg-white/30 relative">
            <RiGiftFill
              size={50}
              onClick={handleShowPopUpPrizeBattle}
              className="text-[#27a590] p-2 bg-white/30 rounded-xl absolute right-2 top-2 transform scale-100 hover:scale-110 transition-transform duration-300 cursor-pointer"
            />
            <div className="lg:hidden font-semibold text-xl text-center mt-3">
              {t('teamBattle.prize')}
            </div>
            <div className="grid grid-cols-3">
              <div></div>
              <div className="flex flex-col gap-2 items-center justify-center">
                <div className="lg:flex flex-row items-end justify-end hidden">
                  <Image src={Crown} alt="1st" />{' '}
                  <span className="text-xl font-medium">1st</span>
                </div>
                <div className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl lg:block hidden">
                  {standartCurrency(data?.prize[0]?.amount).replace('Rp', '')}
                </div>
              </div>
              <div></div>
              <div className="flex flex-col items-center justify-end">
                <div className="flex flex-col gap-2 items-center justify-end lg:border-none border-e-2 h-fit w-full">
                  <div className="flex flex-row items-end justify-end">
                    <Image src={Second} alt="2nd" className="w-6/12" />{' '}
                    <span className="text-lg sm:text-xl font-medium">2nd</span>
                  </div>
                  <div className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
                    {standartCurrency(data?.prize[1]?.amount).replace('Rp', '')}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-center justify-center">
                <div className="flex flex-row items-end justify-end lg:hidden">
                  <Image src={Crown} alt="1st" className="w-8/12" />{' '}
                  <span className="text-lg sm:text-xl font-medium">1st</span>
                </div>
                <div className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl lg:hidden">
                  {standartCurrency(data?.prize[0].amount).replace('Rp', '')}
                </div>
              </div>
              <div className="flex flex-col items-center justify-end">
                <div className="flex flex-col gap-2 items-center justify-end w-full lg:border-none border-s-2">
                  <div className="flex flex-row items-end justify-end">
                    <Image src={Third} alt="3rd" className="w-6/12" />{' '}
                    <span className="text-lg sm:text-xl font-medium">3rd</span>
                  </div>
                  <div className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">
                    {standartCurrency(data?.prize[2]?.amount).replace('Rp', '')}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center mt-5">
              <div className="text-lg sm:text-xl font-semibold text-[#3D3D3D]">
                {t('teamBattle.stagePage.gamePeriod')}
              </div>
              <table className="w-fit border-collapse border-none my-4 text-[#3D3D3D]">
                <tbody className="text-xs sm:text-sm xl:text-lg font-semibold">
                  <tr>
                    <td className="flex items-center space-x-1">
                      <LuDot size={30} />
                      <span>{t('teamBattle.mainPage.period')}</span>
                    </td>
                    <td>
                      :{' '}
                      {data?.elimination_start !== undefined
                        ? formatDate(data.elimination_start)
                        : ''}{' '}
                      -{' '}
                      {data?.final_end !== undefined
                        ? formatDate(data.final_end)
                        : ''}
                    </td>
                  </tr>
                  <tr>
                    <td className="flex items-center space-x-1">
                      <LuDot size={30} />
                      <span>{t('teamBattle.mainPage.registration')}</span>
                    </td>
                    <td>
                      :{' '}
                      {data?.registration_start !== undefined
                        ? formatDate(data.registration_start)
                        : ''}{' '}
                      -{' '}
                      {data?.registration_end !== undefined
                        ? formatDate(data.registration_end)
                        : ''}
                    </td>
                  </tr>
                  <tr>
                    <td className="flex items-center space-x-1">
                      <LuDot size={30} />
                      <span>{t('teamBattle.mainPage.elimination')}</span>
                    </td>
                    <td>
                      :{' '}
                      {data?.elimination_start !== undefined
                        ? formatDate(data.elimination_start)
                        : ''}{' '}
                      -{' '}
                      {data?.elimination_end !== undefined
                        ? formatDate(data.elimination_end)
                        : ''}
                    </td>
                  </tr>
                  <tr
                    className={`${data?.type !== 'PROVINCE' ? '' : 'hidden'}`}
                  >
                    <td className="flex items-center space-x-1">
                      <LuDot size={30} />
                      <span>{t('teamBattle.mainPage.semifinal')}</span>
                    </td>
                    <td>
                      :{' '}
                      {data?.semifinal_start !== undefined
                        ? formatDate(data.semifinal_start)
                        : ''}{' '}
                      -{' '}
                      {data?.semifinal_end !== undefined
                        ? formatDate(data.semifinal_end)
                        : ''}
                    </td>
                  </tr>
                  <tr>
                    <td className="flex items-center space-x-1">
                      <LuDot size={30} />
                      <span>{t('teamBattle.mainPage.final')}</span>
                    </td>
                    <td>
                      :{' '}
                      {data?.final_start !== undefined
                        ? formatDate(data.final_start)
                        : ''}{' '}
                      -{' '}
                      {data?.final_end !== undefined
                        ? formatDate(data.final_end)
                        : ''}
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="font-semibold text-lg sm:text-xl mb-4 text-[#3D3D3D]">
                {t('teamBattle.mainPage.totalParticipants')}
              </div>
              <div className="flex flex-row text-[#407F74] justify-center">
                <FaUserGroup size="calc(100% / 6)" />
                <span className="text-lg sm:text-xl lg:text-2xl">
                  {data?.participants}
                </span>
              </div>
            </div>
          </div>
          <div
            className="my-5 flex lg:hidden flex-row items-center gap-3 col-span-3 text-lg sm:text-xl font-semibold justify-center transform scale-100 hover:scale-110 transition-transform duration-300 cursor-pointer"
            onClick={() => {
              handleShowTnc();
            }}
          >
            <div>{t('teamBattle.mainPage.tnc')}</div>
            {showTnc ? (
              <FaChevronUp
                size={25}
                className="text-white p-1 bg-[#407f74] rounded"
              />
            ) : (
              <FaChevronDown
                size={25}
                className="text-white p-1 bg-[#407f74] rounded"
              />
            )}
          </div>
          <div
            className={`${
              (showTnc && windowWidth <= 959) || windowWidth >= 960
                ? 'flex'
                : 'hidden'
            } col-span-1 border-2 border-white rounded-2xl p-3 bg-white/30 flex-col`}
          >
            <div className="hidden lg:block font-semibold text-lg sm:text-xl mb-4 text-[#3D3D3D] text-center">
              {t('teamBattle.mainPage.tnc')}
            </div>
            <div
              className="h-auto max-h-[250px] lg:max-h-[500px] overflow-y-auto tnc-battle-custom-scroll"
              dangerouslySetInnerHTML={{
                __html: data?.tnc?.[
                  i18n.language === 'id' ? 'id' : 'en'
                ] as string
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth(BattleInformation);
