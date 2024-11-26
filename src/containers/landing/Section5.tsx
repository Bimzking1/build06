import bg from '@/assets/landing-page/bg-discover.png';
import faq from '@/assets/landing-page/faq.png';
import medal from '@/assets/landing-page/medal-blur.png';
import vector2 from '@/assets/landing-page/vector-faq-2.png';
import vector1 from '@/assets/landing-page/vector-faq.png';
import CarouselNewsDesktop from '@/components/carousel/CarouselNewsDesktop';
import CarouselNewsMobile from '@/components/carousel/CarouselNewsMobile';
import {
  Accordion,
  AccordionBody,
  AccordionHeader
} from '@material-tailwind/react';
import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function Section5(): React.ReactElement {
  const { t } = useTranslation();
  const [open, setOpen] = useState(1);

  interface iconProps {
    id: number;
    open: number;
  }

  function Icon({ id, open }: iconProps): JSX.Element {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className={`${
          id === open ? 'rotate-180' : ''
        } h-5 w-5 transition-transform`}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        />
      </svg>
    );
  }

  const handleOpen = (value: number): void => {
    setOpen(open === value ? 0 : value);
  };

  return (
    <div>
      <div className="min-w-full h-auto cursor-default mt-7 md:mt-4 text-start xl:text-center lg:mb-10 font-poppins bg-gradient-to-b from-[#EDF2F700]  to-[#E2E8F0]">
        <span className="text-3xl font-semibold px-6  bg-clip-text text-transparent bg-gradient-to-b from-[#9A76FE] to-[#4FE6AF] mr-2 md:text-5xl lg:text-7xl pb-4">
          {t('landing.section5.text1')}
        </span>
        <h2 className="text-2xl font-normal text-[#7C7C7C] px-6 mt-5 xl:w-[50%] mx-auto">
          {t('landing.section5.text2')}
        </h2>
        <div className="h-full flex items-center justify-center mt-7">
          <Image
            alt="img"
            className="absolute left-0 -mt-[800px] w-[400px] xl:block hidden"
            src={medal}
          />
          {/* Parent container */}
          <div className="xl:w-4/5 w-[90%] bg-white bg-opacity-40 border xl:border-[#4FE6AF] border-[#7555DA] rounded-lg xl:rounded-[24px] shadow-md overflow-hidden text-center xl:p-5">
            <div className="bg-white bg-opacity-40 xl:p-4 relative">
              {/* Carousel container with overflow hidden */}
              <section className="xl:block hidden">
                <Image
                  src={bg}
                  alt="bg"
                  width={1200}
                  className="absolute -top-4 left-8"
                />
                <CarouselNewsDesktop />
              </section>
              <section className="xl:hidden block">
                <CarouselNewsMobile />
              </section>
            </div>
          </div>
        </div>
        <div className="mt-[150px] flex flex-col">
          <div className="flex flex-row w-full justify-center">
            <span className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-[#9A76FE] to-[#4FE6AF] mr-2 md:text-5xl lg:text-7xl pb-4">
              {t('landing.section6.text1')}
            </span>
            <span className="text-3xl font-semibold bg-clip-text text-transparent bg-[#201B1C] mr-2 md:text-5xl lg:text-7xl pb-4">
              {t('landing.section6.text2')}
            </span>
          </div>
          <p className="text-2xl font-normal text-[#262626] text-center px-4 mt-5">
            {t('landing.section6.text3')}
          </p>
          <div>
            <img
              src="/assets/images/communities.png"
              alt=""
              className="-mt-[300px] xl:block hidden w-full h-full"
            />
            <img
              src="/assets/images/community.png"
              alt=""
              className="-mt-[200px] xl:hidden block w-full h-full"
            />
          </div>
        </div>
      </div>
      <div className="mt-20">
        <Image
          src={vector1}
          alt="faq"
          className="absolute left-0 xl:block hidden"
        />
        <Image
          src={vector2}
          alt="faq"
          className="absolute right-0 xl:block hidden"
        />
        <Image
          src={faq}
          alt="faq"
          className="absolute right-0 left-0 mx-auto -mt-5 xl:block hidden"
        />
        <div className="flex flex-col w-full justify-center text-center">
          <span className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-[#9A76FE] to-[#4FE6AF] mr-2 md:text-5xl lg:text-7xl pb-4">
            {t('faq.title')}
          </span>
          <span className="text-2xl font-normal text-[#201B1C] xl:mt-5 px-5">
            {t('faq.subTitle')}
          </span>
          <div className="xl:w-2/3 w-[90%] mx-auto xl:mt-7 mt-5 text-start font-poppins">
            <Accordion
              icon={<Icon id={1} open={open} />}
              open={open === 1}
              className="mb-2 rounded-lg border bg-[#ffffff59] border-[#E9E9E9] px-4 backdrop-blur-sm"
            >
              <AccordionHeader
                onClick={(): void => {
                  handleOpen(1);
                }}
                className={`border-b-0 transition-colors ${
                  open === 1 ? 'text-blue-500 hover:!text-blue-700' : ''
                }`}
              >
                {t('faq.faq.title.1')}
              </AccordionHeader>
              <AccordionBody className="pt-0 text-base font-normal">
                {t('faq.faq.desc.1')}
              </AccordionBody>
            </Accordion>
            <Accordion
              icon={<Icon id={2} open={open} />}
              open={open === 2}
              className="mb-2 rounded-lg border bg-[#ffffff59] border-[#E9E9E9] px-4 backdrop-blur-sm"
            >
              <AccordionHeader
                onClick={(): void => {
                  handleOpen(2);
                }}
                className={`border-b-0 transition-colors ${
                  open === 2 ? 'text-blue-500 hover:!text-blue-700' : ''
                }`}
              >
                {t('faq.faq.title.2')}
              </AccordionHeader>
              <AccordionBody className="pt-0 text-base font-normal">
                {t('faq.faq.desc.2')}
              </AccordionBody>
            </Accordion>
            <Accordion
              icon={<Icon id={3} open={open} />}
              open={open === 3}
              className="mb-2 rounded-lg border bg-[#ffffff59] border-[#E9E9E9] px-4 backdrop-blur-sm"
            >
              <AccordionHeader
                onClick={(): void => {
                  handleOpen(3);
                }}
                className={`border-b-0 transition-colors ${
                  open === 3 ? 'text-blue-500 hover:!text-blue-700' : ''
                }`}
              >
                {t('faq.faq.title.3')}
              </AccordionHeader>
              <AccordionBody className="pt-0 text-base font-normal">
                {t('faq.faq.desc.3')}
              </AccordionBody>
            </Accordion>
            <Accordion
              icon={<Icon id={4} open={open} />}
              open={open === 4}
              className="mb-2 rounded-lg border bg-[#ffffff59] border-[#E9E9E9] px-4 backdrop-blur-sm"
            >
              <AccordionHeader
                onClick={(): void => {
                  handleOpen(4);
                }}
                className={`border-b-0 transition-colors ${
                  open === 4 ? 'text-blue-500 hover:!text-blue-700' : ''
                }`}
              >
                {t('faq.faq.title.4')}
              </AccordionHeader>
              <AccordionBody className="pt-0 text-base font-normal">
                {t('faq.faq.desc.4')}
              </AccordionBody>
            </Accordion>
            <Accordion
              icon={<Icon id={5} open={open} />}
              open={open === 5}
              className="mb-2 rounded-lg border bg-[#ffffff59] border-[#E9E9E9] px-4 backdrop-blur-sm"
            >
              <AccordionHeader
                onClick={(): void => {
                  handleOpen(5);
                }}
                className={`border-b-0 transition-colors ${
                  open === 5 ? 'text-blue-500 hover:!text-blue-700' : ''
                }`}
              >
                {t('faq.faq.title.5')}
              </AccordionHeader>
              <AccordionBody className="pt-0 text-base font-normal">
                {t('faq.faq.desc.5')}
              </AccordionBody>
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
