import CAccordion from '@/components/CAccordion';
import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import { ArrowBackwardIcon } from 'public/assets/vector';
import { useTranslation } from 'react-i18next';
import PrivacyPolicyTnC from './privacyPolicyTnc';
import SocialMediaGuideTnc from './socialMediaGuideTnC';
import TermAndConditionTnC from './termAndConditionTnC';

const TermConditionPage = ({
  changeStep,
  handleRoute,
  setIsChecked,
  isChecked
}: any): JSX.Element => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex flex-row mb-4">
        <button
          className="w-1/3 items-start text-left transition-colors rounded-md hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:bg-gray-200"
          onClick={() => changeStep('')}
        >
          <Image src={ArrowBackwardIcon} alt="arrow-backward-icon" />
        </button>
      </div>
      <div
        className={`relative justify-center text-justify bg-opacity-100 border-white border-4 p-6 bg-white`}
      >
        <div className="font-poppins font-normal leading-7 text-base text-neutral-500 flex flex-col items-center">
          {t('termAndCondition.title')}
        </div>

        <br />

        {t('termAndCondition.announcement')}

        <CAccordion
          key={1}
          title="Terms Conditions"
          description={
            <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
              <TermAndConditionTnC />
            </div>
          }
        />

        <CAccordion
          key={2}
          title="Privacy Policy"
          description={
            <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
              <PrivacyPolicyTnC />
            </div>
          }
        />

        <CAccordion
          key={3}
          title="Social Media Guidelines"
          description={
            <div className="flex flex-col self-stretch text-sm font-poppins text-14 leading-20 text-[#262626]">
              <SocialMediaGuideTnc />
            </div>
          }
        />

        <div className="text-center mt-10 mx-8 pb-2">
          {isChecked !== undefined ? (
            <input
              type="checkbox"
              name="tickBox"
              className="mr-3"
              checked={isChecked}
              onChange={() => {
                if (isChecked === true) {
                  setIsChecked(false);
                }
                setIsChecked(true);
              }}
              id="customCheck2"
            />
          ) : (
            <input
              type="checkbox"
              name="tickBox"
              className="mr-3"
              id="customCheck2"
            />
          )}
          <label
            htmlFor="customCheck2"
            className="font-normal text-xs md:text-sm text-[#262626]"
          >
            I agree with the Terms and Conditions
          </label>
          {handleRoute !== undefined ? (
            <Button
              className="w-full bg-seeds-button-green mt-10 rounded-full capitalize"
              onClick={() => handleRoute()}
            >
              Continue
            </Button>
          ) : (
            <Button className="w-full bg-seeds-button-green mt-10 rounded-full capitalize">
              Continue
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default TermConditionPage;
