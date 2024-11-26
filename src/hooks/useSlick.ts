import type { IUseSlick } from '@/utils/interfaces/slick.interface';
import type { Settings } from '@ant-design/react-slick';
import { useRef } from 'react';

export const useSlick = (): IUseSlick => {
  const settings: Settings = {
    dots: false,
    infinite: false,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    swipe: false
    // initialSlide: 3
  };

  const slickRef = useRef<any>(null);

  const changeStep = (value: number | undefined = 1): void => {
    void slickRef?.current?.slickGoTo(value);
  };

  return {
    settings,
    slickRef,
    changeStep
  };
};
