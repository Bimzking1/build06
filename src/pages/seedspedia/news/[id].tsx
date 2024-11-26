'use-client';
import Footer from '@/components/layouts/Footer';
import Button from '@/components/ui/button/Button';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import {
  getArticle,
  getArticleById,
  getArticleComment,
  postComment
} from '@/repository/article.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { Input } from '@material-tailwind/react';
import { format, parseISO } from 'date-fns';
import { id as ID } from 'date-fns/locale';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface UserData {
  name: string;
  seedsTag: string;
  email: string;
  pin: string;
  avatar: string;
  bio: string;
  birthDate: string;
  phone: string;
  _pin: string;
}

export interface ArticleListRoot {
  promoCodeList: Article[];
  metadata: Metadata;
}
interface Article {
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

export interface Metadata {
  currentPage: number;
  limit: number;
  totalPage: number;
  totalRow: number;
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

interface ArticleComment {
  id: string;
  name: string;
  avatar: string;
  comment: string;
  created_at: string;
}

const params = {
  page: 1,
  limit: 8,
  order_by: 'scheduled_at,DESC',
  source: 'news',
  language: '',
  search: '',
  category: 'all'
};

export default function ArticleDetailPage(): JSX.Element {
  const router = useRouter();
  const { id } = router.query;
  const accessToken =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [comment, setComment] = useState('');
  // const [liked, setLiked] = useState(false);
  const [articleDetail, setArticleDetail] = useState<ArticleDetail | null>(
    null
  );
  const { t } = useTranslation();
  const [articleComment, setArticleComment] = useState<ArticleComment[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [open, setOpen] = useState(false);
  const [formRequest, setFormRequest] =
    useState<FormRequestInterface>(initialFormRequest);
  const baseUrl =
    process.env.NEXT_PUBLIC_DOMAIN ?? 'https://user-dev-gcp.seeds.finance/';

  async function fetchArticles(): Promise<void> {
    try {
      const response = await getArticle(params);
      if (response.status === 200) {
        setArticles(response.data);
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
    };

    fetchData().catch(error => {
      console.error('Error in fetchData:', error);
    });
  }, []);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const response = await getUserInfo();
        setUserInfo(response);
      } catch (error) {
        console.log(error);
      }
    };

