import EventImage from '@/assets/event/default.png';
import { standartCurrency } from '@/helpers/currency';
import { getEventClock, getEventDetailsDate } from '@/helpers/dateFormat';
import { type EventStatus } from '@/pages/homepage/event';
import LanguageContext from '@/store/language/language-context';
import {
  type EventList,
  type UserInfo
} from '@/utils/interfaces/event.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { EventCalendar, EventClock } from 'public/assets/vector';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

interface EventListCardProps {
  item: EventList;
  userInfo: UserInfo;
  eventStatus: EventStatus;
}

const EventListCard: React.FC<EventListCardProps> = ({
  item,
  userInfo,
  eventStatus
}) => {
  const router = useRouter();
  const { t } = useTranslation();
  const languageCtx = useContext(LanguageContext);

  const redirectPage = async (id: string): Promise<void> => {
    await router.push(`/homepage/event/${id}`);
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
        className="w-full h-fit max-h-[150px] overflow-hidden border-b-2 border-[#E9E9E9]"
      >
        {item?.image_url !== undefined ? (
          <img
            src={item?.image_url ?? EventImage}
            className="w-full h-[150px] object-cover"
            width={1000}
            height={1000}
          />
        ) : (
          <div className="bg-gray-400 animate-pulse w-full h-[150px]" />
        )}
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
        {eventStatus !== 'past' && (
          <div className="w-full gap-2 md:gap-8 lg:gap-4 2xl:gap-8 flex justify-between mt-4 mb-2">
            <Typography className="w-full 2xl:w-[125x] flex justify-center items-center bg-white py-2 px-2 md:px-4 xl:px-2 font-poppins font-semibold text-[#3C49D6] border border-[#3C49D6] rounded-md lg:text-sm">
              {(item?.event_price ?? 0) === 0
                ? t('seedsEvent.free').toUpperCase()
                : `${userInfo?.preferredCurrency ?? 'IDR'} ${standartCurrency(
                    item?.event_price ?? 0
                  ).replace('Rp', '')}`}
            </Typography>
            <Typography
              onClick={async () => {
                await redirectPage(item?.id);
              }}
              className={`${
                item?.is_joined
                  ? 'bg-white border border-seeds-button-green text-seeds-button-green'
                  : 'text-white bg-seeds-button-green'
              } w-[200px] 2xl:w-[125x] md:w-full flex justify-center items-center py-2 px-2 md:px-6 xl:px-2 font-poppins font-semibold text-xs md:text-sm xl:text-xs 2xl:text-sm rounded-full`}
            >
              {item?.is_joined
                ? t('seedsEvent.booking.booked')
                : t('seedsEvent.booking.bookNow')}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventListCard;
