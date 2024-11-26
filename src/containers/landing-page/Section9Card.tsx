import type { IEventHighlightLandingPage } from '@/utils/interfaces/components.interfaces';
import Image from 'next/image';

export default function Section9Card({
  data
}: {
  data: IEventHighlightLandingPage;
}): React.ReactElement {
  return (
    <div className="max-w-[320px] md:max-w-[280px] xl:max-w-[360px] h-[310px] xl:h-[340px] font-poppins mb-4 p-10 mx-auto lg:mx-4 rounded-xl bg-[#F3F3F3]">
      <div className="flex justify-center items-center h-[25%]">
        {/* Profile Picture */}
        <div className="w-1/4 items-center justify-center my-auto rounded-full overflow-hidden">
          <Image
            src={data.image}
            alt="Profile Picture"
            className="object-scale-down h-16 w-16"
          />
        </div>

        {/* Name and Occupation */}
        <div className="ml-4 w-3/4">
          <p className="text-md font-semibold">{data.name}</p>
          <p className="text-[#106B6E] font-light text-xs md:line-clamp-3">
            {data.title}
          </p>
        </div>
      </div>

      {/* Review Text */}
      <div className="h-[50%]">
        <p className="mt-4 text-gray-700 text-md line-clamp-4 lg:line-clamp-5">
          {data.comment}
        </p>
      </div>

      {/* Star Ratings */}
      <div className="flex justify-end lg:justify-start items-center gap-4 h-[25%]">
        <span className="text-black">
          {/* Display the rating like "5/5" or "4/5" */}
          5/5
        </span>

        <div className="bottom-0">
          {/* Static star ratings */}
          <p className="text-2xl text-yellow-500">★ ★ ★ ★ ★</p>
        </div>
      </div>
    </div>
  );
}
