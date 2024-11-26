import { Switch } from '@material-tailwind/react';
import Image from 'next/image';
import React from 'react';
import goldSeedsCoin from '../../../../public/assets/images/goldHome.svg';

interface Props {
  totalAvailableCoins: number;
  useCoins: boolean;
  setUseCoins: React.Dispatch<React.SetStateAction<boolean>>;
}

const QuizCoins: React.FC<Props> = ({
  totalAvailableCoins,
  useCoins,
  setUseCoins
}: Props) => {
  return (
    <div className="hidden sm:flex flex-row items-center justify-between">
      <div className="flex flex-row items-center">
        <Image src={goldSeedsCoin} alt="Next" width={30} height={30} />
        <div className="text-xs text-[#7C7C7C]">
          {totalAvailableCoins > 0
            ? `Redeem ${totalAvailableCoins} seeds coin`
            : `Coin cannot be redeemed`}
        </div>
      </div>
      <div>
        <Switch
          circleProps={{ className: 'peer-checked:border-seeds-button-green' }}
          className="checked:bg-seeds-button-green peer-checked:border-seeds-button-green peer-checked:before:bg-seeds-button-green"
          disabled={totalAvailableCoins <= 0}
          checked={useCoins}
          onChange={() => {
            setUseCoins(!useCoins);
          }}
        />
      </div>
    </div>
  );
};

export default QuizCoins;
