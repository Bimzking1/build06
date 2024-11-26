import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import Image from 'next/image';
import React from 'react';
import img from '../../../public/merchant.png';

export default function DiscoverMerchant(): React.ReactElement {
  const width = useWindowInnerWidth();

  return (
    <div
      className={`z-1 relative sm:w-[90%] ${
        width !== undefined && width < 600
          ? 'w-[99%] overflow-x-auto'
          : width !== undefined && width < 500
          ? 'w-[99%] overflow-x-visible'
          : width !== undefined && width < 400
          ? 'w-[99%] overflow-x-visible'
          : width !== undefined && width > 600
          ? 'w-[600px] overflow-x-visible'
          : ''
      }!bg-white`}
    >
      <div className="md:bg-white sm:rounded-[18px] p-5 space-y-5">
        <div>
          <h4 className="md:text-2xl text-lg font-bold">Merchant Promo</h4>
          <p className="text-[#7C7C7C]">
            Enjoy a variety of special promotions just for you!
          </p>
        </div>
        <div className="grid md:grid-cols-3 grid-cols-2 gap-3 md:grid-rows-1 grid-rows-2 md:grid-flow-row grid-flow-col ">
          <Image
            src={img}
            alt="image 1"
            className="h-full rounded-lg md:row-span-1 row-span-2 w-full object-cover"
          />
          <Image
            src={img}
            alt="image 1"
            className="h-full rounded-lg w-full object-cover"
          />
          <Image
            src={img}
            alt="image 1"
            className="h-full rounded-lg w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
