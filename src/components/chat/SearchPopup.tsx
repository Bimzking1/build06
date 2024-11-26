'use client';
import Image from 'next/image';
import { XIcon } from 'public/assets/vector';
// import { useTranslation } from 'react-i18next';
import { type SearchUserChat } from '@/utils/interfaces/chat.interface';
import { Typography } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import Modal from '../ui/modal/Modal';
interface Props {
  onClose: () => void;
  onChange: (value: string) => void;
  onSelect: () => void;
  value: string;
  userList: SearchUserChat[];
}

const SearchChatPopup: React.FC<Props> = ({
  onClose,
  onChange,
  onSelect,
  value,
  userList
}) => {
  //   const { t } = useTranslation();
  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    onChange(event.target.value);
  };
  const router = useRouter();

  const renderUserList = (): JSX.Element | null => {
    if (userList.length > 0) {
      return (
        <div>
          {userList.map(item => (
            <div
              key={item.id}
              className="flex w-full gap-2 mt-4 overflow-hidden cursor-pointer"
              onClick={() => {
                void router.replace(`/chat?roomId=${item.id}`);
                onSelect();
                onClose();
              }}
            >
              <Image
                src={item.avatar}
                alt="Avatar"
                width={48}
                height={48}
                className="rounded-full"
              />
              <div className="flex flex-col gap-1">
                <Typography className="text-md text-left font-semibold text-[#262626] font-poppins">
                  {item.name}
                </Typography>
                <Typography className="text-sm text-left text-[#7C7C7C] font-poppins">
                  {item.seedsTag}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      );
    } else {
      return null;
    }
  };
  return (
    <Modal onClose={onClose}>
      <div className="flex justify-between mb-3">
        <h1 className="text-lg font-semibold font--poppins text-[#262626]">
          New Chat
        </h1>
        <Image
          src={XIcon}
          alt="X"
          width={30}
          height={30}
          onClick={onClose}
          className="hover:scale-110 transition ease-out cursor-pointer"
        />
      </div>
      <hr></hr>
      <div className="flex flex-col border border-1 border-[#7C7C7C] rounded-full px-4 gap-3 mt-3 justify-between">
        <div className="flex w-full">
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            className="focus:outline-none placeholder:text-[#7C7C7C] w-full text-sm font-normal py-3 px-4 rounded-full"
            placeholder="Search"
          />
          <div className="flex mx-2 mt-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_6749_1443)">
                <path
                  d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"
                  fill="#262626"
                />
              </g>
              <defs>
                <clipPath id="clip0_6749_1443">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      {renderUserList()}
    </Modal>
  );
};

export default SearchChatPopup;
