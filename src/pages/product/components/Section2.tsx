import vectorLeft from '@/assets/landing-page/top-asset-left.png';
import vector from '@/assets/landing-page/vector-product.png';
import vectorRight from '@/assets/landing-page/vector-right.png';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CardAsset from './CardAsset';
import CardCircle from './CardCircle';
import CardTournament from './CardTournament';

const customGradient = (
  <>
    <span className="-z-10 fixed bottom-10 -left-10 w-60 h-48 bg-seeds-green-2 blur-[90px] rotate-45" />
    <span className="-z-10 fixed bottom-0 left-0 w-24 h-24 bg-seeds-green-2 blur-[90px]" />
    <span className="-z-10 fixed -bottom-28 left-16 w-48 h-32 bg-seeds-purple-2 blur-[90px] rotate-45" />
    <span className="-z-10 fixed top-64 -right-4 w-60 h-48 bg-seeds-green-2 blur-[90px] rotate-45 rounded-full" />
    <span className="-z-10 fixed bottom-36 right-0 w-32 h-32 bg-seeds-purple-2 blur-[90px] rotate-90 rounded-full" />
  </>
);

export default function Section2(): React.ReactElement {
  const [activeTab, setActiveTab] = useState('circle');
  const { t } = useTranslation();
  const data = [
    {
      label: 'Top Circle',
      value: 'circle',
      desc: 'Top Circle'
    },
    {
      label: 'Top Tournament',
      value: 'tournament',
      desc: 'Top Tournament'
    },
    {
      label: 'Top Asset',
      value: 'asset',
      desc: 'Top Asset'
    }
  ];

  return (
    <PageGradient
      customGradient={customGradient}
      className="overflow-hidden p-2 md:p-8 w-full"
    >
      <Image
        alt="img"
        className="absolute right-0 -z-10 xl:mt-[200px] xl:block hidden"
        src={vectorRight}
      />
      <Image
        alt="img"
        className="absolute left-0 -z-10 xl:mt-10 xl:block hidden"
        src={vector}
      />
      <Image
        alt="img"
        className="absolute left-0 -z-10 xl:mt-15 xl:block hidden"
        src={vectorLeft}
      />
      <Typography className="text-3xl font-semibold mb-5 text-[#222222]">
        {t('landingPageV2.product.section3.title1')}
      </Typography>
      <Tabs value={activeTab}>
        <TabsHeader
          className="rounded-none border-none bg-transparent p-0 w-[30%]"
          indicatorProps={{
            className:
              'bg-transparent border-b-4 w-[50%] mx-auto border-[#3AC4A0] shadow-none rounded-none'
          }}
        >
          {data.map(({ label, value }) => (
            <Tab
              key={value}
              value={value}
              onClick={() => {
                setActiveTab(value);
              }}
              className={
                activeTab === value
                  ? 'text-sm font-normal text-[#262626] pb-2'
                  : 'text-sm font-normal text-[#BDBDBD] pb-2'
              }
            >
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {data.map(({ value, desc }) => (
            <TabPanel
              className={` ${
                activeTab === 'circle' ? 'xl:grid xl:grid-cols-4 xl:gap-4' : ''
              }`}
              key={value}
              value={value}
            >
              {value === 'asset' ? <CardAsset /> : ''}
              {value === 'circle' ? <CardCircle /> : ''}
              {value === 'tournament' ? <CardTournament /> : ''}
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </PageGradient>
  );
}
