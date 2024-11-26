import CAccordion from '@/components/CAccordion';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import Image from 'next/image';
import router from 'next/router';
import { ArrowBackwardIcon } from 'public/assets/vector';
import { useTranslation } from 'react-i18next';
import FaqSubmenu from '..';

const TersmCondition: React.FC = () => {
  const width = useWindowInnerWidth();
  const { t } = useTranslation();
  const cancelHandler = async (): Promise<void> => {
    try {
      await router.push('/faq-submenu');
    } catch (error) {
      console.error('Error navigating to FAQ submenu:', error);
    }
  };
  return (
    <FaqSubmenu>
      <div className="w-full bg-white rounded-2xl flex justify-center  ">
        <div
          className={`z-3 lg:px-[10px] min-h-[calc(100vh-100px)] overflow-y-auto p-4 relative justify-center text-justify bg-opacity-100 border-white py-4 border-4 ${
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
              {t('termAndCondition.title')}
            </div>
          </div>
          <br />

          <div>
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
              key={7}
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
              key={8}
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
              key={9}
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
              key={10}
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
              key={11}
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
              key={12}
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
              key={13}
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
        </div>
      </div>
    </FaqSubmenu>
  );
};

export default TersmCondition;
