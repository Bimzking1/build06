import SeedsPin from '@/assets/my-profile/editProfile/SeedsPin.svg';
import { Button, Card, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowBackwardIcon, DeleteIcon } from 'public/assets/vector';
import { type Dispatch, type SetStateAction } from 'react';

interface VariablePin {
  pin: any;
  setPin: any;
  error: any;
  setError: any;
  emptyPinIndex: any;
  className: string;
  title: string;
  setSelect: Dispatch<SetStateAction<number>>;
}

const ColNum = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

const ValidatePin: React.FC<VariablePin> = ({
  pin,
  setPin,
  emptyPinIndex,
  error,
  setError,
  className,
  title,
  setSelect
}: VariablePin) => {
  return (
    <div className={`${className} justify-center`}>
      <Card className="flex items-center w-[947px] h-[721px] py-5">
        <form className="flex flex-col items-center w-[600px] h-full p-4">
          <Image
            src={ArrowBackwardIcon}
            alt="arrow-backward-icon"
            onClick={() => {
              setSelect((prev: number) => prev - 1);
            }}
            className="absolute left-8 cursor-pointer"
          />

          <div className="flex flex-col items-center gap-[43px]">
            <Image src={SeedsPin} alt="SeedsPin" />
            <div className="flex flex-col gap-2">
              <Typography className="font-poppins font-semibold text-3xl text-[#262626] text-center">
                {title}
              </Typography>
              <Typography className="font-poppins font-normal text-base text-[#7C7C7C] text-center">
                Please enter your PIN number correctly
              </Typography>
            </div>
            <div className="flex w-full justify-evenly">
              {pin?.map((value: any, index: any) => {
                return (
                  <span
                    key={index}
                    className={`w-9 h-9 ${
                      value !== ''
                        ? 'bg-[#3AC4A0]'
                        : 'border-[#CCDCDC] border-4'
                    } ${
                      error === true ? 'border-[#DD2525] border-4' : ''
                    } rounded-full`}
                  ></span>
                );
              })}
            </div>

            <div className="flex flex-wrap justify-center items-center gap-x-[127px] gap-y-5">
              {ColNum.map((value, index) => {
                return (
                  <Button
                    key={index}
                    className={`font-poppins font-semibold text-4xl text-[#262626] text-center w-1/6 p-0 bg-transparent shadow-none hover:shadow-none ${
                      emptyPinIndex === 5 ? '' : ''
                    }`}
                    disabled={emptyPinIndex === -1}
                    onClick={() => {
                      if (emptyPinIndex !== -1) {
                        setError(false);
                        pin[emptyPinIndex] = value;
                        setPin([...pin]);
                      }
                    }}
                  >
                    {value}
                  </Button>
                );
              })}
            </div>
          </div>
          <Link
            href={`/user-setting/forgot-pin`}
            className="font-poppins font-semibold text-xs text-[#3AC4A0] self-end"
          >
            Forgot PIN?
          </Link>
          <Image
            src={DeleteIcon}
            alt="DeleteIcon"
            className="absolute bottom-[206px] right-[240px] cursor-pointer"
            onClick={() => {
              if (emptyPinIndex === -1) {
                pin[5] = '';
                setPin([...pin]);
              } else {
                pin[emptyPinIndex - 1] = '';
                setPin([...pin]);
              }
            }}
          />
        </form>
      </Card>
    </div>
  );
};

export default ValidatePin;
