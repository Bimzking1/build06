import currency from '@/assets/landing-page/currency.png';
import gift from '@/assets/landing-page/gift.png';
import time from '@/assets/landing-page/time.png';
import users from '@/assets/landing-page/users.png';
import type { ICompetitionItem } from '@/utils/interfaces/components.interfaces';
import { Button, Typography } from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';

export default function Section5Card({
  data
}: {
  data: ICompetitionItem;
}): React.ReactElement {
  return (
    <div className="max-w-md sm:w-md rounded overflow-hidden shadow-lg mr-5 relative">
      <Image alt={data.title} src={data.photo} className="w-full" />
      <div
        className="absolute top-2 right-2 bg-seeds-green-2 w-30 py-1 lg:px-3  text-xs font-semibold text-seeds-button-green rounded-md
                    md:text-sm
                     lg:text-base
                    xl:text-lg"
      >
        <div className="flex flex-row items-center">
          <span className="">
            <Image src={gift} alt="user" className="w-[17px] h-[17px]" />
          </span>
          <span className="lg:ml-2">
            {data.gift.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
          </span>
        </div>
      </div>
      <div className="lg:px-6 lg:py-4 sm:px-1 ml-3 sm:pt-4 sm:pb-1h">
        <Typography className="font-bold text-base md:text-lg lg:text-xl my-2 lg:mb-2">
          {data.title}
        </Typography>

        <div className="flex flex-row lg:mb-2">
          <span className="">
            <Image src={users} alt="user" className="w-[17px] h-[17px] mr-2" />
          </span>
          <span className="text-xs font-semibold lg:ml-2 lg:mb-2">
            {`${data.participant.total}/${data.participant.total} Participants`}
          </span>
        </div>

        <div className="flex flex-row lg:mb-2">
          <span className="">
            <Image src={time} alt="user" className="w-[17px] h-[17px] mr-2" />
          </span>
          <span className="text-xs font-semibold lg:ml-2 lg:mb-2">
            {data.start.getTime() === data.end.getTime()
              ? moment(data.start).format('DD MMMM YYYY')
              : `${moment(data.start).format('DD MMMM YYYY')} - ${moment(
                  data.end
                ).format('DD MMMM YYYY')}`}
          </span>
        </div>

        <div className="flex flex-row lg:mb-2">
          <span className="">
            <Image
              src={currency}
              alt="user"
              className="w-[17px] h-[17px] mr-2"
            />
          </span>
          <span className="text-xs font-semibold lg:ml-2 lg:mb-0">
            {data.status}
          </span>
        </div>
      </div>
      <div className="px-6 pt-4 pb-2">
        <Link href={'/'}>
          <Button className="w-full bg-seeds-button-green mt-0 capitalize">
            Get A Ticket
          </Button>
        </Link>
      </div>
    </div>
  );
}
