import AuthArrowDown from '@/assets/auth/AuthArrowDown.svg';
import AuthGlobeLanguage from '@/assets/auth/AuthGlobeLanguage.svg';
import SeedsLogo from '@/assets/landing-page/header/SeedsLogo.svg';
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
import { useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface IPassLayout {
  elementChild: any;
  formChild: any;
}

interface ILogoLanguage {
  open: boolean;
  setOpen: (value: boolean) => void;
  selectedLanguage: 'EN' | 'ID';
  handleLanguageChange: (language: 'EN' | 'ID') => void;
  className: string;
  menuClassName: string;
}

const languageList = [{ language: 'ID' }, { language: 'EN' }];

const LogoLanguage: React.FC<ILogoLanguage> = ({
  open,
  setOpen,
  selectedLanguage,
  handleLanguageChange,
  className,
  menuClassName
}: ILogoLanguage) => {
  return (
    <div className={`${className}`}>
      <Image src={SeedsLogo} alt="SeedsLogo" className="w-[84.41px] lg:w-fit" />
      <Menu open={open} handler={setOpen}>
        <MenuHandler>
          <Button
            ripple={false}
            className="flex justify-between items-center lg:w-[136.62px] w-[97px] bg-[#9A76FE] rounded-full lg:p-2.5 px-2.5 py-1"
          >
            <div className="flex lg:gap-1.5 gap-[3px] items-center">
              <Image
                src={AuthGlobeLanguage}
                alt="AuthGlobeLanguage"
                className="w-[19px] lg:w-fit"
              />
              <Typography className="font-normal font-poppins text-xl text-white">
                {selectedLanguage}
              </Typography>
            </div>

            <Image
              src={AuthArrowDown}
              alt="AuthArrowDown"
              className={`w-[12px] lg:w-fit ${
                open ? 'transition-all rotate-180' : 'transition-all rotate-0'
              }`}
            />
          </Button>
        </MenuHandler>
        <MenuList
          className={`${menuClassName} min-w-fit flex-col items-center p-0 bg-transparent border-none shadow-none`}
        >
          {languageList
            .filter(item => item.language !== selectedLanguage)
            .map((item, index) => {
              return (
                <MenuItem
                  className="p-0 lg:w-[136.62px] w-[97px] bg-white rounded-full"
                  onClick={() => {
                    handleLanguageChange(item.language as 'EN' | 'ID');
                  }}
                  key={index}
                >
                  <Button
                    ripple={false}
                    className="flex justify-between items-center lg:w-[136.62px] w-[97px] bg-[#9A76FE] rounded-full lg:p-2.5 px-2.5 py-1 hover:shadow-none shadow-none"
                  >
                    <div className="flex lg:gap-1.5 gap-[3px] items-center">
                      <Image
                        src={AuthGlobeLanguage}
                        alt="AuthGlobeLanguage"
                        className="w-[19px] lg:w-fit"
                      />
                      <Typography className="font-normal font-poppins text-xl text-white">
                        {item.language}
                      </Typography>
                    </div>
                  </Button>
                </MenuItem>
              );
            })}
        </MenuList>
      </Menu>
    </div>
  );
};

const PassLayout: React.FC<IPassLayout> = ({
  elementChild,
  formChild
}: IPassLayout) => {
  const languageCtx = useContext(LanguageContext);
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'ID'>('EN');
  const [open, setOpen] = useState(false);
  const [height, setHeight] = useState(0);
  const handleLanguageChange = async (language: 'EN' | 'ID'): Promise<void> => {
    setSelectedLanguage(language);
    languageCtx.languageHandler(language);
    await setTranslationToLocalStorage(language);
    setOpen(!open);
  };

  const getLastTranslation = useCallback(async (): Promise<void> => {
    try {
      if (typeof window !== 'undefined') {
        const translation = getLocalStorage('translation', 'EN');
        languageCtx.languageHandler(translation as 'EN' | 'ID');
        setSelectedLanguage(translation);
      }
    } catch {
      toast.error('Error in translation');
    }
  }, []);
  useEffect(() => {
    setHeight(window.innerHeight);
    void getLastTranslation();
  }, []);
  return (
    <div
      className={`flex flex-row items-center bg-gradient-to-b from-[#B798FFB2] via-[#66B5C2B2] to-[#48C0ABB2] ${
        height >= 700 ? 'h-full' : ''
      }`}
    >
      <div className="flex flex-col md:justify-center justify-between md:hidden w-full h-full">
        <div className="flex flex-col gap-4 md:gap-0">
          <LogoLanguage
            open={open}
            setOpen={setOpen}
            selectedLanguage={selectedLanguage}
            handleLanguageChange={handleLanguageChange}
            className="flex justify-between m-4 md:hidden"
            menuClassName="flex md:hidden"
          />
          {elementChild}
        </div>
        <div className="bg-white w-full h-fit md:hidden p-[18px] rounded-t-[35px]">
          <div className="bg-gradient-to-t rounded-[19px] from-[#48C0ABB2] via-[#66B5C2B2] to-[#B798FFB2] p-[2px] h-full">
            <div className="flex relative justify-center items-center bg-white w-full rounded-[19px] h-full">
              {formChild}
            </div>
          </div>
        </div>
      </div>
      <div className="md:flex justify-center items-center hidden bg-white py-[109px] w-full h-full">
        <div className="w-[87%] flex flex-col gap-16">
          <LogoLanguage
            open={open}
            setOpen={setOpen}
            selectedLanguage={selectedLanguage}
            handleLanguageChange={handleLanguageChange}
            className="md:flex justify-between hidden"
            menuClassName="md:flex hidden"
          />
          <div className="bg-gradient-to-t rounded-[19px] from-[#48C0ABB2] via-[#66B5C2B2] to-[#B798FFB2] p-[2px]">
            <div className="flex relative justify-center items-center bg-white w-full rounded-[19px]">
              {formChild}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassLayout;
