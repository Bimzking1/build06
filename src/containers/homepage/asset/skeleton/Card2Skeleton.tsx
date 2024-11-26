import CCard from '@/components/CCard';

const Card1Skeleton: React.FC = (): React.ReactElement => {
  return (
    <CCard className="flex w-full md:w-2/3 p-2 md:mt-5 md:rounded-lg border-none rounded-none bg-gray-300 animate-pulse">
      <p className="text-sm text-center items-center h-4 bg-gray-400" />
      <p className="text-sm font-semibold text-center items-center font-poppins mt-2 h-4 bg-gray-400" />
      <hr className="my-3" />
      <div className="flex flex-row gap-2">
        <div className="flex-col w-1/3 text-center items-center">
          <p className="text-base font-semibold h-4 bg-gray-400" />
          <p className="text-base font-light mt-2 h-4 bg-gray-400" />
        </div>
        <div className="flex-col w-1/3 text-center items-center">
          <p className="text-base font-semibold h-4 bg-gray-400" />
          <p className="text-base font-light mt-2 h-4 bg-gray-400" />
        </div>
        <div className="flex-col w-1/3 text-center items-center">
          <p className="text-base font-semibold h-4 bg-gray-400" />
          <p className="text-base font-light mt-2 h-4 bg-gray-400" />
        </div>
      </div>
    </CCard>
  );
};

export default Card1Skeleton;
