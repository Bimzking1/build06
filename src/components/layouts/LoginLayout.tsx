import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import React from 'react';
import AppAds from '../AppAds';
import HeaderLogin from './HeaderLogin';
import SidebarLogin from './SidebarLogin';

interface props {
  children: any;
}

const LoginLayout: React.FC<props> = ({ children }) => {
  const width = useWindowInnerWidth();

  return (
    <div className="flex h-screen md:bg-[url('/assets/vector/quiz-bg.svg')] md:bg-cover md:bg-no-repeat">
      <aside
        className={`w-1/5 h-screen py-6 social-sidebar fixed ${
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
            className={`bg-white border-b p-5 rounded-xl md:mx-14 md:mt-10`}
          >
            <HeaderLogin />
          </header>
          <AppAds />
        </div>

        <div className="md:p-4 md:mx-11">{children}</div>
      </div>
    </div>
  );
};

export default LoginLayout;
