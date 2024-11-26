/* eslint-disable @typescript-eslint/no-confusing-void-expression */
'use-client';
import OpenAccountCard from '@/components/play/OpenAccountCard';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import withAuth from '@/helpers/withAuth';
import { getBanner } from '@/repository/discover.repository';
import { type Banner } from '@/utils/interfaces/play.interface';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { seedyChatPersonal } from 'public/assets/chat';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const Player = (): React.ReactElement => {
  const { t } = useTranslation();
  const [bannerData, setBannerData] = useState<Banner[]>([]);

  const fetchBannerAsset = async (): Promise<void> => {
    try {
      const res = await getBanner({
        page: 1,
        limit: 9,
        type: 'open_account'
      });
      setBannerData(res.data);
    } catch (error) {
      toast('Error fetching Open Account');
    }
  };
  useEffect(() => {
    void fetchBannerAsset();
  }, []);

  const router = useRouter();

  return (
    <PageGradient defaultGradient className="w-full">
      <div className="w-full h-auto cursor-default bg-white p-5 rounded-2xl">
        <div className="bg-white w-full h-auto font-poppins my-4 flex justify-center flex-wrap gap-4">
          {bannerData?.map((item, index) => (
            <OpenAccountCard
              onClick={() => {
                void router.push(`/play/open-account/${item.id}`);
              }}
              key={index}
              data={item}
            />
          ))}
          {(bannerData?.length === 0 || bannerData === null) && (
            <div className="flex flex-col justify-center items-center py-8">
              <Image src={seedyChatPersonal} alt="Seedy No Chat" />
              <Typography className="font-poppins font-semibold text-xl text-[#262626]">
                {t('openAccount.noAccountYet')}
              </Typography>
              <Typography className="font-poppins font-medium text-[#7C7C7C]">
                {t('openAccount.stayTuned')}
              </Typography>
            </div>
          )}
        </div>
      </div>
    </PageGradient>
  );
};

export default withAuth(Player);
