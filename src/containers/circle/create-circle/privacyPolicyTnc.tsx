import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import { useTranslation } from 'react-i18next';

const PrivacyPolicyTnC = (): JSX.Element => {
  const { t } = useTranslation();
  const width = useWindowInnerWidth();

  return (
    <>
      <div
        className={`z-3 lg:px-[10px] min-h-[calc(100vh-100px)] p-4 relative justify-center text-justify bg-opacity-100 border-white py-4 border-4 ${
          width !== undefined && width < 600
            ? 'w-[99%] overflow-x-auto'
            : width !== undefined && width < 500
            ? 'w-[99%] overflow-x-visible'
            : width !== undefined && width < 400
            ? 'w-[99%] overflow-x-visible'
            : ''
        }  ${
          width !== undefined && width < 370
            ? 'h-[50rem]'
            : width !== undefined && width < 400
            ? 'h-[50rem]'
            : width !== undefined && width < 415
            ? 'h-[48rem]'
            : ''
        } bg-white`}
      >
        <p
          className={`mb-5 font-semibold font-poppins font-14 font-600 leading-5 ${
            width !== undefined && width < 600 ? 'h-[20px]' : ''
          } bg-white`}
        >
          {t('faq.privacy.lastUpdated')}
          <span className="text-purple-600">{t('faq.disclosure.date')}</span>
        </p>
        <br />
        <p className="font-bold font-18 font-poppins">Overview:</p>
        <br />
        <div>
          {Object(t('faq.privacy.overview.title', { returnObjects: true })).map(
            (title: string, index: number) => {
              const description = t(`faq.privacy.overview.desc.${index}`);

              return (
                <div key={index}>
                  <p className="font-bold">{title}</p>
                  <div className="text-justify">
                    {description.split('\n').map((paragraph, index) => (
                      <>
                        <p key={index}>{paragraph}</p>
                      </>
                    ))}
                  </div>
                </div>
              );
            }
          )}
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicyTnC;
