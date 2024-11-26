import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { ArrowBackwardIcon, DeleteIcon, Logo } from 'public/assets/vector';
import CardGradient from '../ui/card/CardGradient';

const numbersColumn1 = ['1', '4', '7'];
const numbersColumn2 = ['2', '5', '8', '0'];
const numbersColumn3 = ['3', '6', '9', ''];
const dotsRow = ['', '', '', '', '', ''];

const dotContainerClasses = 'relative flex justify-center items-center';
const animationClasses =
  'absolute animate-ping w-5 h-5 lg:w-7 lg:h-7 rounded-full bg-neutral-medium';

interface props {
  formRequest: any;
  enterPinHandler: any;
  onCancel: any;
  deletePinHandler: any;
  title: string;
  subtitle?: string;
  error?: any;
  isInputPin?: boolean;
}

const InputPin: React.FC<props> = ({
  formRequest,
  enterPinHandler,
  onCancel,
  deletePinHandler,
  title,
  subtitle,
  error = '',
  isInputPin = true
}) => {
  const width = useWindowInnerWidth();

  const pin = isInputPin ? formRequest.new_pin : formRequest.pin;

  const dotClasses = `absolute w-7 h-7 lg:w-9 lg:h-9 rounded-full border-4 ${
    error !== '' ? 'border-warning-hard' : 'border-[#CCDCDC]'
  }`;
  const isDisabled = pin.length === 6;
  const buttonClasses = `z-10 flex justify-center items-center w-10 h-10 transition-colors rounded-full font-montserrat text-3xl font-semibold hover:bg-gray-200 ${
    !isDisabled ? 'active:bg-gray-300' : 'cursor-not-allowed'
  }`;

  const defaultClasses = `relative overflow-hidden w-full sm:rounded-[18px] sm:h-[36rem] bg-white ${
    width !== undefined && width < 370
      ? 'h-[38rem]'
      : width !== undefined && width < 400
      ? 'h-[45rem]'
      : width !== undefined && width < 415
      ? 'h-[48rem]'
      : ''
  }`;

  return (
    <CardGradient defaultGradient className={defaultClasses}>
      <div className="max-w-max mx-auto mt-6 mb-36">
        <div className="relative flex items-center sm:mb-8 mb-10">
          <button
            onClick={() => onCancel()}
            className="absolute left-0 w-10 transition-colors rounded-md hover:bg-gray-200 active:bg-gray-300"
          >
            <Image src={ArrowBackwardIcon} alt="arrow-backward-icon" />
          </button>
          <span className="mx-auto">
            <Image src={Logo} alt="logo" />
          </span>
        </div>

        <Typography className="mb-2 lg:text-3xl text-2xl font-poppins font-semibold text-center text-neutral-medium">
          {title}
        </Typography>

        <Typography className="mb-5 text-base font-poppins font-normal text-center text-neutral-medium">
          {subtitle}
        </Typography>

        <div
          className={`transition-all duration-700 flex justify-center items-center gap-14 lg:gap-20 h-10 px-5 ${
            error !== '' ? '' : 'sm:mb-10 mb-16'
          }`}
        >
          {dotsRow.map((_, index) => (
            <span key={index} className={dotContainerClasses}>
              <span
                className={pin.length === index + 1 ? animationClasses : ''}
              ></span>
              <span
                className={
                  pin.length >= index + 1
                    ? `${dotClasses} bg-neutral-medium`
                    : dotClasses
                }
              ></span>
            </span>
          ))}
        </div>
        {error !== '' && (
          <p
            className={`animate-fade-in mt-4 text-center font-light font-poppins text-base text-warning-hard ${
              error !== '' ? 'sm:mb-10 mb-16' : ''
            }`}
          >
            {error}
          </p>
        )}

        <div className="flex justify-evenly lg:justify-between [&>*]:flex [&>*]:flex-col [&>*]:gap-4">
          <div>
            {numbersColumn1.map(number => (
              <button
                key={number}
                tabIndex={0}
                className={buttonClasses}
                onClick={() => enterPinHandler(number)}
                disabled={isDisabled}
              >
                {number}
              </button>
            ))}
          </div>
          <div className="mx-8 lg:mx-0">
            {numbersColumn2.map(number => (
              <button
                key={number}
                tabIndex={0}
                className={buttonClasses}
                onClick={() => enterPinHandler(number)}
                disabled={isDisabled}
              >
                {number}
              </button>
            ))}
          </div>
          <div>
            {numbersColumn3.map(number => (
              <button
                key={number}
                tabIndex={0}
                className={`${buttonClasses} ${
                  number === '' ? 'cursor-pointer active:bg-gray-300' : ''
                }`}
                onClick={() =>
                  number === '' ? deletePinHandler() : enterPinHandler(number)
                }
                disabled={number === '' ? false : isDisabled}
              >
                {number === '' ? (
                  <Image src={DeleteIcon} alt="delete-icon" />
                ) : (
                  number
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </CardGradient>
  );
};

export default InputPin;
