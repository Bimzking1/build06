'use client';
import CAccordion from '@/components/CAccordion';
import CardGradient from '@/components/ui/card/CardGradient';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import Faq from 'public/assets/faq.png';
import { useTranslation } from 'react-i18next';
import id from '../../../public/locales/id';

export default function FAQ(): React.ReactElement {
  const width = useWindowInnerWidth();
  const { t } = useTranslation();

  return (
    <PageGradient
      defaultGradient
      className={`z-0 sm:relative sm:py-20  overflow-hidden flex flex-col items-center w-full bottom-0  ${
        width !== undefined && width < 370
          ? 'w-[90%]'
          : width !== undefined && width < 500
          ? 'w-[90%]'
          : width !== undefined && width < 400
          ? 'w-[40%]'
          : width !== undefined && width > 600
          ? 'w-[600px]'
          : ''
      }bg-white`}
    >
      <CardGradient
        defaultGradient
        className={`z-1 relative flex flex-col justify-center items-center  sm:w-[90%] sm:rounded-[18px] sm:min-h-[36rem] ${
          width !== undefined && width < 600
            ? 'w-[99%] overflow-x-auto'
            : width !== undefined && width < 500
            ? 'w-[99%] overflow-x-visible'
            : width !== undefined && width < 400
            ? 'w-[99%] overflow-x-visible'
            : width !== undefined && width > 600
            ? 'w-[600px] overflow-x-visible'
            : ''
        }bg-white`}
      >
        <div className="w-full bg-white rounded-2xl flex justify-center ">
          <div
            className={`z-3 min-h-[calc(100vh-100px)] overflow-hidden relative justify-center text-justify bg-opacity-100 border-none border-4 ${
              width !== undefined && width < 600
                ? 'w-full overflow-x-auto'
                : width !== undefined && width < 500
                ? 'w-[99%] overflow-x-visible'
                : width !== undefined && width < 400
                ? 'w-[99%] overflow-x-visible'
                : width !== undefined && width > 600
                ? 'w-full overflow-x-visible'
                : ''
            } h-auto`}
          >
            <div className="flex md:flex-row p-3 flex-col max-w-6xl mx-auto py-10">
              <div className="flex justify-center w-full md:w-fit md:justify-start">
                <Image src={Faq} alt="faq" />
              </div>
              <br />
              <div className="flex flex-col justify-center p-3">
                <div className="font-semibold text-2xl md:text-3xl flex justify-center md:justify-start">
                  <div className=" w-[411px] md:w-full text-center md:text-left">{`${t(
                    'faq.title'
                  )}`}</div>
                </div>
                <br />
                <div className="font-semibold text-lg flex justify-center md:justify-start">
                  <div className=" w-[320px] md:w-full text-center md:text-left">{`${t(
                    'faq.subTitle'
                  )}`}</div>
                </div>
              </div>
            </div>
            <br />
            <div className="bg-white p-3 sm:rounded-b-[18px]">
              <div className="max-w-6xl mx-auto">
                {Object.keys(id.faq.faq.title).map((key, idx) => (
                  <CAccordion
                    key={key}
                    title={t(`faq.faq.title.${idx + 1}`)}
                    titleColor="#3AC4A0"
                    description={
                      <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
                        {t(`faq.faq.desc.${idx + 1}`)}
                      </div>
                    }
                  />
                ))}
              </div>
              <br />
              <div className="font-semibold text-xl flex justify-center text-neutral-600">
                <div className=" w-[210px] h-[56px] text-center">{`${t(
                  'faq.footerText'
                )}`}</div>
              </div>
              <br />
              <div className="w-full flex justify-center">
                <Button className="bg-seeds-button-green rounded-full">
                  {t('faq.button')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardGradient>
    </PageGradient>
  );
}
