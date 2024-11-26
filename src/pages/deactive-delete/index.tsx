'use client';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import forgot from 'public/assets/forgot.png';
import arrowLeft from 'public/assets/vector/arrow-left-black.svg';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  onClose: () => void;
}

const DeactiveDeletePage: React.FC<Props> = ({ onClose }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const [selectedValue, setSelectedValue] = useState<string>('');
  const handleRadioChange = (event: any): void => {
    setSelectedValue(event.target.value);
  };
  useEffect(() => {
    if (selectedValue !== '') {
      router
        .push(
          selectedValue === 'I need to temporarily deactive to my seeds account'
            ? '/deactive-delete/deactive'
            : '/deactive-delete/delete'
        )
        .catch(error => {
          console.error('Error while navigating:', error);
        });
    }
  }, [selectedValue, router]);

  return (
    <div className="flex justify-center items-center h-screen">
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
        <div className="flex flex-col gap-3 justify-center  px-8 pt-2 items-center">
          <Image
            src={forgot}
            alt="image"
            className="w-auto h-auto aspect-auto"
          />
          <div className="">
            <Typography className="font-bold lg:text-lg sm:text-sm text-black">
              {t('Deactive.text1')}
            </Typography>
            <Typography className=" text-black">
              {t('Deactive.text2')}
              <span className="text-sm text-gray-500">
                {t('Deactive.text3')}
              </span>
            </Typography>
          </div>
        </div>
        <div className="flex flex-col mt-2 gap-3 mb-12">
          <div className="flex bg-gray-300 rounded-2xl p-3">
            <input
              type="radio"
              value={'I need to temporarily deactive to my seeds account'}
              id="radioButton01"
              onChange={handleRadioChange}
              name="radioGroup"
              className="appearance-none w-6 h-6 rounded-full border border-gray-500 checked:bg-seeds-green checked:border-white focus:outline-none ring-2 ring-seeds-green"
            />
            <Typography className="mx-5 text-sm">
              {t('Deactive.text4')}
            </Typography>
          </div>
          <div className="flex  bg-gray-300 rounded-2xl p-3">
            <Link href={'/deactive-delete/deactive'}>
              <input
                type="radio"
                id="radioButton02"
                onChange={handleRadioChange}
                value={"I'd like to delete my seeds account"}
                name="radioGroup"
                className="appearance-none w-6 h-6 rounded-full border border-gray-500 checked:bg-seeds-green checked:border-white focus:outline-none ring-2 ring-seeds-green"
              />
            </Link>
            <Typography className="mx-5 text-sm">
              {t('Deactive.text5')}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeactiveDeletePage;
