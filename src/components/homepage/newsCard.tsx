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
  const [open] = useState(false);

  // const stripHtmlTags = (html: any): string => {
  //   const tempElement = document.createElement('div');
  //   tempElement.innerHTML = html;
  //   return (tempElement.textContent ?? tempElement.innerText ?? '').toString();
  // };

  // const cleanedContent = stripHtmlTags(articleDetail?.content ?? '');

  // function LimitString({
  //   text,
  //   limit
  // }: {
  //   text: string;
  //   limit: number;
  // }): JSX.Element {
  //   const [showFullText] = useState(false);

  //   const truncatedText = showFullText ? text : text.slice(0, limit);

  //   return (
  //     <div>
  //       <p className="text-base font-normal text-[#7C7C7C] my-2">
  //         {truncatedText}...
  //       </p>
  //       {!showFullText && text.length > limit && (
  //         <button className="text-[#7555DA] text-base font-normal underline"></button>
  //       )}
  //     </div>
  //   );
  // }

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
      <div className="bg-[#FFF]  flex lg:col-span-2 xl:rounded-[18px] pb-6 w-full relative shadow-md">
        <div className="px-4 py-3 w-3/4">
          <div className="flex flex-row justify-between">
            {/* <p className="text-xs font-normal text-[#8A8A8A]">
              {formatDateToIndonesian(articleDetail?.publicationDate ?? '')}
            </p>
            <p className="text-xs font-normal text-[#7C7C7C]">
              {formatDateToIndonesianAgo(articleDetail?.publicationDate ?? '')}
            </p> */}
          </div>
          <Link
            href={`/homepage/news/${articleDetail?.id ?? 0}`}
            className="text-base font-semibold text-[#000] my-4"
          >
            {articleDetail?.title}
          </Link>
          {/* <Link
            className="text-sm"
            href={`/homepage/news/${articleDetail?.id ?? 0}`}
          >
            <LimitString text={cleanedContent} limit={100} />
          </Link> */}
          <div className="flex flex-row justify-between bottom-2 w-full gap-4 right-5 absolute">
            <div className="flex flex-row ms-7 justify-between">
              <p className="text-xs font-normal text-[#8A8A8A]">
                {formatDateToIndonesian(articleDetail?.publicationDate ?? '')}
              </p>
              <p className="text-xs font-normal text-[#7C7C7C]">
                {formatDateToIndonesianAgo(
                  articleDetail?.publicationDate ?? ''
                )}
              </p>
            </div>
          </div>
        </div>
        <div className="lg:px-4 lg:py-4 py-3 px-1 flex flex-col ">
          <Link href={`/homepage/news/${articleDetail?.id ?? 0}`}>
            {isImageValid ? (
              <img
                src={imageUrl}
                alt={articleDetail?.title}
                className="w-[153px] object-cover h-[160px] rounded-[18px]"
              />
            ) : (
              <img
                src={defaultNews}
                alt={articleDetail?.title}
                className="w-[153px] object-cover h-[160px] rounded-[18px]"
              />
            )}
          </Link>
        </div>
      </div>
    </>
  );
};

export default NewsCard;
