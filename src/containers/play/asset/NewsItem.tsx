import { getAssetNews } from '@/repository/market.repository';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { LikeNews, ShareNews } from 'public/assets/images';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export interface NewsData {
  id: string;
  asset_id: string;
  title: string;
  content: string;
  thumbnail: string;
  created_at: string;
}

const initialNewsData: NewsData = {
  id: '',
  asset_id: '',
  title: '',
  content: '',
  thumbnail: '',
  created_at: ''
};

const NewsItem: React.FC = () => {
  const router = useRouter();
  const { assetId } = router.query;
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<NewsData[]>([initialNewsData]);

  const fetchNews = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const response = await getAssetNews(assetId as string);
      setData(response.data);
    } catch (error: any) {
      toast(error, { type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchNews();
  }, [assetId]);

  if (isLoading) {
    return <></>;
  }
  return (
    <div className="py-4 flex gap-4 w-full overflow-x-scroll rounded-md p-4">
      {data.map((item, index) => {
        return (
          <div key={index} className="flex flex-col gap-2 w-[80%]">
            <div className="flex justify-between w-full">
              <div className="flex flex-col">
                <p className="font-bold text-lg">{item.title}</p>
                <p>{item.content}</p>
              </div>
              <Image
                width={133}
                height={140}
                src={item?.thumbnail}
                alt="Content Image"
              />
            </div>
            <div className="flex justify-between">
              <div className="flex gap-2">
                <p className="font-thin text-sm">
                  {moment(item.created_at).format('DD MMM')}
                </p>
                <p className="font-thin text-sm">•</p>
                <p className="font-thin text-sm">5 min</p>
              </div>
              <div className="flex gap-2">
                <Image
                  src={LikeNews}
                  alt="member"
                  className="w-5 h-5 mr-1 text-[#262626]"
                />
                <Image
                  src={ShareNews}
                  alt="member"
                  className="w-5 h-5 mr-1 text-[#262626]"
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NewsItem;
