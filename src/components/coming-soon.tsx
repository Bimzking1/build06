'use client';
import { downloadOurApp } from '@/utils/_static';
import Image from 'next/image';
import Link from 'next/link';
// import { useTranslation } from 'react-i18next';
import comingSoon from '@/assets/coming-soon.svg';

export default function ComingSoon(): any {
  //   const { t } = useTranslation();

  return (
    <div className="py-5 items-center overflow-hidden justify-center text-center   w-full font-poppins">
      <div className="justify-center">
        <Image
          alt=""
          src={comingSoon}
          className="mx-auto h-[201px] w-[269px] items-center justify-center text-center"
        />
      </div>
      <div className="mt-5">
        <h1 className="text-4xl text-[#3AC4A0] font-semibold">
          Coming Soon <br></br> Update!
        </h1>
      </div>
      <div className="mt-5">
        <h1 className="text-lg font-normal text-[#262626>">
          If you want to try this feature, you can download<br></br> it via
          Playstore and Appstore below.
        </h1>
        <h1 className="mt-12 text-lg font-semibold text-[#262626>">
          Download Our App
        </h1>
      </div>
      <div className="flex mt-5 justify-around lg:justify-center">
        {downloadOurApp
          .filter((data, i) => i <= 1)
          .map((data, key) => (
            <div key={key} className="flex flex-col items-center md:mr-5">
              <Link key={key} href={data.url}>
                <Image alt="" src={data.icon} />
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
