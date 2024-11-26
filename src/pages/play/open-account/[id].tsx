'use-client';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import withAuth from '@/helpers/withAuth';
import { getBannerById } from '@/repository/discover.repository';
import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

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

const OPenAccountDetail = (): React.ReactElement => {
  const router = useRouter();
  const { id } = router.query;

  const [bannerDetail, setBannerDetail] = useState<BannerDetail | null>(null);

  const fetchBannerDetail = useCallback(async () => {
    try {
      const response = await getBannerById(id as string);
      setBannerDetail(response);
    } catch (error) {
      toast('Error fetching Open Account');
    }
  }, [id, setBannerDetail]);

  useEffect(() => {
    if (typeof id === 'string') {
      void fetchBannerDetail();
    }
  }, [fetchBannerDetail, id]);
  return (
    <PageGradient defaultGradient className="w-full gap-8 flex flex-col">
      <div className="w-full h-auto cursor-default bg-white p-5 rounded-2xl">
        <div className="bg-white w-full h-auto font-poppins my-4 flex flex-col justify-center gap-4 px-8">
          <p className="text-center text-[18px] font-semibold">
            {bannerDetail?.title}
          </p>

          <Image
            src={bannerDetail?.image_url as string}
            alt="Image"
            width={480}
            height={255}
            className="self-center"
          />
          <div
            dangerouslySetInnerHTML={{
              __html: `${bannerDetail?.description as string}`
            }}
          />
        </div>
      </div>

      <div className="w-full h-auto cursor-default bg-white p-5 rounded-2xl">
        <div className="bg-white w-full h-auto font-poppins my-4 flex flex-col justify-center gap-4 px-8">
          <a href={bannerDetail?.external_url}>
            <Button
              variant="filled"
              className="normal-case rounded-full w-full py-4 bg-[#3AC4A0] text-white font-poppins"
            >
              Open Account Now
            </Button>
          </a>
        </div>
      </div>
    </PageGradient>
  );
};

export default withAuth(OPenAccountDetail);
