import { SectionFiveImageProblemSolution } from '@/constants/assets/images';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const Section5: React.FC = () => {
  const width = useWindowInnerWidth();
  const measurement = 400;
  const [isBottom, setBottom] = useState(0);
  const { ref, inView, entry } = useInView({
    threshold: 0.3
  });

  useEffect(() => {
    const bottom = entry?.boundingClientRect.bottom ?? 0;
    setBottom(bottom);
  }, [entry]);

  return (
    <div className="min-w-full font-poppins bg-white" ref={ref}>
      <div
        className={`flex flex-col w-full p-5 items-center font-poppins relative ${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <p className="text-3xl md:text-4xl mt-10 mb-5 text-center font-semibold text-[#7F64D8] xl:font-bold">
          Problem Statement and Solution
        </p>
        {width !== undefined ? (
          width > 700 ? (
            <>
              <div className="absolute bg-[#3AC4A0BF] blur-[150px] w-[200px] h-[200px] left-0 bottom-32 rounded-full"></div>
              <div className="absolute bg-[#7F64D8] blur-[150px] w-[200px] h-[200px] right-0 bottom-44 rounded-full"></div>
            </>
          ) : null
        ) : null}
        <Image
          src={SectionFiveImageProblemSolution.src}
          alt="Body 2"
          width={600}
          height={100}
          className="w-[22rem] h-[16rem] md:w-[80rem] md:h-[55rem] object-cover"
        />

        {/* <div className='relative w-full md:h-[500px] overflow-hidden'>
          <div className='w-full h-full object-cover'>
            <Image
              src={SectionFiveImageProblemSolution.src}
              alt="Body 2"
              width={600}
              height={100}
              className="absolute w-full h-full object-contain"
            />
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Section5;
