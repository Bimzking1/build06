import { useTranslation } from 'react-i18next';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const CircleMembership = () => {
  const { t } = useTranslation();
  return (
    <div className="max-h-96 overflow-auto pr-4">
      <p className="text-center font-bold">
        {t('termAndCondition.circleMembership.title')}
      </p>
      <p className="text-justify mt-10 font-semibold font-poppins font-14 font-600 leading-5">
        {t('termAndCondition.circleMembership.lastupdate')}
        <span className="text-purple-700">
          {t('termAndCondition.circleMembership.updatedate')}
        </span>
      </p>
      <p className="text-justify">
        {t(`termAndCondition.circleMembership.announcement`)}
      </p>

      {/* Services */}
      <p className="font-bold mt-8">
        {t(`termAndCondition.circleMembership.content.title.1`)}
      </p>
      <div className="text-justify">
        {t(`termAndCondition.circleMembership.content.desc.1`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
      </div>

      {/* Circle Owners Responsibilities */}
      <p className="font-bold mt-8">
        {t(`termAndCondition.circleMembership.content.title.2`)}
      </p>
      <div className="text-justify">
        {t(`termAndCondition.circleMembership.content.desc.2`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
      </div>

      {/* Fee and Commission */}
      <p className="font-bold mt-8">
        {t(`termAndCondition.circleMembership.content.title.3`)}
      </p>
      <div className="text-justify">
        {t(`termAndCondition.circleMembership.content.desc.3`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
      </div>

      {/* Utilization and Protection of Personal Data */}
      <p className="font-bold mt-8">
        {t(`termAndCondition.circleMembership.content.title.4`)}
      </p>
      <div className="text-justify">
        {t(`termAndCondition.circleMembership.content.desc.4`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
      </div>

      {/* Intellectual Property */}
      <p className="font-bold mt-8">
        {t(`termAndCondition.circleMembership.content.title.5`)}
      </p>
      <div className="text-justify">
        {t(`termAndCondition.circleMembership.content.desc.5`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
      </div>

      {/* Limitation Of Liability */}
      <p className="font-bold mt-8">
        {t(`termAndCondition.circleMembership.content.title.6`)}
      </p>
      <div className="text-justify">
        {t(`termAndCondition.circleMembership.content.desc.6`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
      </div>

      {/* Immediate Termination */}
      <p className="font-bold mt-8">
        {t(`termAndCondition.circleMembership.content.title.7`)}
      </p>
      <div className="text-justify">
        {t(`termAndCondition.circleMembership.content.desc.7`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
      </div>

      {/* Governing Law */}
      <p className="font-bold mt-8">
        {t(`termAndCondition.circleMembership.content.title.8`)}
      </p>
      <div className="text-justify">
        {t(`termAndCondition.circleMembership.content.desc.8`)
          .split('\n')
          .map((paragraph, index) => (
            <>
              <p key={index}>{paragraph}</p>
              <br />
            </>
          ))}
      </div>

      {/* Dispute Settlement */}
      <p className="font-bold mt-8">
        {t(`termAndCondition.circleMembership.content.title.9`)}
      </p>
      <div className="text-justify">
        {t(`termAndCondition.circleMembership.content.desc.9`)
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

export default CircleMembership;
