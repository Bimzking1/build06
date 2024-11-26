'use-client';
import { getArticleById } from '@/repository/article.repository';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
interface ArticleCardProps {
  articleId: string;
}

interface ArticleDetail {
  id: number;
  title: string;
  author: string;
  link: string;
  videoUrl: string;
  imageUrl: string;
  content: string;
  sourceId: string;
  language: string;
  category: string;
  publicationDate: string;
  total_likes: number;
  total_comments: number;
  total_shares: number;
  is_liked: boolean;
}

const NewsCard: React.FC<ArticleCardProps> = ({ articleId }) => {
  const [articleDetail, setArticleDetail] = useState<ArticleDetail | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const baseUrl =
    process.env.NEXT_PUBLIC_DOMAIN ?? 'https://user-dev-gcp.seeds.finance/';

  function copyValueWithUrl(valueToCopy: number): boolean {
    const textToCopy = `${baseUrl}/article/${valueToCopy}`;

    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;
    document.body.appendChild(textArea);
    textArea.select();

    try {
      const copied = document.execCommand('copy');
      if (copied) {
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 3000);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error('Error copying text: ', err);
      return false;
    } finally {
      document.body.removeChild(textArea);
    }
  }

  useEffect(() => {
    if (typeof articleId !== 'string') {
      const fetchArticleDetail = (): void => {
        getArticleById(articleId)
          .then(response => {
            if (response.status === 200) {
              setArticleDetail(response.news);
            }
          })
          .catch(error => {
            console.error('Error fetching article detail:', error);
          });
      };
      fetchArticleDetail();
    }
  }, [articleId]);

  function isImageUrlValid(url: string): boolean {
    return url?.startsWith('http://') || url?.startsWith('https://');
  }

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

  const defaultNews = '/assets/default-news.png';
  const imageUrl = articleDetail?.imageUrl ?? defaultNews;
  const isImageValid = isImageUrlValid(imageUrl);
  return (
    <>
      {open && (
        <div
          id="myToast"
          className="fixed right-10 z-50 bottom-10 px-5 py-4 border-r-8 border-blue-500 bg-white drop-shadow-lg"
        >
          <p className="text-sm">
            <span className="mr-2 inline-block px-3 py-1 rounded-full bg-blue-500 text-white font-extrabold">
              i
            </span>
            Article copied to Clipboard
          </p>
        </div>
      )}
      <div className="bg-[#FFF] lg:col-span-2 xl:rounded-[18px] pb-6 w-full relative shadow-md">
        <Link href={`/seedspedia/news/${articleDetail?.id ?? 0}`}>
          {isImageValid ? (
            <img
              src={imageUrl}
              alt={articleDetail?.title}
              className="w-full h-[238px] rounded-t-[18px]"
            />
          ) : (
            <img
              src={defaultNews}
              alt={articleDetail?.title}
              className="w-full h-[238px] rounded-t-[18px]"
            />
          )}
        </Link>
        <div className="p-4">
          <Link href={`/seedspedia/news/${articleDetail?.id ?? 0}`}>
            <h1 className="text-xl text-justify font-semibold text-[#000]">
              {articleDetail?.title !== undefined &&
              articleDetail?.title.length > 60
                ? `${articleDetail?.title.substring(0, 60)}...`
                : articleDetail?.title}
            </h1>
          </Link>
        </div>
        <div className="justify-between flex flex-row mx-4">
          <div className="flex flex-row ">
            <p className="text-xs font-normal text-[#8A8A8A]">
              {formatDateToIndonesian(articleDetail?.publicationDate ?? '')}
            </p>
            <p className="text-xs font-normal text-[#7C7C7C]">
              {formatDateToIndonesianAgo(articleDetail?.publicationDate ?? '')}
            </p>
          </div>
          <div className="flex flex-row  gap-4 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 25 25"
              fill="none"
              className="cursor-pointer"
              onClick={() => {
                copyValueWithUrl(articleDetail?.id ?? 0);
              }}
            >
              <path
                d="M18.0059 8.07788C19.6627 8.07788 21.0059 6.73474 21.0059 5.07788C21.0059 3.42103 19.6627 2.07788 18.0059 2.07788C16.349 2.07788 15.0059 3.42103 15.0059 5.07788C15.0059 6.73474 16.349 8.07788 18.0059 8.07788Z"
                stroke="#262626"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M6.00586 15.0779C7.66271 15.0779 9.00586 13.7347 9.00586 12.0779C9.00586 10.421 7.66271 9.07788 6.00586 9.07788C4.34901 9.07788 3.00586 10.421 3.00586 12.0779C3.00586 13.7347 4.34901 15.0779 6.00586 15.0779Z"
                stroke="#262626"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18.0059 22.0779C19.6627 22.0779 21.0059 20.7347 21.0059 19.0779C21.0059 17.421 19.6627 16.0779 18.0059 16.0779C16.349 16.0779 15.0059 17.421 15.0059 19.0779C15.0059 20.7347 16.349 22.0779 18.0059 22.0779Z"
                stroke="#262626"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.5957 13.5879L15.4257 17.5679"
                stroke="#262626"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.4157 6.58789L8.5957 10.5679"
                stroke="#262626"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewsCard;
