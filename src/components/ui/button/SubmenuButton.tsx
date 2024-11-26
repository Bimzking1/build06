import type { StaticImageData } from 'next/image';
import Image from 'next/image';

interface SubmenuButtonProps {
  startAdornment: StaticImageData;
  endAdornment: StaticImageData;
  altStartAdornment?: string;
  altEndAdornment?: string;
  label?: string;
  extraClasses?: string;
  className?: string;
  style?: object;
  onClick: () => void;
  currencyLabel?: string;
}

const animationClasses =
  'group-hover:translate-x-1 group-hover:ease-in-out group-hover:duration-500 transition-all ml-auto';

const SubmenuButton: React.FC<SubmenuButtonProps> = ({
  startAdornment,
  endAdornment,
  altStartAdornment = '',
  altEndAdornment = '',
  label = 'Submenu',
  extraClasses = 'w-full sm:w-[80%] md:w-2/3 lg:w-1/2',
  className,
  style,
  onClick,
  currencyLabel
}) => {
  const defaultButtonClasses = `z-10 group flex justify-start items-center text-sm text-neutral-medium hover:bg-gray-200 active:bg-gray-300 rounded-md ${extraClasses} h-auto px-2 py-2`;

  return (
    <button
      className={className ?? defaultButtonClasses}
      style={style}
      onClick={onClick}
    >
      <div className="flex justify-start items-center text-start">
        <Image
          src={startAdornment}
          alt={altStartAdornment}
          className="mr-4 max-w-[24px] max-h-[24px]"
        />
        <span className="font-poppins flex-grow">{label}</span>
        {currencyLabel != null && (
          <div className="flex justify-end items-center pr-2">
            <span className="font-poppins text-[#BDBDBD]">{currencyLabel}</span>
          </div>
        )}
      </div>
      <Image
        src={endAdornment}
        alt={altEndAdornment}
        className={animationClasses}
      />
    </button>
  );
};

export default SubmenuButton;

