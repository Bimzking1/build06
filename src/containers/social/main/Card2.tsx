import CCard from '@/components/CCard';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { Avatar } from '@material-tailwind/react';
import Image from 'next/image';
import { Sprout } from 'public/assets/images';
import { useTranslation } from 'react-i18next';

interface UserData {
  name: string;
  seedsTag: string;
  email: string;
  pin: string;
  avatar: string;
  bio: string;
  birthDate: string;
  phone: string;
  preferredLanguage: string;
  _pin: string;
  verified: boolean;
}

interface props {
  userData: UserData;
  handleOpen: () => void;
}

const Card2: React.FC<props> = ({ userData, handleOpen }) => {
  const { t } = useTranslation();
  return (
    <CCard className="flex p-8 md:mt-5 md:rounded-lg border-none rounded-none">
      <div className="flex flex-row">
        <Avatar
          size="md"
          variant="circular"
          src={userData.avatar}
          alt="Avatar"
          className="mr-5"
        />
        <div className="flex flex-col w-full">
          <div className="flex flex-row gap-2">
            <p className="text-base font-semibold font-poppins text-black">
              {userData.name}
            </p>
            {userData.verified && (
              <CheckCircleIcon width={20} height={20} color="#5E44FF" />
            )}
            <Image src={Sprout.src} alt={Sprout.alt} width={20} height={20} />
          </div>
          <p className="text-base font-light text-[#7C7C7C] mb-3 font-poppins">
            @{userData.seedsTag}
          </p>
          <div
            className="border border-[#7C7C7C] rounded-2xl w-full p-4 cursor-pointer"
            onClick={() => {
              handleOpen();
            }}
          >
            <p>{t('social.placeholder1')}</p>
            <p>{t('social.placeholder2')}</p>
          </div>
        </div>
      </div>
    </CCard>
  );
};

export default Card2;
