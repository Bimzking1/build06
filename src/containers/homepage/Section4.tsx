// Section4.tsx
import { getBanner } from '@/repository/discover.repository';
// import { useRouter } from 'next/router';
import { isGuest } from '@/helpers/guest';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';
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

const Section4 = (): React.ReactElement => {
  const { t } = useTranslation();
  //   const router = useRouter();
  const [bannerData, setBannerData] = useState<Banner[]>([]);

  useEffect(() => {
    const fetchBannerAsset = async (): Promise<void> => {
      try {
        const res = await getBanner({
          page: 1,
          limit: 10,
          type: 'exclusive'
        });
        if (res.data.length === 1) {
          setBannerData([...res.data, ...res.data]);
        } else {
          setBannerData(res.data);
        }
      } catch (error) {
        console.error('Error fetching trending assets:', error);
      }
    };

    void fetchBannerAsset();
  }, []);

  const hotNewsItemClass = 'mb-2';

  const sliderSettings = {
    className: 'rounded-2xl ',
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,

    responsive: [
      {
        breakpoint: 1024,
        settings: {
          dots: false,
          slidesToShow: 2
        }
      },
      {
        breakpoint: 768,
        settings: {
          dots: false,
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          dots: true,
          slidesToShow: 1
        }
      }
    ]
  };

  return (
    <div className="w-full h-auto cursor-default">
      <h1 className="font-semibold text-3xl text-[#262626]">
        {t('homepage.section2.text6')}
      </h1>
      <h1 className="font-light text-sm mt-3 text-[#262626]">
        {t('homepage.section2.text7')}
      </h1>
      <div className=" mt-4">
        <Slider {...sliderSettings}>
          {bannerData?.map(data => (
            <Link
              key={data.id}
              href={
                isGuest() ? '/auth' : `/homepage/exclusive/${data?.id ?? 0}`
              }
            >
              <div
                key={data.id}
                className={`lg:pe-5  flex   cursor-pointer hover:shadow-lg transition-all ${hotNewsItemClass}`}
              >
                <Image
                  className="object-cover rounded-2xl "
                  src={data.image_url}
                  alt={data.name}
                  width={1420}
                  height={420}
                  // layout="responsive"
                />
              </div>
            </Link>
          ))}
        </Slider>
      </div>
      <div className="text-center justify-center mt-3">
        <Link
          href={isGuest() ? '/auth' : '/homepage/exclusive'}
          className="text-md mt-3 font-normal text-[#3AC4A0]"
        >
          {t('homepage.section2.text14')}
        </Link>
      </div>
    </div>
  );
};

export default Section4;
