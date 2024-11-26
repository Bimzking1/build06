'use client';
import flagId from '@/assets/flag-id.png';
import flagUs from '@/assets/flag-us.png';
import seeds from '@/assets/logo-seeds.png';
import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
export default function Header(): React.ReactElement {
  const { i18n, t } = useTranslation();
  const [active, setActive] = useState<string>(i18n.language);
  const isId = active === 'id';
  const idClass = isId ? 'border border-seeds-purple text-seeds-purple' : '';
  const enClass = isId ? '' : 'border border-seeds-purple text-seeds-purple';

  const languageHandler = (e: React.MouseEvent<HTMLElement>): void => {
    const { id } = e.target as HTMLButtonElement;
    setActive(id);
    void i18n.changeLanguage(id);
    localStorage.setItem('lng', id);
  };

  useEffect(() => {
    const lng = localStorage.getItem('lng') ?? '';
    setActive(lng);
    void i18n.changeLanguage(active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <div className="absolute top-[20px] flex items-center w-full justify-between px-20 z-20">
      <Image alt="img" className="" src={seeds} />
      <div className="flex justify-between w-[350px]">
        <div className="flex items-center w-[200px] justify-between">
          <div
            onClick={languageHandler}
            id="id"
            className={`${idClass} flex w-[80px] text-xs font-medium items-center bg-gray-300 rounded-full p-2 justify-center cursor-pointer hover:shadow-lg transition-all z-30`}
          >
            ID
            <Image
              id="id"
              className="ml-1 w-[20px] z-10"
              src={flagId}
              alt="id"
            />
          </div>

          <div className="px-3 text-center font-light ml-2">|</div>

          <div
            onClick={languageHandler}
            id="en"
            className={`${enClass} flex w-[80px] text-xs font-medium items-center bg-gray-300 rounded-full p-2 justify-center ml-2 cursor-pointer hover:shadow-lg transition-all z-30`}
          >
            EN
            <Image id="en" className="ml-1 w-[20px]" src={flagUs} alt="en" />
          </div>
        </div>
        <Button
          size="sm"
          className="capitalize text-md font-normal bg-seeds-button-green ml-3 rounded-full px-8 whitespace-nowrap"
        >
          {t('button.joinNow')}
        </Button>
      </div>
    </div>
  );
}
