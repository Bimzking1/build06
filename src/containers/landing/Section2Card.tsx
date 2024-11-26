import type { IEventHighlightLandingPage } from '@/utils/interfaces/components.interfaces';
import Image from 'next/image';

export default function Section2Card({
  data
}: {
  data: IEventHighlightLandingPage;
}): React.ReactElement {
  return (
    <div className="relative max-w-s overflow-hidden mr-5">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center">
          {/* Profile Picture */}
          <div className="h-12 w-12 rounded-full overflow-hidden">
            <Image
              src={data.image}
              alt="Profile Picture"
              className="object-cover h-full w-full"
            />
          </div>

          {/* Name and Occupation */}
          <div className="ml-4">
            <p className="text-xl font-semibold">{data.name}</p>
            <p className="text-gray-500">{data.title}</p>
          </div>
        </div>

        {/* Review Text */}
        <p className="mt-4 text-gray-700">
          {data.comment.substring(0, 200)}.....
        </p>

        {/* Star Ratings */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-black">
            {/* Display the rating like "5/5" or "4/5" */}
            5/5
          </span>

          <div className="text-yellow-500">
            {/* Static star ratings */}★ ★ ★ ★ ★
          </div>
        </div>
      </div>
    </div>
  );
}
