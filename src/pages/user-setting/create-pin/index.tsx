import InputPin from '@/components/forms/InputPin';
import CardGradient from '@/components/ui/card/CardGradient';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import { Eye, EyeSlash } from '@/constants/assets/icons';
import ModalSuccess from '@/containers/setting/create-pin/ModalSuccess';
import withAuth from '@/helpers/withAuth';
import useWindowInnerHeight from '@/hooks/useWindowInnerHeight';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import { loginPhoneNumber } from '@/repository/auth.repository';
import { createPin, getUserInfo } from '@/repository/profile.repository';
import { Button, Input } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import {
  ArrowBackwardIcon,
  IconCreatePinInputPassword
} from 'public/assets/vector';
import { useEffect, useState } from 'react';

interface FormCheckPassword {
  phoneNumber: string;
  password: string;
}

interface FormCreatePin {
  new_pin: any;
  password: '';
}

const initialFormCheckPassword = {
  phoneNumber: '',
  password: ''
};

const CreatePin = (): JSX.Element => {
  const width = useWindowInnerWidth();
  const height = useWindowInnerHeight();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formCheckPassword, setFormCheckPassword] = useState<FormCheckPassword>(
    initialFormCheckPassword
  );
  const [formCreatePin, setFormCreatePin] = useState<FormCreatePin>({
    new_pin: [],
    password: ''
  });
  const [errorPassword, setErrorPassword] = useState<string>('');
  const [errorPin, setErrorPin] = useState<string>('');
  const [step, setStep] = useState<string>('password');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const cancelHandler = (): void => {
    router.back();
  };

  const handleChangeValue = (event: any): void => {
    const target = event.target;
    const value = target.value;

    setFormCheckPassword(prevState => ({
      ...prevState,
      password: value
    }));

    setFormCreatePin(prevState => ({
      ...prevState,
      password: value
    }));
  };

  const handleAddPin = (value: string): void => {
    setFormCreatePin(prevState => ({
      ...prevState,
      new_pin: [...prevState.new_pin, value]
    }));
  };

  const handleRemovePin = (): void => {
    setFormCreatePin(prevState => ({
      ...prevState,
      new_pin: prevState.new_pin.slice(0, formCreatePin.new_pin.length - 1)
    }));
  };

  const fetchUserData = async (): Promise<void> => {
    try {
      getUserInfo()
        .then(res => {
          setFormCheckPassword(prevState => ({
            ...prevState,
            phoneNumber: res.phoneNumber
          }));
        })
        .catch(err => {
          console.log(err);
        });
    } catch (error: any) {
      console.error('Error fetching user data:', error.message);
    }
  };

  const SubmitCheckPassword = async (): Promise<void> => {
    try {
      if (formCheckPassword.password === '') {
        setErrorPassword('Password Required');
      } else {
        setErrorPassword('');
      }

      loginPhoneNumber(formCheckPassword)
        .then(res => {
          if (res.status === 401) {
            setErrorPassword('Wrong Password');
          } else {
            setStep('pin');
          }
        })
        .catch(err => {
          console.log(err);
        });
    } catch (error: any) {
      console.error('Error fetching circle data:', error.message);
    }
  };

  const SubmitCreatePin = async (): Promise<void> => {
    try {
      formCreatePin.new_pin = formCreatePin.new_pin.join('');

      createPin(formCreatePin)
        .then(res => {
          if (res.status === 401) {
            setErrorPassword('Wrong Password');
          } else {
            setErrorPin('');
            setIsSuccess(true);
          }
        })
        .catch(err => {
          console.log(err);
          setErrorPin(err.response.data.message);
        });
    } catch (error: any) {
      console.error('Error submit pin:', error.message);
    }
  };

  useEffect(() => {
    fetchUserData()
      .then()
      .catch(() => {});

    if (formCreatePin.new_pin.length === 6) {
      void SubmitCreatePin();
    }
  }, [formCreatePin.new_pin]);

  return (
    <>
      {step === 'password' ? (
        <PageGradient defaultGradient className="w-full">
          <button
            onClick={cancelHandler}
            className="sm:hidden mr-auto ml-6 mb-2 pr-4 rounded-md hover:bg-gray-200 active:bg-gray-300 focus:outline-0 focus:bg-gray-200 transition-colors duration-300"
          >
            <Image src={ArrowBackwardIcon} alt="arrow-backward-icon" />
          </button>

          <CardGradient
            defaultGradient={width !== undefined && width > 640}
            extraClasses={`w-full sm:rounded-[18px] sm:h-[36rem] ${
              height !== undefined && height >= 860
                ? 'h-[44rem]'
                : height !== undefined && height < 750
                ? 'h-[35rem]'
                : 'h-[40rem]'
            } bg-white`}
          >
            <div
              className={`z-10 flex flex-col justify-between lg:w-1/2 md:w-2/3 sm:w-[80%] w-full h-full mx-auto sm:p-4 px-4 bg-white`}
            >
              <div>
                <h6
                  className={`mb-2 text-center font-poppins font-semibold ${
                    height !== undefined && height < 760
                      ? 'text-sm'
                      : 'text-base'
                  }`}
                >
                  Create Pin
                </h6>
                <p
                  className={`mb-8 text-center font-poppins ${
                    height !== undefined && height < 760 ? 'text-xs' : 'text-sm'
                  } text-neutral-soft`}
                >
                  Please input your password
                  {width !== undefined && width >= 640 ? <br /> : ' '}
                </p>
                <Image
                  priority
                  src={IconCreatePinInputPassword}
                  alt="input user email"
                  className="z-10 mx-auto mb-14"
                />

                <label className="font-semibold text-base text-[#262626]">
                  Password
                </label>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  variant="standard"
                  color="green"
                  placeholder="Please input your password"
                  icon={
                    <Image
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                      src={showPassword ? Eye.src : EyeSlash.src}
                      alt={showPassword ? Eye.alt : EyeSlash.alt}
                      width={24}
                      height={24}
                    />
                  }
                  onChange={handleChangeValue}
                  value={formCheckPassword.password}
                  error={errorPassword !== ''}
                />
                {errorPassword !== '' && (
                  <small className="text-[#ff515d] font-bold">
                    {errorPassword}
                  </small>
                )}
                <a
                  href="/auth/forgot-password"
                  className="flex mt-3 underline font-semibold text-xs items-end justify-end text-[#3AC4A0]"
                >
                  Forgot Password?
                </a>

                <Button
                  className="w-full items-center justify-center mt-16 font-semibold text-sm bg-seeds-button-green rounded-full capitalize"
                  onClick={SubmitCheckPassword}
                >
                  Continue
                </Button>
              </div>
            </div>
          </CardGradient>
        </PageGradient>
      ) : step === 'pin' ? (
        <InputPin
          formRequest={formCreatePin}
          enterPinHandler={handleAddPin}
          onCancel={() => {
            setStep('password');
          }}
          deletePinHandler={handleRemovePin}
          title="Create Your Pin"
          subtitle="Please enter your PIN number correctly"
          error={errorPin}
        />
      ) : null}

      {isSuccess ? (
        // <FinalModalCircle
        //   button="Done"
        //   title="Success!"
        //   subtitle="Congratulations, you have successfully create your PIN."
        //   imageUrl={successCircleSetting.src}
        //   handleOpen={handleSubmit}
        //   error={false}
        //   redirect="/user-setting"
        // />

        <ModalSuccess />
      ) : null}
    </>
  );
};

export default withAuth(CreatePin);
