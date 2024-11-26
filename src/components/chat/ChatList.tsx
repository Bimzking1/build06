import { type Chat } from '@/utils/interfaces/chat.interface';
import { Typography } from '@material-tailwind/react';
import moment from 'moment';
import { useRouter } from 'next/router';

interface props {
  data: Chat;
}

const ChatList: React.FC<props> = ({ data }) => {
  const router = useRouter();
  const { roomId } = router.query;
  return (
    <div
      key={data?.id}
      className={`flex w-full justify-start gap-2 py-2 px-2 border-b border-solid border-[#E9E9E9] cursor-pointer ${
        roomId !== undefined && roomId === data?.id
          ? 'bg-[#DCFCE4BF] rounded-xl'
          : 'bg-white'
      }`}
      onClick={() => {
        void router.replace(`/chat?roomId=${data?.id}`);
      }}
    >
      <div className="flex items-center shrink-0">
        <img src={data?.avatar} alt="avatar" className="rounded-full w-8 h-8" />
      </div>
      <div className="flex flex-col w-full">
        <div className="flex justify-between">
          <Typography className="font-semibold text-sm text-black font-poppins max-w-[60%] shrink text-ellipsis overflow-hidden whitespace-nowrap">
            {data?.name.slice(0, 20)}
          </Typography>
          <Typography className="font-normal text-xs text-[#27A590] font-poppins">
            {moment(data?.created_at).isSame(moment(), 'day')
              ? moment(data?.created_at).format('HH:mm')
              : moment(data?.created_at).format('L')}
          </Typography>
        </div>
        <div className="flex">
          <Typography className="font-normal text-sm text-[#7C7C7C] font-poppins max-w-[70%] max-h-[20px] text-ellipsis overflow-hidden">
            {data?.content_text.slice(0, 30)}
          </Typography>
          {data.total_unread > 0 && (
            <div className="rounded-full bg-[#3AC4A0] w-[24px] h-[24px] flex justify-center items-center">
              <Typography className="font-normal text-[10px] text-white font-poppins">
                {data?.total_unread}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatList;
