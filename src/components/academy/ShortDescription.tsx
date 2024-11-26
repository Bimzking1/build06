import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const ShortDescription: React.FC<{ text: string }> = ({ text }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const shortText = text?.slice(0, 150);
  const { t } = useTranslation();
  const showMoreLink = text !== '' && text?.length > 150;

  return (
    <>
      {showFullDescription ? text : shortText}
      {showMoreLink && (
        <span
          className="text-[#3AC4A0] cursor-pointer underline decoration-solid decoration-[#3AC4A0] underline-offset-2 ps-2 break-words"
          onClick={() => {
            setShowFullDescription(prev => !prev);
          }}
        >
          {showFullDescription
            ? `${t('academy.detailCourse.showLess')}`
            : `${t('academy.detailCourse.moreDetail')}`}
        </span>
      )}
    </>
  );
};

export default ShortDescription;
