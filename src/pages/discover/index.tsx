'use client';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
// import DiscoverBanner from '@/containers/discover/DiscoverBanner';
// import DiscoverEarn from '@/containers/discover/DiscoverEarn';
// import DiscoverMerchant from '@/containers/discover/DiscoverMerchant';
import DiscoverNews from '@/containers/discover/DiscoverNews';
// import DiscoverSearch from '@/containers/discover/DiscoverSearch';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';

export default function Discover(): React.ReactElement {
  const width = useWindowInnerWidth();

  return (
    <PageGradient
      defaultGradient
      className={`z-0  sm:gap-12 gap-5 sm:relative py-10  overflow-hidden flex flex-col items-center w-full bottom-0  ${
        width !== undefined && width < 370
          ? 'w-[90%]'
          : width !== undefined && width < 500
          ? 'w-[90%]'
          : width !== undefined && width < 400
          ? 'w-[40%]'
          : width !== undefined && width > 600
          ? 'w-[600px]'
          : ''
      } bg-white`}
    >
      {/* <DiscoverSearch />
      <DiscoverBanner />
      <DiscoverEarn />
      <DiscoverMerchant /> */}
      <DiscoverNews />
    </PageGradient>
  );
}
