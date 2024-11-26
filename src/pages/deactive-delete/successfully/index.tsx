'use client';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import Link from 'next/link';
import successfully from 'public/assets/successfully.png';
import arrowLeft from 'public/assets/vector/arrow-left-black.svg';
import { useTranslation } from 'react-i18next';
const DeletePage: React.FC = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="flex">
      <div className="border w-[40%] rounded-3xl px-8 pt-8 pb-12 items-center justify-center mx-auto">
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
            src={successfully}
            alt="image"
            className="w-auto h-auto aspect-auto"
          />
          <div className="">
            <Typography className="font-bold text-lg text-black">
              {t('Deactive.success1')}
            </Typography>
            <Typography className=" text-black">
              {t('Deactive.success2')}
            </Typography>
            <Button className="mx-auto w-full rounded-full bg-seeds-green mt-5">
              {t('Deactive.ok')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePage;
