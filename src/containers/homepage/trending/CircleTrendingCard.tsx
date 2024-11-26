import { isGuest } from '@/helpers/guest';
import {
  DocumentTextIcon,
  HandThumbUpIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { Avatar, Card, CardBody, Typography } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

export interface CircleInterface {
  banner: string;
  id: string;
  image: string;
  is_liked: false;
  name: string;
  totalMember: number;
  totalPost: number;
  totalRating: number;
  total_like: number;
}

export default function CircleTrendingCard({
  data,
  cover,
  isResponsive
}: {
  data: CircleInterface;
  cover: string;
  isResponsive: boolean;
}): React.ReactElement {
  const responsiveWidth =
    'min-w-[200px] lg:min-w-[190px] xl:min-w-[240px] 2xl:min-w-[300px]';
  const router = useRouter();
  return (
    <Card
      shadow={false}
      className={`h-[170px] max-w-full rounded-3xl overflow-hidden mr-3 relative ${
        isResponsive ? responsiveWidth : ''
      }`}
    >
      {data?.banner !== undefined && (
        <div
          onClick={async () => {
            await router
              .push(isGuest() ? '/auth' : `/connect/post/${data.id}`)
              .catch(error => {
                toast(error, { type: 'error' });
              });
          }}
          className="cursor-pointer"
        >
          <div
            style={{
              backgroundImage: `url(${cover})`,
              width: '100%',
              height: '100%'
            }}
            color="transparent"
            className="absolute inset-0 m-0 h-[170px] w-full rounded-none bg-cover bg-center"
          >
            <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-t from-black/80 via-black/50" />
          </div>
          <CardBody className="flex justify-center items-center relative pb-14">
            <div className="flex flex-col items-center justify-center">
              {/* {data.type !== 'free' ? (
                <div className="flex items-end justify-end absolute top-0 right-0 mt-4 mr-2 bg-white rounded-3xl px-2 py-1">
                  <Image
                    src={chrownCirclePremium.src}
                    alt="X"
                    width={23}
                    height={23}
                    className="align-middle"
                  />
                  <Typography className="text-sm text-[#3AC4A0] font-semibold align-middle ml-1">
                    Premium
                  </Typography>
                </div>
              ) : null} */}
              <Avatar
                size="xl"
                variant="circular"
                alt="tania andrew"
                className="border-2 border-white"
                src={data.image}
              />
              <Typography className="text-base font-semibold text-white text-center my-2">
                {data.name}
              </Typography>

              <div className="flex flex-row text-center">
                <div className="flex flex-row items-center mr-3">
                  <HandThumbUpIcon className="w-5 h-5 text-[#27A590] mr-1" />
                  <Typography className="text-xs font-normal text-white">
                    {data.totalRating}
                  </Typography>
                </div>
                <div className="flex flex-row items-center mr-3">
                  <UsersIcon className="w-5 h-5 text-[#27A590] mr-1" />
                  <Typography className="text-xs font-normal text-white">
                    {data.totalMember}
                  </Typography>
                </div>
                <div className="flex flex-row items-center mr-3">
                  <DocumentTextIcon className="w-5 h-5 text-[#27A590] mr-1" />
                  <Typography className="text-xs font-normal text-white">
                    {data.totalPost}
                  </Typography>
                </div>
              </div>
            </div>
          </CardBody>
        </div>
      )}
    </Card>
  );
}
