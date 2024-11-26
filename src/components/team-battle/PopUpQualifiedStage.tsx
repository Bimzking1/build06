import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import EliminatedSeedy from '../../../public/assets/team-battle/eliminated-battle.svg';
import FailSeedy from '../../../public/assets/team-battle/fail-battle.svg';
import QualifiedSeedy from '../../../public/assets/team-battle/qualified-battle.svg';
import WinSeedy from '../../../public/assets/team-battle/win-battle.svg';

interface PopUpQualifiedStageProps {
  isOpen: boolean;
  onClose: () => void;
  categoryPopUp?: string;
  rank?: number;
}

const PopUpQualifiedStage: React.FC<PopUpQualifiedStageProps> = ({
  isOpen,
  onClose,
  categoryPopUp,
  rank
}) => {
  const { t } = useTranslation();
  
  if (!isOpen) return null;

  const popUpContent: Array<{
    category: string;
    banner: string;
    title: string;
    description: string;
  }> = [
    {
      category: 'win',
      banner: WinSeedy,
      title: 'winTitle',
      description: 'winDescription'
    },
    {
      category: 'qualified',
      banner: QualifiedSeedy,
      title: 'qualifiedTitle',
      description: 'qualifiedDescription'
    },
    {
      category: 'fail',
      banner: FailSeedy,
      title: 'failTitle',
      description: 'failDescription'
    },
    {
      category: 'eliminated',
      banner: EliminatedSeedy,
      title: 'eliminatedTitle',
      description: 'eliminatedDescription'
    }
  ];
  return (
    <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-50">
      <div className="relative bg-white/50 rounded-3xl shadow-lg">
        <div className="py-6 px-3">
          <div className="rounded-3xl bg-white lg:w-[375px] w-[305px] h-full p-6 flex flex-col justify-center items-center gap-6">
            <Image
              src={
                popUpContent.find(item => item.category === categoryPopUp)
                  ?.banner ?? ''
              }
              alt={'Expression'}
              width={225}
              height={225}
              className="lg:w-[225px] lg:h-[225px] w-[180px] h-[180px]"
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <Typography className="font-poppins text-[#407F74] lg:text-[34px] text-[28px] font-semibold">
                {t(
                  `teamBattle.popUpStage.${
                    popUpContent.find(item => item.category === categoryPopUp)
                      ?.title ?? ''
                  }`
                )}
              </Typography>
              <Typography className="text-center font-poppins font-normal lg:text-[17px] text-sm">
                {t(
                  `teamBattle.popUpStage.${
                    popUpContent.find(item => item.category === categoryPopUp)
                      ?.description ?? ''
                  }`
                )}
              </Typography>
            </div>
            <Typography className="font-poppins font-semibold lg:text-xl text-base">
              {t('teamBattle.popUpStage.yourRank')} {''}
              {rank !== 0 ? `#${rank as number}` : ': unranked'}
            </Typography>
            <Button
              onClick={onClose}
              className="rounded-full border-[2px] bg-[#2934B2] border-white lg:text-[17px] text-sm font-semibold font-poppins w-[190px]"
            >
              OK
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopUpQualifiedStage;
