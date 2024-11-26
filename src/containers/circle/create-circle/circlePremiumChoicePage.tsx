import CCard from '@/components/CCard';
import {
  Button,
  Card,
  CardBody,
  Radio,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { ArrowBackwardIcon } from 'public/assets/vector';
import { useTranslation } from 'react-i18next';

const CirclePremiumChoicePage = ({
  change,
  formRequest,
  changeStep
}: any): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="md:mx-8">
      {formRequest !== undefined && (
        <>
          <div className="flex flex-row mb-4">
            <button
              className="w-1/3 items-start text-left transition-colors rounded-md hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:bg-gray-200"
              onClick={() => changeStep('')}
            >
              <Image src={ArrowBackwardIcon} alt="arrow-backward-icon" />
            </button>

            <Typography className="mb-2 text-center text-base font-poppins font-semibold">
              {t('circle.premium.mainTitle')}
            </Typography>
          </div>
          <CCard className="mt-2 p-10 border-none shadow-none rounded-xl bg-white">
            <Typography className="mb-2 text-base font-poppins font-semibold text-[#262626]">
              {t('circle.premium.title')}
            </Typography>
            <Typography className="mb-2 text-sm font-poppins font-normal text-[#7C7C7C]">
              {t('circle.premium.subtitle')}
            </Typography>

            <Card
              color="white"
              shadow={false}
              className="w-full border-2 mb-5 mt-3"
            >
              <CardBody className="p-3 inline-block h-auto">
                <div className="flex flex-row">
                  <div className="flex w-full flex-col gap-0.5">
                    <Typography className="font-semibold text-xs text-[#262626]">
                      {t('circle.premium.option.title1')}
                    </Typography>
                    <Typography className="font-normal text-xs text-[#7C7C7C]">
                      {t('circle.premium.option.subtitle1')}
                      circle
                    </Typography>
                  </div>
                  <div className="items-end">
                    {formRequest.type === 'lifetime' ? (
                      <Radio
                        name="type"
                        value="lifetime"
                        onChange={change}
                        checked={true}
                      />
                    ) : (
                      <Radio
                        name="type"
                        value="lifetime"
                        onChange={change}
                        checked={false}
                      />
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>

            <Card color="white" shadow={false} className="w-full border-2 mb-5">
              <CardBody className="p-3 inline-block h-auto">
                <div className="flex flex-row">
                  <div className="flex w-full flex-col gap-0.5">
                    <Typography className="font-semibold text-xs text-[#262626]">
                      {t('circle.premium.option.title2')}
                    </Typography>
                    <Typography className="font-normal text-xs text-[#7C7C7C]">
                      {t('circle.premium.option.subtitle2')}
                    </Typography>
                  </div>
                  <div className="items-end">
                    {formRequest.type === 'subscription' ? (
                      <Radio
                        name="type"
                        value="subscription"
                        onChange={change}
                        checked={true}
                      />
                    ) : (
                      <Radio
                        name="type"
                        value="subscription"
                        onChange={change}
                        checked={false}
                      />
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
            <Button
              className="w-full mt-16 font-semibold text-sm bg-seeds-button-green rounded-full capitalize"
              onClick={() => changeStep('membership_fee')}
            >
              {t('circle.premium.button')}
            </Button>
          </CCard>
        </>
      )}
    </div>
  );
};

export default CirclePremiumChoicePage;
