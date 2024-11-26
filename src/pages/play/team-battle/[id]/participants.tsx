import AssetPagination from '@/components/AssetPagination';
import withAuth from '@/helpers/withAuth';
import { getUserInfo } from '@/repository/profile.repository';
import {
  getBattleParticipants,
  type BattleParticipantsI
} from '@/repository/team-battle.repository';
import {
  type ParticipantsDataI,
  type ParticipantsMetadata
} from '@/utils/interfaces/team-battle.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import StageFrame from 'public/assets/team-battle/stage-frame.svg';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoArrowBack } from 'react-icons/io5';
import { toast } from 'react-toastify';

const BattleParticipants: React.FC = () => {
  const router = useRouter();
  const { id, stage } = router.query;
  const { t } = useTranslation();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [participantsData, setParticipantsData] = useState<ParticipantsDataI[]>(
    []
  );
  const [participantsMetadata, setParticipantsMetadata] =
    useState<ParticipantsMetadata>();

  const [participantsParams, setParticipantsParams] = useState({
    limit: 20,
    page: 1,
    stage
  });
  const startIndex = (participantsParams.page - 1) * participantsParams.limit;

  const fetchBattleParticipants = async (
    participantsParams: BattleParticipantsI
  ): Promise<void> => {
    try {
      const response = await getBattleParticipants(
        id as string,
        participantsParams
      );
      setParticipantsData(response?.data);
      setParticipantsMetadata(response?.metadata);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
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

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      void fetchBattleParticipants(participantsParams);
    }
  }, [id, userInfo, participantsParams.page]);

  return (
    <>
      <div className="px-2 my-5 font-poppins w-full">
        <div className="flex justify-center items-center relative">
          <div
            className="absolute text-white left-0 w-[24px] h-[24px] hover:opacity-80 transform scale-100 hover:scale-110 transition-transform duration-300 cursor-pointer"
            onClick={async() => {
              await router.push(`/play/team-battle/${id as string}/stage`);
            }}
          >
            <IoArrowBack size={30} />
          </div>
          <Typography className="md:hidden text-white font-poppins font-semibold text-lg sm:text-xl lg:text-2xl">
            {t('teamBattle.battleCompetition')}
          </Typography>
        </div>
        <div className="bg-white/30 border border-white rounded-xl w-full h-[85vh] relative px-2 md:px-8 lg:px-16 flex flex-col justify-center items-center mt-12 md:mt-8">
          <div className="h-[70px] flex justify-center items-center absolute top-[-32px] m-auto right-0 left-0 w-fit">
            <Image
              alt={'StageFrame'}
              src={StageFrame}
              width={100}
              height={100}
              className="w-full h-full relative"
            />
            <div className='absolute text-white font-poppins font-semibold text-center'>
              {
                (stage !== 'elimination' && stage !== 'semifinal' && stage !== 'final')
                  ? t('teamBattle.participant.emptyTitle')
                  : t(`teamBattle.participant.${stage as string}`)
              }
            </div>
          </div>
          {participantsMetadata !== undefined ? (
            participantsData?.length !== 0 ? (
              <div className="mt-12 mb-8 w-full h-[75vh] flex flex-col gap-2 lg:gap-4 overflow-y-scroll">
                {participantsData?.map((item, i) => {
                  return (
                    <div
                      key={i}
                      className="flex justify-start items-start lg:items-center gap-4 lg:gap-8 lg:py-1 lg:px-4 hover:bg-white/25 rounded-xl duration-300 cursor-pointer"
                    >
                      <div className="flex w-fit gap-2 items-center">
                        <div className="text-center w-[20px] lg:w-[30px]">
                          {startIndex + i + 1}.
                        </div>
                        <div className="w-[40px] h-[40px] lg:w-[50px] lg:h-[50px] rounded-full overflow-hidden shadow-xl">
                          <Image
                            alt={'item?.avatar}'}
                            src={item?.avatar}
                            width={100}
                            height={100}
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col justify-start items-start lg:flex-row lg:items-center lg:gap-4 w-full">
                        <div className="text-sm md:text-base lg:hidden xl:flex lg:w-[40%] lg:text-lg font-semibold">
                          {item?.name}
                        </div>
                        <div className="text-sm md:text-base hidden lg:flex xl:hidden lg:w-[40%] lg:text-lg font-semibold">
                          {(item?.name).substring(0, 15)}
                          {item?.name?.length > 20 ? '...' : ''}
                        </div>
                        <div className="text-xs md:text-base lg:w-[60%]">
                          {item?.group_name === ''
                            ? 'Public'
                            : item?.group_name}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="h-[75vh] w-full flex justify-center items-center">
                <div className="font-semibold text-[#262626]">
                  {t('teamBattle.participant.noData')}
                </div>
              </div>
            )
          ) : (
            <div className="h-[75vh] w-full flex justify-center items-center">
              <div className="h-[60px]">
                <div className="animate-spinner w-16 h-16 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
              </div>
            </div>
          )}
          <div className="w-full mb-4 flex justify-end items-end">
            <div className="flex gap-2 justify-center items-center">
              <div className="text-sm">
                {t('teamBattle.participant.participant')}
              </div>
              <div className="text-base font-semibold">
                {` ${20 * participantsParams.page - 19} - ${
                  20 * participantsParams.page
                }`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Participants Pagination */}
      <div className="w-full flex justify-center my-8">
        <AssetPagination
          currentPage={participantsParams.page}
          totalPages={Math.ceil((participantsMetadata?.total ?? 0) / 20)}
          onPageChange={page => {
            setParticipantsParams({ ...participantsParams, page });
          }}
          colorGoTo={'#262626'}
        />
      </div>
    </>
  );
};

export default withAuth(BattleParticipants);
