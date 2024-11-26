'use client';
import star from '@/assets/temporary-page/star.svg';
import CCard from '@/components/CCard';
import { getTrendingCircle } from '@/repository/circle.repository';
import { downloadOurApp } from '@/utils/_static';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import Link from 'next/link';
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const fetch = async (
  setNews: Dispatch<SetStateAction<never[]>>
): Promise<void> => {
  const res = await getTrendingCircle();

  const data: never[] = res?.result;
  setNews(data);
};

export default function Section1(): React.ReactElement {
  const { t } = useTranslation();
  const [list, setList] = useState([]);
  useEffect(() => {
    void fetch(setList);
  }, []);

  console.log(list);

  const Stars = (): JSX.Element => {
    const classes = 'h-auto w-[12px] md:w-[16px] md:w-[20px]';
    return (
      <div className="flex">
        <Image alt="" src={star} className={classes} />
        <Image alt="" src={star} className={classes} />
        <Image alt="" src={star} className={classes} />
        <Image alt="" src={star} className={classes} />
        <Image alt="" src={star} className={classes} />
      </div>
    );
  };

  const renderCard = (): JSX.Element => (
    <CCard className="bg-clip overflow-hidden xl:h-[500px] h-[750px] md:h-auto lg:h-auto shadow-lg rounded-xl border border-seeds-soft bg-white bg-opacity-30 mt-[50px] xl:mt-[100px]">
      <div
        className="flex flex-col p-6 bg-no-repeat bg-right-bottom bg-[length:350px] h-full w-full md:bg-[length:250px] md:p-16 xl:bg-[length:400px] lg:bg-[length:350px] 2xl:bg-[length:400px]"
        style={{ backgroundImage: "url('/assets//temporary/play-ipon.png')" }}
      >
        <div>
          <Typography className="text-center text-[30px] text-transparent bg-clip-text bg-gradient-to-l from-[#7555DA] to-[#4FE6AF] font-bold md:text-left md:text-[32px] lg:text-[64px]">
            {t('landingPageV2.product.section6.title1')}
          </Typography>
          <Typography className="text-center text-[30px] text-[#262626] font-bold md:text-left md:text-[32px] lg:text-[64px] leading-8">
            {t('landingPageV2.product.section6.title2')}
          </Typography>
          <Typography className="text-center text-lg text-[#262626] font-normal my-3 md:my-6 lg:my-9 md:text-left md:w-[50%] lg:text-[18px] lg:w-[60%] lg:text-[24px]">
            {t('landingPageV2.product.section6.title3')}
          </Typography>
        </div>
        <div className="flex justify-around md:justify-start">
          {downloadOurApp
            .filter((data, i) => i <= 1)
            .map((data, key) => (
              <div key={key} className="flex flex-col items-center md:mr-5">
                <Link key={key} href={data.url}>
                  <Image alt="" src={data.icon} />
                </Link>
                <div className="flex mt-7">
                  <Typography className="mr-2 text-xl text-[#262626] font-semibold md:text-[24px] lg:text-[48px]">
                    {data.rate}
                  </Typography>
                  <div>
                    <Stars />
                    <Typography className="text-xs text-[#262626] font-normal lg:text-sm">
                      {t('temporary.review', { review: data.reviews })}
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </CCard>
  );

  return (
    <div
      className="p-3 min-w-full cursor-default md:px-16 lg:p-24 lg:pt-4 w-full h-full"
      style={{
        background:
          "url('/assets/temporary/first-place-medal.png') left bottom no-repeat, url('/assets/temporary/purple-ellipse.png') bottom no-repeat, url('/assets/temporary/green-ellipse.png') right bottom no-repeat"
      }}
    >
      {renderCard()}
    </div>
  );
}
