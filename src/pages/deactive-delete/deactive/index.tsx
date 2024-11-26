'use client';
import PhoneInput from '@/components/PhoneInput';
import { Loader } from '@/constants/assets/icons';
import { Button, Input, Textarea, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import Link from 'next/link';
import arrowLeft from 'public/assets/vector/arrow-left-black.svg';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface FormData {
  email: string;
  phoneNumber: string;
  tellUs: string;
}

const DeletePage: React.FC = (): JSX.Element => {
  const { t } = useTranslation();

  const [showErrorPopup, setShowErrorPopup] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCode, setSelectedCode] = useState<string>('+62');
  const [errorEmail, setErrorEmail] = useState<boolean>(false);
  const [errorPhone, setErrorPhone] = useState<boolean>(false);
  const [errorTellUs, setErrorTellUs] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    phoneNumber: '',
    tellUs: ''
  });

  const handleChangePhoneNumber = (value: string): void => {
    const onlyNumber = value.replace(/[^0-9]/g, '');
    setFormData((prevFormData: FormData) => ({
      ...prevFormData,
      phoneNumber: onlyNumber
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (formData.email === '') {
      setErrorEmail(true);
    } else {
      setErrorEmail(false);
    }
    if (formData.phoneNumber === '') {
      setErrorPhone(true);
    } else {
      setErrorPhone(false);
    }
    if (formData.tellUs === '') {
      setErrorTellUs(true);
    } else {
      setErrorTellUs(false);
    }
    if (
      formData.email !== '' &&
      formData.phoneNumber !== '' &&
      formData.tellUs !== ''
    ) {
      setLoading(true);
      try {
        await new Promise<void>(resolve => setTimeout(resolve, 2000));
        setLoading(false);
        const deleteSuccessful = true;
        if (deleteSuccessful) {
          setShowErrorPopup(true);
        } else {
          setShowErrorPopup(true);
        }
      } catch (error) {
        setLoading(false);
        setShowErrorPopup(true);
        console.error('Error deleting account:', error);
      }
    }
  };

  const toggleErrorPopup = (): void => {
    setShowErrorPopup(!showErrorPopup);
  };

  return (
    <div className="justify-center items-center h-screen">
      <div className="border w-full sm:w-[90%] md:w-[70%] lg:w-[50%] rounded-3xl px-8 pt-8 pb-12 items-center justify-center mx-auto">
        <div className="flex justify-start">
          <Link href={'/deactive-delete'}>
            <Image
              src={arrowLeft}
              alt="X"
              width={30}
              height={30}
              className="hover:scale-110 transition ease-out cursor-pointer"
            />
          </Link>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mt-5">
            <Typography variant="h5" color="black">
              {t('Deactive.email1')}
              <span className="text-gray-500">{t('Deactive.text3')}</span>
            </Typography>
            <Typography className="text-black">
              {t('Deactive.email2')}
            </Typography>
            <Input
              className="text-lg border-blue-500 border rounded-2xl p-2 my-3"
              type="email"
              size="md"
              variant="standard"
              color="gray"
              placeholder=""
              value={formData.email}
              onChange={e => {
                setFormData(prevFormData => ({
                  ...prevFormData,
                  email: e.target.value
                }));
              }}
              error={errorEmail} // Update the error prop to be a boolean
            />
            {errorEmail && ( // Update the condition to check for boolean value
              <small className="text-[#ff515d] font-bold">
                Email is required
              </small>
            )}
          </div>
          <div className="mt-5">
            <Typography variant="h5" color="black">
              {t('Deactive.phone1')}
              <span className="text-gray-500">{t('Deactive.text3')}</span>
            </Typography>
            <Typography className="text-black">
              {t('Deactive.email2')}
            </Typography>
            <div className="text-lg border-blue-500 border rounded-2xl px-2 my-3">
              <PhoneInput
                selectedCode={selectedCode}
                setSelectedCode={setSelectedCode}
                onChangePhoneNumber={handleChangePhoneNumber}
                phoneValue={formData.phoneNumber}
                error={errorPhone} // Update the error prop to be a boolean
              />
            </div>
            {errorPhone && ( // Update the condition to check for boolean value
              <small className="text-[#ff515d] font-bold">
                Phone number is required
              </small>
            )}
          </div>
          <div className="mt-5">
            <Typography variant="h5" color="black">
              {t('Deactive.tellUs1')}
              <span className="text-gray-500">{t('Deactive.text3')}</span>
            </Typography>
            <Typography className="text-black">
              {t('Deactive.tellUs2')}
            </Typography>
            <Textarea
              className="text-lg border-blue-500 border rounded-3xl p-2 my-3"
              placeholder=""
              value={formData.tellUs}
              onChange={e => {
                setFormData(prevFormData => ({
                  ...prevFormData,
                  tellUs: e.target.value
                }));
              }}
              error={errorTellUs} // Update the error prop to be a boolean
            />
            {errorTellUs && ( // Update the condition to check for boolean value
              <small className="text-[#ff515d] font-bold">
                Tell us is required
              </small>
            )}
          </div>
          <Button
            disabled={loading}
            className={`mx-auto w-full rounded-full ${
              formData.email === '' ||
              formData.phoneNumber === '' ||
              formData.tellUs === '' ||
              loading
                ? 'bg-[#3AC4A0]'
                : 'bg-[#3AC4A0]'
            } mt-5`}
            type="submit"
          >
            {loading ? (
              <Image
                src={Loader.src}
                alt={Loader.alt}
                className="mx-auto animate-spin object-contain object-[center_center]"
                width={25}
                height={25}
              />
            ) : (
              t('Deactive.ok')
            )}
          </Button>
        </form>
        {showErrorPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg">
              <Typography variant="h6" color="black" className="mb-4">
                {t('Deactive.error1')}
                <br />
              </Typography>
              <Typography className="text-black">
                {t('Deactive.error2')}
              </Typography>
              <Button
                className="mt-4 mx-auto rounded-full bg-[#3AC4A0] text-white"
                onClick={toggleErrorPopup}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeletePage;
