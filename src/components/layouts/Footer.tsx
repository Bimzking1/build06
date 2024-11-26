'use client';
import email from '@/assets/landing-page/email.svg';
import SeedLogo from '@/assets/landing-page/header/SeedsLogo.svg';
import whatsapp from '@/assets/landing-page/whatsapp.svg';
import { downloadOurApp, socialMedia } from '@/utils/_static';
import type {
  ISeedsInformationItem,
  ISeedsInformationList
} from '@/utils/interfaces/data.interfaces';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { useTranslation } from 'react-i18next';

export default function Footer(): React.ReactElement {
  const { t } = useTranslation();
  const seedsInformation: ISeedsInformationList = {
    Company: [
      { name: `${t('footer.company.title')}`, url: '' },
      {
        name: `${t('footer.company.list1')}`,
        url: '/about-us'
      },
      {
        name: `${t('footer.company.list2')}`,
        url: 'https://bit.ly/CareerSeeds'
      }
    ],
    Legal: [
      { name: `${t('footer.legal.title')}`, url: '' },
      {
        name: `${t('footer.legal.list1')}`,
        url: '/faq-submenu/terms-condition'
      },
      {
        name: `${t('footer.legal.list2')}`,
        url: '/faq-submenu/privacy-policy'
      },
      {
        name: `${t('footer.legal.list3')}`,
        url: '/faq-submenu/social-media-guide'
      }
    ],
    Support: [
      { name: `${t('footer.support.title')}`, url: '' },
      {
        name: 'FAQs',
        url: '/faq'
      }
    ],
    'Contact Us': [
      { name: `${t('footer.contactUs.title')}`, url: '' },
      {
        icon: email,
        name: 'info@seeds.finance',
        url: 'mailto:info@seeds.finance'
      },
      {
        icon: whatsapp,
        name: '08118883519',
        url: 'https://api.whatsapp.com/send?phone=628118883519'
      }
    ]
  };
  return (
    <section className="flex 2xl:flex-row flex-col gap-10 justify-center items-center pt-10 pb-[42px] lg:pt-20 bg-white px-4">
      <div className="flex gap-6 lg:gap-10 md:flex-row flex-col 2xl:justify-between 2xl:w-full">
        <div className="flex flex-col gap-5 lg:max-w-[403px] w-[343px]">
          <div className="flex flex-col gap-2">
            <Image
              src={SeedLogo}
              alt="SeedLogo"
              className="lg:h-[56px] h-[44px] lg:w-[147.72px] w-[116.07px]"
            />
            <Typography className="font-semibold font-poppins text-2xl lg:text-3xl text-[#106B6E]">
              Investing, together
            </Typography>
          </div>
          <div className="flex flex-col gap-2">
            <Typography className="font-semibold font-poppins text-base lg:text-lg text-[#201B1C]">
              PT. Benih Investasi Teknologi
            </Typography>
            <Typography className="font-normal font-poppins text-sm lg:text-base text-[#7C7C7C] text-justify">
              {t('footer.description')}
            </Typography>
          </div>
          <div className="flex gap-4">
            {socialMedia.map((item, key) => (
              <Link
                target="_blank"
                key={key}
                href={item.url}
                className="cursor-pointer"
              >
                <Image alt={item.icon} src={item.icon} />
              </Link>
            ))}
          </div>
        </div>
        <div className="xl:flex md:hidden flex flex-col sm:flex-row gap-6 sm:gap-0">
          <div className="flex flex-col gap-6 lg:gap-10 md:w-[219.5px] w-[171.5px] ">
            {Object.entries(seedsInformation)
              .filter(([key]) => key === 'Company' || key === 'Support')
              .map(([key, value]) => (
                <div key={key} className="flex flex-col lg:gap-4 gap-3">
                  <Typography className="font-semibold font-poppins text-lg lg:text-xl text-[#106B6E]">
                    {value[0].name}
                  </Typography>
                  {value
                    .slice(1)
                    .map(
                      (
                        data: ISeedsInformationItem,
                        key: number
                      ): React.ReactElement => {
                        const dataIcon =
                          data?.icon != null ? (
                            <Image alt="icon" src={data.icon} />
                          ) : (
                            ''
                          );
                        return (
                          <Link
                            key={key}
                            href={data.url}
                            target={
                              data.name === 'Career' || data.name === 'Karir'
                                ? '_blank'
                                : ''
                            }
                          >
                            <Typography className="font-normal font-poppins text-base lg:text-lg text-[#262626] flex gap-2">
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
          <div className="flex flex-col gap-6 lg:gap-10 md:w-[219.5px] w-[171.5px] ">
            {Object.entries(seedsInformation)
              .filter(([key]) => key === 'Legal' || key === 'Contact Us')
              .map(([key, value]) => (
                <div key={key} className="flex flex-col lg:gap-4 gap-3">
                  <Typography className="font-semibold font-poppins text-lg lg:text-xl text-[#106B6E]">
                    {value[0].name}
                  </Typography>
                  {value
                    .slice(1)
                    .map(
                      (
                        data: ISeedsInformationItem,
                        key: number
                      ): React.ReactElement => {
                        const dataIcon =
                          data?.icon != null ? (
                            <Image alt="icon" src={data.icon} />
                          ) : (
                            ''
                          );
                        return (
                          <Link key={key} href={data.url}>
                            <Typography className="font-normal font-poppins text-base lg:text-lg text-[#262626] flex gap-2">
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
        <div className="flex flex-col gap-6 lg:gap-10">
          <div className="flex flex-col gap-2.5">
            <Typography className="font-semibold font-poppins text-lg lg:text-xl text-[#106B6E]">
              {t('footer.download')}
            </Typography>
            <div className="flex gap-4">
              {downloadOurApp
                .filter((data, i) => i <= 1)
                .map((data, key) => (
                  <Link target="_blank" key={key} href={data.url}>
                    <Image alt="icon" src={data.icon} />
                  </Link>
                ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Typography className="flex font-semibold font-poppins text-xl text-[#106B6E]">
              {t('footer.regist')}
            </Typography>
            <div className="flex gap-4">
              {downloadOurApp
                .filter((data, i) => i > 1)
                .map((data, key) => (
                  <Link
                    target="_blank"
                    key={key}
                    href={data.url}
                    className={`${
                      data.url === '' ? 'pointer-events-none' : ''
                    } mx-[35.5px] self-end`}
                  >
                    <Image alt="icon" src={data.icon} />
                  </Link>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:flex xl:hidden">
        <div className="flex flex-col w-[160.25px]">
          {Object.entries(seedsInformation)
            .filter(([key]) => key === 'Company')
            .map(([key, value]) => (
              <div key={key} className="flex flex-col gap-3">
                <Typography className="font-semibold font-poppins text-lg text-[#106B6E]">
                  {value[0].name}
                </Typography>
                {value
                  .slice(1)
                  .map(
                    (
                      data: ISeedsInformationItem,
                      key: number
                    ): React.ReactElement => {
                      const dataIcon =
                        data?.icon != null ? (
                          <Image alt="icon" src={data.icon} />
                        ) : (
                          ''
                        );
                      return (
                        <Link
                          key={key}
                          href={data.url}
                          target={
                            data.name === 'Career' || data.name === 'Karir'
                              ? '_blank'
                              : ''
                          }
                        >
                          <Typography className="font-normal font-poppins text-base text-[#262626] flex gap-2">
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
        <div className="flex flex-col w-[160.25px]">
          {Object.entries(seedsInformation)
            .filter(([key]) => key === 'Support')
            .map(([key, value]) => (
              <div key={key} className="flex flex-col gap-3">
                <Typography className="font-semibold font-poppins text-lg text-[#106B6E]">
                  {value[0].name}
                </Typography>
                {value
                  .slice(1)
                  .map(
                    (
                      data: ISeedsInformationItem,
                      key: number
                    ): React.ReactElement => {
                      const dataIcon =
                        data?.icon != null ? (
                          <Image alt="icon" src={data.icon} />
                        ) : (
                          ''
                        );
                      return (
                        <Link key={key} href={data.url}>
                          <Typography className="font-normal font-poppins text-base text-[#262626] flex gap-2">
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
        <div className="flex flex-col w-[160.25px]">
          {Object.entries(seedsInformation)
            .filter(([key]) => key === 'Legal')
            .map(([key, value]) => (
              <div key={key} className="flex flex-col gap-3">
                <Typography className="font-semibold font-poppins text-lg text-[#106B6E]">
                  {value[0].name}
                </Typography>
                {value
                  .slice(1)
                  .map(
                    (
                      data: ISeedsInformationItem,
                      key: number
                    ): React.ReactElement => {
                      const dataIcon =
                        data?.icon != null ? (
                          <Image alt="icon" src={data.icon} />
                        ) : (
                          ''
                        );
                      return (
                        <Link key={key} href={data.url}>
                          <Typography className="font-normal font-poppins text-base text-[#262626] flex gap-2">
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
        <div className="flex flex-col w-[160.25px]">
          {Object.entries(seedsInformation)
            .filter(([key]) => key === 'Contact Us')
            .map(([key, value]) => (
              <div key={key} className="flex flex-col gap-3">
                <Typography className="font-semibold font-poppins text-lg text-[#106B6E]">
                  {value[0].name}
                </Typography>
                {value
                  .slice(1)
                  .map(
                    (
                      data: ISeedsInformationItem,
                      key: number
                    ): React.ReactElement => {
                      const dataIcon =
                        data?.icon != null ? (
                          <Image alt="icon" src={data.icon} />
                        ) : (
                          ''
                        );
                      return (
                        <Link key={key} href={data.url}>
                          <Typography className="font-normal font-poppins text-base text-[#262626] flex gap-2">
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
    </section>
  );
}
