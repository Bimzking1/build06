import { type SearchUserChat } from '@/utils/interfaces/chat.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';

interface props {
  data: SearchUserChat;
  addToList: (user: SearchUserChat) => void;
}

const UserList: React.FC<props> = ({ data, addToList }) => {
  return (
    <div
      onClick={() => {
        addToList(data);
      }}
      className="w-full flex justify-between items-center pr-4"
    >
      <div className="flex gap-4">
        <Image
          src={data?.avatar}
          alt="Avatar"
          width={48}
          height={48}
          className="rounded-full w-12 h-12"
        />
        <div className="flex flex-col">
          <Typography className="text-md font-semibold text-[#262626] font-poppins mb-1">
            {data?.name}
          </Typography>
          <Typography className="text-md text-[#7c7c7c] font-poppins mb-1">
            {data?.seedsTag}
          </Typography>
        </div>
      </div>
      <div className="size-4 rounded-full border-2 border-[#DADADA]"></div>
    </div>
  );
};

export default UserList;
