/* eslint-disable react/display-name */
import { memo } from 'react';

interface Props {
  title: string;
  darkBackground: string;
  background: string;
  onClick: () => void;
  disabled?: boolean;
}
const QuizButton = memo<Props>(
  ({ title, darkBackground, background, onClick, disabled = false }) => {
    return (
      <button
        onClick={onClick}
        className={`hover:opacity-90 relative flex items-center justify-center border-2 border-white w-full h-14 rounded-full shadow-sm shadow-gray-600 drop-shadow-sm`}
        style={{ backgroundColor: disabled ? '#7C7C7C' : darkBackground }}
        disabled={disabled}
      >
        <div
          className={`h-12 w-full rounded-full absolute inset-0`}
          style={{ backgroundColor: disabled ? '#BDBDBD' : background }}
        />
        <div className="z-10 text-center text-xl font-semibold text-white">
          {title}
        </div>
      </button>
    );
  }
);

export default QuizButton;
