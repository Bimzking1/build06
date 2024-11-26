import { PopupWinnerPlay } from '@/components/popup/PopupWinnerPlay';
import {
  acceptOrRejectJoinCircle,
  getDetailCircle
} from '@/repository/circleDetail.repository';
import { Button, Typography } from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { PlayLogo } from 'public/assets/circle';
import { ExpNotif, SuccessNotif } from 'public/assets/images';
import { useEffect, useState } from 'react';

interface props {
  logo: any;
  data: any;
  variant: string;
}

const NotificationCard: React.FC<props> = ({ data, logo, variant }) => {
  const [detailCircle, setDetailCircle] = useState<any>();
  const router = useRouter();
  const fetchCircleById = async (id: string): Promise<void> => {
    try {
      const { data } = await getDetailCircle({ circleId: id });

      setDetailCircle(data);
    } catch (error: any) {
      console.error('Error fetching Circle Detail:', error.message);
    }
  };
  const [isActive, setIsActive] = useState<boolean>(false);

  const acceptOrRejectInvitation = async (isAccept: boolean): Promise<void> => {
    try {
      const response = await acceptOrRejectJoinCircle(
        data?.data?.circle_id,
        isAccept
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (data?.type === 'circle_send_invitation') {
      void fetchCircleById(data?.data?.circle_id);
    }
  }, []);

  return (
    <div
      className={`flex justify-between p-3 bg-[#F9FAFD] shadow-none rounded-2xl border w-full`}
      onClick={() => {
        if (data?.type === 'new_play') {
          void router.push(`/play/tournament/${data?.data?.play_id as string}`);
        } else if (data?.type === 'new_quiz') {
          void router.push(`/play/quiz/${data?.data?.quiz_id as string}`);
        } else if (data?.data?.event === 'play_winner') {
          setIsActive(!isActive);
        }
      }}
    >
      <div className="flex gap-3 items-center max-w-[70%] md:max-w-[80%]">
        {(variant === 'normal' || variant === 'social') && (
          <Image src={logo} alt="Logo" className="cursor-pointer w-7 h-7" />
        )}
        {(variant === 'play_joined' ||
          variant === 'play_winner_simulation') && (
          <Image src={PlayLogo} alt="Logo" className="cursor-pointer w-7 h-7" />
        )}
        {variant === 'discover_earn' && (
          <Image src={ExpNotif} alt="Logo" className="cursor-pointer w-7 h-7" />
        )}
        {(variant === 'play_sell_asset' || variant === 'play_buy_asset') && (
          <Image
            src={SuccessNotif}
            alt="Logo"
            className="cursor-pointer w-7 h-7"
          />
        )}
        {variant === 'circle_send_invitation' && (
          <img
            src={detailCircle?.avatar}
            alt="Logo"
            className="cursor-pointer w-8 h-8 rounded-full"
          />
        )}
        <div className="flex flex-col">
          <Typography className="font-semibold text-xs md:text-sm font-poppins text-[#1B1314] normal-case">
            {data.data.notification.title}
          </Typography>
          <Typography className="font-light md:font-normal text-xs md:text-sm font-poppins text-[#262626] normal-case">
            {data.data.notification.body}
          </Typography>
          {/* {variant === 'social' && (
            <Typography className="font-light md:font-normal text-xs md:text-sm font-poppins text-[#262626] normal-case">
              <span className="font-semibold">
                @{data.data.notification.body.split(' ')[0]}
              </span>
              {data.data.notification.body.replace(
                data.data.notification.body.split(' ')[0],
                ''
              )}
            </Typography>
          )} */}
        </div>
      </div>
      <div className="flex items-center">
        {variant !== 'circle_send_invitation' && (
          <Typography className="font-normal text-xs font-poppins text-[#7C7C7C] normal-case">
            {moment(data.created_at).fromNow()}
          </Typography>
        )}
        {variant === 'circle_send_invitation' && (
          <div className="flex gap-2">
            <Button
              onClick={() => {
                void acceptOrRejectInvitation(false);
              }}
              variant="filled"
              className={`shadow-none rounded-full normal-case px-3 py-2 h-fit w-fit text-[#FF4A2B] bg-[#FFE9D4] hover:shadow-none`}
            >
              Reject
            </Button>
            <Button
              onClick={() => {
                void acceptOrRejectInvitation(true);
              }}
              variant="filled"
              className={`shadow-none rounded-full normal-case px-3 py-2 h-fit w-fit text-[#3AC4A0] bg-[#DCFCE4] hover:shadow-none`}
            >
              Accept
            </Button>
          </div>
        )}
      </div>
      {isActive && (
        <PopupWinnerPlay
          playId={data?.data.play_id}
          onClose={() => {
            setIsActive(false);
          }}
        />
      )}
    </div>
  );
};

export default NotificationCard;
