import CardGradient from '@/components/ui/card/CardGradient';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import Image from 'next/image';
import { Search } from 'public/assets/vector';

export default function DiscoverSearch(): React.ReactElement {
  const width = useWindowInnerWidth();
  return (
    <CardGradient
      defaultGradient
      className={`z-1 relative p-5  sm:w-[90%] sm:rounded-[18px] ${
        width !== undefined && width < 600
          ? 'w-[99%] overflow-x-auto'
          : width !== undefined && width < 500
          ? 'w-[99%] overflow-x-visible'
          : width !== undefined && width < 400
          ? 'w-[99%] overflow-x-visible'
          : width !== undefined && width > 600
          ? 'w-[600px] overflow-x-visible'
          : ''
      }bg-white`}
    >
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h2 className="text-2xl font-semibold tracking-wide">
          What are you looking for?
        </h2>
        <div className="flex border rounded-full border-[#7C7C7C] py-3 px-5">
          <input
            className="flex-1 outline-none bg-transparent"
            type="text"
            placeholder="Search"
          />
          <Image src={Search} alt="" />
        </div>
        <div className="flex justify-between">
          <p>Recent Search</p>
          <p className="text-seeds-button-green">Clear History</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from(Array(5), (e, i) => {
            return (
              <button
                key={i}
                className="tracking-wide text-seeds-green bg-[#E9E9E9] text-sm py-1 px-3 rounded-full"
              >
                Ethereum
              </button>
            );
          })}
        </div>
      </div>
    </CardGradient>
  );
}
