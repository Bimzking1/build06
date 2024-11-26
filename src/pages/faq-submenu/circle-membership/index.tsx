import CAccordion from '@/components/CAccordion';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import Image from 'next/image';
import router from 'next/router';
import { ArrowBackwardIcon } from 'public/assets/vector';
import { useTranslation } from 'react-i18next';
import FaqSubmenu from '..';

const CircleMembership: React.FC = () => {
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
              {t('termAndCondition.circleMembership.title')}
            </div>
          </div>
          <br />
          <div>
            <p className="font-bold font-14 leading-5 font-poppins">
              {t('termAndCondition.circleMembership.lastupdate')}
              <span className="text-purple-700">
                {t('termAndCondition.circleMembership.updatedate')}
              </span>
            </p>
            <br />
            <p className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
              {t(`termAndCondition.circleMembership.announcement`)}
            </p>
            <br />

            <div className="">
              {/* Services */}
              <CAccordion
                key={1}
                title={t(`termAndCondition.circleMembership.content.title.1`)}
                description={
                  <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
                    {t(`termAndCondition.circleMembership.content.desc.1`)
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

              {/* Circle Owners Responsibilities */}
              <CAccordion
                key={2}
                title={t(`termAndCondition.circleMembership.content.title.2`)}
                description={
                  <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
                    {t(`termAndCondition.circleMembership.content.desc.2`)
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

              {/* Fee and Commission */}
              <CAccordion
                key={3}
                title={t(`termAndCondition.circleMembership.content.title.3`)}
                description={
                  <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
                    {t(`termAndCondition.circleMembership.content.desc.3`)
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

              {/* Utilization and Protection of Personal Data */}
              <CAccordion
                key={4}
                title={t(`termAndCondition.circleMembership.content.title.4`)}
                description={
                  <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
                    {t(`termAndCondition.circleMembership.content.desc.4`)
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
                key={5}
                title={t(`termAndCondition.circleMembership.content.title.5`)}
                description={
                  <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
                    {t(`termAndCondition.circleMembership.content.desc.5`)
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

              {/* Limitation Of Liability */}
              <CAccordion
                key={6}
                title={t(`termAndCondition.circleMembership.content.title.6`)}
                description={
                  <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
                    {t(`termAndCondition.circleMembership.content.desc.6`)
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

              {/* Immediate Termination */}
              <CAccordion
                key={7}
                title={t(`termAndCondition.circleMembership.content.title.7`)}
                description={
                  <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
                    {t(`termAndCondition.circleMembership.content.desc.7`)
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
                key={8}
                title={t(`termAndCondition.circleMembership.content.title.8`)}
                description={
                  <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
                    {t(`termAndCondition.circleMembership.content.desc.8`)
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

              {/* Dispute Settlement */}
              <CAccordion
                key={9}
                title={t(`termAndCondition.circleMembership.content.title.9`)}
                description={
                  <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
                    {t(`termAndCondition.circleMembership.content.desc.9`)
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
      </div>
    </FaqSubmenu>
  );
};

export default CircleMembership;
