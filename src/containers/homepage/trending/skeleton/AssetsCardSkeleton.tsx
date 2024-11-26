import { Card, CardBody } from '@material-tailwind/react';

const AssetTrendingCardSkeleton: React.FC = (): React.ReactElement => {
  return (
    <Card shadow={false} className="w-full my-3 bg-gray-300 animate-pulse">
      <CardBody className="p-3 inline-block h-auto">
        <div className="flex flex-row items-center">
          <div className="w-10 h-10 bg-gray-400 rounded-full" />
          <div className="flex ml-5 w-1/2 flex-col gap-0.5">
            <div className="h-4 bg-gray-400 rounded w-3/4" />
            <div className="h-4 bg-gray-400 rounded w-1/2 mt-2" />
          </div>
          <div className="ml-auto flex flex-col gap-0.5">
            <div className="h-4 bg-gray-400 rounded w-24" />
            <div className="flex justify-end mt-2">
              <div className="h-4 bg-gray-400 rounded w-12" />
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default AssetTrendingCardSkeleton;
