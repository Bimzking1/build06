import i18n from '@/utils/common/i18n';
import { type ParticipantI } from '@/utils/interfaces/academy.interface';
import React from 'react';

interface OptionsListProps {
  options: ParticipantI[];
  selectedOptionId: string | null;
  onSelectOption: (selectedOptionId: string) => void;
}

const OptionsList: React.FC<OptionsListProps> = ({
  options,
  selectedOptionId,
  onSelectOption
}) => {
  return (
    <div className="text-lg flex flex-col gap-5">
      {options.map((participant, index) => {
        const answerText =
          participant[`answer_lang_${i18n.language}` as keyof ParticipantI] ??
          participant.answer_lang_id;
        return (
          <div
            key={index}
            className={`p-3 ${
              participant.id === selectedOptionId
                ? 'bg-[#DCFCE4] border-2 border-[#3AC4A0]'
                : 'bg-white'
            } rounded-xl transition duration-300 ease-in-out hover:bg-[#DCFCE4] cursor-pointer`}
            onClick={() => {
              onSelectOption(participant.id);
            }}
          >
            {answerText}
          </div>
        );
      })}
    </div>
  );
};

export default OptionsList;
