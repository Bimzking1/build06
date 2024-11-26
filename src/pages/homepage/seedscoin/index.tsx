import { CircleLineBold, CircleLineBoldSmall } from '@/constants/assets/icons';
import AllHistory from '@/containers/homepage/seedscoin/allHistory';
import EarningPage from '@/containers/homepage/seedscoin/earning';
import SpendingPage from '@/containers/homepage/seedscoin/spending';

import {
  Card,
  CardBody,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import React, { useState } from 'react';

const RankPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full z-10 h-auto cursor-default">
      <div className="text-3xl font-semibold font-poppins text-[#262626]">
        Seeds Coin
      </div>
      <Card className="relative flex bg-gradient-to-r from-[#7555DA] to-[#7555DA]">
        <Image
          src={CircleLineBold.src}
          alt={CircleLineBold.alt}
          height={0}
          width={0}
          className="absolute z-0 bottom-0 right-0 w-[4.5rem] h-[4.5rem]
                            sm:w-[8rem] sm:h-[8rem]
                            md:w-[10.4rem] md:h-[9rem]"
        />

        <Image
          src={CircleLineBoldSmall.src}
          alt={CircleLineBoldSmall.alt}
          height={0}
          width={0}
          className="absolute bottom-0 right-0 w-[2rem] h-[2rem]
                            sm:w-[4rem] sm:h-[4rem]
                            md:w-[5.5rem] md:h-[4.8rem]"
        />

        <CardBody>
          <Typography className="font-poppins text-base text-[#DADADA] text-left mb-2">
            Seeds Coins
          </Typography>
          <Typography className="font-poppins text-xs text-[#DADADA] text-left mb-2">
            <span className="text-2xl font-semibold">9000</span>
            Coins available
          </Typography>
          <Typography className="font-poppins text-[8px] text-[#DADADA] text-left mb-2">
            5000 coins expiring on 30 Juli 2023
          </Typography>
        </CardBody>
      </Card>
      <Tabs value={activeTab}>
        <TabsHeader
          className="w-full text-center justify-center mx-auto  rounded-none bg-transparent p-0"
          indicatorProps={{
            className: 'shadow-none rounded-none'
          }}
        >
          <Tab
            value="all"
            onClick={() => {
              handleTabChange('all');
            }}
            className={`text-center text-xl bg-transparent mt-3 xl:mt-5 ${
              activeTab === 'all'
                ? 'text-[#4FE6AF] font-semibold border-b-4 border-b-[#4FE6AF]'
                : 'text-[#7C7C7C] text-xl font-normal'
            }`}
          >
            All History
          </Tab>
          <Tab
            value="earning"
            onClick={() => {
              handleTabChange('earning');
            }}
            className={`text-center text-xl bg-transparent mt-3 xl:mt-5 ${
              activeTab === 'earning'
                ? 'text-[#4FE6AF] font-semibold border-b-4 border-b-[#4FE6AF]'
                : 'text-[#7C7C7C] text-xl font-normal'
            }`}
          >
            Earning
          </Tab>
          <Tab
            value="spending"
            onClick={() => {
              handleTabChange('spending');
            }}
            className={`text-center text-xl bg-transparent mt-3 xl:mt-5 ${
              activeTab === 'spending'
                ? 'text-[#4FE6AF] font-semibold border-b-4 border-b-[#4FE6AF]'
                : 'text-[#7C7C7C] text-xl font-normal'
            }`}
          >
            Spending
          </Tab>
        </TabsHeader>
        <TabsBody>
          <TabPanel value="all">
            <AllHistory />
          </TabPanel>
          <TabPanel value="earning">
            <EarningPage />
          </TabPanel>
          <TabPanel value="spending">
            <SpendingPage />
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default RankPage;
