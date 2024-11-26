import CAccordion from '@/components/CAccordion';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import { useTranslation } from 'react-i18next';

const TermAndConditionTnC = (): JSX.Element => {
  const width = useWindowInnerWidth();
  const { t } = useTranslation();

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
          {t('termAndCondition.lastupdate')}{' '}
          <span className="text-purple-600">
            {t('termAndCondition.updatedate')}
          </span>
        </p>
        {t('termAndCondition.announcement')}
        <br />

        {/* Definition */}
        <CAccordion
          key={1}
          title={t(`termAndCondition.tnc.title.1`)}
          description={
            <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
              {t(`termAndCondition.tnc.desc.1`)
                .split('\n')
                .map((paragraph, index) => (
                  <>
                    <p key={index}>{paragraph}</p>
                    <br />
                  </>
                ))}
            </div>
          }
        />

        {/* User Statement */}
        <CAccordion
          key={2}
          title={t(`termAndCondition.tnc.title.2`)}
          description={
            <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
              {t(`termAndCondition.tnc.desc.2`)
                .split('\n')
                .map((paragraph, index) => (
                  <>
                    <p key={index}>{paragraph}</p>
                    <br />
                  </>
                ))}
            </div>
          }
        />

        {/* Scope of service */}
        <CAccordion
          key={3}
          title={t(`termAndCondition.tnc.title.3`)}
          description={
            <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
              {t(`termAndCondition.tnc.desc.3`)
                .split('\n')
                .map((paragraph, index) => (
                  <>
                    <p key={index}>{paragraph}</p>
                    <br />
                  </>
                ))}
            </div>
          }
        />

        {/* User Guideline */}
        <CAccordion
          key={4}
          title={t(`termAndCondition.tnc.title.4`)}
          description={
            <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
              {t(`termAndCondition.tnc.desc.4`)
                .split('\n')
                .map((paragraph, index) => (
                  <>
                    <p key={index}>{paragraph}</p>
                    <br />
                  </>
                ))}
            </div>
          }
        />

        {/* USE OF PERSONAL DATA */}
        <CAccordion
          key={5}
          title={t(`termAndCondition.tnc.title.5`)}
          description={
            <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
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
          }
        />

        {/* Limitation of Liability */}
        <CAccordion
          key={6}
          title={t(`termAndCondition.tnc.title.6`)}
          description={
            <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
              {t(`termAndCondition.tnc.desc.7`)
                .split('\n')
                .map((paragraph, index) => (
                  <>
                    <p key={index}>{paragraph}</p>
                    <br />
                  </>
                ))}
            </div>
          }
        />

        {/* Subject to user policy */}
        <CAccordion
          key={7}
          title={t(`termAndCondition.tnc.title.7`)}
          description={
            <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
              {t(`termAndCondition.tnc.desc.8`)
                .split('\n')
                .map((paragraph, index) => (
                  <>
                    <p key={index}>{paragraph}</p>
                    <br />
                  </>
                ))}
            </div>
          }
        />

        {/* Intellectual Property */}
        <CAccordion
          key={8}
          title={t(`termAndCondition.tnc.title.8`)}
          description={
            <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
              {t(`termAndCondition.tnc.desc.9`)
                .split('\n')
                .map((paragraph, index) => (
                  <>
                    <p key={index}>{paragraph}</p>
                    <br />
                  </>
                ))}
            </div>
          }
        />

        {/* Temporary suspension */}
        <CAccordion
          key={9}
          title={t(`termAndCondition.tnc.title.9`)}
          description={
            <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
              {t(`termAndCondition.tnc.desc.10`)
                .split('\n')
                .map((paragraph, index) => (
                  <>
                    <p key={index}>{paragraph}</p>
                    <br />
                  </>
                ))}
            </div>
          }
        />

        {/* Service Termination */}
        <CAccordion
          key={10}
          title={t(`termAndCondition.tnc.title.10`)}
          description={
            <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
              {t(`termAndCondition.tnc.desc.11`)
                .split('\n')
                .map((paragraph, index) => (
                  <>
                    <p key={index}>{paragraph}</p>
                    <br />
                  </>
                ))}
            </div>
          }
        />

        {/* Disclaimer */}
        <CAccordion
          key={11}
          title={t(`termAndCondition.tnc.title.11`)}
          description={
            <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
              {t(`termAndCondition.tnc.desc.12`)
                .split('\n')
                .map((paragraph, index) => (
                  <>
                    <p key={index}>{paragraph}</p>
                    <br />
                  </>
                ))}
            </div>
          }
        />

        {/* Governing Law */}
        <CAccordion
          key={12}
          title={t(`termAndCondition.tnc.title.12`)}
          description={
            <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
              {t(`termAndCondition.tnc.desc.13`)
                .split('\n')
                .map((paragraph, index) => (
                  <>
                    <p key={index}>{paragraph}</p>
                    <br />
                  </>
                ))}
            </div>
          }
        />

        {/* Variance */}
        <CAccordion
          key={13}
          title={t(`termAndCondition.tnc.title.13`)}
          description={
            <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
              {t(`termAndCondition.tnc.desc.14`)
                .split('\n')
                .map((paragraph, index) => (
                  <>
                    <p key={index}>{paragraph}</p>
                    <br />
                  </>
                ))}
            </div>
          }
        />

        {/* DISPUTE SETTLEMENT */}
        <CAccordion
          key={14}
          title={t(`termAndCondition.tnc.title.14`)}
          description={
            <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
              {t(`termAndCondition.tnc.desc.15`)
                .split('\n')
                .map((paragraph, index) => (
                  <>
                    <p key={index}>{paragraph}</p>
                    <br />
                  </>
                ))}
            </div>
          }
        />
      </div>
    </>
  );
};

export default TermAndConditionTnC;
