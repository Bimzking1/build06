'use client';
import LanguageSwitcher from '@/components/DropdownLanguageSwitcher';
import { HelloHero, LineChart } from '@/constants/assets/images';
import { SeedsLogo } from '@/constants/assets/logo';
import { isEmptyString, isUndefindOrNull } from '@/utils/common/utils';
import { Card, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'public/assets/vector';
import { Trans, useTranslation } from 'react-i18next';

export interface IAuthLayout {
  children: JSX.Element;
  title?: string;
  titleKey?: string;
  onBack?: () => void;
}

const AuthLayout = ({
  children,
  title,
  titleKey,
  onBack
}: IAuthLayout): JSX.Element => {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <div className="relative">
      <div className="h-full w-full lg:w-1/2 bg-gradient-to-bl from-[#7856E1] absolute top-0 left-0 z-10 to-[#44FFBB] bg-gray-500">
        <div className="relative h-[30rem] top-[100%] translate-y-[-100%]">
          <Image
            src={LineChart.src}
            className="object-cover object-[bottom_center]"
            quality={100}
            alt={LineChart.alt}
            fill
            sizes="100vw, 100vw"
            placeholder="blur"
            blurDataURL={LineChart.src}
          />
        </div>
      </div>
      <div className="absolute top-0 left-0 z-0 h-full w-full">
        <div className="flex justify-center lg:justify-around">
          <div className="bg-[#7856E1] rounded-full h-72 w-72 blur-2xl hidden lg:flex"></div>
          <div className="bg-[#44FFBB] rounded-full h-72 w-72 blur-3xl object-cover"></div>
        </div>
        <div className="flex justify-between items-end">
          <div className="bg-[#7856E1] rounded-full h- w-48 rounded-r-none blur-xl hidden lg:flex"></div>
          <div className="bg-[#44FFBB] rounded-full h-80 w-48 lg:ml-40 rounded-l-none blur-3xl"></div>
          <div className="bg-[#7856E1] rounded-full h-80 w-48 rounded-r-none blur-3xl"></div>
        </div>
      </div>
      <div className="h-screen w-full grid grid-cols-1 lg:grid-cols-2 items-center">
        <div className="hidden lg:flex lg:justify-center lg:z-20">
          <div className="p-4 w-[30rem] h-[40rem]">
            <Card className="w-full h-full justify-between border-y-white border-2 border-x-teal-200 bg-blue-100 backdrop-filter backdrop-blur-2xl bg-opacity-25 rounded-[60px]">
              <div className="px-8 mt-16">
                <Typography variant="h2" color="white">
                  {t('authPage.welcoming')}
                </Typography>
                <Typography variant="paragraph" color="white" className="mt-4">
                  {t('authPage.description')}
                </Typography>
              </div>
              <div className="flex justify-center">
                <Image
                  src={HelloHero.src}
                  className="object-cover object-[bottom_center] w-[18rem]"
                  alt={HelloHero.alt}
                  quality={60}
                  width="0"
                  height="0"
                  sizes="100vw"
                  placeholder="blur"
                  blurDataURL={HelloHero.src}
                />
              </div>
            </Card>
          </div>
        </div>
        <div className="flex justify-center z-20">
          <div className="p-4 w-[30rem] min-h-[50rem] lg:min-h-[40rem]">
            <div className="z-20 lg:hidden flex items-center mb-4">
              {(!isUndefindOrNull(title) && !isEmptyString(title)) ||
              (!isUndefindOrNull(titleKey) && !isEmptyString(titleKey)) ? (
                <div
                  className="w-[2rem] h-[2rem] hover:bg-white/25 p-1 rounded-lg cursor-pointer flex justify-center items-center"
                  onClick={() => {
                    if (
                      !isUndefindOrNull(onBack) &&
                      typeof onBack === 'function'
                    ) {
                      onBack();
                    } else {
                      router.push('/').catch(error => {
                        console.log(error);
                      });
                    }
                  }}
                >
                  <Image
                    src={ArrowLeft}
                    width={30}
                    height={30}
                    alt="arrow-left"
                    className="w-auto h-auto object-contain object-[center_center]"
                  />
                </div>
              ) : null}
              <Typography variant="h4" color="white" className="mx-auto">
                {isUndefindOrNull(title) || isEmptyString(title) ? (
                  <Trans i18nKey={titleKey} />
                ) : (
                  title
                )}
              </Typography>
            </div>
            <Card className="w-full md:h-full bg-gradient-to-br from-white bg-opacity-10 flex-col border rounded-3xl border-white">
              <div className="flex justify-between p-8">
                <Image
                  src={SeedsLogo.src}
                  alt={SeedsLogo.alt}
                  quality={50}
                  className="w-auto h-auto object-contain object-[center_center]"
                  width={60}
                  height={30}
                  placeholder="blur"
                  blurDataURL={SeedsLogo.src}
                />
                <LanguageSwitcher />
              </div>
              {children}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
