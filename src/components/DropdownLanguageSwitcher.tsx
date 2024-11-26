'use client';
import CButton from '@/components/CButton';
import supportedLanguages from '@/constants/supportedLanguages';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const DropdownLanguageSwitcher = (): JSX.Element => {
  const { i18n } = useTranslation();

  const [dropdownVisibility, setDropdownVisibility] = useState<boolean>(false);
  const [selectedLang, setSelectedLang] = useState<string>(
    i18n.language.toUpperCase()
  );

  useEffect(() => {
    if (i18n.language !== selectedLang.toLocaleLowerCase()) {
      void i18n.changeLanguage(selectedLang.toLowerCase());
    }
  }, [i18n, selectedLang]);

  return (
    <div>
      <CButton
        onClick={() => {
          setDropdownVisibility(!dropdownVisibility);
        }}
        color="white"
        className={`px-4 py-2 w-[7rem] rounded-none rounded-t-lg ${
          !dropdownVisibility ? 'rounded-b-lg' : ''
        } lg:w-[8rem] shadow-lg focus:shadow-lg shadow-gray hover:shadow-gray flex items-center justify-between`}
      >
        <div className="flex items-center gap-1 lg:gap-2">
          <Image
            src={supportedLanguages[selectedLang].flag.src}
            alt={supportedLanguages[selectedLang].flag.alt}
            quality={50}
            width={10}
            height={10}
            className="rounded-full w-5 h-5 lg:w-6 lg:h-6 border-2 border-black"
            style={{ objectFit: 'contain', objectPosition: 'center center' }}
          />
          <Typography className="text-black font-bold">
            {selectedLang === 'ID' ? 'ID' : 'EN'}
          </Typography>
        </div>
        <div
          className={`w-3 transition ${
            dropdownVisibility ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <svg
            viewBox="0 0 19 11"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.56093 8.23855L7.56076 8.2387L9.81026 10.2973L12.0603 8.2387L12.0599 8.23835L18.8105 2.06002L16.5605 -9.83538e-08L9.81055 6.17916L3.06062 -6.88451e-07L0.810547 2.06002L7.56093 8.23855Z"
              fill="black"
            />
          </svg>
        </div>
      </CButton>
      {dropdownVisibility ? (
        <div
          onClick={() => {
            setSelectedLang(selectedLang === 'ID' ? 'EN' : 'ID');
            setDropdownVisibility(!dropdownVisibility);
          }}
          className="cursor-pointer absolute bg-white flex w-[7rem] shadow-lg shadow-gray gap-1 lg:gap-3 lg:w-[8rem] rounded-b-xl px-4 py-2"
        >
          <Image
            src={
              supportedLanguages[selectedLang === 'ID' ? 'EN' : 'ID'].flag.src
            }
            alt={
              supportedLanguages[selectedLang === 'ID' ? 'EN' : 'ID'].flag.alt
            }
            quality={50}
            width={10}
            height={10}
            className="rounded-full w-5 h-5 lg:w-6 lg:h-6 border-2 border-black object-contain object-[center_center]"
          />
          <Typography className="font-bold text-black">
            {selectedLang === 'ID' ? 'EN' : 'ID'}
          </Typography>
        </div>
      ) : null}
    </div>
  );
};

export default DropdownLanguageSwitcher;
