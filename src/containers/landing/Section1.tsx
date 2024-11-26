'use client';
import cartoon from '@/assets/landing-page/cartoon.png';
import medal from '@/assets/landing-page/medal.png';
import rectangleLine1 from '@/assets/landing-page/rectangle-line-1.png';
import rectangleLine2 from '@/assets/landing-page/rectangle-line-2.png';
import rectangle from '@/assets/landing-page/rectangle.png';
import s1Line2 from '@/assets/landing-page/s1-line-2.png';
import vector2 from '@/assets/landing-page/vector-faq-2.png';
import vector3 from '@/assets/landing-page/vector-faq-3.png';
import vector from '@/assets/landing-page/vector.png';
import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import phone from 'public/assets/rectangle1.png';
import { useTranslation } from 'react-i18next';

export default function Section1(): React.ReactElement {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="min-w-full w-full sm:w-screen h-auto cursor-default">
      <div className="flex flex-col md:flex-row">
        <div className="w-full">
          <div className="absolute z-40 top-[40px] xl:top-[100px] ml-5 w-1/2 lg:ml-10 lg:mt-10 xl:ml-20 xl:mt-40">
            <div className="xl:text-[64px] text-[#F9F9F9] font-bold xl:mb-3 text-[36px] md:mb-8">
              {t('landing.section1.text1')}
            </div>
            <div className="xl:text-[24px] text-white font-normal mb-3 text-xl md:mb-7">
              {t('landing.section1.text2')}
            </div>
            <Button
              className="text-xs px-10 font-semibold capitalize text-md bg-seeds-purple rounded-full"
              onClick={() => {
                void router.push('/auth/register');
              }}
            >
              {t('button.joinNow')}
            </Button>
          </div>

          <Image
            alt="img"
            className="w-full -z-10 xl:mt-5 mt-0 md:absolute md:w-[550px] md:h-[350px] md:top-[10px] lg:w-[700px] lg:h-[470px] xl:w-[1000px] xl:h-[670px]"
            src={rectangle}
          />

          <Image
            alt="img"
            className="absolute w-full top-[30px] -z-20 md:w-[560px] md:h-[360px] md:top-[40px] lg:w-[720px] lg:h-[490px] xl:w-[1030px] xl:h-[690px]"
            src={rectangleLine1}
          />

          <Image
            alt="img"
            className="absolute w-[71px] -top-8 lg:w-[180px] xl:block hidden"
            src={medal}
          />
          <Image
            alt="img"
            className="absolute w-full top-[30px] -z-20 md:w-[560px] md:h-[380px] md:top-[40px] lg:w-[740px] lg:h-[515px] xl:top-[110px] xl:h-[670px] xl:w-[1030px]"
            src={rectangleLine2}
          />
        </div>

        <div className="w-[80%] xl:mb-[20vh] mb-[8vh]">
          <Image
            className="absolute xl:top-[30vh] xl:right-[20vw] xl:w-[380px] w-[222px] top-[60vh] xl:left-auto sm:left-[5vw] z-20 xl:h-[380px]"
            alt="img"
            src={cartoon}
          />
          <Image
            className="xl:w-[400px] md:ml-[2vw] xl:ml-[10vw] ml-[30vw] z-10 h-full"
            alt="img"
            src={phone}
          />
        </div>

        <Image
          alt="img"
          src={s1Line2}
          className="absolute -z-10 top-[250px] w-[750px] left-[0px]"
        />

        <Image
          alt="img"
          className="absolute -z-10 right-0 bottom-0 top-0 overflow-hidden md:w-[33%] lg:w-[33%] xl:w-[29%] w-[0%]"
          src={vector}
        />

        <Image
          alt="img"
          className="absolute right-0 -z-10 top-[200px] xl:block hidden"
          src={vector3}
        />

        <Image
          alt="img"
          className="absolute right-0 -z-10 top-[600px] xl:block hidden"
          src={vector2}
        />
      </div>
    </div>
  );
}
