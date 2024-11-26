import { HashtagIcon } from '@heroicons/react/24/outline';
import { Card, CardBody, Typography } from '@material-tailwind/react';
import { useRouter } from 'next/router';

interface props {
  data: any;
}

const CardHashtag: React.FC<props> = ({ data }) => {
  const router = useRouter();

  return (
    <Card
      shadow={false}
      className="w-full cursor-pointer my-3 border border-[#E9E9E9]"
      onClick={() => {
        router
          .push(`/social/hashtag/${data.hashtag as string}`)
          .catch(error => {
            console.log(error);
          });
      }}
    >
      <CardBody className="p-3 h-auto flex items-center">
        <div className="bg-[#F2FDF9] p-2 rounded-full flex items-center justify-center">
          <HashtagIcon width={20} height={20} className="text-[#1DCB8C]" />
        </div>
        <div className="flex ml-5 flex-col">
          <Typography className="font-semibold text-base text-[#262626]">
            #{data.hashtag}
          </Typography>
          <Typography className="font-normal text-sm text-[#7C7C7C]">
            {data.frequency} post
          </Typography>
        </div>
      </CardBody>
    </Card>
  );
};

export default CardHashtag;
