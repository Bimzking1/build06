import ArticleCard from '@/components/article/ArticleList';
import Footer from '@/components/layouts/Footer';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import useService from '@/hooks/useFetch';
import { getArticle } from '@/repository/article.repository';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

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

export interface PlayParams {
  language: string;
  search: string;
  limit: number;
  page: number;
  category: string;
}

const initialFilter = {
  search: '',
  limit: 9,
  page: 1,
  language: '',
  source: '',
  category: 'all'
};

const initialData = {
  news: []
};

export default function ArticleList(): React.ReactElement {
  const [filter, setFilter] = useState(initialFilter);
  const { data } = useService(getArticle, filter, 500);

  const dataArticle = useMemo(() => {
    if (typeof data === 'undefined' || data === null || data === '') {
      return initialData;
    }
    return data;
  }, [data]);

  const updateParams = (direction: 'decrease' | 'increase'): void => {
    if (direction === 'decrease' && filter.page > 1) {
      setFilter(prevFilter => ({
        ...prevFilter,
        page: prevFilter.page - 1
      }));
    } else if (direction === 'increase') {
      setFilter(prevFilter => ({
        ...prevFilter,
        page: prevFilter.page + 1
      }));
    }
  };
  const { t } = useTranslation();

  // const timeAgo = (dateString: string): string => {
  //   const createdDate = new Date(dateString);
  //   const currentDate = new Date();
  //   const timeDifference = currentDate.getTime() - createdDate.getTime();
  //   const secondsDifference = Math.floor(timeDifference / 1000);

  //   if (secondsDifference < 60) {
  //     return `${secondsDifference} seconds ago`;
  //   } else if (secondsDifference < 3600) {
  //     const minutes = Math.floor(secondsDifference / 60);
  //     return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  //   } else if (secondsDifference < 86400) {
  //     const hours = Math.floor(secondsDifference / 3600);
  //     return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  //   } else {
  //     const days = Math.floor(secondsDifference / 86400);
  //     return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  //   }
  // };

  return (
    <>
      <PageGradient className="z-0 relative overflow-hidden flex flex-col justify-center mx-5 lg:mx-20">
        <div className="flex z-10 flex-col lg:flex-row justify-between">
          <div>
            <div className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r mt-3 xl:mt-5 from-[#9A76FE] to-[#4FE6AF]">
              {t('articleList.text1')}
            </div>
          </div>
          <div className="lg:flex justify-end mt-4 ">
            <div className="hidden lg:block mt-2 font-normal text-base mx-3 text-[#7C7C7C]">
              {t('articleList.text3')} :
            </div>
            <select
              className="me-5 hidden lg:block text-base font-semibold"
              aria-label="All"
            >
              <option value="option1">All</option>
              <option value="option2">All</option>
            </select>
            <input
              type="search"
              className="w-full lg:w-[300px] lg:h-[40px] rounded-3xl border-[1px] px-[8px] justify-between py-[12px] text-[#7C7C7C] "
              placeholder="Search"
              aria-label="Search"
              aria-describedby="button-addon2"
              value={filter.search}
              onChange={e => {
                setFilter({
                  ...filter,
                  search: e.target.value
                });
                void getArticle({
                  ...filter,
                  search: e.target.value
                });
              }}
            />
          </div>
        </div>
        <div className="lg:hidden z-10 flex justify-end mt-5">
          <div className=" justify-end lg:hidden first-line:mt-2 font-normal text-base mx-3 text-[#7C7C7C]">
            {t('articleList.text3')} :
          </div>
          <select
            className="me-5 justify-end lg:hidden text-base font-semibold"
            aria-label="All"
          >
            <option value="option1">All</option>
            <option value="option2">All</option>
          </select>
        </div>
        <div className="grid z-10 lg:grid-cols-6 gap-4 mt-8">
          {dataArticle?.news.map((data: any) => {
            return <ArticleCard key={data.id} articleId={data.id} />;
          })}
        </div>

        <div className="flex justify-center mt-8">
          <div className="mt-5 pb-10 pagination">
            <div className="bg-white rounded-full cursor-pointer flex flex-row gap-3 p-2 shadow-lg">
              <div
                className="p-2"
                onClick={() => {
                  updateParams('decrease');
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M12.5 15L7.5 10L12.5 5"
                    stroke="#7C7C7C"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div
                className="rounded-full p-2 bg-gradient-to-r cursor-pointer from-[#9A76FE] to-[#4FE6AF]"
                onClick={() => {
                  updateParams('increase');
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  <path
                    d="M7.5 15L12.5 10L7.5 5"
                    stroke="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </PageGradient>
      <Footer />
    </>
  );
}
