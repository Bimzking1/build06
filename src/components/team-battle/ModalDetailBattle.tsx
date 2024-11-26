'use client';
import FirstMedal from '@/assets/play/quiz/Medal-1.svg';
import SecondMedal from '@/assets/play/quiz/Medal-2.svg';
import ThirdMedal from '@/assets/play/quiz/Medal-3.svg';
import SubsequentMedal from '@/assets/play/quiz/Medal-4-10.svg';
import { standartCurrency } from '@/helpers/currency';
import { Typography } from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import { XIcon } from 'public/assets/vector';
import { useTranslation } from 'react-i18next';
import Modal from '../ui/modal/Modal';

interface Props {
  onClose: () => void;
  category: string;
  playTime: string;
  endTime: string;
  fixedPrize: number;
  fixedPrizePercentages: number[];
  tnc: string;
  length: number;
  userInfoCurrency: string;
}

const ModalDetailBattle: React.FC<Props> = ({
  onClose,
  length,
  playTime,
  endTime,
  category,
  fixedPrize,
  fixedPrizePercentages,
  tnc,
  userInfoCurrency
}) => {
  const { t } = useTranslation();
  //   const languageCtx = useContext(LanguageContext);

  // Handle category as a comma-separated string for display
  // const categoryString = category.join(', ');

  return (
    <Modal
      onClose={onClose}
      backdropClasses="z-40 fixed top-0 left-0 w-full h-screen bg-black/75 flex justify-start items-start"
      modalClasses="z-50 animate-slide-down fixed bottom-0 md:top-[40%] md:left-[10%] md:right-[-10%] xl:left-[22.5%] xl:right-[-22.5%] mt-[-12.35rem] w-full md:w-[80%] xl:w-[60%] h-[70vh] p-4 rounded-3xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white overflow-y-scroll"
    >
      <div className="flex justify-between">
        <Typography className="font-bold text-lg text-[#3AC4A0]">
          Detail Arena
        </Typography>
        <Image
          src={XIcon}
          alt="X"
          width={30}
          height={30}
          onClick={onClose}
          className="hover:scale-110 transition ease-out cursor-pointer"
        />
      </div>
      <div className="flex flex-col justify-start items-start mt-4">
        <Typography className="font-semibold font-poppins">
          {t('tournament.participants')}
        </Typography>
        <Typography className="font-poppins text-[#7C7C7C]">
          {length} {t('tournament.participants')}
        </Typography>
        <Typography className="font-semibold font-poppins">
          {t('tournament.detailPeriod')}
        </Typography>
        <Typography className="font-poppins text-[#7C7C7C]">
          {moment(playTime).format('D MMM YYYY, h a')} Jakarta -{' '}
          {moment(endTime).format('D MMM YYYY, h a')} Jakarta
        </Typography>
        <Typography className="font-semibold font-poppins">
          {t('tournament.categoryAsset')}
        </Typography>
        <Typography className="font-poppins text-[#7C7C7C]">
          {category}
        </Typography>
      </div>
      <div className="mt-4">
        <div className="text-lg font-semibold">
          {t('tournament.detailPrize')}
        </div>
        <table className="mt-2">
          {/* Fixed prize */}
          {/* <tr>
            <td className="inline-flex gap-2 border p-3 w-full">
              <Image
                src={FirstMedal}
                alt="first-medal"
                width={200}
                height={200}
                className="object-contain max-h-5 max-w-5"
              />
              {t('tournament.first')}
            </td>
            <td className="border p-3 w-full">
              {userInfoCurrency?.length > 0 ? userInfoCurrency : 'IDR'}
              {standartCurrency(fixedPrize).replace('Rp', '')}
            </td>
          </tr> */}
          {/* Percentage prizes */}
          {fixedPrizePercentages?.map((prize, index) => (
            <tr key={index}>
              <td className="inline-flex gap-2 border p-3 w-full">
                <Image
                  src={
                    index === 0
                      ? FirstMedal
                      : index === 1
                      ? SecondMedal
                      : index === 2
                      ? ThirdMedal
                      : SubsequentMedal
                  }
                  alt={`${index}-medal`}
                  width={200}
                  height={200}
                  className="object-contain max-h-5 max-w-5"
                />
                {index + 1}
                {index === 0
                  ? 'st'
                  : index === 1
                  ? 'nd'
                  : index === 2
                  ? 'rd'
                  : 'th'}
              </td>
              <td className="border p-3 w-full">
                {userInfoCurrency?.length > 0 ? userInfoCurrency : 'IDR'}
                {standartCurrency(prize).replace('Rp', '')}
              </td>
            </tr>
          ))}
        </table>
      </div>
      <div className="mt-4">
        <p className="text-lg font-semibold">{t('tournament.detailTerms')}</p>
        <div
          className="text-[#7C7C7C]"
          dangerouslySetInnerHTML={{ __html: tnc }}
        />
      </div>
      <div className="mt-4">
        <p className="text-lg font-semibold">
          {t('tournament.detailResponsibility')}
        </p>
        <p className="text-[#7C7C7C]">
          • {t('tournament.seedsResponsibility1')}
        </p>
        <p className="text-[#7C7C7C]">
          • {t('tournament.seedsResponsibility2')}
        </p>
      </div>
    </Modal>
  );
};

export default ModalDetailBattle;
