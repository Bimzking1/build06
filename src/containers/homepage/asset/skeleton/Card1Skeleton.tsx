import CCard from '@/components/CCard';

const Card1Skeleton: React.FC = (): React.ReactElement => {
  return (
    <CCard className="flex w-full md:w-1/3 p-4 md:mt-5 md:rounded-lg border-none rounded-none bg-gray-300 animate-pulse">
      <div className="flex flex-row justify-between">
        <div className="w-full flex flex-row gap-4">
          <div className="w-[50px] h-[50px] bg-gray-400 rounded-full" />
          <div className="flex flex-col w-full">
            <div className="flex flex-row gap-2">
              <p className="h-4 text-base font-semibold font-poppins bg-gray-400" />
            </div>
            <p className="h-4 text-lg font-normal bg-gray-400 mb-3 font-poppins" />
          </div>
        </div>
      </div>
      <p className="h-4 text-xl font-semibold bg-gray-400 my-4 mt-12" />
      <p className="h-4 text-sm font-normal bg-gray-400" />
    </CCard>
  );
};

export default Card1Skeleton;
