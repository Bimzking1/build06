'use client';
import { getLeaderboardDetail } from '@/repository/play.repository';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import {
  BronzeMedalIcon,
  Gain,
  GoldMedalIcon,
  SilverMedalIcon,
  XIcon
} from 'public/assets/vector';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import FollowButton from '../FollowButton';
import Modal from '../ui/modal/Modal';

interface Props {
  playerId: string;
  rank: number;
  onClose: () => void;
}

interface Achievement {
  medal: string;
  count: number;
}

interface LeaderboardDetail {
  user_id?: string;
  avatar_url?: string;
  name?: string;
  seeds_tag?: string;
  user_achievement?: Achievement[];
  win_accuracy?: number;
  is_followed?: boolean;
}

const PlayerAchievement: React.FC<Props> = ({ playerId, rank, onClose }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<LeaderboardDetail>({});

  const fetchPlayerAchievement = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const leaderboardDetail = await getLeaderboardDetail(playerId);

      setData(leaderboardDetail);
    } catch (error: any) {
      console.error('Error fetching user profile:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchPlayerAchievement();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const achievementOrder = ['GOLD', 'SILVER', 'BRONZE'];
  const sortAchievement = (a: Achievement, b: Achievement): number =>
    achievementOrder.indexOf(a.medal) - achievementOrder.indexOf(b.medal);

  const getMedalIcon = (medal: string): string => {
    if (medal === 'GOLD') {
      return GoldMedalIcon;
    }
    if (medal === 'SILVER') {
      return SilverMedalIcon;
    }
    if (medal === 'BRONZE') {
      return BronzeMedalIcon;
    }
    return '';
  };

  const renderAchievementCard: React.FC<Achievement> = ({
    medal = '',
    count = 0
  }) => (
    <div className="mt-3 bg-[#F9F9F9] p-3 flex rounded-xl outline outline-[#E9E9E9] shadow-md">
      <div className="flex items-center mr-2">
        <Image src={getMedalIcon(medal)} alt={medal} width={45} height={45} />
      </div>
      <div className="flex flex-col justify-center">
        <Typography className="font-bold text-xs text-left text-neutral-medium">
          {t(`playerAchievementPopup.achievement${medal}Title`, { count })}
        </Typography>
        <Typography className="text-left text-[12px] text-neutral-soft">
          {t(`playerAchievementPopup.achievement${medal}Subtitle`)}
        </Typography>
      </div>
    </div>
  );

  const renderLoading = (): JSX.Element => (
    <div className="h-72">
      <div className="animate-spinner absolute top-1/2 left-1/2 -mt-8 -ml-8 w-16 h-16 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
    </div>
  );

  const renderContent = (): JSX.Element => (
    <>
      <div className="p-3">
        <div className="flex justify-evenly">
          <Image
            src={data?.avatar_url ?? ''}
            alt="AVATAR"
            width={100}
            height={100}
            className="outline outline-seeds-green-2 rounded-2xl"
          />
        </div>

        <div className="flex flex-col justify-center  px-8 pt-2 items-center text-center">
          <Typography className="font-bold text-lg text-neutral-500">
            {data?.name}
          </Typography>

          <Typography className="text-sm text-neutral-soft">
            {t('playerAchievementPopup.seedsTag', {
              seedsTag: data?.seeds_tag
            })}
          </Typography>
        </div>

        <div className="flex justify-between items-center m-2">
          <div className="flex flex-col items-center">
            <Typography className="font-bold text-lg text-seeds-button-green flex">
              <Image
                src={Gain}
                alt="gain"
                width={24}
                height={24}
                className="mr-1"
              />
              {t('playerAchievementPopup.winningAccuracy', {
                accuracy:
                  data?.win_accuracy != null
                    ? Math.round(data?.win_accuracy)
                    : 0
              })}
            </Typography>
            <Typography className="text-sm text-neutral-soft">
              {t('playerAchievementPopup.winningAccuracyLabel')}
            </Typography>
          </div>
          <hr className="w-0 h-7 border border-r border-[#BDBDBD]" />
          <div>
            <Typography className="font-bold text-lg text-seeds-button-green">
              {t('playerAchievementPopup.rank', { rank })}
            </Typography>
            <Typography className="text-sm text-neutral-soft">
              {t('playerAchievementPopup.rankLabel')}
            </Typography>
          </div>
        </div>

        <FollowButton
          userId={data?.user_id ?? ''}
          isFollowed={data?.is_followed ?? false}
        />
      </div>

      <div className="mt-2">
        <Typography className="font-bold text-xs text-left text-seeds-button-green">
          {t('playerAchievementPopup.achievementLabel')}
        </Typography>
        <div className="p-1">
          {data?.user_achievement
            ?.sort(sortAchievement)
            .map(renderAchievementCard)}
        </div>
      </div>
    </>
  );

  return (
    <Modal
      onClose={onClose}
      modalClasses="z-30 animate-slide-down fixed sm:left-[50%] top-[35%] left-[5%] sm:ml-[-13.125rem] mt-[-12.35rem] sm:w-[26.25rem] w-[90%] h-fit p-4 text-center rounded-3xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white"
    >
      <div className="flex justify-end">
        <Image
          src={XIcon}
          alt="X"
          width={30}
          height={30}
          onClick={onClose}
          className="hover:scale-110 transition ease-out cursor-pointer"
        />
      </div>
      {isLoading ? renderLoading() : renderContent()}
    </Modal>
  );
};

export default PlayerAchievement;
