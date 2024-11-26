import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import React from 'react';
import { useTranslation } from 'react-i18next';

const SocialMediaGuideTnc = (): JSX.Element => {
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
        <br />
        <p className="font-bold font-14 leading-5 ">
          {t('faq.socialMediaGuide.lastUpdated')}
          <span className="text-purple-700">
            {t('termAndCondition.socialMediaGuide.date')}
          </span>
        </p>
        <br />
        <p className=" font-14 leading-5 text-justify">
          {t('termAndCondition.socialMediaGuide.overview')
            .split('\n')
            .map((line, index) => (
              <React.Fragment key={index}>
                {line}
                <br />
                <br />
              </React.Fragment>
            ))}
        </p>

        <div>
          {/* Guidelines */}
          <p className="font-bold">
            {t('termAndCondition.socialMediaGuide.content.rules.1.title')}
          </p>
          <ul className="list-disc pl-4 ml-6">
            {Array.from({ length: 3 }, (_, index) => (
              <li key={index}>
                {t(
                  `termAndCondition.socialMediaGuide.content.rules.1.items.${
                    index + 1
                  }`
                )}
              </li>
            ))}
          </ul>

          {/* Dont */}
          <p className="font-bold">
            {t('termAndCondition.socialMediaGuide.content.rules.2.title')}
          </p>
          <ul className="list-disc pl-4 ml-6">
            {Array.from({ length: 15 }, (_, index) => (
              <li key={index}>
                {t(
                  `termAndCondition.socialMediaGuide.content.rules.2.items.${
                    index + 1
                  }`
                )}
              </li>
            ))}
          </ul>

          {/* rules */}
          <p className="font-bold">
            {t('termAndCondition.socialMediaGuide.content.rules.3.title')}
          </p>
          <ul className="list-disc pl-4 ml-6">
            {Array.from({ length: 6 }, (_, index) => (
              <li key={index}>
                {t(
                  `termAndCondition.socialMediaGuide.content.rules.3.items.${
                    index + 1
                  }`
                )}
              </li>
            ))}
          </ul>

          {/* consequence */}
          <p className="font-bold">
            {t('termAndCondition.socialMediaGuide.content.rules.4.title')}
          </p>
          <ul className="list-disc pl-4 ml-6">
            {Array.from({ length: 1 }, (_, index) => (
              <p key={index}>
                {t(
                  `termAndCondition.socialMediaGuide.content.rules.4.items.${
                    index + 1
                  }`
                )}
              </p>
            ))}
          </ul>

          {/* agreement */}
          <p className="font-bold">
            {t('termAndCondition.socialMediaGuide.content.rules.5.title')}
          </p>
          <ul className="list-disc pl-4 ml-6">
            {Array.from({ length: 1 }, (_, index) => (
              <p key={index}>
                {t(
                  `termAndCondition.socialMediaGuide.content.rules.5.items.${
                    index + 1
                  }`
                )}
              </p>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default SocialMediaGuideTnc;
