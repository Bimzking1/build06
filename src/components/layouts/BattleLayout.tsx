import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import React, { type ReactNode } from 'react';
// import AppAds from '../AppAds';
import BattleGradient from '../ui/battle-gradient/BattleGradient';
import HeaderBattle from './HeaderBattle';
import SidebarLogin from './SidebarLogin';

interface props {
  children: ReactNode;
}

const BattleLayout: React.FC<props> = ({ children }) => {
  const width = useWindowInnerWidth();

  return (
    <div className="flex h-screen relative max-w-screen overflow-x-hidden">
      <div className="rounded-full border-2 border-white p-3 absolute -right-24 -top-24 opacity-20 z-0">
        <div className="rounded-full p-20 bg-white"></div>
      </div>
      <aside
        className={`w-1/5 py-6 h-screen bg-white fixed overflow-y-hidden ${
          width !== undefined ? (width >= 768 ? '' : 'hidden') : ''
        }`}
      >
        <SidebarLogin />
      </aside>
      <div
        className={`w-1/5 ${
          width !== undefined ? (width >= 768 ? '' : 'hidden') : ''
        }`}
      />

      <div className="w-4/5 flex-1 flex flex-col">
        <div className="flex flex-col-reverse md:flex-col md:gap-4">
          <header
            className={`bg-transparent p-5 rounded-xl md:mx-14 md:mt-10 z-10`}
          >
            <HeaderBattle />
          </header>
          {/* <AppAds /> */}
        </div>

        <div className="md:p-4 md:mx-11 relative">
          <BattleGradient defaultGradient className="-z-50 min-h-screen">
            {children}
          </BattleGradient>
          <div className="rounded-full border-2 border-white p-3 absolute -right-32 -z-10 bottom-0 opacity-20">
            <div className="rounded-full p-24 bg-white"></div>
          </div>
          <div className="rounded-full border-2 border-white p-3 absolute -left-24 -z-10 bottom-0 opacity-20">
            <div className="rounded-full p-14 bg-white"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BattleLayout;
