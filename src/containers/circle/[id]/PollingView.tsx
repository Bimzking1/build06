import { useMemo, useState } from 'react';
import { Typography } from '@material-tailwind/react';
import moment from 'moment';

import { selectPostPolling } from '@/repository/circleDetail.repository';

interface Polling {
  id: string;
  content_text: string;
  percentage: number;
  total_vote: number;
  status_vote?: boolean;
}

interface props {
  data: Polling[];
  pollingDate: string;
  totalVote: number;
}

const PollingView: React.FC<props> = ({
  data: pollings,
  pollingDate,
  totalVote: initialTotalVote
}) => {
  const [totalVote, setTotalVote] = useState(initialTotalVote);
  const [data, setData] = useState(pollings);
  const hadSelectedPoll = useMemo(
    () => (data ?? []).some(e => e.status_vote),
    [data]
  );
  const pollHasExpired = useMemo(() => {
    const expiredDate = moment(pollingDate);

    if (expiredDate.year() < 2000) {
      return false;
    }

    return expiredDate.isSameOrBefore(moment(new Date()));
  }, [pollingDate]);
  const handleSelectPoll = async (postPollingId: string): Promise<any> => {
    try {
      const res = await selectPostPolling(postPollingId);
      setData(res.data);
      setTotalVote(res.total);
    } catch (e) {
      console.log('err: ', e);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-y-2 my-2">
        {data.map(item => (
          <PollingItem
            key={item.content_text}
            polling={item}
            hadSelectedPoll={hadSelectedPoll}
            pollHasExpired={pollHasExpired}
            onVote={handleSelectPoll}
          />
        ))}
      </div>
      {(hadSelectedPoll || pollHasExpired) && (
        <Typography className="text-[#7C7C7C] text-sm">
          {totalVote} votes
        </Typography>
      )}
    </div>
  );
};

interface PollingItemProps {
  polling: Polling;
  hadSelectedPoll: boolean;
  pollHasExpired: boolean;
  onVote: (id: string) => void;
}

const PollingItem: React.FC<PollingItemProps> = ({
  polling,
  hadSelectedPoll,
  pollHasExpired,
  onVote
}) => {
  const percentage = polling.percentage ?? 0;
  const borderColor =
    hadSelectedPoll || pollHasExpired ? 'border-[#4FE6AF]' : '';
  const textColor =
    polling.status_vote === true
      ? 'text-[#262626] font-bold'
      : 'text-[#7C7C7C]';

  return (
    <button
      className={`flex relative justify-between overflow-hidden border rounded-lg ${borderColor}`}
      disabled={pollHasExpired}
      onClick={() => {
        onVote(polling.id);
      }}
    >
      {(hadSelectedPoll || pollHasExpired) && (
        <div className={`absolute w-[${percentage}%] h-full bg-[#DCFCE4]`} />
      )}
      {polling.status_vote === true && (
        <div className={`absolute w-[8px] h-full bg-[#3AC4A0]`} />
      )}
      <div className="relative p-2 flex justify-between w-full">
        <Typography className={`${textColor}`}>
          {polling.content_text}
        </Typography>
        {(hadSelectedPoll || pollHasExpired) && (
          <Typography className="text-[#3AC4A0] font-bold">
            {polling.percentage ?? 0}%
          </Typography>
        )}
      </div>
    </button>
  );
};

export default PollingView;
