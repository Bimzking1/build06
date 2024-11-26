import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import {
  Avatar,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader
} from '@material-tailwind/react';
import Image from 'next/image';
import { ArrowRightCollapseIcon } from 'public/assets/vector';
import React, { useState } from 'react';
import plants from '../../assets/plants.png';
import Stepper from './components/Stepper';

interface DataItem {
  label: string;
  value: string;
  content: React.ReactNode;
}

export default function DiscoverEarn(): React.ReactElement {
  const width = useWindowInnerWidth();
  const [activeTab, setActiveTab] = useState<string>('circle');

  const data: DataItem[] = [
    {
      label: 'Circle',
      value: 'circle',
      content: <div className="w-full"></div>
    },
    {
      label: 'Asset',
      value: 'asset',
      content: (
        <div className="flex flex-col  justify-center items-center"></div>
      )
    },
    {
      label: 'People',
      value: 'people',
      content: <div></div>
    },
    {
      label: 'Play',
      value: 'play',
      content: <div></div>
    }
  ];
  return (
    <div
      className={`z-1 relative sm:w-[90%] ${
        width !== undefined && width < 600
          ? 'w-[99%] overflow-x-auto'
          : width !== undefined && width < 500
          ? 'w-[99%] overflow-x-visible'
          : width !== undefined && width < 400
          ? 'w-[99%] overflow-x-visible'
          : width !== undefined && width > 600
          ? 'w-[600px] overflow-x-visible'
          : ''
      }!bg-white`}
    >
      <div className="md:bg-white sm:rounded-[18px] p-5 space-y-5">
        <div>
          <h4 className="md:text-2xl text-lg font-bold">Earn</h4>
          <p className="text-[#7C7C7C]">
            Enjoy a variety of special promotions just for you!
          </p>
        </div>
        <div className="flex items-center md:gap-10 gap-0">
          <div className="md:p-7 px-4 text-center font-bold text-lg space-y-1">
            <Image src={plants} alt="plants" width={70} />
            <p>Sprout</p>
          </div>
          <div className="flex-1 space-y-3">
            <p className="font-bold ">You Have 1200 XP</p>
            <div className="flex gap-5">
              <Stepper />
              <Image src={ArrowRightCollapseIcon} alt="plants" width={15} />
            </div>
            <p className="text-[#262626]">278 XP to your next level!</p>
          </div>
        </div>

        <div>
          <h4 className="md:text-2xl text-lg font-bold">Trending Today</h4>
          <p className="text-[#7C7C7C]">What&apos;s! trending today?</p>
        </div>

        <Tabs value={activeTab}>
          <TabsHeader
            className="bg-transparent max-w-sm"
            indicatorProps={{
              className:
                'bg-transparent mt-2 border-b-4 border-[#3AC4A0] shadow-none rounded-sm'
            }}
          >
            {data.map(({ label, value }) => (
              <Tab
                key={value}
                value={value}
                onClick={() => {
                  setActiveTab(value);
                }}
                className={`${activeTab === value ? 'text-[#3AC4A0]' : ''}`}
              >
                {label}
              </Tab>
            ))}
          </TabsHeader>
          <TabsBody>
            {data.map(({ value, content }) => (
              <TabPanel key={value} value={value}>
                <div className="border p-3 sm:space-y-8 space-y-5 rounded-2xl">
                  <div className="grid grid-cols-3 w-full items-center">
                    <div>Bitcoin</div>
                    <div className="flex items-center -space-x-4 justify-center">
                      <Avatar
                        size={width !== undefined && width > 720 ? 'sm' : 'xs'}
                        variant="circular"
                        alt="user 1"
                        className="border-2 border-white hover:z-10 focus:z-10"
                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                      />
                      <Avatar
                        size={width !== undefined && width > 720 ? 'sm' : 'xs'}
                        variant="circular"
                        alt="user 2"
                        className="border-2 border-white hover:z-10 focus:z-10"
                        src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80"
                      />
                      <Avatar
                        size={width !== undefined && width > 720 ? 'sm' : 'xs'}
                        variant="circular"
                        alt="user 3"
                        className="border-2 border-white hover:z-10 focus:z-10"
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1288&q=80"
                      />
                      <Avatar
                        size={width !== undefined && width > 720 ? 'sm' : 'xs'}
                        variant="circular"
                        alt="user 4"
                        className="border-2 border-white hover:z-10 focus:z-10"
                        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80"
                      />
                      <Avatar
                        size={width !== undefined && width > 720 ? 'sm' : 'xs'}
                        variant="circular"
                        alt="user 5"
                        className="border-2 border-white hover:z-10 focus:z-10"
                        src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80"
                      />
                    </div>
                    <div className="text-right">Premium</div>
                  </div>
                  <div className="grid grid-cols-3 w-full items-center">
                    <div>Bitcoin</div>
                    <div className="flex items-center -space-x-4 justify-center">
                      <Avatar
                        size={width !== undefined && width > 720 ? 'sm' : 'xs'}
                        variant="circular"
                        alt="user 1"
                        className="border-2 border-white hover:z-10 focus:z-10"
                        src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1480&q=80"
                      />
                      <Avatar
                        size={width !== undefined && width > 720 ? 'sm' : 'xs'}
                        variant="circular"
                        alt="user 2"
                        className="border-2 border-white hover:z-10 focus:z-10"
                        src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1061&q=80"
                      />
                      <Avatar
                        size={width !== undefined && width > 720 ? 'sm' : 'xs'}
                        variant="circular"
                        alt="user 3"
                        className="border-2 border-white hover:z-10 focus:z-10"
                        src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1288&q=80"
                      />
                      <Avatar
                        size={width !== undefined && width > 720 ? 'sm' : 'xs'}
                        variant="circular"
                        alt="user 4"
                        className="border-2 border-white hover:z-10 focus:z-10"
                        src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1287&q=80"
                      />
                      <Avatar
                        size={width !== undefined && width > 720 ? 'sm' : 'xs'}
                        variant="circular"
                        alt="user 5"
                        className="border-2 border-white hover:z-10 focus:z-10"
                        src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1760&q=80"
                      />
                    </div>
                    <div className="text-right">Premium</div>
                  </div>
                </div>
              </TabPanel>
            ))}
          </TabsBody>
        </Tabs>
      </div>
    </div>
  );
}
