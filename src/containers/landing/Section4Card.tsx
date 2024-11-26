import type { ICircleLandingPage } from '@/utils/interfaces/components.interfaces';
import Image from 'next/image';

export default function Section4Card({
  data
}: {
  data: ICircleLandingPage;
}): React.ReactElement {
  return (
    <div className="border rounded-xl border-gray-100 sm:w-[200px] lg:w-[200px] sm:me-3 lg:me-1 flex flex-col items-start bg-white cursor-pointer hover:shadow-lg transition-all relative bg-opacity-70">
      <Image
        alt={data.name}
        src={data.image}
        className="w-full rounded-xl"
        width={500}
        height={500}
      />
      {/* <div className="p-2">
        <div className="text-sm my-2 font-medium">{data.name}</div>
        <div className="flex items-center text-sm text-gray-400">
          <Image src={icon} alt="user" className="w-[15px] h-[15px] mr-2" />
          {data.totalMember}
        </div>
      </div> */}
    </div>
  );
}
