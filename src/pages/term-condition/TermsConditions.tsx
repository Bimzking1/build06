import { useTranslation } from 'react-i18next';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const TermsConditions = () => {
  const { t } = useTranslation();
  return (
    <div className="max-h-96 overflow-auto pr-4">
      <p className="text-center font-bold">{t('termAndCondition.title')}</p>
      <p className="text-justify mt-10 font-semibold font-poppins font-14 font-600 leading-5">
        {' '}
        {t('termAndCondition.lastupdate')}{' '}
        <span className="text-purple-600">
          {t('termAndCondition.updatedate')}
        </span>
      </p>
      <p className="text-justify">{t('termAndCondition.announcement')}</p>

      {/* Definition */}
      <p className="font-bold mt-8">{t(`termAndCondition.tnc.title.1`)}</p>
      <div className="text-justify">
        {t(`termAndCondition.tnc.desc.1`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
      </div>

      {/* User Statement */}
      <p className="font-bold mt-8">{t(`termAndCondition.tnc.title.2`)}</p>
      <div className="text-justify">
        {t(`termAndCondition.tnc.desc.2`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
      </div>

      {/* Scope of service */}
      <p className="font-bold mt-8">{t(`termAndCondition.tnc.title.3`)}</p>
      <div className="text-justify">
        {t(`termAndCondition.tnc.desc.3`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
      </div>

      {/* User Guideline */}
      <p className="font-bold mt-8">{t(`termAndCondition.tnc.title.4`)}</p>
      <div className="text-justify">
        {t(`termAndCondition.tnc.desc.4`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
      </div>

      {/* USE OF PERSONAL DATA */}
      <p className="font-bold mt-8">{t(`termAndCondition.tnc.title.5`)}</p>
      <div className="text-justify">
        {t(`termAndCondition.tnc.desc.5`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
        <ul className="list-disc pl-4 ml-6">
          {Object.values(
            t('termAndCondition.tnc.list.5', { returnObjects: true })
          ).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <br />

        {/* second paragraph */}
        {t(`termAndCondition.tnc.desc.6`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
      </div>

      {/* Limitation of Liability */}
      <p className="font-bold mt-8">{t(`termAndCondition.tnc.title.6`)}</p>
      <div className="text-justify">
        {t(`termAndCondition.tnc.desc.7`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
      </div>

      {/* Subject to user policy */}
      <p className="font-bold mt-8">{t(`termAndCondition.tnc.title.7`)}</p>
      <div className="text-justify">
        {t(`termAndCondition.tnc.desc.8`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
      </div>

      {/* Intellectual Property */}
      <p className="font-bold mt-8">{t(`termAndCondition.tnc.title.8`)}</p>
      <div className="text-justify">
        {t(`termAndCondition.tnc.desc.9`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
      </div>

      {/* Temporary suspension */}
      <p className="font-bold mt-8">{t(`termAndCondition.tnc.title.9`)}</p>
      <div className="text-justify">
        {t(`termAndCondition.tnc.desc.10`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
      </div>

      {/* Service Termination */}
      <p className="font-bold mt-8">{t(`termAndCondition.tnc.title.10`)}</p>
      <div className="text-justify">
        {t(`termAndCondition.tnc.desc.11`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
      </div>

      {/* Disclaimer */}
      <p className="font-bold mt-8">{t(`termAndCondition.tnc.title.11`)}</p>
      <div className="text-justify">
        {t(`termAndCondition.tnc.desc.12`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
      </div>

      {/* Governing Law */}
      <p className="font-bold mt-8">{t(`termAndCondition.tnc.title.12`)}</p>
      <div className="text-justify">
        {t(`termAndCondition.tnc.desc.13`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
      </div>

      {/* Variance */}
      <p className="font-bold mt-8">{t(`termAndCondition.tnc.title.13`)}</p>
      <div className="text-justify">
        {t(`termAndCondition.tnc.desc.14`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
      </div>

      {/* DISPUTE SETTLEMENT */}
      <p className="font-bold mt-8">{t(`termAndCondition.tnc.title.14`)}</p>
      <div className="text-justify">
        {t(`termAndCondition.tnc.desc.15`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
      </div>
    </div>
  );
};

export default TermsConditions;
