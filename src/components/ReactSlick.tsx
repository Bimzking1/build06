import common from '@/utils/common';
import type { ISlider } from '@/utils/interfaces/components.interfaces';
import React, { useRef } from 'react';
import Slider from 'react-slick';
import SliderCard from './SlideCard';
import SliderDot from './SliderDot';

export default function ReactSlick({
  data = []
}: {
  data?: ISlider[];
}): React.ReactElement {
  const sliderRef = useRef<Slider | null>(null);

  setTimeout(() => {
    sliderRef.current?.slickPlay();
  }, 5000);

  return (
    <Slider
      {...common._static.slideSettings}
      ref={sliderRef}
      customPaging={() => <SliderDot />}
    >
      {data.map((slide: ISlider, idx: number) => (
        <SliderCard key={idx} slide={slide} />
      ))}
    </Slider>
  );
}
