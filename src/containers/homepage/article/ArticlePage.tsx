import ArticleCard from '@/components/homepage/articleCard';
import { getArticle } from '@/repository/article.repository';
import LanguageContext from '@/store/language/language-context';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Slider from 'react-slick';

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

export default function ArticlePage(): React.ReactElement {
  const { t } = useTranslation();
  const languageCtx = useContext(LanguageContext);
  const [articles, setArticles] = useState<Article[]>([]);
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
    source: 'articles',
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
        category: params.category
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

  const categoryItemClass = 'py-1 rounded-full text-center w-full text-xs px-2';

  const categories = [
    'All',
    'General',
    'Crypto',
    'Us Stocks',
    'Indo Stocks',
    'Commodities',
    'Indices',
    'Forex',
    'Finance'
  ];

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      await fetchArticles();
    };

    fetchData().catch(error => {
      console.error('Error in fetchData:', error);
    });
  }, [params]);

  const updateCategory = (newCategory: string): void => {
    setParams(prevParams => ({
      ...prevParams,
      category: newCategory.toLowerCase()
    }));

    setActiveCategory(newCategory);
  };

  return (
    <div className="w-full">
      <div className="lg:hidden mt-4 ">
        <Slider
          slidesToShow={4}
          speed={500}
          initialSlide={0}
          responsive={[
            {
              breakpoint: 768,
              settings: {
                dots: false,
                slidesToShow: 4,
                slidesToScroll: 1
              }
            }
          ]}
        >
          {categories.map((category, key) => (
            <div
              key={key}
              className={`${categoryItemClass} ${
                activeCategory === category
                  ? 'bg-[#3AC4A0] text-white text-xs'
                  : 'text-[#3AC4A0] bg-[#F9F9F9] text-xs'
              }`}
              onClick={() => {
                updateCategory(category);
              }}
            >
              {category}
            </div>
          ))}
        </Slider>
      </div>

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
            activeCategory === 'general'
              ? 'bg-[#3AC4A0] text-white'
              : 'text-[#3AC4A0] bg-[#F9F9F9]'
          }`}
          onClick={() => {
            updateCategory('general');
          }}
        >
          General
        </button>
        <button
          className={`py-1 rounded-full text-xs px-2 ${
            activeCategory === 'crypto'
              ? 'bg-[#3AC4A0] text-white'
              : 'text-[#3AC4A0] bg-[#F9F9F9]'
          }`}
          onClick={() => {
            updateCategory('crypto');
          }}
        >
          Crypto
        </button>

        <button
          className={`py-1 rounded-full text-xs px-2 ${
            activeCategory === 'usstocks'
              ? 'bg-[#3AC4A0] text-white'
              : 'text-[#3AC4A0] bg-[#F9F9F9]'
          }`}
          onClick={() => {
            updateCategory('usstocks');
          }}
        >
          Us Stocks
        </button>
        <button
          className={`py-1 rounded-full text-xs px-2 ${
            activeCategory === 'indostocks'
              ? 'bg-[#3AC4A0] text-white'
              : 'text-[#3AC4A0] bg-[#F9F9F9]'
          }`}
          onClick={() => {
            updateCategory('indostocks');
          }}
        >
          Indo Stocks
        </button>
        <button
          className={`py-1 rounded-full text-xs px-2 ${
            activeCategory === 'commodities'
              ? 'bg-[#3AC4A0] text-white'
              : 'text-[#3AC4A0] bg-[#F9F9F9]'
          }`}
          onClick={() => {
            updateCategory('commodities');
          }}
        >
          Commodities
        </button>
        <button
          className={`py-1 rounded-full text-xs px-2 ${
            activeCategory === 'indices'
              ? 'bg-[#3AC4A0] text-white'
              : 'text-[#3AC4A0] bg-[#F9F9F9]'
          }`}
          onClick={() => {
            updateCategory('indices');
          }}
        >
          Indices
        </button>
        <button
          className={`py-1 rounded-full text-xs px-2 ${
            activeCategory === 'forex'
              ? 'bg-[#3AC4A0] text-white'
              : 'text-[#3AC4A0] bg-[#F9F9F9]'
          }`}
          onClick={() => {
            updateCategory('forex');
          }}
        >
          Forex
        </button>
        <button
          className={`py-1 rounded-full text-xs px-2 ${
            activeCategory === 'finance'
              ? 'bg-[#3AC4A0] text-white'
              : 'text-[#3AC4A0] bg-[#F9F9F9]'
          }`}
          onClick={() => {
            updateCategory('finance');
          }}
        >
          Finance
        </button>
      </div>
      <div className="grid justify-between z-10 lg:grid-cols-4 gap-4 mt-8">
        {articles.map(article => {
          return <ArticleCard key={article.id} articleId={article.id} />;
        })}
      </div>
      <div className="text-center justify-center mt-3">
        <Link
          href={'/homepage/articles'}
          className="text-md mt-3 font-normal text-[#3AC4A0]"
        >
          {t('homepage.section2.text14')}
        </Link>
      </div>
    </div>
  );
}
