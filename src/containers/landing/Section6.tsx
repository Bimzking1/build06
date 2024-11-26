'use client';
import { downloadOurApp, seedsInformation, socialMedia } from '@/utils/_static';
import type { ISeedsInformationItem } from '@/utils/interfaces/data.interfaces';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Section6(): React.ReactElement {
  const { t } = useTranslation();
  return (
    <div className="w-full bg-gradient-to-tr from-seeds-green to-seeds-purple p-5 cursor-default">
      <div className="flex flex-col lg:flex-row h-full lg:p-5">
        <div className="w-full lg:w-1/3">
          <div className="mr-28 mb-10 lg:mr-14">
            <Typography className="text-[3rem] font-bold text-seeds-green lg:text-[3rem]">
              Seeds
            </Typography>

            <Typography className="text-lg font-bold text-white tracking-widest mb-3 lg:text-3xl">
              {t('landing.section6.text2')}
            </Typography>

            <Typography className=" text-xs text-white font-light mb-3 lg:text-sm lg:font-normal">
              {t('landing.section6.text1')}
            </Typography>

            <div className="flex">
              {socialMedia.map((item, key) => (
                <Link
                  target="_blank"
                  key={key}
                  href={item.url}
                  className="mr-3 last:mr-0 cursor-pointer"
                >
                  <Image alt="" src={item.icon} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <div className="flex flex-wrap mb-10 lg:mr-14">
            {Object.entries(seedsInformation).map(([key, value]) => (
              <div key={key} className="w-1/2 text-white tracking-widest">
                <Typography className="mb-3 text-xs lg:text-base font-semibold last:mb-0">
                  {key}
                </Typography>
                {value.map(
                  (
                    data: ISeedsInformationItem,
                    key: number
                  ): React.ReactElement => {
                    const dataIcon =
                      data?.icon != null ? (
                        <Image alt="" src={data.icon} className="mr-3" />
                      ) : (
                        ''
                      );
                    return (
                      <Link key={key} href={data.url}>
                        <Typography className="font-light text-xs mb-3 flex items-center">
                          {dataIcon}
                          {data.name}
                        </Typography>
                      </Link>
                    );
                  }
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/3">
          <Typography className="text-white text-lg font-normal mb-5 lg:font-medium lg:text-xl">
            {t('landing.section6.text3')}
          </Typography>

          <div className="grid grid-cols-2 gap-5 w-fit">
            {downloadOurApp
              .filter((data, i) => i <= 1)
              .map((data, key) => (
                <Link key={key} href={data.url}>
                  <Image alt="" src={data.icon} />
                </Link>
              ))}
          </div>
          <br />
          <div className="flex">
            {downloadOurApp
              .filter((data, i) => i > 1)
              .map((data, key) => (
                <Link key={key} href={data.url}>
                  <Image className="mr-5" alt="" src={data.icon} />
                </Link>
              ))}
          </div>
          <br />
          <div className="text-xs text-white tracking-widest lg:text-sm font-light cursor-pointer lg:font-normal">
            PT. Benih Investasi Teknologi
          </div>
        </div>
      </div>
    </div>
  );
}
