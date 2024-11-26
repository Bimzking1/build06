import faq from '@/assets/landing-page/faq.png';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import {
  Accordion,
  AccordionBody,
  AccordionHeader
} from '@material-tailwind/react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';

const Section5: React.FC = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(1);
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
    <div className="mt-20" ref={ref}>
      <div
        className={`${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <Image
          src={faq}
          alt="faq"
          className="absolute right-0 left-0 mx-auto -mt-5 xl:block hidden"
        />
        <div className="flex flex-col w-full justify-center text-center relative mb-32">
          <span className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-b from-[#9A76FE] to-[#4FE6AF] mr-2 md:text-5xl lg:text-7xl pb-4">
            {t('faq.title')}
          </span>
          <span className="text-2xl font-normal text-[#201B1C] xl:mt-5 px-5">
            {t('faq.subTitle')}
          </span>

          {width !== undefined ? (
            width > 700 ? (
              <>
                <div className="absolute bg-[#3AC4A0BF] blur-[100px] w-[200px] h-[200px] left-0 bottom-44 rounded-full"></div>
                <div className="absolute bg-[#7F64D8] blur-[150px] w-[200px] h-[200px] right-0 bottom-44 rounded-full"></div>
              </>
            ) : null
          ) : null}

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
                {t('faq.faq.title.5')}
              </AccordionHeader>
              <AccordionBody className="pt-0 text-base font-normal">
                {t('faq.faq.desc.5')}
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
                {t('faq.faq.title.4')}
              </AccordionHeader>
              <AccordionBody className="pt-0 text-base font-normal">
                {t('faq.faq.desc.4')}
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
            {/* <Accordion
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
                {t('faq.faq.title.2')}
              </AccordionHeader>
              <AccordionBody className="pt-0 text-base font-normal">
                {t('faq.faq.desc.2')}
              </AccordionBody>
            </Accordion> */}
            {/* <Accordion
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
                {t('faq.faq.title.1')}
              </AccordionHeader>
              <AccordionBody className="pt-0 text-base font-normal">
                {t('faq.faq.desc.1')}
              </AccordionBody>
            </Accordion> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Section5;
