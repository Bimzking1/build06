'use-client';
import { getArticleByIdHome, postLike } from '@/repository/article.repository';
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

interface FormRequestInterface {
  comment: string;
}

const initialFormRequest = {
  comment: ''
};

const ArticleCard: React.FC<ArticleCardProps> = ({ articleId }) => {
  const [articleDetail, setArticleDetail] = useState<ArticleDetail | null>(
    null
  );
  const baseUrl =
    process.env.NEXT_PUBLIC_DOMAIN ?? 'https://user-dev-gcp.seeds.finance/';
  const [open, setOpen] = useState(false);
  const [formRequest] = useState<FormRequestInterface>(initialFormRequest);

  const stripHtmlTags = (html: any): string => {
    const tempElement = document.createElement('div');
    tempElement.innerHTML = html;
    return (tempElement.textContent ?? tempElement.innerText ?? '').toString();
  };

  const cleanedContent = stripHtmlTags(articleDetail?.content ?? '');

  function LimitString({
    text,
    limit
  }: {
    text: string;
    limit: number;
  }): JSX.Element {
    const [showFullText] = useState(false);

    const truncatedText = showFullText ? text : text.slice(0, limit);

    return (
      <div>
        <p className="text-sm font-normal text-[#7C7C7C] my-2">
          {truncatedText}...
        </p>
        {!showFullText && text.length > limit && (
          <button className="text-[#7555DA] text-base font-normal underline"></button>
        )}
      </div>
    );
  }

  useEffect(() => {
    if (typeof articleId !== 'string') {
      // Check if articleId is a valid non-empty string
      const fetchArticleDetail = (): void => {
        getArticleByIdHome(articleId)
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

  const likeArticle = async (articleId: number): Promise<void> => {
    try {
      const response = await postLike(formRequest, articleId);
      if (response.status === 200) {
        if (response.is_liked === true) {
          setArticleDetail(prevArticleDetail => {
            if (prevArticleDetail !== null) {
              return {
                ...prevArticleDetail,
                total_likes: prevArticleDetail?.total_likes + 1,
                is_liked: true
              };
            }
            return prevArticleDetail;
          });
        } else {
          setArticleDetail(prevArticleDetail => {
            if (prevArticleDetail !== null) {
              return {
                ...prevArticleDetail,
                total_likes: prevArticleDetail?.total_likes - 1,
                is_liked: false
              };
            }
            return prevArticleDetail;
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
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

  function copyValueWithUrl(valueToCopy: number): boolean {
    const textToCopy = `${baseUrl}/homepage/articles/${valueToCopy}`;

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
        <div className="px-4 pb-3 w-3/4">
          <h1 className="text-base font-semibold text-[#000] my-4">
            {articleDetail?.title !== undefined &&
            articleDetail.title.length > 45
              ? `${articleDetail.title.slice(0, 45)}...`
              : articleDetail?.title}
          </h1>
          <Link
            className="text-sm"
            href={`/homepage/articles/${articleDetail?.id ?? 0}`}
          >
            <LimitString text={cleanedContent} limit={80} />
          </Link>
        </div>
        <div className="lg:px-4 lg:py-4 py-3 px-1 flex flex-col ">
          <Link href={`/homepage/articles/${articleDetail?.id ?? 0}`}>
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
          <div className="flex flex-row justify-between mt-4 bottom-2 w-full gap-4 right-5 absolute">
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
            <div className="flex flex-row gap-2">
              <div className="flex flex-row gap-1">
                {articleDetail?.is_liked !== undefined &&
                articleDetail.is_liked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="#3AC4A0"
                    className="cursor-pointer"
                    onClick={async () => {
                      await likeArticle(articleDetail?.id ?? 0);
                    }}
                  >
                    <path
                      d="M7.00293 11.0779L11.0029 2.07788C11.7986 2.07788 12.5616 2.39395 13.1243 2.95656C13.6869 3.51917 14.0029 4.28223 14.0029 5.07788V9.07788H19.6629C19.9528 9.0746 20.24 9.13438 20.5045 9.2531C20.769 9.37181 21.0045 9.54661 21.1948 9.76539C21.385 9.98417 21.5254 10.2417 21.6063 10.5201C21.6871 10.7986 21.7064 11.0912 21.6629 11.3779L20.2829 20.3779C20.2106 20.8548 19.9684 21.2895 19.6008 21.6019C19.2333 21.9143 18.7653 22.0833 18.2829 22.0779H7.00293M7.00293 11.0779V22.0779M7.00293 11.0779H4.00293C3.4725 11.0779 2.96379 11.2886 2.58872 11.6637C2.21364 12.0387 2.00293 12.5474 2.00293 13.0779V20.0779C2.00293 20.6083 2.21364 21.117 2.58872 21.4921C2.96379 21.8672 3.4725 22.0779 4.00293 22.0779H7.00293"
                      stroke="#3AC4A0"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                    className="cursor-pointer"
                    onClick={async () => {
                      await likeArticle(articleDetail?.id ?? 0);
                    }}
                  >
                    <path
                      d="M7.00293 11.0779L11.0029 2.07788C11.7986 2.07788 12.5616 2.39395 13.1243 2.95656C13.6869 3.51917 14.0029 4.28223 14.0029 5.07788V9.07788H19.6629C19.9528 9.0746 20.24 9.13438 20.5045 9.2531C20.769 9.37181 21.0045 9.54661 21.1948 9.76539C21.385 9.98417 21.5254 10.2417 21.6063 10.5201C21.6871 10.7986 21.7064 11.0912 21.6629 11.3779L20.2829 20.3779C20.2106 20.8548 19.9684 21.2895 19.6008 21.6019C19.2333 21.9143 18.7653 22.0833 18.2829 22.0779H7.00293M7.00293 11.0779V22.0779M7.00293 11.0779H4.00293C3.4725 11.0779 2.96379 11.2886 2.58872 11.6637C2.21364 12.0387 2.00293 12.5474 2.00293 13.0779V20.0779C2.00293 20.6083 2.21364 21.117 2.58872 21.4921C2.96379 21.8672 3.4725 22.0779 4.00293 22.0779H7.00293"
                      stroke="#262626"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                <span className="mx-2 text-[#3AC4A0]">
                  {articleDetail?.total_likes}
                </span>
              </div>
              {/* <div className="flex flex-row gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
              >
                <path
                  d="M21.0029 11.5779C21.0064 12.8978 20.698 14.1998 20.1029 15.3779C19.3974 16.7897 18.3127 17.9771 16.9704 18.8072C15.6281 19.6373 14.0812 20.0773 12.5029 20.0779C11.1831 20.0814 9.88104 19.773 8.70293 19.1779L3.00293 21.0779L4.90293 15.3779C4.30786 14.1998 3.99949 12.8978 4.00293 11.5779C4.00354 9.99967 4.44354 8.45276 5.27365 7.11046C6.10376 5.76816 7.29118 4.68348 8.70293 3.97791C9.88104 3.38284 11.1831 3.07447 12.5029 3.07791H13.0029C15.0873 3.1929 17.056 4.07267 18.5321 5.54877C20.0082 7.02487 20.8879 8.99356 21.0029 11.0779V11.5779Z"
                  stroke="#262626"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>{articleDetail?.total_comments}</span>
            </div> */}
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
      </div>
    </>
  );
};

export default ArticleCard;
