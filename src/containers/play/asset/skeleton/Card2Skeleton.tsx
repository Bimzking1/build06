import CCard from '@/components/CCard';

const KeystatCard: React.FC = (): React.ReactElement => {
  return (
    <CCard className="flex gap-8 w-full md:w-2/3 p-4 md:mt-5 md:rounded-lg border-none rounded-none bg-gray-300 animate-pulse">
      <div className="flex gap-2 items-center pt-4">
        <p className="text-sm items-center h-4 bg-gray-400" />
        <div className="h-[13] w-[13] mt-2 bg-gray-400" />
      </div>
      <div className="flex flex-row gap-2 mt-8">
        <div className="flex-col w-1/3 text-left items-center">
          <p className="text-base font-light h-4 bg-gray-400" />
          <p className="text-base font-semibold mt-2 h-4 bg-gray-400" />
        </div>
        <div className="flex-col w-1/3 text-left items-center">
          <p className="text-base font-light h-4 bg-gray-400" />
          <p className="text-base font-semibold mt-2 h-4 bg-gray-400" />
        </div>
        <div className="flex-col w-1/3 text-left items-center">
          <p className="text-base font-light h-4 bg-gray-400" />
          <p className="text-base font-semibold mt-2 h-4 bg-gray-400" />
        </div>
      </div>
    </CCard>
  );
};

export default KeystatCard;
