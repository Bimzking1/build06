import CardGradient from '@/components/ui/card/CardGradient';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import { useTranslation } from 'react-i18next';

const PrivacyPolicy: React.FC = () => {
  const { t } = useTranslation();
  const width = useWindowInnerWidth();

  return (
    <PageGradient
      defaultGradient
      className={`z-0 sm:relative sm:pb-20  overflow-hidden flex flex-col items-center w-full bottom-0  ${
        width !== undefined && width < 370
          ? 'w-[90%]'
          : width !== undefined && width < 500
          ? 'w-[90%]'
          : width !== undefined && width < 400
          ? 'w-[40%]'
          : width !== undefined && width > 600
          ? 'w-[600px]'
          : ''
      } ${
        width !== undefined && width < 370
          ? 'h-[50rem]'
          : width !== undefined && width < 400
          ? 'h-[50rem]'
          : width !== undefined && width < 415
          ? 'h-[48rem]'
          : ''
      } bg-white`}
    >
      <CardGradient
        defaultGradient
        className={`z-1 relative overflow-hidden flex flex-col justify-center shadow-2xl items-center lg:w-[65%] sm:w-[90%] sm:rounded-[18px] sm:min-h-[36rem] ${
          width !== undefined && width < 600
            ? 'w-full'
            : width !== undefined && width < 500
            ? 'w-[90%]'
            : width !== undefined && width < 400
            ? 'w-[40%]'
            : width !== undefined && width > 600
            ? 'w-[600px]'
            : ''
        } bg-white`}
      >
        {/* Closure section */}
        <div
          className={`z-3 min-h-[calc(100vh-100px)] lg:w-[100%] relative justify-center text-justify bg-opacity-100 border-white border-4 ${
            width !== undefined && width < 600
              ? 'w-[90%] overflow-x-auto'
              : width !== undefined && width < 500
              ? 'w-[90%] overflow-x-visible'
              : width !== undefined && width < 400
              ? 'w-[40%] overflow-x-visible'
              : width !== undefined && width > 600
              ? 'w-[600px] overflow-x-visible'
              : ''
          }  bg-white`}
        >
          <div className="font-poppins font-18 leading-7 font-bold text-neutral-500 flex flex-col items-center">
            {t('faq.privacy.title')}
          </div>

          <br />
          <p className="lg:mx-[20%] font-bold font-14 leading-5 font-poppins">
            {t('faq.privacy.lastUpdated')}
            <span className="text-purple-700">{t('faq.disclosure.date')}</span>
          </p>
          <br />
          <p className="font-bold lg:mx-[20%] font-18 font-poppins">
            Overview:
          </p>
          <br />
          <div>
            {Object(
              t('faq.privacy.overview.title', { returnObjects: true })
            ).map((title: string, index: number) => {
              const description = t(`faq.privacy.overview.desc.${index}`);

              return (
                <div key={index}>
                  <p className="font-bold lg:mx-[20%]">{title}</p>
                  <div className="text-justify lg:mx-[20%]">
                    {description.split('\n').map((paragraph, index) => (
                      <>
                        <p key={index}>{paragraph}</p>
                      </>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardGradient>
    </PageGradient>
  );
};

export default PrivacyPolicy;
