import {
  SectionFourKolOptionOne,
  SectionFourKolOptionThree,
  SectionFourKolOptionTwo
} from '@/constants/assets/images';
import { Button, Card } from '@material-tailwind/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';

const Section4: React.FC = () => {
  const { t } = useTranslation();
  const measurement = 400;
  const [isBottom, setBottom] = useState(0);
  const { ref, inView, entry } = useInView({
    threshold: 0.3
  });

  useEffect(() => {
    const bottom = entry?.boundingClientRect.bottom ?? 0;
    setBottom(bottom);
  }, [entry]);

  const data = [
    {
      image: SectionFourKolOptionOne.src,
      title: `${t('partner.section4.option1.title')}`,
      text: `${t('partner.section4.option1.text')}`,
      button: `${t('partner.section4.option1.button')}`,
      link: 'https://docs.google.com/forms/d/e/1FAIpQLSdvwGEZG_2rtRHJz9lJloF3sQd-l9I4kCe9Mh0EOOZfpPFIOA/viewform'
    },
    {
      image: SectionFourKolOptionTwo.src,
      title: `${t('partner.section4.option2.title')}`,
      text: `${t('partner.section4.option2.text')}`,
      button: `${t('partner.section4.option2.button')}`,
      link: 'https://docs.google.com/forms/d/e/1FAIpQLSeGD35xu4iT7hkuM6PJLuI66vsqGx-oREAtmgWIiodpxgdFaQ/viewform'
    },
    {
      image: SectionFourKolOptionThree.src,
      title: `${t('partner.section4.option3.title')}`,
      text: `${t('partner.section4.option3.text')}`,
      button: `${t('partner.section4.option3.button')}`,
      link: 'https://docs.google.com/forms/d/e/1FAIpQLSdRJA5QIs16tTJHdjtWWMMeIfEvGteJwINZJV6IHIBIBbM8ZA/viewform'
    }
  ];

  return (
    <div
      className="min-w-full font-poppins bg-gradient-to-b from-[#EDF2F700]  to-[#E2E8F0]"
      ref={ref}
    >
      <div
        className={`flex flex-col w-full items-center font-poppins ${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <p className="text-3xl md:text-4xl mt-10 p-2 text-center font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF] xl:font-bold">
          {t('partner.section4.title')}
        </p>
        <p className="text-base md:text-2xl p-2 mt-1 font-normal text-center text-[#262626]">
          {t('partner.section4.subtitle')}
        </p>

        <div className="flex flex-col w-full items-center justify-center gap-5 md:gap-28 font-poppins p-5 md:px-20 md:flex-row">
          {data.map((data, idx) => (
            <Card
              key={idx}
              className="flex flex-col items-center md:h-[30rem] w-full md:w-1/4 md:mb-14 p-5 text-center rounded-3xl"
            >
              <Image
                src={data.image}
                height={100}
                width={100}
                alt="kol"
                className="w-[200px] h-[200px]"
              />

              <p className="text-2xl font-semibold text-black mt-5">
                {data.title}
              </p>
              <p className="text-lg font-normal text-black mt-5">{data.text}</p>
              <Button
                className="invisible text-xs px-12 md:mt-8 font-semibold capitalize text-md bg-[#3AC4A0] rounded-full md:visible"
                onClick={() => {
                  window.open(data.link, '_blank', 'noopener noreferrer');
                }}
              >
                {data.button}
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Section4;
