import {
  getGroupBattle,
  joinBattle
} from '@/repository/team-battle.repository';
import { type GroupBattle } from '@/utils/interfaces/team-battle.interface';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import TeamRegion from 'public/assets/team-battle/team-region.svg';
import { CloseModalCross } from 'public/assets/vector';
import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface PopUpJoinBattleProps {
  isOpen: boolean;
  onClose: () => void;
  battleId: string;
}

const PopUpJoinBattle: React.FC<PopUpJoinBattleProps> = ({
  isOpen,
  onClose,
  battleId
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [joinMode, setJoinMode] = useState<'public' | 'invitation' | null>(
    null
  );
  const [invitationCode, setInvitationCode] = useState<string>('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [searchGroup, setSearchGroup] = useState<string>('');
  const [groupList, setGroupList] = useState<GroupBattle[]>([]);
  const [filteredGroupList, setFilteredGroupList] = useState<GroupBattle[]>([]);
  const [isInvalidCode, setIsInvalidCode] = useState<boolean>(false);

  const handleToggleJoin = (mode: 'public' | 'invitation' | null): void => {
    setJoinMode(mode);
  };

  const handleClose = (): void => {
    setJoinMode(null);
    setInvitationCode('');
    setGroupList([]);
    setFilteredGroupList([]);
    setSelectedGroup(null);
    onClose();
  };

  const handleJoin = async (
    type: 'public' | 'invitation',
    groupId?: string
  ): Promise<void> => {
    try {
      if (battleId === undefined) return;

      setIsLoading(true);
      if (type === 'public') {
        await joinBattle(battleId);
      } else if (groupId !== undefined) {
        await joinBattle(battleId, groupId);
      }

      await router.push(`/play/team-battle/${battleId}/waiting`);
      handleClose();
    } catch (error) {
      toast.error(`Error joining battle: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchGroup = async (): Promise<void> => {
    try {
      setIsLoading(true);
      if (invitationCode !== '' && battleId !== undefined) {
        const response = await getGroupBattle(battleId, invitationCode);
        if (response !== null) {
          setGroupList(response);
          setFilteredGroupList(response);
        } else {
          setInvitationCode('');
        }
      }
    } catch (error: any) {
      if (
        error?.status === 404 &&
        error?.response?.data?.message === 'invitation code not found on this battle'
      ) {
        setIsInvalidCode(true)
        setTimeout(() => {
          setIsInvalidCode(false)
        }, 5000)
      } else if (
        error?.status === 404 &&
        error?.response?.data?.message !== 'invitation code not found on this battle'
      ) {
        toast.error(error?.response?.data?.message);
      } else {
        toast.error(error?.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      const keyword = searchRef?.current?.value?.trim();
      if (keyword !== undefined) {
        setFilteredGroupList(
          groupList?.filter(group => group.name.toLowerCase().includes(keyword))
        );
      }
      setSelectedGroup(null);
    }
  };

  const isValidURL = (input: string): boolean => {
    try {
      // eslint-disable-next-line no-new
      new URL(input?.replace(/^[A-D]\.\s/, ''));
      return true;
    } catch (err) {
      return false;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-50">
      <div className="relative bg-white/50 rounded-3xl shadow-lg border border-white">
        <button
          disabled={isLoading}
          onClick={handleClose}
          className="absolute w-[40px] h-auto top-5 right-4 transform scale-100 hover:scale-110 transition-transform duration-300 cursor-pointer"
        >
          <Image
            alt={'CloseModalCross'}
            src={CloseModalCross}
            width={100}
            height={100}
            className="w-full h-full"
          />
        </button>
        <div className="pt-20 px-4 pb-4">
          {joinMode === null && (
            <div className="rounded-3xl flex flex-col justify-around items-center gap-6 bg-white min-w-[320px] h-[190px] p-6">
              <Button
                onClick={() => {
                  handleToggleJoin('public');
                }}
                className="w-full rounded-full border-[2px] bg-[#2934B2] border-white text-sm font-semibold font-poppins normal-case"
              >
                Join as Public
              </Button>
              <Button
                onClick={() => {
                  handleToggleJoin('invitation');
                }}
                className="w-full rounded-full border-[2px] bg-[#2934B2] border-white text-sm font-semibold font-poppins normal-case"
              >
                Join as Invitation
              </Button>
            </div>
          )}
          {joinMode === 'public' && (
            <div className="rounded-3xl bg-white max-w-[360px] h-[190px] p-6 flex flex-col justify-center items-center gap-8">
              <Typography className="font-poppins lg:text-xl text-base font-semibold text-center">
                {t('teamBattle.joinAsPublicConfirm')}
              </Typography>
              <div className="flex flex-row w-full gap-2">
                <Button
                  disabled={isLoading}
                  onClick={() => {
                    handleToggleJoin(null);
                  }}
                  className="w-full rounded-full border-[2px] bg-[#ff4672] border-white text-sm font-semibold font-poppins"
                >
                  No
                </Button>
                <Button
                  disabled={isLoading}
                  onClick={async () => {
                    await handleJoin('public');
                  }}
                  className="w-full rounded-full border-[2px] bg-[#2934B2] border-white text-sm font-semibold font-poppins"
                >
                  Yes
                </Button>
              </div>
            </div>
          )}
          {joinMode === 'invitation' && groupList?.length === 0 && (
            <div className="rounded-3xl bg-white max-w-[460px] h-fit p-6 flex flex-col justify-center items-center">
              <Typography className="font-poppins lg:text-2xl text-base font-semibold">
                {t('teamBattle.joinAsInvitation')}
              </Typography>
              <div
                className={`w-full p-[3px] rounded-2xl bg-gradient-to-r from-[#97A4E7] to-[#47C0AA] mt-6 ${
                  isInvalidCode ? 'mb-4' : 'mb-6'
                }`}
              >
                <input
                  type="text"
                  placeholder={
                    t('teamBattle.placeholderInvitation') ?? 'Input here'
                  }
                  className="w-full lg:h-16 h-10 p-2 lg:text-xl text-sm text-center text-[#262626] placeholder:text-[#7C7C7C] rounded-2xl focus:outline-none"
                  value={invitationCode}
                  onChange={e => {
                    setInvitationCode(e.target.value.toUpperCase());
                  }}
                />
              </div>
              {isInvalidCode && (
                <Typography className="text-lg text-[#DD2525] w-full text-center mb-4">
                  {t('teamBattle.mainPage.wrongInvitationCode')}
                </Typography>
              )}
              <Button
                disabled={isLoading || invitationCode.trim().length < 3}
                onClick={handleFetchGroup}
                className="rounded-full border-[2px] bg-[#2934B2] border-white text-sm font-semibold font-poppins w-[190px]"
              >
                Enter
              </Button>
            </div>
          )}
          {filteredGroupList?.length > 0 && (
            <div className="rounded-3xl bg-white lg:w-[460px] w-[350px] h-full p-6 flex flex-col justify-center items-center gap-4">
              <Typography className="font-poppins lg:text-lg font-semibold">
                {t(
                  `teamBattle.${
                    groupList[0]?.type === 'COMMUNITY'
                      ? 'chooseCommunity'
                      : groupList[0]?.type === 'UNIVERSITY'
                      ? 'chooseUniversity'
                      : 'chooseRegion'
                  }`
                )}
              </Typography>
              <div className="w-full p-[3px] rounded-2xl bg-gradient-to-r from-[#97A4E7] to-[#47C0AA]">
                <div className="relative w-full">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#BDBDBD] w-5 h-5" />
                  <input
                    type="text"
                    ref={searchRef}
                    onKeyDown={handleSearch}
                    placeholder="Search here.."
                    className="w-full h-10 p-2 pl-10 text-sm font-normal text-[#262626] placeholder:text-[#7C7C7C] rounded-2xl focus:outline-none"
                    value={searchGroup}
                    onChange={e => {
                      setSearchGroup(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2 lg:w-[430px] w-full max-h-[290px] shadow-md overflow-y-scroll team-battle-scroll p-4 rounded-xl">
                {filteredGroupList?.map((group, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setSelectedGroup(group.id);
                    }}
                    className={`flex flex-row justify-between items-center cursor-pointer hover:shadow-lg p-2 rounded-xl ${
                      selectedGroup === group.id
                        ? 'border-[2px] border-[#76A5D0]'
                        : ''
                    }`}
                  >
                    <Typography className="font-poppins text-base font-normal">
                      {index + 1}. {group.name}
                    </Typography>
                    <div className="border-[2px] border-[#76A5D0] rounded-lg">
                      <Image
                        alt={group.name}
                        src={isValidURL(group.logo) ? group.logo : TeamRegion}
                        width={40}
                        height={40}
                        className="overflow-hidden rounded-lg aspect-square"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button
                disabled={
                  isLoading || selectedGroup === null || selectedGroup === ''
                }
                onClick={async () => {
                  await handleJoin('invitation', selectedGroup as string);
                }}
                className="rounded-full border-[2px] bg-[#2934B2] border-white text-sm font-semibold font-poppins w-[190px]"
              >
                Enter
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopUpJoinBattle;
