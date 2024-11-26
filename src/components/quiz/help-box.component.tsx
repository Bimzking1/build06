/* eslint-disable react/display-name */
import Image from 'next/image';
import { memo } from 'react';

interface Props {
  icon: any;
  title?: string;
  selected: boolean;
  onClick: () => void;
  darkBackground: string;
  background: string;
}

const HelpBox = memo<Props>(
  ({ icon, title, selected, onClick, darkBackground, background }) => {
    return (
      <div className="flex flex-col justify-center items-center gap-4">
        <button
          className={`hover:opacity-60 relative flex items-center justify-center border-2 border-white h-20 w-20 rounded-xl shadow-sm shadow-gray-600 drop-shadow-sm ${
            selected ? '' : 'opacity-40'
          }`}
          style={{ backgroundColor: darkBackground }}
          onClick={onClick}
        >
          <div
            className={`h-[72px] w-full rounded-xl absolute inset-0`}
            style={{ backgroundColor: background }}
          />
          <Image
            src={icon}
            alt={title as string}
            width={100}
            height={100}
            className="object-contain w-6 h-6 lg:w-12 lg:h-12 z-10"
          />
        </button>
        {title !== undefined && (
          <div className="text-sm lg:text-base font-semibold">{title}</div>
        )}
      </div>
    );
  }
);

export default HelpBox;
