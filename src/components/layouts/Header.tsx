import BurgerMenu from '@/assets/landing-page/header/BurgerMenu.svg';
import ChevronDown from '@/assets/landing-page/header/ChevronDown.svg';
import SeedLogo from '@/assets/landing-page/header/SeedsLogo.svg';
import TrackerEvent from '@/helpers/GTM';
import { setTranslationToLocalStorage } from '@/helpers/translation';
import LanguageContext from '@/store/language/language-context';
import { getLocalStorage } from '@/utils/common/localStorage';
import {
  Button,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import ID from 'public/assets/images/flags/ID.png';
import US from 'public/assets/images/flags/US.png';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Redirecting from '../popup/Redirecting';

interface VariableHeader {
  className?: string;
}

const pathUrl = [
  { id: 1, name: 'Home', nama: 'Beranda', url: '/' },
  { id: 2, name: 'Product', nama: 'Produk', url: '/product' },
  { id: 3, name: 'Seedspedia', nama: 'Seedspedia', url: '/seedspedia' },
  // { id: 4, name: 'Market', nama:'Pasar', url: '/market' },
  { id: 5, name: 'Partner', nama: 'Mitra', url: '/partner' },
  { id: 6, name: 'About Us', nama: 'Tentang Kami', url: '/about-us' }
];

const languageList = [
  { id: 1, language: 'ID', flag: ID },
  { id: 2, language: 'EN', flag: US }
];

const Header: React.FC<VariableHeader> = ({ className }: VariableHeader) => {
  const { t } = useTranslation();
  const [openMenu, setOpenMenu] = useState(false);
  const [open, setOpen] = useState(false);
  const languageCtx = useContext(LanguageContext);
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'ID'>('EN');

  const handleOpen = (): void => {
    setOpen(!open);
  };

  const handleLanguageChange = (language: 'EN' | 'ID'): void => {
    setSelectedLanguage(language);
    languageCtx.languageHandler(language);
    setTranslationToLocalStorage(language).catch(err => {
      console.log(err);
    });
  };

  useEffect(() => {
    const getLastTranslation = async (): Promise<void> => {
      try {
        if (typeof window !== 'undefined') {
          const translation = getLocalStorage('translation', 'EN');
          languageCtx.languageHandler(translation as 'EN' | 'ID');
          setSelectedLanguage(translation);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getLastTranslation().catch(err => {
      console.log(err);
    });
    if (
      localStorage.getItem('accessToken') !== null &&
      parseInt(localStorage.getItem('expiresAt') as string) > Date.now() / 1000
    ) {
      if (window.location.pathname !== '/auth/change-phone-number') {
        router
          .push('/homepage')
          .then()
          .catch(() => {});
        handleOpen();
      }
    } else {
      localStorage.removeItem('accessToken');
    }
  }, []);

  return (
    <nav className={`fixed z-50 ${className as string} w-full bg-white`}>
      <Redirecting open={open} handleOpen={handleOpen} />
      {/* TODO: NEW HEADER */}
      <section className="xl:flex hidden justify-evenly h-20 items-center">
        <Link href="https://seeds.finance">
          <Image
            alt="SeedsLogo"
            src={SeedLogo}
            width={97}
            height={36.77}
            className="mr-9"
          />
        </Link>
        <section className="flex flex-row font-poppins text-xl font-semibold gap-4 items-center">
          {pathUrl.map((item, index) => {
            return (
              <Link
                className={`${
                  router.pathname === `${item.url}`
                    ? 'text-[#3AC4A0] underline-offset-8 underline'
                    : 'text-[#7C7C7C]'
                } px-3`}
                href={`${item.url}`}
                key={item.id}
                onClick={() => {
                  TrackerEvent({
                    event: `SW_landing_${item.name
                      .toLowerCase()
                      .replace(' ', '_')}_page`
                  });
                }}
              >
                {selectedLanguage === 'EN' ? item.name : item.nama}
              </Link>
            );
          })}
        </section>
        <section className="flex items-center gap-8">
          <Link
            href="/auth"
            className=" flex justify-center items-center cursor-pointer text-base font-semibold font-poppins text-white w-[140px] h-[42px] bg-[#3AC4A0] rounded-full"
          >
            {t('header.join')}
          </Link>

          <Menu>
            <MenuHandler>
              <Button
                ripple={false}
                className="flex items-center justify-center gap-1.5 rounded-full bg-[#E9E9E9] w-[110px] h-11 hover:shadow-none shadow-none"
              >
                <Typography className="text-lg text-black font-semibold font-poppins">
                  {selectedLanguage}
                </Typography>
                {selectedLanguage === 'EN' ? (
                  <Image src={US} width={30} alt="US-flag" />
                ) : (
                  <Image src={ID} width={30} alt="ID-flag" />
                )}
                <Image src={ChevronDown} alt="ChevronDown" />
              </Button>
            </MenuHandler>
            <MenuList className="flex flex-col items-center p-0 bg-transparent border-none shadow-none">
              {languageList
                .filter(item => item.language !== selectedLanguage)
                .map((item, index) => {
                  return (
                    <MenuItem
                      className="p-0 w-[110px] bg-white rounded-full"
                      onClick={() => {
                        handleLanguageChange(item.language as 'EN' | 'ID');
                      }}
                      key={item.id}
                    >
                      <Button
                        ripple={false}
                        className="flex items-center justify-center gap-1.5 rounded-full bg-[#E9E9E9] w-[110px] h-11 hover:shadow-none shadow-none"
                      >
                        <Typography className="text-lg text-black font-semibold font-poppins">
                          {item.language}
                        </Typography>
                        <Image
                          src={item.flag}
                          width={19}
                          alt={`${item.language} flag`}
                        />
                      </Button>
                    </MenuItem>
                  );
                })}
            </MenuList>
          </Menu>
        </section>
      </section>
      {/* TODO: END NEW HEADER */}
      <section className="flex xl:hidden justify-between mx-4 items-center h-20">
        <Link href="https://seeds.finance">
          <Image alt="SeedsLogo" src={SeedLogo} height={46} />
        </Link>
        <Menu
          placement="left-start"
          offset={-24}
          dismiss={{
            ancestorScroll: true
          }}
          open={openMenu}
          handler={setOpenMenu}
        >
          <MenuHandler>
            <Image
              src={BurgerMenu}
              alt="BurgerMenu"
              className="cursor-pointer z-20"
            />
          </MenuHandler>
          <MenuList className="pb-12 shadow-none border-none xl:hidden flex flex-col">
            {pathUrl.map((item, index) => {
              return (
                <MenuItem
                  key={item.id}
                  className="hover:bg-transparent focus:bg-transparent"
                >
                  <Link
                    href={item.url}
                    className={` font-poppins font-normal text-base ${
                      router.pathname === item.url
                        ? 'text-[#3AC4A0]'
                        : 'text-[#7C7C7C]'
                    }`}
                    onClick={async () => {
                      setOpenMenu(false);
                      TrackerEvent({
                        event: `SW_landing_${item.name.toLowerCase()}_page`
                      });
                    }}
                  >
                    {selectedLanguage === 'EN' ? item.name : item.nama}
                  </Link>
                </MenuItem>
              );
            })}
            <MenuItem className="flex justify-center hover:bg-transparent focus:bg-transparent">
              <Link
                href="/auth"
                className=" flex justify-center items-center cursor-pointer text-base font-semibold font-poppins text-white w-[140px] h-[42px] bg-[#3AC4A0] rounded-full"
              >
                {t('header.join')}
              </Link>
            </MenuItem>
            <MenuItem className="flex justify-center hover:bg-transparent focus:bg-transparent">
              <Menu>
                <MenuHandler>
                  <Button
                    ripple={false}
                    className="flex items-center justify-center gap-1.5 rounded-full bg-[#E9E9E9] w-[110px] h-11 hover:shadow-none shadow-none"
                  >
                    <Typography className="text-lg text-black font-semibold font-poppins">
                      {selectedLanguage}
                    </Typography>
                    {selectedLanguage === 'EN' ? (
                      <Image src={US} width={30} alt="US-flag" />
                    ) : (
                      <Image src={ID} width={30} alt="ID-flag" />
                    )}
                    <Image src={ChevronDown} alt="ChevronDown" />
                  </Button>
                </MenuHandler>
                <MenuList className="flex flex-col items-center p-0 bg-transparent border-none shadow-none">
                  {languageList
                    .filter(item => item.language !== selectedLanguage)
                    .map((item, index) => {
                      return (
                        <MenuItem
                          className="p-0 w-[110px] bg-white rounded-full"
                          onClick={() => {
                            handleLanguageChange(item.language as 'EN' | 'ID');
                          }}
                          key={item.id}
                        >
                          <Button
                            ripple={false}
                            className="flex items-center justify-center gap-1.5 rounded-full bg-[#E9E9E9] w-[110px] h-11 hover:shadow-none shadow-none"
                          >
                            <Typography className="text-lg text-black font-semibold font-poppins">
                              {item.language}
                            </Typography>
                            <Image
                              src={item.flag}
                              width={19}
                              alt={`${item.language} flag`}
                            />
                          </Button>
                        </MenuItem>
                      );
                    })}
                </MenuList>
              </Menu>
            </MenuItem>
          </MenuList>
        </Menu>
      </section>
    </nav>
  );
};

export default Header;
