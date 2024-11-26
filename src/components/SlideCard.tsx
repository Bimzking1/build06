import type { ISlider } from '@/utils/interfaces/components.interfaces';
import Image from 'next/image';

const SliderCard = ({ slide }: { slide: ISlider }): React.ReactElement => (
  <div className="w-full lg:w-full justify-center flex flex-col items-center mt-3">
    {/* <div className="w-full lg:w-3/4 justify-center flex flex-col items-center mt-3"> */}
    <div className="w-full flex flex-col items-center mt-3">
      <Image src={slide.image} alt="" />
    </div>
    <div className="text-lg tracking-wide font-semibold mt-3">
      {slide.title}
    </div>
    <div className="text-md tracking-wide text-center font-normal mt-2 text-[#7C7C7C]">
      {slide.text}
    </div>
  </div>
);

export default SliderCard;
