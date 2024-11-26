import {
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader
} from '@material-tailwind/react';
import React, { useState } from 'react';
import ArticleList from './articles';
import NewsList from './news';

const SeedsPedia: React.FC = () => {
  const [activeTab, setActiveTab] = useState('article');

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="flex items-center justify-center mt-20">
      <Tabs value={activeTab}>
        <TabsHeader
          className="w-[15%] text-center justify-center mx-auto  rounded-none bg-transparent p-0"
          indicatorProps={{
            className: 'shadow-none rounded-none'
          }}
        >
          <Tab
            value="article"
            onClick={() => {
              handleTabChange('article');
            }}
            className={`text-end text-xl bg-transparent mt-3 xl:mt-5 ${
              activeTab === 'article'
                ? 'text-[#9A76FE] to-[#4FE6AF] font-semibold border-b-4 border-b-[#9A76FE]'
                : 'text-[#7C7C7C] text-xl font-normal'
            }`}
          >
            Article
          </Tab>
          <Tab
            value="news"
            onClick={() => {
              handleTabChange('news');
            }}
            className={`text-start text-xl bg-transparent mt-3 xl:mt-5 ${
              activeTab === 'news'
                ? 'text-[#9A76FE] to-[#4FE6AF] font-semibold border-b-4 border-b-[#9A76FE]'
                : 'text-[#7C7C7C] text-xl font-normal'
            }`}
          >
            News
          </Tab>
        </TabsHeader>
        <TabsBody>
          <TabPanel value="article">
            <ArticleList />
          </TabPanel>
          <TabPanel value="news">
            <NewsList />
          </TabPanel>
        </TabsBody>
      </Tabs>
    </div>
  );
};

export default SeedsPedia;
