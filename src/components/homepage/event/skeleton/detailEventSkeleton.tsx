const DetailEventSkeleton: React.FC = (): React.ReactElement => {
  return (
    <>
      <div className="w-full mt-6 flex flex-col justify-start items-start bg-gray-300 animate-pulse rounded-full">
        <div className="text-sm text-center items-center bg-gray-400 h-[16px]" />
      </div>
      <div className="w-full mt-8 flex flex-col justify-start items-start bg-gray-300 animate-pulse rounded-full">
        <div className="text-sm text-center items-center bg-gray-400 h-[16px]" />
      </div>
      <div className="w-full mt-4 flex flex-col justify-start items-start bg-gray-300 animate-pulse rounded-full">
        <div className="text-sm text-center items-center bg-gray-400 h-[16px]" />
      </div>
      <div className="w-full mt-4 flex flex-col justify-start items-start bg-gray-300 animate-pulse rounded-full">
        <div className="text-sm text-center items-center bg-gray-400 h-[16px]" />
      </div>
    </>
  );
};

export default DetailEventSkeleton;
