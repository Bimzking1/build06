/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Image from 'next/image';
import { memo, useEffect, useState } from 'react';
import CorrectIcon from '../../assets/play/quiz/answer-correct.svg';
import WrongIcon from '../../assets/play/quiz/answer-wrong.svg';

const AnswerButton = ({
  selected = false,
  onClick,
  title,
  rightAnswer,
  spillAnswer = false,
  disabled = false
}: {
  selected?: boolean;
  onClick: () => void;
  title: string;
  rightAnswer?: boolean;
  spillAnswer?: boolean;
  disabled?: boolean;
}): React.ReactElement => {
  const [bgColor, setBgColor] = useState<string>('bg-white');
  const [borderColor, setBorderColor] = useState<string>('border-[#E9E9E9]');

  const isValidURL = (option: string): boolean => {
    try {
      // eslint-disable-next-line no-new
      new URL(option.replace(/^[A-D]\.\s/, ''));
      return true;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    if (spillAnswer) {
      if (rightAnswer) {
        setBgColor('bg-[#DCFCE4]');
        setBorderColor('border-[#3AC4A0]');
      } else {
        setBgColor(selected ? 'bg-[#FFEBEB]' : 'bg-white');
        setBorderColor(selected ? 'border-[#DD2525]' : 'border-[#E9E9E9]');
      }
    } else {
      setBgColor(selected ? 'bg-[#E9E9E9]' : 'bg-white');
      setBorderColor(selected ? 'border-[#BDBDBD]' : 'border-[#E9E9E9]');
    }
  }, [spillAnswer, rightAnswer, selected]);

  return (
    <button
      onClick={onClick}
      className={`${
        isValidURL(title)
          ? `${bgColor} ${borderColor} rounded-xl ${
              spillAnswer ? 'border' : ''
            }`
          : `w-full rounded-full px-2 lg:px-4 py-3 border ${bgColor} ${borderColor} full flex flex-row justify-between items-center mb-2`
      }`}
      disabled={disabled}
    >
      {isValidURL(title) ? (
        <>
          <p>{title.substring(0, 2)}</p>
          <div
            className={`flex justify-center p-6 ${
              spillAnswer ? '' : 'border border-[#E9E9E9]'
            }  rounded-lg`}
          >
            <Image
              src={title.replace(/^[A-D]\.\s/, '')}
              alt="answer"
              width={120}
              height={120}
              className="object-cover rounded-md"
            />
          </div>
        </>
      ) : (
        <div className="text-sm text-start">{title}</div>
      )}
      {spillAnswer ? (
        rightAnswer ? (
          <Image src={CorrectIcon} alt="answer result" width={20} height={20} />
        ) : (
          selected && (
            <Image src={WrongIcon} alt="answer result" width={20} height={20} />
          )
        )
      ) : null}
    </button>
  );
};

export default memo(AnswerButton);
