import LanguageContext from '@/store/language/language-context';
import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import { SeedyBattleClosed } from 'public/assets/images';
import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';

interface PopUpJoinBattleProps {
  isOpen: boolean;
  onClose: () => void;
  currentStage: string;
}

const PopUpRegistrationClosed: React.FC<PopUpJoinBattleProps> = ({
  isOpen,
  onClose,
  currentStage
}) => {
  const { t } = useTranslation();
  const languageCtx = useContext(LanguageContext);
  const handleClose = (): void => {
    onClose();
  };

  if (!isOpen) return null;

  const handleStageName = (): string => {
    if (languageCtx?.language === 'ID') {
      if (currentStage === 'ELIMINATION') {
        return 'penyisihan'
      } else if (currentStage === 'SEMIFINAL') {
        return 'semifinal'
      } else if (currentStage === 'FINAL') {
        return 'final'
      } else {
        return '';
      }
    } else {
      if (currentStage === 'ELIMINATION') {
        return 'elimination stage'
      } else if (currentStage === 'SEMIFINAL') {
        return 'semifinal stage'
      } else if (currentStage === 'FINAL') {
        return 'final stage'
      } else {
        return '';
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-50 w-full">
      <div className="relative bg-white/50 border border-white rounded-3xl shadow-lg w-11/12 md:w-[450px] h-fit p-2 text-center">
        <div className="bg-white rounded-2xl p-4">
          <div className="w-full flex justify-center items-center">
            <div className="w-[200px] h-auto flex justify-center items-center">
              <Image
                alt={'SeedyBattleClosed'}
                src={SeedyBattleClosed}
                width={1000}
                height={1000}
                className="w-full h-full"
              />
            </div>
          </div>
          <div className='flex flex-col gap-1 my-4 text-normal md:text-lg font-poppins'>
            <div>
              {t('teamBattle.battleClosed1')}
            </div>
            {
              currentStage !== 'ENDED' ? (
                currentStage !== 'CANCELED' ? (
                  <div>
                    {t('teamBattle.battleClosed2')} {handleStageName()}!
                  </div>
                ) : (
                  <div>
                    {t('teamBattle.battleClosed4')}
                  </div>
                )
              ) : (
                <div>
                  {t('teamBattle.battleClosed3')}
                </div>
              )
            }
          </div>
          <Button
            onClick={() => {
              handleClose();
            }}
            className='w-[150px] bg-[#5E44FF] rounded-full shadow-lg hover:shadow-xl hover:scale-110 duration-300 mb-2'
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PopUpRegistrationClosed;
