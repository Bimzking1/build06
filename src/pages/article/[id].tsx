'use-client';
import Button from '@/components/ui/button/Button';
import {
  getArticle,
  getArticleById,
  getArticleComment,
  postComment,
  postLike
} from '@/repository/article.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { Input } from '@material-tailwind/react';
import { format, parseISO } from 'date-fns';
import { id as ID } from 'date-fns/locale';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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
  language: '',
  source: '',
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
  const [articleDetail, setArticleDetail] = useState<ArticleDetail | null>(
    null
  );
  const [articleComment, setArticleComment] = useState<ArticleComment[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [open, setOpen] = useState(false);
  const [formRequest, setFormRequest] =
    useState<FormRequestInterface>(initialFormRequest);

  async function fetchArticles(): Promise<void> {
    try {
      const response = await getArticle(params);
      if (response.status === 200) {
        setArticles(response.news);
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
              console.log(response.news);
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

  function formatDateToIndonesian(dateStr: string): string {
    try {
      const parsedDate = parseISO(dateStr);
      const formattedDate = format(parsedDate, 'd MMMM yyyy', {
        locale: ID
      }); // id adalah kode bahasa Indonesia

      return formattedDate;
    } catch (error) {
      console.error('Error parsing or formatting date:', error);
      return ''; // Mengembalikan string kosong jika terjadi kesalahan
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

  function formatDate(inputDate: string): string {
    const date = new Date(inputDate);
    // Remove milliseconds to avoid precision issues
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

  const defaultNews = '/assets/default-news.png';
  const imageUrl = articleDetail?.imageUrl;
  const isImageValid = isImageUrlValid(imageUrl);
  return (
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
            You have successfully created a comment
          </p>
        </div>
      )}
      <h1 className="my-8 text-5xl font-semibold bg-clip-text text-transparent bg-gradient-to-r py-4 from-[#9A76FE] to-[#4FE6AF]">
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
          {articleDetail?.is_liked !== undefined && articleDetail.is_liked ? (
            <div
              className="rounded-full p-1 w-8 h-8 bg-green-500 cursor-pointer"
              onClick={async () => {
                await likeArticle(articleDetail?.id ?? 0);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M7 11L11 2C11.7956 2 12.5587 2.31607 13.1213 2.87868C13.6839 3.44129 14 4.20435 14 5V9H19.66C19.9499 8.99672 20.2371 9.0565 20.5016 9.17522C20.7661 9.29393 21.0016 9.46873 21.1919 9.68751C21.3821 9.90629 21.5225 10.1638 21.6033 10.4423C21.6842 10.7207 21.7035 11.0134 21.66 11.3L20.28 20.3C20.2077 20.7769 19.9654 21.2116 19.5979 21.524C19.2304 21.8364 18.7623 22.0055 18.28 22H7M7 11V22M7 11H4C3.46957 11 2.96086 11.2107 2.58579 11.5858C2.21071 11.9609 2 12.4696 2 13V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H7"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          ) : (
            <div
              className={`rounded-full p-1 w-8 h-8 cursor-pointer ${
                articleDetail.is_liked ? 'bg-green-500' : 'bg-[#BDBDBD]'
              }`}
              onClick={async () => {
                await likeArticle(articleDetail?.id ?? 0);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M7 11L11 2C11.7956 2 12.5587 2.31607 13.1213 2.87868C13.6839 3.44129 14 4.20435 14 5V9H19.66C19.9499 8.99672 20.2371 9.0565 20.5016 9.17522C20.7661 9.29393 21.0016 9.46873 21.1919 9.68751C21.3821 9.90629 21.5225 10.1638 21.6033 10.4423C21.6842 10.7207 21.7035 11.0134 21.66 11.3L20.28 20.3C20.2077 20.7769 19.9654 21.2116 19.5979 21.524C19.2304 21.8364 18.7623 22.0055 18.28 22H7M7 11V22M7 11H4C3.46957 11 2.96086 11.2107 2.58579 11.5858C2.21071 11.9609 2 12.4696 2 13V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H7"
                  stroke="white"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
          <p className="align-middle"> +{articleDetail?.total_likes}</p>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <rect width="32" height="32" rx="16" fill="#BDBDBD" />
            <path
              d="M21.5612 19.6496C20.8499 19.6496 20.1936 19.8897 19.6795 20.2907L14.5087 16.6916C14.5953 16.2344 14.5953 15.7659 14.5087 15.3087L19.6795 11.7096C20.1936 12.1106 20.8499 12.3507 21.5612 12.3507C23.2132 12.3507 24.5558 11.059 24.5558 9.46953C24.5558 7.8801 23.2132 6.58838 21.5612 6.58838C19.9091 6.58838 18.5665 7.8801 18.5665 9.46953C18.5665 9.74804 18.6064 10.0145 18.6838 10.2691L13.7726 13.6904C13.0439 12.7612 11.8859 12.1586 10.5808 12.1586C8.3747 12.1586 6.58789 13.8777 6.58789 16.0001C6.58789 18.1226 8.3747 19.8417 10.5808 19.8417C11.8859 19.8417 13.0439 19.239 13.7726 18.3099L18.6838 21.7312C18.6064 21.9857 18.5665 22.2546 18.5665 22.5308C18.5665 24.1202 19.9091 25.4119 21.5612 25.4119C23.2132 25.4119 24.5558 24.1202 24.5558 22.5308C24.5558 20.9413 23.2132 19.6496 21.5612 19.6496ZM21.5612 8.22103C22.2774 8.22103 22.8588 8.78046 22.8588 9.46953C22.8588 10.1586 22.2774 10.718 21.5612 10.718C20.8449 10.718 20.2635 10.1586 20.2635 9.46953C20.2635 8.78046 20.8449 8.22103 21.5612 8.22103ZM10.5808 18.113C9.37042 18.113 8.38468 17.1646 8.38468 16.0001C8.38468 14.8357 9.37042 13.8873 10.5808 13.8873C11.7911 13.8873 12.7768 14.8357 12.7768 16.0001C12.7768 17.1646 11.7911 18.113 10.5808 18.113ZM21.5612 23.7793C20.8449 23.7793 20.2635 23.2198 20.2635 22.5308C20.2635 21.8417 20.8449 21.2823 21.5612 21.2823C22.2774 21.2823 22.8588 21.8417 22.8588 22.5308C22.8588 23.2198 22.2774 23.7793 21.5612 23.7793Z"
              fill="white"
            />
          </svg>
        </div>
      </div>

      <div className="w-full">
        {isImageValid ? (
          <img src={imageUrl} alt="Image" className="w-full" />
        ) : (
          <img src={defaultNews} alt="Image" className="w-2/3 mx-auto" />
        )}
      </div>
      <div className="flex flex-row border-b-4 pb-5 border-[#7555DA]">
        <p
          className="w-full mt-8 border-r pr-3 border-[#DBC8FF]"
          dangerouslySetInnerHTML={{ __html: `${articleDetail?.content}` }}
        ></p>
        <div className="flex flex-col gap-4 pl-4 mt-5 w-[50vw]">
          <h1 className="bg-clip-text text-xl font-semibold text-transparent bg-gradient-to-r from-[#9A76FE] to-[#4FE6AF]">
            Hot News
          </h1>
          {articles.map(article => {
            const imageUrl = article?.imageUrl;
            const isImageValid = isImageUrlValid(imageUrl);
            return (
              <div className="mt-2 flex flex-row" key={article?.id}>
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
                <div className="flex flex-col ml-3">
                  <h1 className="text-base font-semibold text-[#000000]">
                    {article?.title}
                  </h1>
                  <div className="flex flex-row align-middle gap-2 items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M4.66634 7.33325L7.33301 1.33325C7.86344 1.33325 8.37215 1.54397 8.74722 1.91904C9.12229 2.29411 9.33301 2.80282 9.33301 3.33325V5.99992H13.1063C13.2996 5.99773 13.4911 6.03759 13.6674 6.11673C13.8437 6.19587 14.0008 6.31241 14.1276 6.45826C14.2544 6.60411 14.348 6.7758 14.4019 6.96142C14.4558 7.14704 14.4687 7.34216 14.4397 7.53325L13.5197 13.5333C13.4715 13.8512 13.31 14.141 13.0649 14.3493C12.8199 14.5575 12.5079 14.6702 12.1863 14.6666H4.66634M4.66634 7.33325V14.6666M4.66634 7.33325H2.66634C2.31272 7.33325 1.97358 7.47373 1.72353 7.72378C1.47348 7.97382 1.33301 8.31296 1.33301 8.66658V13.3333C1.33301 13.6869 1.47348 14.026 1.72353 14.2761C1.97358 14.5261 2.31272 14.6666 2.66634 14.6666H4.66634"
                        stroke="#262626"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p>+ {article.total_likes}</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M14 7.66669C14.0023 8.5466 13.7967 9.41461 13.4 10.2C12.9296 11.1412 12.2065 11.9328 11.3116 12.4862C10.4168 13.0396 9.3855 13.3329 8.33333 13.3334C7.45342 13.3356 6.58541 13.1301 5.8 12.7334L2 14L3.26667 10.2C2.86995 9.41461 2.66437 8.5466 2.66667 7.66669C2.66707 6.61452 2.96041 5.58325 3.51381 4.68839C4.06722 3.79352 4.85884 3.0704 5.8 2.60002C6.58541 2.20331 7.45342 1.99772 8.33333 2.00002H8.66667C10.0562 2.07668 11.3687 2.66319 12.3528 3.64726C13.3368 4.63132 13.9233 5.94379 14 7.33335V7.66669Z"
                        stroke="#262626"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p>{article.total_comments}</p>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <path
                        d="M12 5.33325C13.1046 5.33325 14 4.43782 14 3.33325C14 2.22868 13.1046 1.33325 12 1.33325C10.8954 1.33325 10 2.22868 10 3.33325C10 4.43782 10.8954 5.33325 12 5.33325Z"
                        stroke="#262626"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 10C5.10457 10 6 9.10457 6 8C6 6.89543 5.10457 6 4 6C2.89543 6 2 6.89543 2 8C2 9.10457 2.89543 10 4 10Z"
                        stroke="#262626"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 14.6667C13.1046 14.6667 14 13.7713 14 12.6667C14 11.5622 13.1046 10.6667 12 10.6667C10.8954 10.6667 10 11.5622 10 12.6667C10 13.7713 10.8954 14.6667 12 14.6667Z"
                        stroke="#262626"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5.72656 9.00659L10.2799 11.6599"
                        stroke="#262626"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10.2732 4.34009L5.72656 6.99342"
                        stroke="#262626"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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
              <div className="w-full">
                <Input
                  label="Type your comment.."
                  onChange={e => {
                    updateComment(e.target.value);
                  }}
                />
              </div>
            </div>
            <div className="pt-7">
              <Button
                disabled={comment === '' && loading}
                variant="purple"
                label="Comment"
                containerClasses="xl:w-[196px] h-full p-1 rounded-full"
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
    </div>
  );
}
