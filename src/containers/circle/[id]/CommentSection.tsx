import { getAssetById } from '@/repository/asset.repository';
import {
  getAllReplyComment,
  getDetailCircle,
  postLikeComment
} from '@/repository/circleDetail.repository';
import { getPlayById } from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { formatCurrency } from '@/utils/common/currency';
import { isUndefindOrNull } from '@/utils/common/utils';
import { Typography } from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { PlayLogo } from 'public/assets/circle';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface typeOfComment {
  id: string;
  post_id: string;
  user_id: string;
  user_name: string;
  parent_id: string;
  content_text: string;
  media_url: string;
  media_type: string;
  status: string;
  total_reply: number;
  total_like: number;
  is_liked: boolean;
  created_at: string;
  updated_at: string;
  avatar: string;
}

interface UserData {
  id: string;
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

interface props {
  dataPost: typeOfComment;
  idx: number;
  setDataComment: any;
  setParent: any;
  isParent?: boolean;
  golId: number;
}

const CommentSection: React.FC<props> = ({
  dataPost,
  idx,
  setDataComment,
  setParent,
  isParent = true,
  golId
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const postId: string | any = router.query.postId;
  const [thumbnailList, setThumbnailList] = useState<any>([]);
  const [additionalPostData, setAdditionalPostData] = useState<any>({});
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const [dataReplyComment, setDataReplyComment] = useState<typeOfComment[]>([]);
  const [isLoadingComment, setIsLoadingComment] = useState<boolean>(false);
  const [isDrop, setIsDrop] = useState<boolean>(false);

  const fetchReplyComment = async (): Promise<void> => {
    try {
      setIsLoadingComment(true);
      const { data } = await getAllReplyComment({
        postId,
        parentId: dataPost.id
      });
      setDataReplyComment(data);
    } catch (error: any) {
      console.error('Error fetching Circle Detail:', error.message);
    } finally {
      setIsLoadingComment(false);
    }
  };

  useEffect(() => {
    if (isParent) {
      void fetchReplyComment();
    }
  }, [golId]);

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

  if (additionalPostData.length > 0) {
    console.log('succes');
  }
  const toUserProfile = (id: any): void => {
    if (dataPost?.id === userInfo?.id && isUndefindOrNull(id)) {
      router.push('MyProfileScreen').catch(err => {
        console.error(err);
      });
    } else if (id !== undefined) {
      router.push('ProfileUserScreen').catch(err => {
        console.error(err);
      });
    } else {
      router.push('ProfileUserScreen').catch(err => {
        console.error(err);
      });
    }
  };

  const toCircleDetail = useCallback((id: string): void => {
    router.push(`/connect/post/${id}`).catch(err => {
      console.error(err);
    });
  }, []);

  const renderTouchableText = (text: string): JSX.Element => {
    let linkUrl = '';
    const lines = text?.split('\n');
    const renderedLines = lines?.map((line, index) => {
      const parts = line.split(
        /(@\[[^\]]+\]\([^)]+\)|#\[[^\]]+\]\([^)]+\)|\$\[[^\]]+\]\([^)]+\)|\b(?:https?|ftp):\/\/\S+|\b(?:www\.\S+)\b)/g
      );
      const renderedParts = parts
        .map((part, partIndex) => {
          if (
            part.startsWith('@[') ||
            part.startsWith('#[') ||
            part.startsWith('$[')
          ) {
            const contentMatch = part.match(/\[([^\]]+)\]/);
            const linkMatch = part.match(/\(([^)]+)\)/);

            if (contentMatch !== null && linkMatch !== null) {
              const content = contentMatch[1];
              const link = linkMatch[1];

              return (
                <button
                  style={{ marginBottom: 0 }}
                  key={partIndex}
                  onClick={() => {
                    onPressTag(link);
                  }}
                >
                  {link?.includes('-circle') ? (
                    <pre className="font-poppins text-seeds-green font-normal">
                      @{content}
                    </pre>
                  ) : link?.includes('-asset') ? (
                    <pre className="font-poppins text-seeds-green font-normal">
                      ${content}
                    </pre>
                  ) : (
                    <pre className="font-poppins text-seeds-green font-normal">
                      @{content}
                    </pre>
                  )}
                </button>
              );
            }
          } else if (part.match(/#\[[^\]]+\]\([^)]+\)/) !== null) {
            const matchResult = part.match(/#\[(.*?)\]/);
            const extractedValue = matchResult !== null ? matchResult[1] : null;
            return (
              <button
                key={index}
                onClick={() => {
                  onPressTag(extractedValue);
                }}
              >
                <pre className="font-poppins text-seeds-green font-normal">
                  #{extractedValue}
                </pre>
              </button>
            );
          } else if (
            part.match(/\b(?:https?|ftp):\/\/\S+|\b(?:www\.\S+)\b/) !== null
          ) {
            linkUrl = part;
            const link = part.startsWith('www.') ? `http://${part}` : part;
            return (
              <button
                key={index}
                onDoubleClick={() => {}}
                onClick={() => {
                  router.push(link).catch(err => {
                    console.error(err);
                  });
                }}
              >
                <pre className="text-blue-500 font-poppins">{part}</pre>
              </button>
            );
          } else {
            const words = part.split(' ');
            return words.map((word: string, index: number) => {
              if (word.startsWith('#')) {
                const cleanedWord = word.replace(/#(\w+)/, '$1');
                return (
                  <button
                    key={index}
                    onClick={() => {
                      onPressTag(cleanedWord);
                    }}
                  >
                    <pre className="font-poppins text-seeds-green font-normal">
                      #{cleanedWord}{' '}
                    </pre>
                  </button>
                );
              } else {
                return (
                  <pre
                    key={index}
                    className="font-poppins text-black font-normal"
                  >
                    {word}{' '}
                  </pre>
                );
              }
            });
          }
          return undefined;
        })
        .filter(Boolean);

      return (
        <pre key={index} className="flex justify-start max-w-full">
          {renderedParts}
        </pre>
      );
    });

    return (
      <div className="">
        {renderedLines}
        {linkUrl.length > 0 ? (
          <div>
            <div></div>
          </div>
        ) : null}
      </div>
    );
  };

  const renderLoading = (): JSX.Element => (
    <div className="h-72 flex justify-center">
      <div className="animate-spinner w-16 h-16 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
    </div>
  );

  function removeDuplicateIds(data: any): any {
    const uniqueIds = new Set();
    return data.filter((item: any) => {
      if (!uniqueIds.has(item.id)) {
        uniqueIds.add(item.id);
        return true;
      }
      return false;
    });
  }

  function checkPostOrderPlay(inputString: string): boolean {
    const patternRegex =
      /^%\[[^\]]+\]\([^)]+\) &\[[^\]]+\]\([^)]+\) \*\[asset_icon\]\([^)]+\)$/;

    const isMatching = patternRegex.test(inputString);
    return isMatching;
  }

  function extractIdsOrderPlay(inputString: string): any {
    // Define regular expressions to match the indicators and their values
    const assetNameRegex = /%\[([^[\]]+)\]\(([^()]+)\)/;
    const orderTypeRegex = /&\[(buy|sell)\]\(([^()]+)\)/;
    const assetIconRegex = /\*\[asset_icon\]\(([^()]+)\)/;

    // Extract values using regular expressions
    const assetNameMatch = inputString.match(assetNameRegex);
    const orderTypeMatch = inputString.match(orderTypeRegex);
    const assetIconMatch = inputString.match(assetIconRegex);

    return {
      asset_name: assetNameMatch?.[1] ?? '',
      order_type:
        orderTypeMatch?.[1] === 'buy'
          ? 'buy'
          : orderTypeMatch?.[1] === 'sell'
          ? 'sell'
          : '',
      order_amount: parseInt(orderTypeMatch?.[2] ?? '0', 10),
      asset_icon: assetIconMatch?.[1] ?? ''
    };
  }

  function extractIds(inputString: string): string[] {
    const pattern = /[@#$]\[.*?\]\((.*?)\)/g;
    const matches = inputString?.match(pattern) ?? [];
    const ids = matches.map(match => match.match(/\((.*?)\)/)?.[1] ?? '');
    return ids;
  }

  useEffect(() => {
    if (checkPostOrderPlay(dataPost?.content_text)) {
      const extractedDataPlayOrder = extractIdsOrderPlay(
        dataPost?.content_text
      );
      setAdditionalPostData(extractedDataPlayOrder);
      setThumbnailList([]);
    } else {
      const res = extractIds(dataPost?.content_text);

      const tempThumbnailList: any = [];

      const promises = res?.map(async (el: any) => {
        if (el?.includes('-circle') === true) {
          await getDetailCircle({
            circleId: el?.replace('-circle', '')
          }).then((res: any) => {
            tempThumbnailList.push({ thumbnailType: 'circle', ...res?.data });
          });
        } else if (el?.includes('-play') === true) {
          await getPlayById(el?.replace('-play', '')).then((res: any) => {
            tempThumbnailList.push({ thumbnailType: 'play', ...res });
          });
        } else if (el?.includes('-asset') === true) {
          await getAssetById(el?.replace('-asset', '')).then((res: any) => {
            tempThumbnailList.push({ thumbnailType: 'asset', ...res });
          });
        }
        await Promise.resolve();
      });

      Promise.all(promises)
        .then(() => {
          const filteredThumbnailList = removeDuplicateIds(tempThumbnailList);
          setThumbnailList(filteredThumbnailList);
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [dataPost?.content_text]);

  const onPressTag = (content: any): void => {
    if (content?.includes('-people') === true) {
      toUserProfile(content?.replace('-people', ''));
    } else if (content?.includes('-circle') === true) {
      toCircleDetail(content?.replace('-circle', ''));
    } else if (content?.includes('-asset') === true) {
      router.push('').catch(err => {
        console.error(err);
      });
    } else if (content?.includes('-play') === true) {
      router.push('').catch(err => {
        console.error(err);
      });
    } else {
      router.push('').catch(err => {
        console.error(err);
      });
    }
  };

  const toDetailTag = (item: any): void => {
    if (item?.thumbnailType === 'circle') {
      router.push('CircleDetailScreen').catch(err => {
        console.error(err);
      });
    } else if (item?.thumbnailType === 'play') {
      router.push('PlayDetailScreen').catch(err => {
        console.error(err);
      });
    } else if (item?.thumbnailType === 'asset') {
      router.push('OverviewAsset').catch(err => {
        console.error(err);
      });
    }
  };
  const likePost = async (type: number, id: string): Promise<void> => {
    try {
      const response = await postLikeComment(type, id);

      if (response.status === 200) {
        setDataComment((prevDataPost: any | null) => {
          if (prevDataPost !== null) {
            if (Array.isArray(prevDataPost)) {
              const newData = prevDataPost.map((el: typeOfComment) => {
                if (el.id === id) {
                  if (el.is_liked) {
                    el.total_like -= 1;
                    el.is_liked = false;
                  } else {
                    el.total_like++;
                    el.is_liked = true;
                  }
                }
                return el;
              });

              return newData;
            } else {
              const updatedDataPost = { ...prevDataPost };

              if (dataPost.is_liked) {
                updatedDataPost.total_like -= 1;
                updatedDataPost.is_liked = false;
              } else {
                updatedDataPost.total_like++;
                updatedDataPost.is_liked = true;
              }

              return updatedDataPost;
            }
          }
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col  mt-5 pb-5" key={`${dataPost.id}${idx + 1}`}>
      <div className="w-full flex justify-between">
        <div className="flex gap-4 md:gap-8">
          <div className="hidden md:flex">
            <div
              onClick={() => {
                void router.push(`/social/${dataPost?.user_id}`);
              }}
            >
              <img
                src={dataPost.avatar}
                alt="AVATAR"
                width={48}
                height={48}
                className="rounded-full object-cover cursor-pointer"
              />
            </div>
          </div>
          <div className="flex gap-5 pb-4">
            <div className="md:hidden flex">
              <div>
                <img
                  src={dataPost.avatar}
                  alt="AVATAR"
                  width={48}
                  height={48}
                  className="rounded-full outline outline-black"
                />
              </div>
            </div>
            <div className="w-full">
              <div className="flex justify-start gap-2">
                <Typography
                  onClick={() => {
                    void router.push(`/social/${dataPost?.user_id}`);
                  }}
                  className="font-semibold md:text-lg font-poppins cursor-pointer"
                >
                  @{dataPost.user_name}
                </Typography>
                <Typography className="text-xs md:text-sm text-neutral-soft font-poppins items-center flex">
                  {moment(dataPost.created_at).fromNow()}
                </Typography>
              </div>
              <div className="flex items-center pt-[5px]">
                {renderTouchableText(dataPost.content_text)}
              </div>

              <div className="flex justify-start gap-4 pt-4">
                {thumbnailList.length > 0 &&
                  thumbnailList.map((item: any, index: number) => {
                    return (
                      <div
                        className="cursor-pointer border-2 rounded-xl border-neutral-ultrasoft bg-neutral-ultrasoft/10 min-w-[140px] max-w-[150px] h-fit"
                        key={`${item?.id as string}${index}`}
                        onClick={() => {
                          toDetailTag(item);
                        }}
                      >
                        {item?.admission_fee > 0 ? (
                          <div className="flex justify-center pt-4">
                            <div className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="17"
                                height="10"
                                viewBox="0 0 17 10"
                                fill="none"
                              >
                                <path
                                  d="M11.8385 5L8.50521 0L6.00521 5L0.171875 3.33333L3.50521 10H13.5052L16.8385 3.33333L11.8385 5Z"
                                  fill="#FDBA22"
                                />
                              </svg>
                            </div>
                            <Typography className="font-poppins text-black text-xs pl-2">
                              Paid
                            </Typography>
                          </div>
                        ) : null}
                        {item?.thumbnailType === 'circle' &&
                        item?.type !== 'free' ? (
                          <div className="flex justify-center pt-4">
                            <div className="flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="17"
                                height="10"
                                viewBox="0 0 17 10"
                                fill="none"
                              >
                                <path
                                  d="M11.8385 5L8.50521 0L6.00521 5L0.171875 3.33333L3.50521 10H13.5052L16.8385 3.33333L11.8385 5Z"
                                  fill="#FDBA22"
                                />
                              </svg>
                            </div>
                            <Typography className="font-poppins text-black text-xs pl-2">
                              Premium
                            </Typography>
                          </div>
                        ) : null}
                        {item?.thumbnailType === 'play' ? (
                          <div className="flex justify-center py-2">
                            <Image
                              src={PlayLogo}
                              alt="image"
                              width={60}
                              height={60}
                              className="rounded-full object-cover"
                            />
                          </div>
                        ) : (
                          <div
                            className={`${
                              item?.thumbnailType === 'asset' ||
                              (item?.thumbnailType === 'circle' &&
                                item?.type === 'free')
                                ? 'pt-4'
                                : ''
                            } flex justify-center py-2`}
                          >
                            <img
                              src={
                                item?.thumbnailType === 'asset'
                                  ? item?.marketAsset?.logo
                                  : item?.logo !== undefined
                                  ? item.logo
                                  : item?.avatar
                              }
                              alt="image"
                              className="rounded-full object-cover"
                              width={60}
                              height={60}
                            />
                          </div>
                        )}
                        <div className="flex justify-center">
                          <Typography className="text-seeds-green font-semibold font-poppins text-xl text-center">
                            {item?.name?.length > 10
                              ? (item?.name.substring(0, 15) as string) + '...'
                              : item?.name}
                            {item?.thumbnailType === 'asset' &&
                              (item?.marketAsset?.name?.length > 10
                                ? (item?.marketAsset?.name.substring(
                                    0,
                                    15
                                  ) as string) + '...'
                                : item?.marketAsset?.name)}
                          </Typography>
                        </div>
                        {item?.thumbnailType === 'play' ? (
                          <Typography className="text-neutral-soft font-poppins text-center pb-4 text-xs font-medium">
                            {item?.participants?.length} participants
                          </Typography>
                        ) : null}
                        {item?.thumbnailType === 'asset' ? (
                          <div className="flex justify-center">
                            <Typography className="text-neutral-soft font-poppins text-center text-xs font-medium pb-4">
                              {item?.marketAsset?.exchangeCurrency === 'IDR'
                                ? `IDR ${formatCurrency(
                                    item?.marketAsset?.lastPrice?.close
                                  )}`
                                : `$${formatCurrency(
                                    item?.marketAsset?.lastPrice?.close /
                                      item?.marketAsset?.exchangeRate
                                  )}`}
                            </Typography>
                          </div>
                        ) : null}
                        {item?.thumbnailType === 'circle' && (
                          <div className="flex justify-center">
                            <Typography className="text-neutral-soft font-poppins text-xs font-medium pb-4">
                              {item?.total_member} {t('circleDetail.member')}
                            </Typography>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
              {dataPost.media_url.length > 0 && (
                <div className="flex justify- py-2">
                  {dataPost.media_type === 'image' && (
                    <img
                      src={dataPost.media_url}
                      alt="image"
                      className="min-w-[200px] object-cover max-h-[300px]"
                    />
                  )}
                  {dataPost.media_type === 'video' && (
                    <video
                      controls
                      className="max-w-[50vw] max-h-[50vh] object-fit"
                      key={dataPost.media_url}
                    >
                      <source src={dataPost.media_url} type="video/mp4" />
                      Browser Anda tidak mendukung tag video.
                    </video>
                  )}
                </div>
              )}
              {isParent && (
                <button
                  className="flex items-center pt-[5px]"
                  onClick={() => {
                    if (dataReplyComment.length > 0 && !isDrop) {
                      setIsDrop(true);
                    } else {
                      setParent({
                        id: dataPost.id,
                        seedsTag: dataPost.user_name
                      });
                    }
                  }}
                >
                  <Typography className="text-xs md:text-sm text-neutral-soft font-poppins">
                    {dataReplyComment.length > 0 && !isDrop
                      ? `View ${dataReplyComment.length} more replies`
                      : `${t('termAndCondition.circleMembership.reply')}`}
                  </Typography>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-start">
          <div className="flex flex-col">
            <button
              className="flex"
              onClick={async () => {
                await likePost(1, dataPost.id);
              }}
            >
              {dataPost.is_liked ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="20"
                  viewBox="0 0 24 20"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M1.09998 10.4939C-0.180856 6.65732 1.31724 1.8874 5.51548 0.590992C7.72382 -0.0927161 10.449 0.477613 11.9973 2.52645C13.4572 0.402027 16.2612 -0.0881351 18.4671 0.590992C22.6642 1.8874 24.1706 6.65732 22.891 10.4939C20.8975 16.5751 13.9418 19.7428 11.9973 19.7428C10.0539 19.7428 3.16031 16.6461 1.09998 10.4939Z"
                    fill="#DA2D1F"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="26"
                  height="22"
                  viewBox="0 0 26 22"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.09998 11.9304C0.819144 8.09385 2.31724 3.32393 6.51548 2.02752C8.72382 1.34381 11.449 1.91414 12.9973 3.96297C14.4572 1.83855 17.2612 1.34839 19.4671 2.02752C23.6642 3.32393 25.1706 8.09385 23.891 11.9304C21.8975 18.0116 14.9418 21.1794 12.9973 21.1794C11.0539 21.1794 4.16031 18.0826 2.09998 11.9304Z"
                    stroke="#BDBDBD"
                    strokeWidth="1.61976"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>

            <Typography className="font-poppins text-neutral-soft text-center">
              {dataPost.total_like}
            </Typography>
          </div>
        </div>
      </div>
      {isDrop &&
        dataReplyComment.map((el, idx) => {
          return (
            <div className="pl-14" key={`${el.id}${idx}`}>
              {isLoadingComment && renderLoading()}
              <CommentSection
                dataPost={el}
                setDataComment={setDataReplyComment}
                setParent={setParent}
                idx={idx}
                isParent={false}
                golId={1}
              />
            </div>
          );
        })}
    </div>
  );
};

export default CommentSection;
