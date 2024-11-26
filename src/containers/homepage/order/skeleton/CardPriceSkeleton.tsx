import CCard from '@/components/CCard';

const CardPriceSkeleton = (): JSX.Element => {
  return (
    <CCard className="flex w-full p-4 border-none rounded-xl shadow-none bg-gray-300 animate-pulse">
      <div className="flex justify-between">
        <div className="flex flex-row w-full">
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
          <div className="flex flex-col ml-4 w-full">
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mt-2"></div>
          </div>
        </div>
        <div className="h-4 bg-gray-300 rounded w-1/3 mt-2"></div>
      </div>
    </CCard>
  );
};

export default CardPriceSkeleton;
