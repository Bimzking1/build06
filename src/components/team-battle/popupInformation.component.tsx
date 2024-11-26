import i18n from '@/utils/common/i18n';
import { type TeamBattleDetail } from '@/utils/interfaces/team-battle.interface';
import moment from 'moment';
import Image from 'next/image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AiOutlineClose } from 'react-icons/ai';
import { CiSquareChevUp } from 'react-icons/ci';

interface PopupInformationProps {
  isOpen: boolean;
  onClose: () => void;
  infoBattle?: TeamBattleDetail;
}

const PopupInformation: React.FC<PopupInformationProps> = ({
  onClose,
  isOpen,
  infoBattle
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-50">
      <div className="relative bg-white/50 rounded-3xl shadow-lg w-[590px] h-[580px]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-[#ff4672] border-white border-4 text-white rounded-full p-2 transform scale-100 hover:scale-110 transition-transform duration-300 cursor-pointer"
        >
          <AiOutlineClose size={15} />
        </button>
        <div className="pt-14 px-4 pb-4 overflow-y-auto">
          <div className="rounded-3xl bg-gradient-to-r from-[#227e7f]/85 to-[#4760a8]/85 overflow-hidden h-[500px] w-[558px]">
            <div className="relative w-full h-40 overflow-hidden">
              <Image
                src={infoBattle?.banner ?? ''}
                alt="battle-banner"
                fill
                style={{ objectFit: 'cover' }}
                className="absolute top-0 left-0"
              />
            </div>
            <div className="flex flex-col justify-center items-center gap-2 py-2">
              <div className="text-2xl font-bold text-white text-center">
                {infoBattle?.title}
              </div>
              <div className="flex flex-col overflow-y-auto max-h-[240px] w-full team-battle-scroll">
                <div className="text-white font-semibold flex flex-row justify-center items-center gap-1">
                  <span className="text-base font-semibold">
                    {t('teamBattle.history.moreInfo')}
                  </span>
                  <CiSquareChevUp size={20} />
                </div>
                <div className="py-2 px-5 border-white border-2 rounded-3xl text-white text-base font-normal flex justify-center mx-auto">
                  {t('teamBattle.mainPage.period')} :{' '}
                  {moment(infoBattle?.registration_start).format('DD MMM YYYY')}{' '}
                  - {moment(infoBattle?.final_end).format('DD MMM YYYY')}
                </div>
                <div
                  className="text-sm text-white font-normal mt-2 py-2 pb-5 px-4"
                  dangerouslySetInnerHTML={{
                    __html:
                      infoBattle?.tnc?.[
                        i18n.language === 'id' ? 'id' : 'en'
                      ]?.replace(/\n/g, '<br />') ?? '-'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupInformation;