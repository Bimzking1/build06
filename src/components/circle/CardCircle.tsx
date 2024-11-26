import { chrownCirclePremium } from '@/constants/assets/icons';
import TrackerEvent from '@/helpers/GTM';
import { isGuest } from '@/helpers/guest';
import {
  DocumentTextIcon,
  HandThumbUpIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { Avatar, Card, CardBody, Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';

interface Circle {
  id: string;
  name: string;
  avatar: string;
  cover: string;
  description: string;
  description_rules: string;
  type: string;
  premium_fee: number;
  admin_fee: number;
  monthly_time: number;
  total_rating: number;
  total_member: number;
  total_post: number;
  created_at: string;
  updated_at: string;
}

export default function CardCircle({
  data,
  cover,
  userInfo
}: {
  data: Circle;
  cover: string;
  userInfo: any;
}): React.ReactElement {
  const router = useRouter();
  return (
    <Card
      shadow={false}
      className="h-[250px] max-w-full rounded-3xl overflow-hidden mr-3 relative"
    >
      {data?.cover !== undefined && (
        <div
          onClick={() => {
            router
              .push(isGuest() ? '/auth' : `/connect/post/${data.id}`)
              .catch(error => {
                toast(error, { type: 'error' });
              });
            TrackerEvent({
              event: `SW_circle_page_detail`,
              userData: userInfo,
              circleData: data
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
            className="absolute inset-0 m-0 h-[250px] w-full rounded-none bg-cover bg-center"
          >
            <div className="to-bg-black-10 absolute inset-0 h-full w-full bg-gradient-to-t from-black/80 via-black/50" />
          </div>
          <CardBody className="flex justify-center items-center relative pt-8 pb-14">
            <div className="flex flex-col items-center justify-center">
              {data.type !== 'free' ? (
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
              ) : null}
              <Avatar
                size="xl"
                variant="circular"
                alt="tania andrew"
                className="border-2 border-white mt-6"
                src={data.avatar}
              />
              <Typography className="text-base font-semibold text-white text-center mt-4">
                {data.name}
              </Typography>

              <div className="flex flex-row text-center">
                <div className="flex flex-row items-center mr-3">
                  <HandThumbUpIcon className="w-5 h-5 text-[#27A590] mr-1" />
                  <Typography className="text-xs font-normal text-white">
                    {data.total_rating}
                  </Typography>
                </div>
                <div className="flex flex-row items-center mr-3">
                  <UsersIcon className="w-5 h-5 text-[#27A590] mr-1" />
                  <Typography className="text-xs font-normal text-white">
                    {data.total_member}
                  </Typography>
                </div>
                <div className="flex flex-row items-center mr-3">
                  <DocumentTextIcon className="w-5 h-5 text-[#27A590] mr-1" />
                  <Typography className="text-xs font-normal text-white">
                    {data.total_post}
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
