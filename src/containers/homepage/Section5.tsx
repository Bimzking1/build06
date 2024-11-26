import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader
} from '@material-tailwind/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ArticlePage from './article/ArticlePage';
import NewsPage from './news/NewsPage';

const Section5: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('article');

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="w-full h-auto cursor-default">
      <div className="text-3xl font-semibold text-[#262626]">SeedsPedia</div>
      <div className=" text-sm mt-3 font-light text-[#262626]">
        {t('homepage.section3.text1')}
      </div>
      <div className="h-auto">
        <Tabs value={activeTab}>
          <TabsHeader
            className="w-full text-center justify-center mx-auto  rounded-none bg-transparent p-0"
            indicatorProps={{
              className: 'shadow-none rounded-none bg-transparent'
            }}
          >
            <Tab
              value="article"
              onClick={() => {
                handleTabChange('article');
              }}
              className={`text-center text-xl bg-transparent mt-3 xl:mt-5 ${
                activeTab === 'article'
                  ? 'text-[#4FE6AF] bg-gradient-to-t from-[#e5fcf3] to-white linier font-semibold border-b-4 border-b-[#4FE6AF]'
                  : 'text-[#7C7C7C] text-xl font-normal border-b-2 border-b-[#BDBDBD]'
              }`}
            >
              Article
            </Tab>
            <Tab
              value="news"
              onClick={() => {
                handleTabChange('news');
              }}
              className={`text-center text-xl bg-transparent mt-3 xl:mt-5 ${
                activeTab === 'news'
                  ? 'text-[#4FE6AF] bg-gradient-to-t from-[#e5fcf3] to-white linier font-semibold border-b-4 border-b-[#4FE6AF]'
                  : 'text-[#7C7C7C] text-xl font-normal border-b-2 border-b-[#BDBDBD]'
              }`}
            >
              News
            </Tab>
          </TabsHeader>
          <TabsBody className="w-full">
            <TabPanel value="article">
              <ArticlePage />
            </TabPanel>
            <TabPanel value="news">
              <NewsPage />
            </TabPanel>
          </TabsBody>
        </Tabs>
      </div>
    </div>
  );
};

export default Section5;
