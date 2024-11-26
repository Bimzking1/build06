import common from '@/utils/common';
import Image from 'next/image';
import bgLine from 'public/assets/story-boarding/bg-line.png';
import hello from 'public/assets/story-boarding/hello.png';
import logo from 'public/assets/story-boarding/logo-seeds.png';
import { useTranslation } from 'react-i18next';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import Dropdown from './Dropdown';

export default function Container({
  children
}: {
  children: React.ReactNode;
}): React.ReactElement {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string): void => {
    void i18n.changeLanguage(lng);
  };
  return (
    <div className="opacity-0 flex min-w-full min-h-full fade-in">
      <div className="w-full h-screen lg:w-1/2 relative bg-gradient-to-tr from-seeds-green  to-seeds-purple">
        <div className="w-full h-full hidden lg:block">
          <div className="min-h-full flex items-center justify-center min-w-full transition-all duration-300   px-[5%] py-[3%]">
            <Image
              className="fixed bottom-0 w-1/2 left-0 z-0"
              src={bgLine}
              alt=""
            />
            <Image className="left-0 w-[30vw]" src={hello} alt="" />
          </div>
        </div>
      </div>
      <div className="w-full h-screen lg:w-1/2 relative bg-gradient-to-tr from-seeds-green to-seeds-purple lg:bg-none">
        <div className={`absolute h-full w-full z-20`}>
          <div className="w-full flex items-center justify-center lg:py-16 h-full p-8 ">
            <div className="bg-white bg-opacity-50 min-w-full min-h-full p-4 lg:px-8 relative rounded-2xl shadow-center text-sm lg:text-base">
              <div className="w-full flex justify-between items-center lg:pr-0">
                <Image src={logo} alt="" />
                <Dropdown
                  options={common.langOptions}
                  onClick={(v: any) => {
                    changeLanguage(v.id);
                  }}
                />
              </div>
              {children}
            </div>
          </div>
        </div>
        <div className="w-full h-1/2 justify-between flex">
          <div
            className="rounded-full bg-seeds-green blur-[100px] "
            style={{ height: '350px', width: '350px' }}
          />
          <div
            className="rounded-full bg-seeds-purple blur-[100px]  right-0"
            style={{ height: '350px', width: '350px' }}
          />
        </div>
      </div>
    </div>
  );
}
