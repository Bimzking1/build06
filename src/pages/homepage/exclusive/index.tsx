// Section4.tsx
import { getBanner } from '@/repository/discover.repository';
// import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import Link from 'next/link';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

interface Banner {
  id: string;
  name: string;
  external_url: string;
  image_url: string;
  type: string;
  title: string;
  description: string;
  tnc: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string;
}

const ExclusiveList = (): React.ReactElement => {
  //   const { t } = useTranslation();
  //   const router = useRouter();
  const [bannerData, setBannerData] = useState<Banner[]>([]);
  console.log(bannerData, 'c');

  useEffect(() => {
    const fetchBannerAsset = async (): Promise<void> => {
      try {
        const res = await getBanner({
          page: 1,
          limit: 10,
          type: 'exclusive'
        });
        setBannerData(res.data);
        console.log(res, 'a');
        console.log(res.data, 'b');
      } catch (error) {
        console.error('Error fetching trending assets:', error);
      }
    };

    void fetchBannerAsset();
  }, []);

  return (
    <div className="w-full h-auto cursor-default">
      <h1 className="font-semibold text-3xl text-[#262626]">
        Exclusive Offers
      </h1>
      <h1 className="font-light text-sm mt-3 text-[#262626]">
        Enjoy a variety of special promotions just for you!
      </h1>
      <div className="grid z-10 lg:grid-cols-2 gap-4 mt-8">
        {bannerData?.map(data => (
          <div key={data.id} className="w-full">
            <Link href={`/homepage/exclusive/${data?.id ?? 0}`}>
              <Image
                className="object-cover rounded-2xl "
                src={data.image_url}
                alt={data.name}
                width={1420}
                height={420}
                // layout="responsive"
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExclusiveList;
