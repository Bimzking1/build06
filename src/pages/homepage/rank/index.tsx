import CurrentPage from '@/containers/homepage/Current';
import LastMonthPage from '@/containers/homepage/LastMonth';
import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader
} from '@material-tailwind/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const RankPage: React.FC = () => {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState('current');

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full h-auto cursor-default">
      <div className="text-2xl md:text-3xl font-semibold text-[#262626] px-4 md:px-0 my-4 md:my-0">
        {t('homepage.section2.text11')}
      </div>
      <Tabs value={activeTab}>
        <TabsHeader
          className="w-full text-center justify-center mx-auto  rounded-none bg-transparent p-0"
          indicatorProps={{
            className: 'shadow-none rounded-none bg-transparent'
          }}
        >
          <Tab
            value="current"
            onClick={() => {
              handleTabChange('current');
            }}
            className={`text-center text-md md:text-xl bg-transparent mt-3 xl:mt-5 ${
              activeTab === 'current'
                ? 'text-[#4FE6AF] bg-gradient-to-t from-[#e5fcf3] to-white linier font-semibold border-b-4 border-b-[#4FE6AF]'
                : 'text-[#7C7C7C] font-normal border-b-2 border-b-[#BDBDBD]'
            }`}
          >
            {t('homepage.section3.text2')}
          </Tab>
          <Tab
            value="lastMonth"
            onClick={() => {
              handleTabChange('lastMonth');
            }}
            className={`text-center text-md md:text-xl bg-transparent mt-3 xl:mt-5 ${
              activeTab === 'lastMonth'
                ? 'text-[#4FE6AF] bg-gradient-to-t from-[#e5fcf3] to-white linier font-semibold border-b-4 border-b-[#4FE6AF]'
                : 'text-[#7C7C7C] font-normal border-b-2 border-b-[#BDBDBD]'
            }`}
          >
            {t('homepage.section3.text3')}
          </Tab>
        </TabsHeader>
        <TabsBody>
          <TabPanel value="current">
            <CurrentPage />
          </TabPanel>
          <TabPanel value="lastMonth">
            <LastMonthPage />
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default RankPage;
