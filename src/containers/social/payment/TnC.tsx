import CAccordion from '@/components/CAccordion';
import PrivacyPolicyTnC from '@/containers/circle/create-circle/privacyPolicyTnc';
import SocialMediaGuideTnc from '@/containers/circle/create-circle/socialMediaGuideTnC';
import TermAndConditionTnC from '@/containers/circle/create-circle/termAndConditionTnC';
import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import { ArrowBackwardIcon } from 'public/assets/vector';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface props {
  stepBack: () => void;
  stepNext: () => void;
}

const TnC: React.FC<props> = ({ stepBack, stepNext }) => {
  const { t } = useTranslation();
  const [isChecked, setIsChecked] = useState<boolean>(false);

  return (
    <>
      <div className="flex flex-row mb-4">
        <button
          className="w-1/3 items-start text-left transition-colors rounded-md hover:bg-gray-200 active:bg-gray-300 focus:outline-none focus:bg-gray-200"
          onClick={stepBack}
        >
          <Image src={ArrowBackwardIcon} alt="arrow-backward-icon" />
        </button>
      </div>
      <div
        className={`relative justify-center text-justify bg-opacity-100 border-white border-4 p-6 lg:px-32 bg-white`}
      >
        <div className="font-poppins font-semibold leading-7 text-lg text-neutral-500 flex flex-col items-center">
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
          <input
            type="checkbox"
            name="tickBox"
            className="mr-3"
            checked={isChecked}
            onChange={() => {
              setIsChecked(!isChecked);
            }}
            id="customCheck2"
          />
          <label
            htmlFor="customCheck2"
            className="font-normal text-xs md:text-sm text-[#262626]"
          >
            I agree with the Terms and Conditions
          </label>
          <Button
            className="w-full bg-seeds-button-green mt-10 rounded-full capitalize"
            disabled={!isChecked}
            onClick={stepNext}
          >
            Continue
          </Button>
        </div>
      </div>
    </>
  );
};

export default TnC;
