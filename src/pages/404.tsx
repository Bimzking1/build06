'use client';
import error from '@/assets/error-page/error.svg';
import Footer from '@/components/layouts/Footer';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import { Button, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

export default function Custom404(): any {
  const { t } = useTranslation();
  const router = useRouter();
  const customGradient = (
    <>
      <span className="-z-10 fixed bottom-10 -left-10 w-60 h-48 bg-seeds-green blur-[90px] rotate-45" />
      <span className="-z-10 fixed bottom-0 left-0 w-24 h-24 bg-seeds-green blur-[90px]" />
      <span className="-z-10 fixed -bottom-28 left-16 w-48 h-32 bg-seeds-purple-2 blur-[90px] rotate-45" />
      <span className="-z-10 fixed top-64 -right-4 w-60 h-48 bg-seeds-green blur-[90px] rotate-45 rounded-full" />
      <span className="-z-10 fixed bottom-36 right-0 w-32 h-32 bg-seeds-purple-2 blur-[90px] rotate-90 rounded-full" />
    </>
  );
  return (
    <PageGradient
      className="py-5 absolute overflow-hidden w-full"
      customGradient={customGradient}
    >
      <div
        className="flex flex-col text-center items-center justify-center
                            md:mx-32 lg:mx-40 xl:mx-56"
      >
        <Typography className="text-[26px] font-semibold mb-3 md:text-5xl lg:text-[72px] text-red-600">
          {t('errorPage.text1')}
        </Typography>
        <Typography className="text-xs font-normal mb-7 leading-7 md:leading-5 md:text-xl lg:text-[20px] text-[#7C7C7C]">
          {t('errorPage.text2')}
        </Typography>

        <div className="flex flex-row">
          <Button
            className="text-xs font-semibold bg-seeds-purple rounded-full mr-4
                                    lg:text-base"
            onClick={() => {
              void router.push('/');
            }}
          >
            {t('errorPage.button1')}
          </Button>
          <Link href={'https://api.whatsapp.com/send?phone=628118883519'}>
            <Button
              className="text-xs font-semibold text-[#7555DA] outline outline-offset-0 outline-[#7555DA] bg-inherit rounded-full
                                    lg:text-base"
            >
              {t('errorPage.button2')}
            </Button>
          </Link>
        </div>

        <Image alt="" src={error} className="mt-10 h-full w-full" />
      </div>
      <Footer />
    </PageGradient>
  );
}
