/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import CorrectIcon from '@/assets/play/quiz/answer-correct.svg';
import WrongIcon from '@/assets/play/quiz/answer-wrong.svg';
import Image from 'next/image';
import { memo, useEffect, useState } from 'react';

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
      className={`w-1/2 rounded-full px-2 py-1 lg:px-4 lg:py-3 border ${bgColor} ${borderColor} flex flex-row justify-between items-center`}
      disabled={disabled}
    >
      <div className="text-sm text-start">{title}</div>
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
