import { editVerifyOtp, getOtp } from '@/repository/auth.repository';
import { Button, Card, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import otpSms from 'public/assets/otpSms.png';
import otpWhatsapp from 'public/assets/otpWhatsapp.png';
import { useEffect, useRef, useState } from 'react';

interface VariableOTP {
  select: number;
  number: string;
  method: any;
  setMethod: any;
  getOTP: any;
  countdown: any;
  setCountdown: any;
}

const ValidateOTP: React.FC<VariableOTP> = ({
  select,
  number,
  method,
  setMethod,
  getOTP,
  countdown,
  setCountdown
}: VariableOTP) => {
  const router = useRouter();
  const [input, setInput] = useState(['', '', '', '']);
  const inputRefs = useRef<any[]>([]);
  const OTP = input.join('');
  const verifyOTP = {
    method,
    msisdn: number,
    otp: OTP
  };

  const handleChangeOTP = (index: number, value: string): void => {
    const newInput = [...input];
    newInput[index] = value;
    setInput(newInput);

    if (newInput[index] !== '') {
      inputRefs.current[index + 1]?.focus();
    } else if (newInput[index] === '') {
      inputRefs.current[index - 1]?.focus();
    }
  };
  const handleSubmitOTP = async (event: any): Promise<void> => {
    event.preventDefault();
    try {
      await editVerifyOtp(verifyOTP);
      await router.push('/my-profile/edit-profile');
    } catch (error: any) {
      console.error(error.response.data.message);
    }
  };
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, [select === 2]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        await getOtp(getOTP);
      } catch (error) {
        console.error('Error fetching OTP:', error);
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, [method]);
  return (
    <div className={`${select === 2 ? 'flex' : 'hidden'} justify-center`}>
      <Card className="flex items-center w-[947px] h-fit py-5">
        <form
          onSubmit={handleSubmitOTP}
          className="flex flex-col justify-between items-center w-[600px] h-full p-4"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col gap-2">
              <Typography className="font-poppins font-semibold text-2xl text-[#262626] text-center">
                Verification Code
              </Typography>
              <Typography className="font-poppins font-light text-sm text-[#262626] text-center">
                Enter the OTP code we sent to your WhatsApp.
              </Typography>
            </div>
            <Image
              src={method === 'whatsapp' ? otpWhatsapp : otpSms}
              alt="methodOTP"
            />
            <div className="flex flex-col gap-[60px]">
              <div className="flex flex-col gap-8">
                <Typography className="font-poppins font-semibold text-base text-[#262626] text-center">
                  OTP Code
                </Typography>
                <div className="flex gap-8">
                  {input.map((value, index) => (
                    <input
                      type="number"
                      key={index}
                      ref={el => (inputRefs.current[index] = el)}
                      value={value}
                      maxLength={1}
                      onChange={e => {
                        handleChangeOTP(index, e.target.value);
                      }}
                      className="focus:outline-none border-b border-[#CCCCCC] w-1/4 text-center text-[#262626] text-base font-semibold font-poppins pb-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  ))}
                </div>
                <div className="flex justify-between">
                  <Typography>{`${countdown as string} second${
                    countdown >= 1 ? 's' : ''
                  }`}</Typography>
                  <Button
                    onClick={async () => {
                      await getOtp(getOTP);
                      setCountdown(60);
                    }}
                    disabled={countdown > 0}
                    className="capitalize bg-transparent shadow-none hover:shadow-none p-0 text-sm text-[#3AC4A0] font-normal font-poppins"
                  >
                    Resend OTP
                  </Button>
                </div>
              </div>
              <Button
                className="capitalize bg-transparent shadow-none hover:shadow-none p-0 text-sm text-[#3AC4A0] font-normal font-poppins"
                onClick={() => {
                  setMethod((prev: any) =>
                    prev === 'whatsapp' ? 'sms' : 'whatsapp'
                  );
                  setCountdown(60);
                }}
                disabled={countdown > 0}
              >
                Another way? Send via
                {`${method === 'whatsapp' ? ' SMS' : ' Whatsapp'}`}
              </Button>
              <Button
                className="w-full rounded-full bg-[#3AC4A0]"
                type="submit"
              >
                Continue
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ValidateOTP;
