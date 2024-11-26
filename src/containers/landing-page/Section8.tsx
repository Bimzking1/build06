'use client';
import { SectionSixImageOval } from '@/constants/assets/images';
import useWindowInnerWidth from '@/hooks/useWindowInnerWidth';
import { getArticle } from '@/repository/article.repository';
import LanguageContext from '@/store/language/language-context';
import { Button } from '@material-tailwind/react';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInView } from 'react-intersection-observer';
import Slider from 'react-slick';

interface Article {
  id: string;
  title: string;
  author: string;
  link: string;
  videoUrl: string;
  imageUrl: string;
  content: string;
  sourceId: string;
  language: string;
  category: string;
  is_liked: boolean;
  publicationDate: string;
  total_likes: number;
  total_comments: number;
  total_shares: number;
}

export default function Section3(): React.ReactElement {
  const [hotNews, setHotNews] = useState<Article[]>([]);
  const { t } = useTranslation();
  const languageCtx = useContext(LanguageContext);
  const width = useWindowInnerWidth();
  const [isBottom, setBottom] = useState(0);
  const measurement = 900;
  const router = useRouter();

  let languageValue = '';

  if (languageCtx.language === 'EN') {
    languageValue = 'english';
  } else {
    languageValue = 'indonesian';
  }

  const { ref, inView, entry } = useInView({
    threshold: 0.2
  });
  useEffect(() => {
    const bottom = entry?.boundingClientRect.bottom ?? 0;
    setBottom(bottom);
  }, [entry]);

  function formatDateToIndonesian(dateStr: string): string {
    try {
      const parsedDate = parseISO(dateStr);
      const formattedDate = format(parsedDate, 'd MMMM ', { locale: id });

      return formattedDate;
    } catch (error) {
      console.error('Error parsing or formatting date:', error);
      return '';
    }
  }

  function formatDateToIndonesianAgo(dateStr: string): string {
    try {
      const parsedDate = parseISO(dateStr);
      const distance = formatDistanceToNow(parsedDate, { locale: id });
      return `.  ${distance}`;
    } catch (error) {
      console.error('Error parsing or formatting date:', error);
      return '';
    }
  }

  async function fetchHotNews(): Promise<void> {
    try {
      const response = await getArticle({
        page: 1,
        limit: 9,
        source: 'news',
        language: languageValue,
        search: '',
        category: 'All'
      });

      setHotNews(response.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  }

  const hotNewsItemClass = '';

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await fetchHotNews();
    };

    fetchData().catch(error => {
      console.error('Error in fetchData:', error);
    });
  }, [languageCtx]);

  const defaultHotNewsImage = '/assets/default-news.png';
  function isImageUrlValid(url: string): boolean {
    return url?.startsWith('http://') || url?.startsWith('https://');
  }
  //   const { t } = useTranslation();
  //   const width = useWindowInnerWidth();

  return (
    <section
      ref={ref}
      className="h-auto min-w-full cursor-default relative font-poppins text-center"
    >
      <div
        className={`h-auto min-w-full lg:mt-20 lg:mx-12 font-poppins cursor-default relative text-center ${
          inView && isBottom >= measurement
            ? 'animate-fade-in-slide'
            : isBottom >= measurement
            ? 'animate-fade-out-slide'
            : ''
        }`}
      >
        <div className="flex flex-col w-full items-center font-poppins relative">
          <p className=" text-2xl lg:text-5xl mt-10 p-5 text-center font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF] xl:font-semibold absolute z-10">
            {t('landingV2.section8.text1')} <br />{' '}
            {t('landingV2.section8.text2')}
          </p>
          <Image
            src={SectionSixImageOval.src}
            alt={SectionSixImageOval.alt}
            width={400}
            height={100}
            className="w-[375px] h-[157px] top-5 lg:w-[836px] lg:h-[167px] md:top-5 relative z-1"
          />
          {width !== undefined ? (
            width > 700 ? (
              <>
                <div className="absolute z-0 bg-[#3AC4A0BF] blur-[150px] w-[300px] h-[300px] right-[10rem] top-[10rem] rounded-full"></div>
                <div className="absolute z-0 bg-[#7F64D8] blur-[250px] w-[300px] h-[300px] right-[25rem] top-[20rem] rounded-full"></div>
              </>
            ) : null
          ) : null}
        </div>
        <div>
          <Slider
            slidesToShow={3}
            speed={500}
            className="my-12"
            initialSlide={0}
            // slidesToScroll={1}
            responsive={[
              {
                breakpoint: 1024,
                settings: {
                  dots: true,
                  slidesToShow: 3,
                  slidesToScroll: 1
                }
              },
              {
                breakpoint: 768,
                settings: {
                  dots: true,
                  slidesToShow: 2,
                  slidesToScroll: 1
                }
              },
              {
                breakpoint: 480,
                settings: {
                  dots: true,
                  slidesToShow: 1
                }
              }
            ]}
          >
            {hotNews?.map((data, key) => (
              <div
                key={key}
                className={` lg:pe-5 w-[200px] flex flex-col items-start bg-transparent cursor-pointer hover:shadow-lg transition-all relative bg-opacity-70 ${hotNewsItemClass}`}
              >
                <Link href={`/seedspedia/news/${data?.id ?? 0}`}>
                  {isImageUrlValid(data.imageUrl) ? (
                    <img
                      src={data.imageUrl}
                      alt={data.title}
                      className="w-full rounded-xl h-[240px]"
                    />
                  ) : (
                    <img
                      src={defaultHotNewsImage}
                      alt={data.title}
                      className="w-full rounded-xl h-[240px]"
                    />
                  )}

                  <h3 className="text-xl font-poppins font-semibold p-2 text-left">
                    {data.title}
                  </h3>
                  <div className="flex flex-row mx-2">
                    <p className="text-xs font-normal text-[#8A8A8A]">
                      {formatDateToIndonesian(data?.publicationDate ?? '')}
                    </p>
                    <p className="text-xs font-normal text-[#7C7C7C]">
                      {formatDateToIndonesianAgo(data?.publicationDate ?? '')}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
        <div className="justify-center text-center">
          <Button
            className="text-xs px-5 font-normal capitalize bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF] rounded-full"
            onClick={() => {
              void router.push('/seedspedia');
            }}
          >
            <div className="flex">
              <h1 className="me-3 mt-1">Show All</h1>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 9L12 15L6 9"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </Button>
        </div>
      </div>
    </section>
  );
}
