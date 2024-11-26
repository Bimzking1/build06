/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
'use-client';

import IconNoData from '@/assets/play/tournament/noData.svg';
import AssetPagination from '@/components/AssetPagination';
import MyEventCard from '@/components/homepage/event/myEventCard';
import withAuth from '@/helpers/withAuth';
import {
  type EventListParams,
  getEventList
} from '@/repository/discover.repository';
import { getUserInfo } from '@/repository/profile.repository';
import LanguageContext from '@/store/language/language-context';
import { type EventList } from '@/utils/interfaces/event.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { EventIcon, MyCertificateIcon } from 'public/assets/vector';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

export interface StatusEvent {
  id: number;
  status: EventStatus;
  title: string;
}

export enum EventStatus {
  MY_ACTIVE_EVENT = 'my_active_event',
  MY_PAST_EVENT = 'my_past_event'
}

interface EventMetadata {
  current_page: number;
  limit: number;
  total: number;
  total_page: number;
}

type EventsByMonth = Record<string, EventList[]>;

const MyEvent: React.FC = () => {
  const router = useRouter();
  const id = router.query.id;
  const { t } = useTranslation();
  const languageCtx = useContext(LanguageContext);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [loading, setLoading] = useState<boolean>(false);
  const [eventList, setEventList] = useState<EventList[]>([]);
  const [eventMetadata, setEventMetadata] = useState<EventMetadata>();

  const [eventStatus, setEventStatus] = useState(EventStatus.MY_ACTIVE_EVENT);
  const [eventParams, setEventParams] = useState({
    limit: 6,
    page: 1,
    section: eventStatus,
    year: new Date().getFullYear()
  });

  useEffect(() => {
    fetchData()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (id !== null && userInfo !== undefined) {
      void fetchEventList(eventParams);
    }
  }, [id, userInfo, eventStatus, eventParams.page, eventParams.year]);

  useEffect(() => {
    if (userInfo !== undefined) {
      setEventParams(params => ({
        ...params
      }));
    }
  }, [userInfo]);

  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  const fetchEventList = async (
    eventParams: EventListParams
  ): Promise<void> => {
    try {
      setLoading(true);
      const response = await getEventList(eventParams);
      setEventList(response?.data);
      setEventMetadata(response?.metadata);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    } finally {
      setLoading(false);
    }
  };

  const statusEvent: StatusEvent[] = [
    {
      id: 1,
      status: EventStatus.MY_ACTIVE_EVENT,
      title: t('seedsEvent.myActive')
    },
    {
      id: 2,
      status: EventStatus.MY_PAST_EVENT,
      title: t('seedsEvent.myPast')
    }
  ];

  const separateEventsByMonth = (eventList: EventList[]): EventsByMonth => {
    const months: string[] =
      languageCtx.language === 'ID'
        ? [
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember'
          ]
        : [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
          ];

    const eventsByMonth: EventsByMonth = {};

    eventList?.forEach(event => {
      const eventDate = new Date(event?.event_date);
      const month = eventDate.getMonth();
      const year = eventDate.getFullYear();
      const monthYearKey = `${months[month]} ${year}`;

      if (!eventsByMonth[monthYearKey]) {
        eventsByMonth[monthYearKey] = [];
      }

      eventsByMonth[monthYearKey].push(event);
    });

    return eventsByMonth;
  };

  const eventsByMonth = separateEventsByMonth(eventList);

  return (
    <>
      <div className="flex flex-col justify-center items-center rounded-xl font-poppins p-5 bg-white">
        <div className="flex justify-between w-full relative">
          <div
            onClick={async () => await router.push('/homepage/event')}
            className="bg-seeds-button-green rounded-lg flex justify-center items-center w-[40px] h-[40px] cursor-pointer absolute left-0 top-[-6px] lg:top-[-4px]"
          >
            <Image src={EventIcon} alt={'EventIcon'} width={20} height={20} />
          </div>
          <Typography className="w-full text-xl lg:text-2xl font-semibold text-center flex justify-center items-center">
            {t('seedsEvent.myEvent')}
          </Typography>
          <div
            onClick={ async() => await router.push('/homepage/event/my-certificate')}
            className='bg-seeds-button-green rounded-lg flex justify-center items-center w-[40px] h-[40px] cursor-pointer absolute right-0 top-[-6px] lg:top-[-4px]'
          >
            <Image
              src={MyCertificateIcon}
              alt={'MyCertificateIcon'}
              width={20}
              height={20}
            />
          </div>
        </div>
        <div className="w-full flex flex-col md:flex-row items-center justify-start mt-4 gap-4">
          <div className="w-full lg:w-2/3 xl:w-1/2 flex flex-row items-center gap-2 lg:gap-4 max-w-full overflow-x-auto no-scroll">
            {statusEvent.map(item => (
              <button
                className={`w-full border px-4 py-2 font-poppins rounded-lg text-sm text-nowrap hover:bg-[#DCFCE4] hover:text-seeds-button-green hover:border-seeds-button-green duration-300 ${
                  item.status === eventStatus
                    ? 'border-seeds-button-green bg-white text-seeds-button-green'
                    : 'bg-[#E9E9E9] text-[#7C7C7C]'
                }`}
                key={item.id}
                onClick={() => {
                  setEventStatus(item.status);
                  setEventParams({
                    ...eventParams,
                    section: item.status,
                    page: 1
                  });
                }}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Event Card */}
      <div className="flex flex-col justify-center items-center rounded-xl font-poppins p-5 bg-white mt-4">
        {!loading ? (
          eventList !== null ? (
            <div className="w-full">
              {Object.entries(eventsByMonth).map(([monthYear, events]) => (
                <div key={monthYear}>
                  <div>{monthYear}</div>
                  <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4 mb-4">
                    {events?.map(item => (
                      <MyEventCard key={item?.id} item={item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div className="bg-white flex flex-col justify-center items-center text-center lg:px-0 mb-8">
                <Image alt="" src={IconNoData} className="w-[250px]" />
                <p className="font-semibold text-black">
                  {t('seedsEvent.blank1')}
                </p>
                <p className="text-[#7C7C7C]">{t('seedsEvent.blank2')}</p>
              </div>
            </>
          )
        ) : (
          <div className="w-full flex justify-center h-fit mt-8">
            <div className="h-[60px]">
              <div className="animate-spinner w-16 h-16 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
            </div>
          </div>
        )}
      </div>

      {/* Event Pagination */}
      <div className="flex justify-center mx-auto my-8">
        <AssetPagination
          currentPage={eventParams.page}
          totalPages={Math.ceil((eventMetadata?.total ?? 0) / 6)}
          onPageChange={page => {
            setEventParams({ ...eventParams, page });
          }}
        />
      </div>
    </>
  );
};

export default withAuth(MyEvent);
