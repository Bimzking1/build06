import EventImage from '@/assets/event/default.png';
import { getEventClock, getEventDetailsDate } from '@/helpers/dateFormat';
import { getEventTicketById } from '@/repository/discover.repository';
import LanguageContext from '@/store/language/language-context';
import {
  type EventList,
  type TicketData
} from '@/utils/interfaces/event.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { EventCalendar, EventClock } from 'public/assets/vector';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface MyEventCardProps {
  item: EventList;
}

const MyEventCard: React.FC<MyEventCardProps> = ({ item }) => {
  const router = useRouter();
  const languageCtx = useContext(LanguageContext);
  const [ticketData, setTicketData] = useState<TicketData>();
  const [id, setId] = useState<string>('');
  const [redirectTrigger, setRedirectTrigger] = useState(false);

  const redirectPage = async (id: string): Promise<void> => {
    try {
      setId(id);
      if (item?.is_joined !== undefined && item?.is_joined) {
        await fetchEventTicketById(item?.id);
      }
      setRedirectTrigger(!redirectTrigger);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  useEffect(() => {
    if (redirectTrigger) {
      if (isEventEnded()) {
        void router.push(`/homepage/event/${id}`);
      } else {
        if (
          ticketData?.status === 'ISSUED' ||
          ticketData?.status === 'CHECKED_OUT'
        ) {
          void router.push(`/homepage/event/${id}`);
        } else {
          void router.push(`/homepage/event/${id}/check-in-out`);
        }
      }
    }
  }, [redirectTrigger]);

  const fetchEventTicketById = async (id: string): Promise<void> => {
    try {
      const response = await getEventTicketById(id);
      setTicketData(response);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const isEventEnded = (): boolean => {
    const endDateObject = new Date(item?.ended_at ?? '');
    const endDateTimestamp = endDateObject.getTime();

    const currentDateObject = new Date();
    const currentDateTimestamp = currentDateObject.getTime();

    return endDateTimestamp < currentDateTimestamp;
  };

  return (
    <div
      key={item?.id}
      className="w-full rounded-xl shadow-md hover:shadow-xl duration-300 overflow-hidden cursor-pointer"
    >
      <div
        onClick={async () => {
          await redirectPage(item?.id);
        }}
        className="w-full max-h-[250px] overflow-hidden border-b-2 border-[#E9E9E9]"
      >
        <img src={item?.image_url ?? EventImage} className="w-full h-full" />
      </div>
      <div className="w-full gap-2 px-4 py-2">
        <div
          onClick={async () => {
            await redirectPage(item?.id);
          }}
          className="flex flex-col w-full"
        >
          <Typography className="text-black font-semibold text-sm md:text-base font-poppins mb-2">
            {item?.name?.length < 24
              ? item?.name
              : `${item?.name?.slice(0, 23)}...`}
          </Typography>
          <div className="w-full flex gap-2 justify-start items-center">
            <div className="w-[25px] h-[25px] flex justify-center items-center">
              <Image
                src={EventCalendar}
                alt={'EventCalendar'}
                width={20}
                height={20}
              />
            </div>
            <Typography className="font-poppins text-sm">
              {languageCtx.language === 'ID'
                ? getEventDetailsDate(
                    new Date(item?.event_date ?? '2024-12-31T23:59:00Z'),
                    'id-ID'
                  )
                : getEventDetailsDate(
                    new Date(item?.event_date ?? '2024-12-31T23:59:00Z'),
                    'en-US'
                  )}
            </Typography>
          </div>
          <div className="w-full flex gap-2 justify-start items-center">
            <div className="w-[25px] h-[25px] flex justify-center items-center">
              <Image
                src={EventClock}
                alt={'EventClock'}
                width={20}
                height={20}
              />
            </div>
            <Typography className="font-poppins text-sm">
              {getEventClock(
                new Date(item?.event_date ?? '2024-12-31T23:59:00Z'),
                new Date(item?.ended_at ?? '2024-12-31T23:59:00Z')
              )}
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEventCard;