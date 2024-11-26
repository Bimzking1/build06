import { standartCurrency } from '@/helpers/currency';
import { type TeamBattleDetail } from '@/utils/interfaces/team-battle.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import Image from 'next/image';
import { CloseBattlePrize, GreenGift } from 'public/assets/vector';
import React from 'react';

interface PopUpJoinBattleProps {
  isOpen: boolean;
  onClose: () => void;
  userInfo: UserInfo;
  data: TeamBattleDetail;
}

const PopUpPrizeBattle: React.FC<PopUpJoinBattleProps> = ({
  isOpen,
  onClose,
  userInfo,
  data
}) => {
  const handleClose = (): void => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 flex justify-center items-center z-50 w-full">
      <div className="relative bg-white/50 border border-white rounded-3xl shadow-lg w-11/12 md:w-[450px] h-fit p-2 text-center">
        <div className="w-full flex justify-end items-end mt-2 mb-4">
          <div
            onClick={() => {
              handleClose();
            }}
            className="w-[40px] h-[40px] flex justify-center items-center cursor-pointer hover:scale-125 duration-300"
          >
            <Image
              alt={'CloseBattlePrize'}
              src={CloseBattlePrize}
              width={100}
              height={100}
              className="w-full h-full"
            />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4">
          <div className="w-full flex justify-center items-center">
            <div className="w-[50px] h-[50px] flex justify-center items-center">
              <Image
                alt={'GreenGift'}
                src={GreenGift}
                width={100}
                height={100}
                className="w-full h-full"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-col gap-2 font-semibold">
            <div className="border border-[#407F74] rounded-lg flex flex-col justify-center items-center p-2">
              <div>
                1.{' '}
                {`${
                  (userInfo?.preferredCurrency ?? 'Rp') === 'IDR'
                    ? 'Rp'
                    : userInfo?.preferredCurrency
                }${standartCurrency(data?.prize[0]?.amount ?? 0).replace(
                  'Rp',
                  ''
                )}`}
              </div>
              <div>{data?.prize[0]?.description ?? 'Loading ...'}</div>
            </div>
            <div className="border border-[#407F74] rounded-lg flex flex-col justify-center items-center p-2">
              <div>
                2.{' '}
                {`${
                  (userInfo?.preferredCurrency ?? 'Rp') === 'IDR'
                    ? 'Rp'
                    : userInfo?.preferredCurrency
                }${standartCurrency(data?.prize[1]?.amount ?? 0).replace(
                  'Rp',
                  ''
                )}`}
              </div>
              <div>{data?.prize[1]?.description ?? 'Loading ...'}</div>
            </div>
            <div className="border border-[#407F74] rounded-lg flex flex-col justify-center items-center p-2">
              <div>
                3.{' '}
                {`${
                  (userInfo?.preferredCurrency ?? 'Rp') === 'IDR'
                    ? 'Rp'
                    : userInfo?.preferredCurrency
                }${standartCurrency(data?.prize[2]?.amount ?? 0).replace(
                  'Rp',
                  ''
                )}`}
              </div>
              <div>{data?.prize[2]?.description ?? 'Loading ...'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopUpPrizeBattle;
