import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import Image from 'next/image';
import router from 'next/router';
import { ArrowBackwardIcon } from 'public/assets/vector';
import { useTranslation } from 'react-i18next';
import FaqSubmenu from '..';

const RefundPolicy: React.FC = () => {
  const { t } = useTranslation();
  const width = useWindowInnerWidth();
  const cancelHandler = async (): Promise<void> => {
    try {
      await router.push('/faq-submenu');
    } catch (error) {
      console.error('Error navigating to FAQ submenu:', error);
    }
  };

  return (
    <FaqSubmenu>
      {/* Closure section */}
      <div className="w-full bg-white rounded-2xl flex justify-center  ">
        <div
          className={`z-3 lg:px-[10px] min-h-[calc(100vh-100px)] overflow-hidden p-4 relative justify-center text-justify bg-opacity-100 border-white py-4 border-4 ${
            width !== undefined && width < 600
              ? 'w-full overflow-x-auto'
              : width !== undefined && width < 500
              ? 'w-[99%] overflow-x-visible'
              : width !== undefined && width < 400
              ? 'w-[99%] overflow-x-visible'
              : width !== undefined && width > 600
              ? 'w-[600px] overflow-x-visible'
              : ''
          } h-auto bg-white`}
        >
          <div className="w-full bg-white rounded-2xl flex flex-col justify-center items-center">
            <button
              onClick={cancelHandler}
              className={`w-10 transition-colors rounded-md hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:bg-gray-200 absolute left-4 top-4 ${
                width !== undefined && width > 640 ? 'hidden' : ''
              }`}
            >
              <Image src={ArrowBackwardIcon} alt="arrow-backward-icon" />
            </button>
            <div className="font-poppins font-18 leading-7 font-bold text-neutral-500 flex flex-col items-center">
              {t('faq.refundPolicy.title')}
            </div>
          </div>
          <br />
          <div>
            <p
              className={`mb-5 font-semibold font-poppins font-14 font-600 leading-5 ${
                width !== undefined && width < 600 ? 'h-[20px]' : ''
              } bg-white`}
            >
              {t('faq.refundPolicy.lastUpdated')}
              <span className="text-purple-600">
                {t('faq.refundPolicy.date')}
              </span>
            </p>
            <br />
            <p className="font-bold font-18 font-poppins">Overview:</p>
            <br />
            <div>
              {Object(
                t('faq.refundPolicy.overview.title', { returnObjects: true })
              ).map((title: string, index: number) => {
                const description = t(
                  `faq.refundPolicy.overview.desc.${index}`
                );

                return (
                  <div key={index}>
                    <div key={index}>
                      <p className="font-bold">{title}</p>
                      <div className="text-justify">
                        {description.split('\n').map((paragraph, index) => {
                          const paragraphsWithTab = paragraph.split('\t');

                          return paragraphsWithTab.map(
                            (subParagraph, subIndex) => (
                              <div key={`${index}-${subIndex}`}>
                                <p>{subParagraph}</p>
                                {subIndex < paragraphsWithTab.length - 1 && (
                                  <p>&nbsp;</p>
                                )}
                              </div>
                            )
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </FaqSubmenu>
  );
};

export default RefundPolicy;
