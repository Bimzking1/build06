import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import Link from 'next/link';
import CardNews from './components/CardNews';

export default function DiscoverNews(): React.ReactElement {
  const width = useWindowInnerWidth();
  return (
    <div
      className={`z-1 relative sm:w-[90%] ${
        width !== undefined && width < 600
          ? 'w-[99%] overflow-x-auto'
          : width !== undefined && width < 500
          ? 'w-[99%] overflow-x-visible'
          : width !== undefined && width < 400
          ? 'w-[99%] overflow-x-visible'
          : width !== undefined && width > 600
          ? 'w-[600px] overflow-x-visible'
          : ''
      }!bg-white`}
    >
      <div className="md:bg-white sm:rounded-[18px] p-5 space-y-5">
        <div className="flex justify-between items-center">
          <h4 className="md:text-2xl text-lg font-bold">Berita Terkini</h4>
          <Link href={'/'} className="text-seeds-green">
            See More
          </Link>
        </div>
        <div className="flex lg:grid lg:grid-cols-4 gap-3 overflow-auto">
          <CardNews />
          <CardNews />
          <CardNews />
          <CardNews />
        </div>
      </div>
    </div>
  );
}
