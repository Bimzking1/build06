import ChatList from '@/components/chat/ChatList';
import type { Chat } from '@/utils/interfaces/chat.interface';
import Image from 'next/image';
import { filterSearch } from 'public/assets/chat';
import { SearchMember } from 'public/assets/circle';
import { useState } from 'react';

interface props {
  data: Chat[];
  handleFilterUnreadChange: () => void;
  handleListClick: () => void;

  isLoading: boolean;
}

const ContactList: React.FC<props> = ({
  data,
  handleListClick,
  handleFilterUnreadChange
}) => {
  const [filter, setFilter] = useState<string>('');
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFilter(e.target.value);
  };
  const filteredChats = data.filter(chat =>
    chat.name.toLowerCase().includes(filter.toLowerCase())
  );
  return (
    <div className="flex flex-col">
      <div className="flex justify-start gap-2">
        <div className="flex justify-center flex-col absolute left-2 pt-2">
          <Image
            alt="Search"
            src={SearchMember}
            className="h-6 w-6 object-cover"
          />
        </div>
        <input
          type="text"
          value={filter}
          onChange={handleFormChange}
          className="h-10 pl-10 focus:outline-none placeholder:text-neutral-soft rounded-xl w-full border border-neutral-ultrasoft text-xs"
          placeholder="search"
        />
        <div
          onClick={handleFilterUnreadChange}
          className="flex items-center cursor-pointer"
        >
          <Image alt="Search" src={filterSearch} width={24} height={24} />
        </div>
      </div>
      <div
        onClick={handleListClick}
        className={`flex flex-col max-h-[40vh] overflow-x-hidden mt-4 w-full`}
      >
        {filteredChats?.map((el: Chat) => {
          return <ChatList data={el} key={el.id} />;
        })}
      </div>
    </div>
  );
};

export default ContactList;
