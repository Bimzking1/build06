import CCard from '@/components/CCard';
import { Button, Input, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { ArrowBackwardIcon } from 'public/assets/vector';
import { useTranslation } from 'react-i18next';

const CircleMembershipFeePage = ({
  formRequest,
  changeStep,
  change
}: any): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="md:mx-8">
      {formRequest !== undefined && (
        <>
          <div className="flex flex-row mb-4">
            <button
              className="w-1/3 items-start text-left transition-colors rounded-md hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:bg-gray-200"
              onClick={() => changeStep('premium_choice')}
            >
              <Image src={ArrowBackwardIcon} alt="arrow-backward-icon" />
            </button>
            <Typography className="mb-2 text-center text-lg font-poppins font-semibold">
              {t('circle.fee.title')}
            </Typography>
            <p className="w-1/3"></p>
          </div>
          <CCard className="mt-2 p-10 border-none shadow-none rounded-xl bg-white">
            <Typography className="mb-5 text-base font-poppins font-semibold text-[#262626]">
              {t('circle.fee.title2')}
            </Typography>
            <div className="grid grid-rows-3 grid-flow-col gap-6 mb-6">
              <Button
                className="w-full border-2 font-normal text-sm bg-transparent rounded-full shadow-none text-black"
                value={20000}
                name="premium_fee"
                onClick={change}
              >
                IDR 20.000
              </Button>
              <Button
                className="w-full border-2 font-normal text-sm bg-transparent rounded-full shadow-none text-black"
                value={40000}
                name="premium_fee"
                onClick={change}
              >
                IDR 40.000
              </Button>
              <Button
                className="w-full border-2 font-normal text-sm bg-transparent rounded-full shadow-none text-black"
                value={75000}
                name="premium_fee"
                onClick={change}
              >
                IDR 75.000
              </Button>
              <Button
                className="w-full border-2 font-normal text-sm bg-transparent rounded-full shadow-none text-black"
                value={30000}
                name="premium_fee"
                onClick={change}
              >
                IDR 30.000
              </Button>
              <Button
                className="w-full border-2 font-normal text-sm bg-transparent rounded-full shadow-none text-black"
                value={50000}
                name="premium_fee"
                onClick={change}
              >
                IDR 50.000
              </Button>
              <Button
                className="w-full border-2 font-normal text-sm bg-transparent rounded-full shadow-none text-black"
                value={100000}
                name="premium_fee"
                onClick={change}
              >
                IDR 100.000
              </Button>
            </div>
            <div className="flex flex-row justify-between mb-5">
              <hr className="w-1/3 mt-3" />
              <Typography className="w-1/3 text-center">
                {t('circle.fee.line')}
              </Typography>
              <hr className="w-1/3 mt-3" />
            </div>
            <Input
              placeholder="Minimum membership fee IDR. 20,000"
              type="number"
              onChange={change}
              name="premium_fee"
              value={formRequest.premium_fee}
              variant="outlined"
            />

            <Button
              className="w-full mt-16 font-semibold text-sm bg-seeds-button-green rounded-full capitalize"
              onClick={() => changeStep('membership')}
            >
              {t('circle.premium.button')}
            </Button>
          </CCard>
        </>
      )}
    </div>
  );
};

export default CircleMembershipFeePage;