    void fetchData();
  }, []);

  useEffect(() => {
    if (typeof id === 'string') {
      // Check if id is a valid string
      const fetchArticleDetail = (): void => {
        getArticleById(id)
          .then(response => {
            if (response.status === 200) {
              setArticleDetail(response.news);
            }
          })
          .catch(error => {
            console.error('Error fetching article detail:', error);
          });
      };
      const fetchArticleComment = (): void => {
        getArticleComment(id)
          .then(response => {
            if (response.status === 200) {
              setArticleComment(response.comments);
            }
          })
          .catch(error => {
            console.error('Error fetching article detail:', error);
          });
      };
      fetchArticleComment();
      fetchArticleDetail();
    }
  }, [id]);

  function copyValueWithUrl(valueToCopy: number): boolean {
    const textToCopy = `${baseUrl}/seedspedia/news/${valueToCopy}`;

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

  function formatDateToIndonesian(dateStr: string): string {
    try {
      const parsedDate = parseISO(dateStr);
      const formattedDate = format(parsedDate, 'd MMMM yyyy', {
        locale: ID
      });

      return formattedDate;
    } catch (error) {
      console.error('Error parsing or formatting date:', error);
      return '';
    }
  }

  const updateComment = (comment: string): void => {
    setComment(comment);
    setFormRequest(prevState => ({
      ...prevState,
      comment
    }));
    console.log(comment);
  };

  const submitComment = async (articleId: number): Promise<void> => {
    try {
      setLoading(true);
      const response = await postComment(formRequest, articleId);
      if (response.status === 200) {
        setLoading(false);
        setOpen(true);
        setTimeout(() => {
          setOpen(false);
        }, 3000);
        setComment('');
        setFormRequest(prevState => ({
          ...prevState,
          comment: ''
        }));
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function splitContentIntoParagraphs(content: any): string[] {
    const MAX_PARAGRAPH_LENGTH = 400;
    const paragraphs = [];
    let currentParagraph = '';

    for (const char of content) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      currentParagraph += char;

      if (currentParagraph.length >= MAX_PARAGRAPH_LENGTH && char === '.') {
        paragraphs.push(currentParagraph);
        currentParagraph = '';
      }
    }

    if (currentParagraph !== undefined) {
      paragraphs.push(currentParagraph);
    }

    return paragraphs;
  }

  const contentParagraphs = splitContentIntoParagraphs(
    articleDetail?.content ?? ''
  );

  function formatDate(inputDate: string): string {
    const date = new Date(inputDate);

    date.setMilliseconds(0);

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('en-US', options).replace(',', '');
  }

  function isImageUrlValid(url: string): boolean {
    return url?.startsWith('http://') || url?.startsWith('https://');
  }

  if (articleDetail == null) {
    return <p>Loading...</p>;
  }

  // const customGradient = (
  //   <>
  //     <span className="-z-0 absolute top-0 mt-[50%] -left-10 w-60 h-48 bg-seeds-green blur-[90px] rotate-45" />
  //     <span className="-z-0 absolute top-0 mt-[55%] left-0 w-24 h-24 bg-seeds-green blur-[90px]" />
  //     {/* <span className="-z-0 absolute -bottom-28 left-16 w-48 h-32 bg-seeds-purple-2 blur-[90px] rotate-45" /> */}
  //     <span className="-z-0 absolute top-64 -right-4 w-60 h-48 bg-seeds-purple blur-[140px] rotate-45 rounded-full" />
  //     <span className="-z-0 absolute bottom-36 right-0 w-32 h-32 bg-seeds-purple-2 blur-[140px] rotate-90 rounded-full" />
  //   </>
  // );

  const defaultNews = '/assets/default-news.png';
  const imageUrl = articleDetail?.imageUrl;
  const isImageValid = isImageUrlValid(imageUrl);
  return (
    <>
      <PageGradient className="z-0">
        <div className="z-0 relative overflow-hidden flex flex-col justify-center mx-5 lg:mx-20">
          {open && (
            <div
              id="myToast"
              className="fixed right-10 z-50 bottom-10 px-5 py-4 border-r-8 border-blue-500 bg-white drop-shadow-lg"
            >
              <p className="text-sm">
                <span className="mr-2 inline-block px-3 py-1 rounded-full bg-blue-500 text-white font-extrabold">
                  i
                </span>
                Link copied to clipboard
              </p>
            </div>
          )}
          <h1 className="my-8 text-lg lg:text-5xl py-3 font-semibold bg-clip-text text-black">
            {articleDetail.title}
          </h1>
          <div className="flex flex-row justify-between my-4">
            <div className="flex flex-col">
              <h4 className="text-xl font-semibold text-[#262626]">
                {articleDetail.author}
              </h4>
              <p className="text-sm font-semibold text-[#8A8A8A]">
                {formatDateToIndonesian(articleDetail?.publicationDate)}
              </p>
            </div>
            <div className="flex flex-row gap-3">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => {
                  copyValueWithUrl(articleDetail?.id ?? 0);
                }}
              >
                <path
                  d="M21.5612 19.6496C20.8499 19.6496 20.1936 19.8897 19.6795 20.2907L14.5087 16.6916C14.5953 16.2344 14.5953 15.7659 14.5087 15.3087L19.6795 11.7096C20.1936 12.1106 20.8499 12.3507 21.5612 12.3507C23.2132 12.3507 24.5558 11.059 24.5558 9.46953C24.5558 7.8801 23.2132 6.58838 21.5612 6.58838C19.9091 6.58838 18.5665 7.8801 18.5665 9.46953C18.5665 9.74804 18.6064 10.0145 18.6838 10.2691L13.7726 13.6904C13.0439 12.7612 11.8859 12.1586 10.5808 12.1586C8.3747 12.1586 6.58789 13.8777 6.58789 16.0001C6.58789 18.1226 8.3747 19.8417 10.5808 19.8417C11.8859 19.8417 13.0439 19.239 13.7726 18.3099L18.6838 21.7312C18.6064 21.9857 18.5665 22.2546 18.5665 22.5308C18.5665 24.1202 19.9091 25.4119 21.5612 25.4119C23.2132 25.4119 24.5558 24.1202 24.5558 22.5308C24.5558 20.9413 23.2132 19.6496 21.5612 19.6496ZM21.5612 8.22103C22.2774 8.22103 22.8588 8.78046 22.8588 9.46953C22.8588 10.1586 22.2774 10.718 21.5612 10.718C20.8449 10.718 20.2635 10.1586 20.2635 9.46953C20.2635 8.78046 20.8449 8.22103 21.5612 8.22103ZM10.5808 18.113C9.37042 18.113 8.38468 17.1646 8.38468 16.0001C8.38468 14.8357 9.37042 13.8873 10.5808 13.8873C11.7911 13.8873 12.7768 14.8357 12.7768 16.0001C12.7768 17.1646 11.7911 18.113 10.5808 18.113ZM21.5612 23.7793C20.8449 23.7793 20.2635 23.2198 20.2635 22.5308C20.2635 21.8417 20.8449 21.2823 21.5612 21.2823C22.2774 21.2823 22.8588 21.8417 22.8588 22.5308C22.8588 23.2198 22.2774 23.7793 21.5612 23.7793Z"
                  fill="#262626"
                />
              </svg>
            </div>
          </div>

          <div className="w-full">
            {isImageValid ? (
              <img
                src={imageUrl}
                alt="Image"
                className="w-full object-cover rounded-2xl lg:h-[676px]"
              />
            ) : (
              <img
                src={defaultNews}
                alt="Image"
                className="w-full object-cover rounded-2xl lg:h-[676px]"
              />
            )}
          </div>
          <div className="flex flex-col border-b-4 pb-5 border-[#E9E9E9]">
            {contentParagraphs.map((paragraph, index) => (
              <div key={index} className=" py-4">
                <p className="w-full">{paragraph}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col px-2">
            {accessToken !== null && userInfo !== null ? (
              <div className="flex flex-row gap-3 my-6 w-full">
                <img
                  src={userInfo.avatar}
                  className="xl:w-[75px] h-full rounded-full"
                  alt=""
                />
                <div className="flex flex-col gap-2 w-full">
                  <h1 className="text-[#201B1C] text-lg font-semibold">
                    {userInfo.name}
                  </h1>
                  <div className="w-full rounded-lg border-1 border border-[#3AC4A0]">
                    <Input
                      placeholder="Type your comment.."
                      className="focus:outline-none "
                      onChange={e => {
                        updateComment(e.target.value);
                      }}
                    />
                  </div>
                </div>
                <div className="pt-7">
                  <Button
                    disabled={comment === '' && loading}
                    label="Comment"
                    containerClasses="xl:w-[196px] h-full p-1 rounded-full bg-[#3AC4A0]"
                    onClick={async () => {
                      await submitComment(articleDetail.id);
                    }}
                  />
                </div>
              </div>
            ) : (
              <></>
            )}
            <h1 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF] w-max">
              {articleDetail.total_comments} Comments
            </h1>
            {articleDetail.total_comments !== 0 ? (
              <div className="flex flex-col">
                {articleComment.map(article => (
                  <div
                    key={article?.id}
                    className="flex flex-col mt-5 bg-[#E9E9E94D]/30 p-4 gap-3 rounded-xl"
                  >
                    <div className="flex flex-row">
                      <img
                        src={article?.avatar}
                        alt=""
                        className="xl:w-[48px] xl:h-[48px] rounded-full"
                      />
                      <div className="xl:ml-4">
                        <h1 className="text-[#201B1C] text-lg font-semibold">
                          {article?.name}
                        </h1>
                        <p className="text-[#7C7C7C] text-sm font-normal">
                          {formatDate(article?.created_at)}
                        </p>
                      </div>
                    </div>
                    <p className="text-[#201B1C] text-base font-normal">
                      {article?.comment}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="mt-12 flex justify-between">
            <p className="text-3xl font-bold ">{t('articleList.text6')} </p>
            <Link href={'/seedspedia'}>
              <p className="flex text-md border border-1 p-2 font-semibold">
                {t('articleList.text8')}
                <span className="mt-1">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.16602 10H15.8327"
                      stroke="#262626"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10 4.16675L15.8333 10.0001L10 15.8334"
                      stroke="#262626"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </p>
            </Link>
          </div>
          <div className="grid lg:grid-cols-6 gap-4 rounded-2xl py-10">
            {articles.slice(0, 3).map(article => (
              <div
                key={article.id}
                className="p-4 border bg-[#F9F9F9] gap-[16px] lg:col-span-2 border-gray-300 rounded-3xl w-full"
              >
                <Link href={`/seedspedia/news/${article.id}`}>
                  <div className="flex justify-between">
                    <div className="flex-row">
                      <div className="flex justify-between flex-col">
                        <div className="mb-auto">
                          <p className="mt-2 font-bold text-base">
                            {article.title}
                          </p>
                        </div>

                        <div>
                          <div className="flex mt-2 justify-between">
                            <p className="mt-1 font-normal text-sm text-[#8A8A8A]">
                              {formatDateToIndonesian(
                                articleDetail?.publicationDate
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="mt-1 w-[100px] h-[100px]">
                        {isImageValid ? (
                          <img
                            src={article?.imageUrl}
                            alt=""
                            className="w-[75px] h-full rounded-2xl"
                          />
                        ) : (
                          <img
                            src={defaultNews}
                            alt=""
                            className="w-[75px] h-full rounded-2xl"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </PageGradient>
      <Footer />
    </>
  );
}
