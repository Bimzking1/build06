import SeedsAds from '@/assets/SeedsAds.png';
import grayClose from '@/assets/grayClose.svg';
import { Button, Card, Typography } from '@material-tailwind/react';
import DeviceDetector from 'device-detector-js';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const AppAds: React.FC = () => {
  const { t } = useTranslation();
  const deviceDetector = new DeviceDetector();
  const [isClose, setClose] = useState(false);

  useEffect(() => {
    if (window.localStorage.getItem('isBannerOpen') === 'false') {
      setClose(true);
    }
  }, []);
  return (
    <Card
      shadow={false}
      className={`${
        isClose ? 'hidden' : 'flex'
      } md:p-4 p-3 md:mx-14 flex-row justify-between z-10 md:rounded-xl rounded-none`}
    >
      <div className="flex items-center lg:gap-6 gap-3">
        <Image
          src={SeedsAds}
          alt="SeedsAds"
          className="md:w-[45px] w-[30px] md:h-[45px] h-[30px]"
        />
        <div>
          <Typography className="font-poppins font-semibold md:text-lg text-xs text-[#262626]">
            Seeds
          </Typography>
          <Typography className="font-poppins font-normal md:text-base text-[10px] leading-[14px] text-[#7C7C7C]">
            {t('AppAds.title')}
          </Typography>
        </div>
      </div>
      <div className="flex items-center md:gap-4 gap-3">
        <Link
          href={
            (deviceDetector.parse(navigator.userAgent).os?.name as string) ===
              'iOS' ||
            (deviceDetector.parse(navigator.userAgent).os?.name as string) ===
              'Mac'
              ? 'https://apps.apple.com/id/app/seeds-investing-together/id6443659980'
              : 'https://play.google.com/store/apps/details?id=com.seeds.investment&hl=en&gl=US'
          }
          target="_blank"
        >
          <Button className="capitalize font-semibold font-poppins md:text-sm text-[10px] leading-[14px] text-white rounded-full bg-[#3AC4A0] p-2 md:py-[15px] md:px-[36.5px] w-[115px] h-[30px] md:w-[178px] md:h-[50px]">
            {t('AppAds.button')}
          </Button>
        </Link>
        <Image
          src={grayClose}
          alt="grayClose"
          className="cursor-pointer md:w-6 w-5 md:h-6 h-5"
          onClick={() => {
            setClose(true);
            window.localStorage.setItem('isBannerOpen', 'false');
          }}
        />
      </div>
    </Card>
  );
};

export default AppAds;
