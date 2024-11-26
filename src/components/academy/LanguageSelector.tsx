import { setTranslationToLocalStorage } from '@/helpers/translation';
import LanguageContext from '@/store/language/language-context';
import {
  Avatar,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList
} from '@material-tailwind/react';
import Image from 'next/image';
import IDFlag from 'public/assets/images/flags/ID.png';
import USFlag from 'public/assets/images/flags/US.png';
import React, { useContext } from 'react';
import { toast } from 'react-toastify';

const LanguageSelector: React.FC = () => {
  const languageCtx = useContext(LanguageContext);

  const handleLanguageChange = (language: 'EN' | 'ID'): void => {
    languageCtx.languageHandler(language);
    setTranslationToLocalStorage(language).catch(err => {
      toast(`Error setting language: ${err as string}`);
    });
  };

  return (
    <Menu placement="bottom-end">
      <MenuHandler>
        <Avatar
          src={languageCtx.language === 'EN' ? USFlag.src : IDFlag.src}
          alt={languageCtx.language === 'EN' ? 'US-Flag' : 'ID-Flag'}
          size="xs"
          className="cursor-pointer"
        />
      </MenuHandler>
      <MenuList>
        <MenuItem
          onClick={() => {
            handleLanguageChange('ID');
          }}
          className="flex items-center space-x-2"
        >
          <Image
            src={IDFlag}
            alt="ID-Flag"
            width={20}
            height={20}
            className="rounded-full object-cover"
          />
          <span>Indonesia</span>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleLanguageChange('EN');
          }}
          className="flex items-center space-x-2"
        >
          <Image
            src={USFlag}
            alt="US-Flag"
            width={20}
            height={20}
            className="rounded-full object-cover"
          />
          <span>English</span>
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default LanguageSelector;
