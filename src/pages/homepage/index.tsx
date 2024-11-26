import CCard from '@/components/CCard';
import ChooseCurrencyPopup from '@/components/popup/ChooseCurrency';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import FeatureSection from '@/containers/homepage/FeatureSection';
import Section1 from '@/containers/homepage/Section1';
import Section2 from '@/containers/homepage/Section2';
import Section3 from '@/containers/homepage/Section3';
import Section4 from '@/containers/homepage/Section4';
import Section5 from '@/containers/homepage/Section5';
import TrendingSection from '@/containers/homepage/TrendingSection';
import { isGuest } from '@/helpers/guest';
import withAuth from '@/helpers/withAuth';
import { getUserInfo } from '@/repository/profile.repository';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const Homepage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [popUpCurrency, setPopupCurrency] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const dataInfo = await getUserInfo();
        setUserInfo(dataInfo);
      } catch (error) {
        toast.error(`Error fetching data: ${error as string}`);
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (userInfo?.preferredCurrency?.length === 0) {
      setPopupCurrency(true);
    }
  }, [userInfo]);

  const handleOpen = (): void => {
    setPopupCurrency(!popUpCurrency);
  };

  return (
    <PageGradient defaultGradient className="w-full">
      <ChooseCurrencyPopup handleOpen={handleOpen} open={popUpCurrency} />
      <CCard className="p-3 mb-5">
        <Section1 />
      </CCard>
      <CCard className="p-3 mb-5">
        {userInfo !== undefined && <Section2 userInfo={userInfo} />}
      </CCard>
      {!isGuest() && (
        <CCard className="px-3 py-5 mb-5">
          <Section3 />
        </CCard>
      )}
      <CCard className="p-3 mb-5">
        <FeatureSection />
      </CCard>
      <CCard className="p-3 mb-5">
        <Section4 />
      </CCard>
      <CCard className="p-3 mb-5">
        <TrendingSection userInfo={userInfo} />
      </CCard>
      <CCard className="p-3 mb-5">
        <Section5 />
      </CCard>
    </PageGradient>
  );
};

export default withAuth(Homepage);
