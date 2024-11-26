'use-client';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import { getBanner, getBannerById } from '@/repository/discover.repository';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

export interface Metadata {
  currentPage: number;
  limit: number;
  totalPage: number;
  totalRow: number;
}

interface BannerDetail {
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

export default function ArticleDetailPage(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;
  const [bannerDetail, setBannerDetail] = useState<BannerDetail | null>(null);
  const [bannerData, setBannerData] = useState<Banner[]>([]);

  useEffect(() => {
    const fetchBannerAsset = async (): Promise<void> => {
      try {
        const res = await getBanner({
          page: 1,
          limit: 10,
          type: 'exclusive'
        });
        setBannerData(res.data);
      } catch (error) {
        console.error('Error fetching trending assets:', error);
      }
    };

    void fetchBannerAsset();
  }, []);

  useEffect(() => {
    if (typeof id === 'string') {
      const fetchBannerDetail = async (): Promise<void> => {
        try {
          const response = await getBannerById(id);
          setBannerDetail(response);
          console.log(response, 'jj');
        } catch (error) {
          console.log(error);
        }
      };

      void fetchBannerDetail();
    }
  }, [id]);

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 2
  };

  function splitContentIntoParagraphs(description: any): string[] {
    const MAX_PARAGRAPH_LENGTH = 400;
    const paragraphs = [];
    let currentParagraph = '';

    for (const char of description) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      currentParagraph += char;

      if (currentParagraph.length >= MAX_PARAGRAPH_LENGTH && char === '.') {
        paragraphs.push(currentParagraph);
        currentParagraph = '';
      }
    }

    if (currentParagraph !== undefined) {
      paragraphs.push(currentParagraph);
    }

    return paragraphs;
  }

  const contentParagraphs = splitContentIntoParagraphs(
    bannerDetail?.description ?? ''
  );

  function isImageUrlValid(url: string): boolean {
    return url?.startsWith('http://') || url?.startsWith('https://');
  }

  if (bannerDetail == null) {
    return <p>Loading...</p>;
  }

  const customGradient = (
    <>
      <span className="-z-0 absolute top-0 mt-[50%] -left-10 w-60 h-48 bg-seeds-green blur-[90px] rotate-45" />
      <span className="-z-0 absolute top-0 mt-[55%] left-0 w-24 h-24 bg-seeds-green blur-[90px]" />
      {/* <span className="-z-0 absolute -bottom-28 left-16 w-48 h-32 bg-seeds-purple-2 blur-[90px] rotate-45" /> */}
      <span className="-z-0 absolute top-64 -right-4 w-60 h-48 bg-seeds-purple blur-[140px] rotate-45 rounded-full" />
      <span className="-z-0 absolute bottom-36 right-0 w-32 h-32 bg-seeds-purple-2 blur-[140px] rotate-90 rounded-full" />
    </>
  );

  const defaultNews = '/assets/default-news.png';
  const imageUrl = bannerDetail?.image_url;
  const isImageValid = isImageUrlValid(imageUrl);
  return (
    <>
      <PageGradient customGradient={customGradient} className="z-0">
        <div className="z-0 relative overflow-hidden flex flex-col justify-center mx-5 lg:mx-20">
          <div className="w-full">
            {isImageValid ? (
              <img src={imageUrl} alt="Image" className="w-full rounded-2xl" />
            ) : (
              <img
                src={defaultNews}
                alt="Image"
                className="w-full rounded-2xl"
              />
            )}
          </div>
          <div className="flex flex-col border-b-4 pb-5 border-[#7555DA]">
            <div className="text-xl font-semibold text-[#262626]">
              {bannerDetail.title}
            </div>
            {contentParagraphs.map((paragraph, index) => (
              <div key={index} className=" py-4">
                <p className="w-full">{paragraph}</p>
              </div>
            ))}
            <div className="text-lg mt-3 font-light text-[#262626]">
              {bannerDetail.tnc}
            </div>
          </div>
          <div className="mt-12 ">
            <p className="text-3xl font-bold ">Exclusive Offers Lainnya </p>
            <p className="text-sm font-light text-[#7C7C7C]">
              Enjoy a variety of special promotions just for you!
            </p>
          </div>
          <div className=" mt-4">
            <Slider {...sliderSettings}>
              {bannerData?.map(data => (
                <Link
                  key={data.id}
                  href={`/homepage/exclusive/${data?.id ?? 0}`}
                >
                  <div key={data.id} className="w-full">
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
        </div>
      </PageGradient>
    </>
  );
}
