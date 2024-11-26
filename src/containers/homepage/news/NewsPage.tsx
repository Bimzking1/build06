import NewsCard from '@/components/homepage/newsCard';
import { getArticle } from '@/repository/article.repository';
import LanguageContext from '@/store/language/language-context';
import { Card, Typography } from '@material-tailwind/react';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

export interface ArticleListRoot {
  promoCodeList: Article[];
  metadata: Metadata;
}

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

export interface Metadata {
  currentPage: number;
  limit: number;
  totalPage: number;
  totalRow: number;
}

export default function NewsPage(): React.ReactElement {
  const [articles, setArticles] = useState<Article[]>([]);
  const [hotNews, setHotNews] = useState<Article[]>([]);
  const { t } = useTranslation();

  const languageCtx = useContext(LanguageContext);
  const [activeCategory, setActiveCategory] = useState('All');
  let languageValue = '';

  if (languageCtx.language === 'EN') {
    languageValue = 'english';
  } else {
    languageValue = 'indonesian';
  }
  const [params, setParams] = useState({
    page: 1,
    limit: 4,
    source: 'news',
    language: languageValue,
    search: '',
    category: 'All',
    totalPage: 9
  });

  async function fetchArticles(): Promise<void> {
    try {
      const response = await getArticle({
        ...params,
        source: params.source,
        category: params.category,
        language: languageValue
      });

      if (response.status === 200) {
        setArticles(response.data);
      } else {
        console.error('Failed to fetch articles:', response);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
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

      if (response.status === 200) {
        setHotNews(response.data);
      } else {
        console.error('Failed to fetch articles:', response);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  }

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await fetchArticles();
      await fetchHotNews();
    };

    fetchData().catch(error => {
      console.error('Error in fetchData:', error);
    });
  }, [params, languageValue]);

  const updateCategory = (newCategory: string): void => {
    setParams(prevParams => ({
      ...prevParams,
      category: newCategory.toLowerCase()
    }));

    setActiveCategory(newCategory);
  };
  
  const defaultHotNewsImage = '/assets/default-news.png';
  function isImageUrlValid(url: string): boolean {
    return url?.startsWith('http://') || url?.startsWith('https://');
  }

  const classNameSwiper =
    'items-center lg:flex lg:flex-col lg:w-full lg:justify-center ';

  const responsiveBreakpointsSwiper = {
    320: { slidesPerView: 1, centeredSlides: true },
    480: { slidesPerView: 1, centeredSlides: true },
    640: { slidesPerView: 1, centeredSlides: true },
    1024: { slidePerView: 1, centeredSlides: true }
  };
  return (
    <>
      <div className="flex flex-col gap-10">
        <div className="hidden lg:flex  justify-center mt-4 gap-2 ">
          <button
            className={`py-1 rounded-full text-xs px-4 ${
              activeCategory === 'All'
                ? 'bg-[#3AC4A0] text-white'
                : 'text-[#3AC4A0] bg-[#F9F9F9]'
            }`}
            onClick={() => {
              updateCategory('All');
            }}
          >
            All
          </button>
          <button
            className={`py-1 rounded-full text-xs px-2 ${
              activeCategory === 'business'
                ? 'bg-[#3AC4A0] text-white'
                : 'text-[#3AC4A0] bg-[#F9F9F9]'
            }`}
            onClick={() => {
              updateCategory('business');
            }}
          >
            Business
          </button>
          <button
            className={`py-1 rounded-full text-xs px-2 ${
              activeCategory === 'entertainment'
                ? 'bg-[#3AC4A0] text-white'
                : 'text-[#3AC4A0] bg-[#F9F9F9]'
            }`}
            onClick={() => {
              updateCategory('entertainment');
            }}
          >
            Entertainment
          </button>

          <button
            className={`py-1 rounded-full text-xs px-2 ${
              activeCategory === 'health'
                ? 'bg-[#3AC4A0] text-white'
                : 'text-[#3AC4A0] bg-[#F9F9F9]'
            }`}
            onClick={() => {
              updateCategory('health');
            }}
          >
            Health
          </button>
          <button
            className={`py-1 rounded-full text-xs px-2 ${
              activeCategory === 'politics'
                ? 'bg-[#3AC4A0] text-white'
                : 'text-[#3AC4A0] bg-[#F9F9F9]'
            }`}
            onClick={() => {
              updateCategory('politics');
            }}
          >
            Politics
          </button>
          <button
            className={`py-1 rounded-full text-xs px-2 ${
              activeCategory === 'science'
                ? 'bg-[#3AC4A0] text-white'
                : 'text-[#3AC4A0] bg-[#F9F9F9]'
            }`}
            onClick={() => {
              updateCategory('science');
            }}
          >
            Science
          </button>
          <button
            className={`py-1 rounded-full text-xs px-2 ${
              activeCategory === 'sports'
                ? 'bg-[#3AC4A0] text-white'
                : 'text-[#3AC4A0] bg-[#F9F9F9]'
            }`}
            onClick={() => {
              updateCategory('sports');
            }}
          >
            Sports
          </button>
          <button
            className={`py-1 rounded-full text-xs px-2 ${
              activeCategory === 'technology'
                ? 'bg-[#3AC4A0] text-white'
                : 'text-[#3AC4A0] bg-[#F9F9F9]'
            }`}
            onClick={() => {
              updateCategory('technology');
            }}
          >
            Technology
          </button>
          <button
            className={`py-1 rounded-full text-xs px-2 ${
              activeCategory === 'top'
                ? 'bg-[#3AC4A0] text-white'
                : 'text-[#3AC4A0] bg-[#F9F9F9]'
            }`}
            onClick={() => {
              updateCategory('top');
            }}
          >
            Top
          </button>
          <button
            className={`py-1 rounded-full text-xs px-2 ${
              activeCategory === 'world'
                ? 'bg-[#3AC4A0] text-white'
                : 'text-[#3AC4A0] bg-[#F9F9F9]'
            }`}
            onClick={() => {
              updateCategory('world');
            }}
          >
            World
          </button>
        </div>
        {/* ----swiper slide image---- */}
        <div className="lg:w-full lg:h-[300px] w-full h-[200px] lg:justify-center">
          <Swiper
            className={classNameSwiper}
            spaceBetween={0}
            loop={true}
            centeredSlides={true}
            slidesPerView={1}
            breakpoints={responsiveBreakpointsSwiper}
            modules={[Autoplay]}
            autoplay={{ delay: 1300, disableOnInteraction: false }}
          >
            {hotNews.map((data, key) => (
              <SwiperSlide key={key}>
                <Card className="w-full h-full p-0 relative overflow-hidden">
                  {/* store image on swiper slide */}
                  <Link
                    href={`/homepage/news/${data?.id ?? 0}`}
                    className="block w-full h-full"
                  >
                    {isImageUrlValid(data.imageUrl) ? (
                      <img
                        src={data.imageUrl}
                        alt={data.title}
                        className="object-cover w-full lg:h-[300px] h-[200px]"
                      />
                    ) : (
                      <img
                        src={defaultHotNewsImage}
                        alt={data.title}
                        className="object-cover w-full lg:h-[300px] h-[200px]"
                      />
                    )}
                    <Typography className=" absolute bottom-0 left-0 right-0 bg-gradient-to-b from-transparent to-black bg-opacity-50 text-white py-3 px-2 rounded-b-xl">
                      {data.title}
                    </Typography>
                  </Link>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        {/* -------Box Card news------- */}
        <div className="grid z-10 lg:grid-cols-4 gap-4">
          {articles.map(article => {
            return <NewsCard key={article.id} articleId={article.id} />;
          })}
        </div>
        {/* ------"show more" text------ */}
        <div className="text-center justify-center">
          <Link
            href={'/homepage/news'}
            className="text-md mt-3 font-normal text-[#3AC4A0]"
          >
            {t('homepage.section2.text14')}
          </Link>
        </div>
      </div>
    </>
  );
}
