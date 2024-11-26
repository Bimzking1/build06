import Connect from '@/assets/event/connect.svg';
import Event from '@/assets/event/event.svg';
import OpenTrading from '@/assets/event/openTradingAccount.svg';
import PlayArena from '@/assets/event/playArena.svg';
// import SeedsAcademy from '@/assets/event/seeds-academy-icon.svg';
import Image from 'next/image';
import { useRouter } from 'next/router';

const FeatureSection: React.FC = (): React.ReactElement => {
  const router = useRouter();

  return (
    <div className="flex justify-between gap-2 lg:px-4 py-2 xl:px-8 xl:gap-4">
      {/* <div
        onClick={async () => await router.push('/academy')}
        className="w-full flex flex-col lg:gap-2 justify-center items-center border border-[#E9E9E9] rounded-lg px-2 py-2 lg:p-4 hover:border-[#3AC4A0] hover:shadow-lg duration-300 cursor-pointer"
      >
        <Image
          width={100}
          height={100}
          alt=""
          src={SeedsAcademy}
          className="w-[40px] h-[40px] lg:w-[35px] lg:h-[35px]"
        />
        <div className="flex justify-center items-center text-center text-[#262626] text-[9px] lg:text-[16px] mt-1 lg:mt-0">
          Seeds Academy
        </div>
      </div> */}
      <div
        onClick={async () => await router.push('/play')}
        className="w-full flex flex-col lg:gap-2 justify-center items-center border border-[#E9E9E9] rounded-lg px-2 py-2 lg:p-4 hover:border-[#3AC4A0] hover:shadow-lg duration-300 cursor-pointer"
      >
        <Image
          width={100}
          height={100}
          alt=""
          src={PlayArena}
          className="w-[40px] h-[40px] lg:w-[35px] lg:h-[35px]"
        />
        <div className="flex justify-center items-center text-center text-[#262626] text-xs lg:text-[16px] mt-1 lg:mt-0">
          Play
        </div>
      </div>
      <div
        onClick={async () => await router.push('/connect')}
        className="w-full flex flex-col lg:gap-2 justify-center items-center border border-[#E9E9E9] rounded-lg px-2 py-2 md:p-4 hover:border-[#3AC4A0] hover:shadow-lg duration-300 cursor-pointer"
      >
        <Image
          width={100}
          height={100}
          alt=""
          src={Connect}
          className="w-[40px] h-[40px] lg:w-[35px] lg:h-[35px]"
        />
        <div className="flex justify-center items-center text-center text-[#262626] text-xs lg:text-[16px] mt-1 lg:mt-0">
          Connect
        </div>
      </div>
      <div
        onClick={async () => await router.push('/homepage/event')}
        className="w-full flex flex-col lg:gap-2 justify-center items-center border border-[#E9E9E9] rounded-lg px-2 py-2 lg:p-4 hover:border-[#3AC4A0] hover:shadow-lg duration-300 cursor-pointer"
      >
        <Image
          width={100}
          height={100}
          alt=""
          src={Event}
          className="w-[40px] h-[40px] lg:w-[35px] lg:h-[35px]"
        />
        <div className="flex justify-center items-center text-center text-[#262626] text-xs lg:text-[16px] mt-1 lg:mt-0">
          Events
        </div>
      </div>
      <div
        onClick={async () => await router.push('/play/open-account')}
        className="w-full lg:w-[1200px] flex flex-col lg:gap-2 justify-center items-center border border-[#E9E9E9] rounded-lg px-1 xl:p-2 hover:border-[#3AC4A0] hover:shadow-lg duration-300 cursor-pointer"
      >
        <Image
          width={100}
          height={100}
          alt=""
          src={OpenTrading}
          className="w-[40px] h-[40px] lg:w-[35px] lg:h-[35px]"
        />
        <div className="flex justify-center items-center text-center text-[#262626] text-[9px] lg:text-[16px] mt-1 lg:mt-0">
          Open Account
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
