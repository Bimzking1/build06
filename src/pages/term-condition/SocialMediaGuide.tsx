import React from 'react';
import { useTranslation } from 'react-i18next';

const SocialMediaGuide: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-h-96 overflow-auto pr-4">
      <div className="font-poppins font-18 leading-7 font-bold text-neutral-500 flex flex-col items-center">
        {t('termAndCondition.socialMediaGuide.title')}
      </div>

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
  );
};

export default SocialMediaGuide;
