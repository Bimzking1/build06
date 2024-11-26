import likeCircle from '@/assets/my-profile/circle/likeCircle.svg';
import memberCircle from '@/assets/my-profile/circle/memberCircle.svg';
import postCircle from '@/assets/my-profile/circle/postCircle.svg';
import GrayArrow from '@/assets/product/GrayArrow.svg';
import WhiteArrow from '@/assets/product/WhiteArrow.svg';
import { chrownCirclePremium } from '@/constants/assets/icons';
import { getTrendingCircle } from '@/repository/circle.repository';
import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import 'swiper/css';
import { Autoplay, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide, useSwiper, type SwiperClass } from 'swiper/react';
interface Item {
  banner: string;
  type?: string;
  image?: string;
  name?: string;
  total_like?: number;
  totalMember?: number;
  totalPost?: number;
  percentage?: number;
}

interface MyStyle extends React.CSSProperties {
  '--image-url': string;
}

export const SlideCircle: React.FC = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [circleData, setCircleData] = useState<Item[]>([]);
  const [isChange, setChange] = useState(true);
  const [activeIdx, setActiveIdx] = useState<number>(0);

const HandleSlideChange = (swiper: SwiperClass): void => {
  setActiveIdx(swiper.realIndex);
};

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const circleResponse = await getTrendingCircle();
        setCircleData(circleResponse.result);
      } catch (error) {
        toast.error('Error fetching data:');
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, []);

  const PrevBtn: React.FC = () => {
    const swiper = useSwiper();
    setActiveSlide(activeSlide);
    return (
      <div className="flex gap-3">
        <div
          onClick={() => {
            setChange(false);
            swiper.slidePrev();
          }}
          className={`rounded-full p-2 w-9 h-9 flex justify-center items-center   ${
            isChange
              ? 'bg-transparent'
              : 'bg-gradient-to-tr from-[#9A76FE] to-[#4FE6AF]'
          }`}
        >
          <Image
            src={isChange ? GrayArrow : WhiteArrow}
            alt="PrevArrow"
            className={`${isChange ? '' : 'rotate-180'}`}
          />
        </div>
      </div>
    );
  };

  const NextBtn: React.FC = () => {
    const swiper = useSwiper();
    setActiveSlide(activeSlide);
    return (
      <div className="flex gap-3">
        <div
          onClick={() => {
            setChange(true);
            swiper.slideNext();
          }}
          className={`rounded-full p-2 w-9 h-9 flex justify-center items-center   ${
            isChange
              ? 'bg-gradient-to-tr from-[#9A76FE] to-[#4FE6AF]'
              : 'bg-transparent'
          }`}
        >
          <Image
            src={isChange ? WhiteArrow : GrayArrow}
            alt="NextArrow"
            className={`${isChange ? '' : 'rotate-180'}`}
          />
        </div>
      </div>
    );
  };

  const classNameSwiper =
    'sm:flex-col sm:!w-full sm:!justify-end !flex !flex-col w-full !items-center !justify-center';
  const coverFlowEffectSwiper = {
    rotate: 0,
    slideShadows: false,
    stretch: 0,
    modifier: 2.5,
    depth: 150
  };
  const responsiveBreakpointsSwiper = {
    320: { slidesPerView: 1, centeredSlides: true },
    480: { slidesPerView: 1, centeredSlides: true },
    640: { slidesPerView: 2, centeredSlides: true },
    1024: { slidesPerView: 3, centeredSlides: true },
    2380: { slidesPerView: 3, centeredSlides: true }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center gap-10">
      <Swiper
        slidesPerView={3}
        grabCursor={true}
        loop={true}
        className={classNameSwiper}
        modules={[EffectCoverflow, Autoplay]}
        effect={'coverflow'}
        parallax={true}
        coverflowEffect={coverFlowEffectSwiper}
        centeredSlides={true}
        autoFocus={true}
        breakpoints={responsiveBreakpointsSwiper}
        autoplay={{ delay: 1000 }}
        speed={1000}
        spaceBetween={100}
        centeredSlidesBounds={true}
        onSlideChange={HandleSlideChange}
      >
        {circleData?.length !== 0
          ? circleData?.map((item: Item, index: number) => {
              const myStyle: MyStyle = {
                '--image-url': `url(${
                  item.banner.split('.')[0] === 'https://seeds-bucket-new'
                    ? 'https://res.cloudinary.com/dafjb9vn7/image/upload/v1702374211/defaultBannerCircle_kp04b9.svg'
                    : item.banner
                })`
              };
              return (
                <SwiperSlide
                  key={index}
                  className="flex justify-center items-center"
                >
                  <Card
                    shadow={false}
                    className={`${
                      activeIdx !== index
                        ? 'scale-[0.9] bg-opacity-50'
                        : 'scale-[1]'
                    }rounded-full lg:w-96 lg:h-48 w-full h-[169.31px] flex justify-center`}
                    key={index}
                  >
                    <CardHeader
                      shadow={false}
                      color="transparent"
                      className={`absolute m-0 h-full w-full bg-cover bg-center bg-[image:var(--image-url)]`}
                      style={myStyle}
                    >
                      <div
                        className={`
                          ${
                            activeIdx !== index
                              ? 'bg-white bg-opacity-50 w-full h-full'
                              : ''
                          }
                        `}
                      >
                        {item.type !== 'free' ? (
                          <div className="flex w-full h-20 pe-6 justify-end items-center">
                            <div className="flex lg:w-[98.54px] lg:h-[29px] w-[46.66px] h-[13.76px] absolute overflow-hidden bg-white rounded-full lg:gap-[5px] gap-[2.39px] items-center justify-center border">
                              <Image
                                src={chrownCirclePremium.src}
                                alt="crown"
                                className="lg:w-[15.1px] lg:h-[15.1px] w-[7.17px] h-[7.17px]"
                                width={300}
                                height={300}
                              />
                              <Typography className="lg:text-[10.10px] lg:leading-[20.22px] text-[4.79px] leading-[9.56px] text-[#3AC4A0] font-semibold font-poppins">
                                Premium
                              </Typography>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </CardHeader>
                    <CardBody className="p-0 relative flex flex-col items-center my-auto gap-2.5">
                      {item.image?.split('.')[0] ===
                      'https://seeds-bucket-new' ? (
                        <Avatar
                          alt="circleAvatar"
                          className="lg:border-[2.53px] border-[1.20px] border-white lg:w-[94.70px] lg:h-[94.70px] w-[44.86px] h-[44.86px] bg-cover"
                          src="https://res.cloudinary.com/dafjb9vn7/image/upload/v1702375269/defaultAvatarCircle_rp78vk.svg"
                        />
                      ) : (
                        <Avatar
                          alt="circleAvatar"
                          className="lg:border-[2.53px] border-[1.20px] border-white lg:w-[94.70px] lg:h-[94.70px] w-[44.86px] h-[44.86px] bg-cover"
                          src={`${item.image ?? ''}`}
                        />
                      )}
                      <Typography className="text-white lg:text-xl text-[9.56px] leading-[14.36px] font-poppins font-semibold">
                        {item.name}
                      </Typography>
                      <div className="flex lg:gap-[18px] gap-[8.36px]">
                        <div className="flex items-center lg:gap-[2.5px] gap-[1.20px]">
                          <Image
                            src={likeCircle}
                            alt="likeCircle"
                            className="lg:w-[25.29px] lg:h-[25.29px] w-[11.96px] h-[11.96px]"
                          />
                          <Typography className="text-white lg:text-base text-xs font-poppins font-normal ">
                            {item.total_like}
                          </Typography>
                        </div>
                        <div className="flex items-center lg:gap-[2.5px] gap-[1.20px]">
                          <Image
                            src={memberCircle}
                            alt="memberCircle"
                            className="lg:w-[25.29px] lg:h-[25.29px] w-[11.96px] h-[11.96px]"
                          />
                          <Typography className="text-white lg:text-base text-xs font-poppins font-normal ">
                            {item.totalMember}
                          </Typography>
                        </div>
                        <div className="flex items-center lg:gap-[2.5px] gap-[1.20px]">
                          <Image
                            src={postCircle}
                            alt="postCircle"
                            className="lg:w-[25.29px] lg:h-[25.29px] w-[11.96px] h-[11.96px]"
                          />
                          <Typography className="text-white lg:text-base text-xs font-poppins font-normal ">
                            {item.totalPost}
                          </Typography>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </SwiperSlide>
              );
            })
          : null}
        <div className="flex w-full justify-center cursor-pointer mt-5">
          <PrevBtn />
          <NextBtn />
        </div>
      </Swiper>
    </div>
  );
};
