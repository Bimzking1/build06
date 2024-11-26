import { type EventStatus, type StatusEvent } from '@/pages/homepage/event';
import Image from 'next/image';
import { ArrowDownCollapse } from 'public/assets/vector';

interface EventFilterProps {
  monthYear?: string;
  showDropdown: boolean;
  eventParams: EventParams;
  statusEvent: StatusEvent[];
  handleOpenCloseDrowndown: () => void;
  setEventStatus: React.Dispatch<React.SetStateAction<EventStatus>>;
  setEventParams: React.Dispatch<React.SetStateAction<EventParams>>;
}

interface EventParams {
  limit: number;
  page: number;
  section: EventStatus;
  year: number;
}

const EventFilter: React.FC<EventFilterProps> = ({
  monthYear,
  showDropdown,
  eventParams,
  statusEvent,
  handleOpenCloseDrowndown,
  setEventStatus,
  setEventParams
}) => {
  return (
    <div className="w-full h-fit text-[#7C7C7C] font-semibold flex justify-between items-center">
      <div>{monthYear ?? ''}</div>
      <div className="relative w-[120px] rounded-lg text-center">
        <div
          onClick={() => {
            handleOpenCloseDrowndown();
          }}
          className="px-4 py-2 rounded-lg cursor-pointer flex gap-2 hover:bg-[#E9E9E9] duration-300 justify-center items-center"
        >
          <div className="font-semibold text-[#7C7C7C]">
            {eventParams?.year}
          </div>
          <Image src={ArrowDownCollapse} alt="Select" width={20} height={20} />
        </div>
        {showDropdown && (
          <div className="absolute bottom-[-100px] right-[0px] w-[120px] md:w-[200px] bg-white shadow-xl p-2 rounded-lg">
            <div
              onClick={() => {
                setEventStatus(statusEvent[0].status);
                setEventParams({
                  ...eventParams,
                  section: statusEvent[0].status,
                  year: new Date().getFullYear() - 1
                });
                handleOpenCloseDrowndown();
              }}
              className="p-2 hover:bg-[#DCFCE4] duration-300 cursor-pointer rounded-lg text-start"
            >
              {new Date().getFullYear() - 1}
            </div>
            <div
              onClick={() => {
                setEventParams({
                  ...eventParams,
                  year: new Date().getFullYear()
                });
                handleOpenCloseDrowndown();
              }}
              className="p-2 hover:bg-[#DCFCE4] duration-300 cursor-pointer rounded-lg text-start"
            >
              {new Date().getFullYear()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventFilter;
