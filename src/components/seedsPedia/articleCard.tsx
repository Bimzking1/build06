'use-client';
import { getArticleById, postLike } from '@/repository/article.repository';
import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { id } from 'date-fns/locale';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

interface ArticleCardProps {
  articleId: string;
  articleName?: string;
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

const ArticleCard: React.FC<ArticleCardProps> = ({
  articleId,
  articleName
}) => {
  const [articleDetail, setArticleDetail] = useState<ArticleDetail | null>(
    null
  );
  const baseUrl =
    process.env.NEXT_PUBLIC_DOMAIN ?? 'https://user-dev-gcp.seeds.finance/';
  const [open, setOpen] = useState(false);
  const [formRequest] = useState<FormRequestInterface>(initialFormRequest);

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

  useEffect(() => {
    if (typeof articleId !== 'string') {
      // Check if articleId is a valid non-empty string
      const fetchArticleDetail = (): void => {
        getArticleById(articleId)
          .then(response => {
            if (response.status === 200) {
              setArticleDetail(response.news);
            }
            console.log(response);
          })
          .catch(error => {
            console.error('Error fetching article detail:', error);
          });
      };
      fetchArticleDetail();
    }
  }, [articleId]);
  const router = useRouter();

  const likeArticle = async (articleId: number): Promise<void> => {
    try {
      const accessToken = localStorage.getItem('accessToken');

      if (accessToken === null) {
        void router.push('/auth/verification');
        return;
      }
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

  // function formatDateToIndonesian(dateStr: string): string {
  //   try {
  //     const parsedDate = parseISO(dateStr);
  //     const formattedDate = format(parsedDate, 'd MMMM yyyy', { locale: id }); // id adalah kode bahasa Indonesia

  //     return formattedDate;
  //   } catch (error) {
  //     console.error('Error parsing or formatting date:', error);
  //     return ''; // Mengembalikan string kosong jika terjadi kesalahan
  //   }
  // }

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
        <Link
          href={`/seedspedia/articles/${articleDetail?.id ?? 0}/${
            articleName
              ?.replace(/[^\w\s]/gi, '')
              .split(' ')
              .join('-') as string
          }`}
        >
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
          <Link
            href={`/seedspedia/articles/${articleDetail?.id ?? 0}/${
              articleName
                ?.replace(/[^\w\s]/gi, '')
                .split(' ')
                .join('-') as string
            }`}
          >
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
            <div className="flex flex-row gap-1">
              {articleDetail?.is_liked !== undefined &&
              articleDetail.is_liked ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="#4CAF51"
                  className="cursor-pointer"
                  onClick={async () => {
                    await likeArticle(articleDetail?.id ?? 0);
                  }}
                >
                  <path
                    d="M7.00293 11.0779L11.0029 2.07788C11.7986 2.07788 12.5616 2.39395 13.1243 2.95656C13.6869 3.51917 14.0029 4.28223 14.0029 5.07788V9.07788H19.6629C19.9528 9.0746 20.24 9.13438 20.5045 9.2531C20.769 9.37181 21.0045 9.54661 21.1948 9.76539C21.385 9.98417 21.5254 10.2417 21.6063 10.5201C21.6871 10.7986 21.7064 11.0912 21.6629 11.3779L20.2829 20.3779C20.2106 20.8548 19.9684 21.2895 19.6008 21.6019C19.2333 21.9143 18.7653 22.0833 18.2829 22.0779H7.00293M7.00293 11.0779V22.0779M7.00293 11.0779H4.00293C3.4725 11.0779 2.96379 11.2886 2.58872 11.6637C2.21364 12.0387 2.00293 12.5474 2.00293 13.0779V20.0779C2.00293 20.6083 2.21364 21.117 2.58872 21.4921C2.96379 21.8672 3.4725 22.0779 4.00293 22.0779H7.00293"
                    stroke="#4CAF51"
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
              <span>{articleDetail?.total_likes}</span>
            </div>
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

export default ArticleCard;
