import close from '@/assets/more-option/close.svg';
import { setTranslationToLocalStorage } from '@/helpers/translation';
import LanguageContext from '@/store/language/language-context';
import { getLocalStorage } from '@/utils/common/localStorage';
import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader
} from '@material-tailwind/react';
import Image from 'next/image';
import ID from 'public/assets/social/flag/ID.png';
import US from 'public/assets/social/flag/US.png';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LangOption from '../profile/ChooseLanguageOption';

interface props {
  open: boolean;
  handleOpen: () => void;
}

const ChooselanguagePopup: React.FC<props> = ({ open, handleOpen }) => {
  const dataLang = [
    {
      label: 'Bahasa Indonesia',
      logo: ID,
      id: 'ID'
    },
    {
      label: 'English',
      logo: US,
      id: 'EN'
    }
  ];
  const languageCtx = useContext(LanguageContext);
  const { t } = useTranslation();
  const [value, setValue] = useState<string>('ID');
  useEffect(() => {
    setValue(languageCtx.language);
  }, [languageCtx]);
  useEffect(() => {
    const getLastTranslation = async (): Promise<void> => {
      try {
        if (typeof window !== 'undefined') {
          const translation = getLocalStorage('translation', 'EN');
          languageCtx.languageHandler(translation as 'EN' | 'ID');
        }
      } catch (error) {
        console.log(error);
      }
    };
    getLastTranslation().catch(err => {
      console.log(err);
    });
  }, []);
  return (
    <Dialog
      dismiss={{
        outsidePress: false
      }}
      open={open}
      size={'xs'}
      handler={handleOpen}
      className="text-center p-5 m-0 max-w-full sm:max-w-xs self-end sm:self-center md:self-center lg:self-center rounded-none rounded-t-2xl sm:rounded-2xl"
    >
      <DialogHeader className="p-0 font-poppins">
        <div className="min-w-full flex items-center justify-end">
          <div className="mb-4">
            <Image
              src={close}
              alt="close"
              className="cursor-pointer"
              onClick={() => {
                handleOpen();
              }}
            />
          </div>
        </div>
      </DialogHeader>
      <DialogBody className="p-0 mb-6 font-poppins">
        <p className="text-base font-semibold leading-6 text-gray-900 mb-2">
          {languageCtx.language === 'EN' ? 'Select Language' : 'Pilih Bahasa'}
        </p>
        <p className="font-normal text-sm mb-2">
          {languageCtx.language === 'EN'
            ? "Pick the language you're comfortable with!"
            : 'Pilih bahasa yang cocok dengan dirimu!'}
        </p>
        <div className="flex flex-col gap-4">
          {dataLang.map((el: any) => {
            return (
              <LangOption
                key={el.id}
                currentValue={value}
                onChange={option => {
                  setValue(option.id);
                }}
                option={el}
              />
            );
          })}
        </div>
      </DialogBody>
      <DialogFooter className="p-0">
        <Button
          className="rounded-full min-w-full capitalize font-semibold text-sm bg-[#3AC4A0] text-white font-poppins"
          onClick={() => {
            handleOpen();
            setTimeout(() => {
              languageCtx.languageHandler(value as 'EN' | 'ID');
              setTranslationToLocalStorage(value as 'EN' | 'ID').catch(err => {
                console.log(err);
              });
            }, 500);
          }}
        >
          {t('button.label.confirm')}
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
export default ChooselanguagePopup;
