import { useTranslation } from 'react-i18next';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const PrivacyPolicy = () => {
  const { t } = useTranslation();
  return (
    <div className="max-h-96 overflow-auto pr-4">
      <p className="text-center font-bold">{t('faq.privacy.title')}</p>

      <p className="text-justify mt-10 font-semibold font-poppins font-14 font-600 leading-5">
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
  );
};

export default PrivacyPolicy;
