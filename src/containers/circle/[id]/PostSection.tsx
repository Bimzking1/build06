'use client';
import more_vertical from '@/assets/more-option/more_vertical.svg';
import SeedyQuestion from '@/assets/social/seedy-question.png';
import MoreOption from '@/components/MoreOption';
import ModalShareBattle from '@/components/popup/ModalShareBattle';
import {
  Bookmark,
  ChatBubble,
  Dot,
  Pin,
  ShareBlack
} from '@/constants/assets/icons';
import ImageCarousel from '@/containers/circle/[id]/CarouselImage';
import PieCirclePost from '@/containers/circle/[id]/PieCirclePost';
import PollingView from '@/containers/circle/[id]/PollingView';
import TrackerEvent from '@/helpers/GTM';
import { standartCurrency } from '@/helpers/currency';
import { generateRandomColor } from '@/helpers/generateRandomColor';
import { isGuest } from '@/helpers/guest';
import { getAssetById } from '@/repository/asset.repository';
import {
  getDetailCircle,
  postLikeCirclePost,
  postPinCirclePost,
  postSavedCirclePost
} from '@/repository/circleDetail.repository';
import { getPlayById } from '@/repository/play.repository';
import { getQuizById } from '@/repository/quiz.repository';
import { getBattleDetail } from '@/repository/team-battle.repository';
import { formatCurrency } from '@/utils/common/currency';
import { isUndefindOrNull } from '@/utils/common/utils';
import { ArrowUpRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { Typography } from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { PlayLogo, UnPin, clipCopy } from 'public/assets/circle';
import {
  FacebookShare,
  InstagramShare,
  LinkedinShare,
  MassengerShare,
  NearbyShare,
  TelegramShare,
  TiktokShare,
  TwitterShare,
  WhatsappShare
} from 'public/assets/circle/share';
import { BookmarkFill, XIcon } from 'public/assets/vector';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsTag } from "react-icons/bs";
import { FiLayers } from "react-icons/fi";
import { GoPeople } from "react-icons/go";
import { IoShareSocialOutline } from "react-icons/io5";
import { toast } from 'react-toastify';
import PDFViewer from './PDFViewer';

interface props {
  dataPost: any;
  setData: any;
  userInfo: UserData;
  handleSubmitBlockUser?: any;
  myInfo?: any;
}

interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
  }>;
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
  preferredCurrency: string;
}

interface ShareData {
  name: string;
  image: any;
  link: string;
  class: string;
}

const initialChartData = {
  labels: ['dummy'],
  datasets: [
    {
      data: [100],
      backgroundColor: ['#9F9F9F']
    }
  ]
};

const shareData: ShareData[] = [
  {
    name: 'Instagram',
    image: InstagramShare,
    link: 'https://www.instagram.com/direct/inbox/',
    class: ''
  },
  {
    name: 'Tiktok',
    image: TiktokShare,
    link: 'https://www.tiktok.com/',
    class: ''
  },
  {
    name: 'Facebook',
    image: FacebookShare,
    link: 'https://www.facebook.com/',
    class: ''
  },
  {
    name: 'Twitter',
    image: TwitterShare,
    link: 'https://twitter.com/messages/compose',
    class: ''
  },
  {
    name: 'Whatsapp',
    image: WhatsappShare,
    link: 'https://api.whatsapp.com/',
    class: ''
  },
  {
    name: 'Telegram',
    image: TelegramShare,
    link: 'https://web.telegram.org/',
    class: ''
  },
  {
    name: 'Massenger',
    image: MassengerShare,
    link: 'https://www.messenger.com/',
    class: ''
  },
  {
    name: 'Linkedin',
    image: LinkedinShare,
    link: 'https://www.linkedin.com/feed/',
    class: 'bg-[#0A66C2]'
  },
  {
    name: 'Near by',
    image: NearbyShare,
    link: 'www.instagram.com',
    class: 'bg-[#69FFC9]'
  }
];

const PostSection: React.FC<props> = ({
  dataPost,
  setData,
  userInfo,
  handleSubmitBlockUser,
  myInfo
}) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [chartData, setChartData] = useState<ChartData>(initialChartData);
  const [isCopied, setIsCopied] = useState(false);
  const [isShare, setIsShare] = useState(false);
  const [additionalPostData, setAdditionalPostData] = useState<any>({});
  const [thumbnailList, setThumbnailList] = useState<any>([]);
  const [isShareModal, setIsShareModal] = useState<boolean>(false);
  const [sharedId, setSharedId] = useState<string>('');
  const [sharedName, setSharedName] = useState<string>('');

  const handleOpen = (): void => {
    setIsShare(!isShare);
  };

  const handleItemClick = (link: string): void => {
    window.open(link, '_blank');
  };
  const baseUrl =
    process.env.NEXT_PUBLIC_DOMAIN ?? 'https://user-dev-gcp.seeds.finance/';

  const handleCopyClick = async (text: string): Promise<void> => {
    const textToCopy = `${baseUrl}/connect/comment/${text}`;
    await navigator.clipboard.writeText(textToCopy).then(() => {
      setIsCopied(true);
      setTimeout((): void => {
        setIsCopied(false);
      }, 2000);
    });
  };

  function formatDate(inputDateString: any): string {
    const date = new Date(inputDateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear().toString();

    return `${day}/${month}/${year}`;
  }

  const toUserProfile = (id: any): void => {
    if (dataPost?.user_id === userInfo?.id && isUndefindOrNull(id)) {
      router.push('/my-profile').catch(err => {
        console.error(err);
      });
    } else if (id !== undefined) {
      router.push(`/social/${id as string}`).catch(err => {
        console.error(err);
      });
    } else {
      router.push('ProfileUserScreen').catch(err => {
        console.error(err);
      });
    }
  };

  const toCircleDetail = useCallback((id: string) => {
    router.push(`/connect/post/${id}`).catch(err => {
      console.error(err);
    });
  }, []);

  const toQuizDetail = useCallback((id: string) => {
    router.push(`/play/quiz/${id}`).catch(err => {
      console.error(err);
    });
  }, []);

  const toPlayDetail = useCallback((id: string) => {
    router.push(`/play/tournament/${id}`).catch(err => {
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
            if (contentMatch !== null && linkMatch === null) {
              const content = contentMatch[1];

              return (
                <button style={{ marginBottom: 0 }} key={partIndex}>
                  <pre className="font-poppins text-seeds-green font-normal">
                    #{content}{' '}
                  </pre>
                </button>
              );
            }
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
          } else if (part.startsWith('*[')) {
            const contentMatch = part.match(/\[([^\]]+)\]/);
            const linkMatch = part.match(/\(([^)]+)\)/);
            if (contentMatch !== null && linkMatch !== null) {
              const link = linkMatch[1];
              const content = contentMatch[1];

              return (
                <div className={`flex-col gap-3 font-poppins`} key={link}>
                  <div className="flex items-center gap-2">
                    <div className="p-2">
                      <Image
                        src={SeedyQuestion}
                        alt="question-icon"
                        className="w-12 h-12 lg:w-14 lg:h-14 object-contain"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">Daily Quiz</p>
                      <p className="font-normal break-all text-sm">
                        {content === 'WIN'
                          ? t('social.dailyQuiz.postWin')
                          : t('social.dailyQuiz.postLose')}
                      </p>
                    </div>
                  </div>
                </div>
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
                  handleItemClick(link);
                }}
              >
                <pre className="text-blue-500 font-poppins">
                  {part.length > 30 ? part.substring(0, 30) + '...' : part}
                </pre>
              </button>
            );
          } else {
            const words = part.split(' ');
            return words.map((word: string, index: number) => {
              if (word.startsWith('#')) {
                if (word.startsWith('#[')) {
                  const contentMatch = part.match(/\[([^\]]+)\]/);
                  if (contentMatch !== null) {
                    const content = contentMatch[1];

                    return (
                      <button style={{ marginBottom: 0 }} key={partIndex}>
                        <pre className="font-poppins text-seeds-green font-normal">
                          #{content}
                        </pre>
                      </button>
                    );
                  }
                }
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
                    {/* See more premium */}
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
        <div
          className="flex justify-start flex-col"
          key={Math.floor(Math.random() * 100000000)}
        >
          <div className="flex break-words overflow-hidden flex-wrap">
            {renderedParts}
          </div>
        </div>
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
      /^%\[[^\]]+\]\([^)]+\) &[^\]]+\]\([^)]+\)( \*\[asset_icon\]\([^)]*\))?$/;

    const isMatching = patternRegex.test(inputString);
    return isMatching;
  }

  function extractIdsOrderPlay(inputString: string): any {
    // Define regular expressions to match the indicators and their values
    const assetNameRegex = /%\[([^[\]]+)\]\(([^()]+)\)/;
    const orderTypeRegex = /&\[(BUY|SELL)\]\(([^()]+)\)/;
    const assetIconRegex = /\*\[asset_icon\]\(([^()]+)\)/;

    // Extract values using regular expressions
    const assetNameMatch = inputString.match(assetNameRegex);
    const orderTypeMatch = inputString.match(orderTypeRegex);
    const assetIconMatch = inputString.match(assetIconRegex);

    return {
      asset_name: assetNameMatch?.[1] ?? '',
      order_type:
        orderTypeMatch?.[1] === 'BUY'
          ? 'buy'
          : orderTypeMatch?.[1] === 'SELL'
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
            tempThumbnailList.push({
              thumbnailType: 'circle',
              ...res?.data
            });
          });
        } else if (el?.includes('-play') === true) {
          await getPlayById(el?.replace('-play', '')).then((res: any) => {
            tempThumbnailList.push({ thumbnailType: 'play', ...res });
          });
        } else if (el?.includes('-quiz') === true) {
          await getQuizById({
            id: el?.replace('-quiz', ''),
            currency: ''
          }).then((res: any) => {
            tempThumbnailList.push({ thumbnailType: 'quiz', ...res });
          });
        } else if (el?.includes('-battles') === true) {
          await getBattleDetail(
            el?.replace('-battles', '')
          ).then((res: any) => {
            tempThumbnailList.push({ thumbnailType: 'battles', ...res });
          });
        } else if (el?.includes('-asset') === true) {
          await getAssetById(el?.replace('-asset', '')).then((res: any) => {
            tempThumbnailList.push({
              thumbnailType: 'asset',
              ...res.marketAsset
            });
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
      router
        .push(`/social/asset/${content?.replace('-asset', '') as string}`)
        .catch(err => {
          console.error(err);
        });
    } else if (content?.includes('-play') === true) {
      toPlayDetail(content?.replace('-play', ''));
    } else if (content?.includes('-quiz') === true) {
      toQuizDetail(content?.replace('-quiz', ''));
    } else {
      router.push(`/social/search?hashtags=${content as string}`).catch(err => {
        console.error(err);
      });
    }
  };

  const toDetailTag = useCallback((item: any) => {
    if (item?.thumbnailType === 'circle') {
      router.push(`/connect/post/${item.id as string}`).catch(err => {
        console.error(err);
      });
    } else if (item?.thumbnailType === 'play') {
      router.push(`/play/tournament/${item?.id as string}`).catch(err => {
        console.error(err);
      });
    } else if (item?.thumbnailType === 'quiz') {
      router.push(`/play/quiz/${item?.id as string}`).catch(err => {
        console.error(err);
      });
    } else if (item?.thumbnailType === 'asset') {
      router.push(`/social/asset/${item.id as string}`).catch(err => {
        console.error(err);
      });
    }
  }, []);

  function formatTime(inputDateString: any): string {
    const date = new Date(inputDateString);
    date.setUTCHours(date.getUTCHours() + 7);
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    let ampm = 'AM';
    if (hours >= 12) {
      ampm = 'PM';
      if (hours > 12) hours -= 12;
    }
    if (hours === 0) hours = 12;
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  }

  const media: string[] = [];
  const document: string[] = [];
  const voice: string[] = [];
  function categorizeURL(url: string[]): any {
    const documentExtensions = ['pdf'];
    const voiceExtension: string[] = ['mp3'];

    return url?.map((el: string) => {
      const urlParts = el.split('.');

      const extension = urlParts[urlParts.length - 1].toLowerCase();

      if (voiceExtension.includes(extension)) {
        voice.push(el);
      } else if (!documentExtensions.includes(extension)) {
        media.push(el);
      } else {
        document.push(el);
      }
      return <></>;
    });
  }

  const likePost = async (type: number): Promise<void> => {
    try {
      const response = await postLikeCirclePost(type, dataPost.id);
      if (response.status === 200) {
        setData((prevDataPost: any | null) => {
          if (prevDataPost !== null) {
            if (Array.isArray(prevDataPost)) {
              const newData = prevDataPost.map((el: any) => {
                if (el.id === dataPost.id) {
                  if (dataPost.status_like === true) {
                    el.total_upvote -= 1;
                    el.status_like = false;
                    TrackerEvent({
                      event: `SW_social_btn_unliked_post`,
                      postData: dataPost,
                      userData: userInfo
                    });
                  } else {
                    el.total_upvote++;
                    el.status_like = true;
                    TrackerEvent({
                      event: `SW_social_btn_liked_post`,
                      postData: dataPost,
                      userData: userInfo
                    });
                  }
                }
                return el;
              });

              return newData;
            } else {
              const updatedDataPost = { ...prevDataPost };

              if (dataPost.status_like === true) {
                updatedDataPost.total_upvote -= 1;
                updatedDataPost.status_like = false;
              } else {
                updatedDataPost.total_upvote++;
                updatedDataPost.status_like = true;
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

  const pinPost = async (type: string): Promise<void> => {
    try {
      const response = await postPinCirclePost(type, dataPost.id);
      if (response.status === 200) {
        setData((prevDataPost: any | null) => {
          if (prevDataPost !== null) {
            if (Array.isArray(prevDataPost)) {
              const newData = prevDataPost.map((el: any) => {
                if (el.id === dataPost.id) {
                  if (dataPost.is_pinned === true) {
                    el.is_pinned = false;
                  } else {
                    el.is_pinned = true;
                  }
                }
                return el;
              });
              const filteredTrue = newData.filter(el => el.is_pinned === true);
              const filterPin = filteredTrue.filter(
                el => el.id !== dataPost.id
              );
              const findPin = filteredTrue.find(el => el.id === dataPost.id);
              const filteredFalse = newData.filter(
                el => el.is_pinned === false
              );

              let arrangedPinPost = [];
              if (findPin === undefined) {
                arrangedPinPost = [...filterPin];
              } else {
                arrangedPinPost = [findPin, ...filterPin];
              }

              const newArrPinnedPost = [...arrangedPinPost, ...filteredFalse];
              return newArrPinnedPost;
            } else {
              const updatedDataPost = { ...prevDataPost };
              if (dataPost.is_pinned === true) {
                updatedDataPost.is_pinned = false;
              } else {
                updatedDataPost.is_pinned = true;
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

  const savePost = async (): Promise<void> => {
    try {
      const response = await postSavedCirclePost(dataPost.id);
      if (response.status === 200) {
        setData((prevDataPost: any | null) => {
          if (prevDataPost !== null) {
            if (Array.isArray(prevDataPost)) {
              const newData = prevDataPost.map((el: any) => {
                if (el.id === dataPost.id) {
                  if (dataPost.status_saved === true) {
                    el.status_saved = false;
                  } else {
                    el.status_saved = true;
                  }
                }
                return el;
              });

              return newData;
            } else {
              const updatedDataPost = { ...prevDataPost };
              if (dataPost.status_saved === true) {
                updatedDataPost.status_saved = false;
              } else {
                updatedDataPost.status_saved = true;
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

  const handleSetChartData = (): void => {
    const convertedData: ChartData = {
      labels: [],
      datasets: [
        {
          data: [],
          backgroundColor: []
        }
      ]
    };

    dataPost.pie.forEach((item: any) => {
      convertedData.labels.push(item.name);
      convertedData.datasets[0].data.push(item.allocation);
      convertedData.datasets[0].backgroundColor.push(generateRandomColor());
    });

    setChartData(convertedData);
  };

  useEffect(() => {
    if (dataPost?.pie?.length > 0) {
      handleSetChartData();
    }
  }, []);

  const [expanded, setExpanded] = useState<boolean>(false);
  const redirectToPaymentPostPremium = (): void => {
    router
      .push(isGuest() ? '/auth' : `/social/payment/${dataPost.id as number}`)
      .catch(error => {
        toast(error, { type: 'error' });
      });
  };
  const handleSeeMore = (text: string, maxWords: number): JSX.Element => {
    const words = text.split(' ');

    const displayText =
      dataPost.status_payment === true
        ? text
        : expanded
        ? (redirectToPaymentPostPremium(), '')
        : words.slice(0, maxWords).join(' ');

    return (
      <div>
        <p>{displayText}</p>
        {words.length > maxWords && dataPost.status_payment === false ? (
          <button
            className="text-blue-600"
            onClick={() => {
              setExpanded(!expanded);
            }}
          >
            See More
          </button>
        ) : null}
      </div>
    );
  };

  return (
    <>
      <div
        className="w-full pb-5 mt-5 border-b border-neutral-ultrasoft"
        key={`${dataPost.id as string}${Math.floor(Math.random() * 100000000)}`}
      >
        <div className="flex gap-4 md:gap-8">
          <div className="hidden md:flex">
            <div className="shrink-0">
              <img
                src={
                  dataPost.owner !== undefined ? dataPost.owner.avatar : null
                }
                alt="AVATAR"
                className="rounded-full w-12 h-12 object-cover cursor-pointer"
                onClick={async () => {
                  isGuest()
                    ? await router.push('/auth')
                    : dataPost.user_id === userInfo.id
                    ? await router.push('/my-profile')
                    : await router.push(
                        `/social/${dataPost.user_id as string}`
                      );
                }}
              />
            </div>
          </div>
          <div className="w-full">
            <div className="mb-4">
              <div className="flex gap-5 pb-4">
                <div className="md:hidden flex">
                  <div className="shrink-0">
                    <img
                      src={
                        dataPost.owner !== undefined
                          ? dataPost.owner.avatar
                          : null
                      }
                      alt="AVATAR"
                      className="rounded-full w-12 h-12 object-cover cursor-pointer"
                      onClick={async () => {
                        isGuest()
                          ? await router.push('/auth')
                          : dataPost.user_id === userInfo.id
                          ? await router.push('/my-profile')
                          : await router.push(
                              `/social/${dataPost.user_id as string}`
                            );
                      }}
                    />
                  </div>
                </div>

                <div className="w-full">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <Typography
                        className="font-bold text-black md:text-lg cursor-pointer"
                        onClick={async () => {
                          isGuest()
                            ? await router.push('/auth')
                            : dataPost.user_id === userInfo.id
                            ? await router.push('/my-profile')
                            : await router.push(
                                `/social/${dataPost.user_id as string}`
                              );
                        }}
                      >
                        @
                        {dataPost.owner !== undefined
                          ? dataPost.owner.seeds_tag !== undefined
                            ? dataPost.owner.seeds_tag
                            : dataPost.owner.username
                          : null}
                      </Typography>
                      {/* {dataPost.owner.verified === true && (
                      <CheckCircleIcon width={20} height={20} color="#5E44FF" />
                    )} */}

                      {dataPost.owner !== undefined
                        ? dataPost.owner.verified === true && (
                            <CheckCircleIcon
                              width={20}
                              height={20}
                              color="#5E44FF"
                            />
                          )
                        : null}
                    </div>
                    {isGuest() ? (
                      <div
                        onClick={async () => await router.push('/auth')}
                        className="cursor-pointer"
                      >
                        <Image
                          src={more_vertical}
                          alt="threeDots"
                          className="cursor-pointer"
                        />
                      </div>
                    ) : (
                      <MoreOption
                        myInfo={myInfo}
                        setDataPost={setData}
                        dataPost={dataPost}
                        userInfo={userInfo}
                        handleSubmitBlockUser={handleSubmitBlockUser}
                      />
                    )}
                  </div>
                  <div className="flex gap-1 items-center text-gray-500">
                    <Typography className="text-xs md:text-sm">
                      {formatDate(dataPost.created_at)}
                    </Typography>
                    <Image src={Dot.src} alt={Dot.alt} width={5} height={5} />
                    <Typography className="text-xs md:text-sm">
                      {formatTime(dataPost.created_at)}
                    </Typography>
                  </div>
                </div>
              </div>
              {isGuest() ? (
                <div onClick={async () => await router.push('/auth')}>
                  {additionalPostData?.asset_name === undefined && (
                    <div className="flex items-center mb-2">
                      {dataPost.privacy === 'premium' &&
                      dataPost.user_id !== userInfo.id
                        ? handleSeeMore(dataPost.content_text, 10)
                        : renderTouchableText(dataPost?.content_text)}
                    </div>
                  )}
                  {categorizeURL(dataPost.media_urls)}
                  {voice.length > 0 && (
                    <audio controls>
                      <source
                        src={voice[0]}
                        type="audio/wav"
                        className="w-full mb-4"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                  {document.length > 0 && <PDFViewer file={document[0]} />}
                  {media.length > 0 && <ImageCarousel images={media} />}
                  {dataPost.pollings?.length > 0 && (
                    <PollingView
                      data={dataPost.pollings}
                      totalVote={dataPost.total_polling}
                      pollingDate={dataPost.polling_date}
                    />
                  )}

                  {dataPost?.pie?.length > 0 ? (
                    <PieCirclePost data={dataPost} chartData={chartData} />
                  ) : null}
                </div>
              ) : (
                <div>
                  {additionalPostData?.asset_name === undefined && (
                    <div className="flex items-center mb-2">
                      {dataPost.privacy === 'premium' &&
                      dataPost.user_id !== userInfo.id
                        ? handleSeeMore(dataPost.content_text, 10)
                        : renderTouchableText(dataPost?.content_text)}
                    </div>
                  )}
                  {categorizeURL(dataPost.media_urls)}
                  {voice.length > 0 && (
                    <audio controls>
                      <source
                        src={voice[0]}
                        type="audio/wav"
                        className="w-full mb-4"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  )}
                  {document.length > 0 && <PDFViewer file={document[0]} />}
                  {media.length > 0 && <ImageCarousel images={media} />}
                  {dataPost.pollings?.length > 0 && (
                    <PollingView
                      data={dataPost.pollings}
                      totalVote={dataPost.total_polling}
                      pollingDate={dataPost.polling_date}
                    />
                  )}

                  {dataPost?.pie?.length > 0 ? (
                    <PieCirclePost data={dataPost} chartData={chartData} />
                  ) : null}
                </div>
              )}
            </div>
            <div className="flex justify-start gap-4 flex-wrap">
              {thumbnailList?.length > 0 &&
                thumbnailList?.map((item: any, index: number) => {
                  return ((item.thumbnailType !== 'quiz') && (item.thumbnailType !== 'battles')) ? (
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
                                ? item?.logo
                                : item?.logo !== undefined
                                ? item.logo
                                : item?.avatar
                            }
                            alt="image thumbnail"
                            className={`${
                              item?.thumbnailType === 'asset'
                                ? 'object-contain'
                                : 'object-cover'
                            } rounded-full w-14 h-14 max-w-[60px] max-h-[60px] min-h-[50px] min-w-[50px]`}
                          />
                        </div>
                      )}
                      <div className="flex justify-center">
                        <Typography className="text-seeds-green font-semibold font-poppins text-xl text-center">
                          {item?.name?.length > 10
                            ? (item?.name.substring(0, 15) as string) + '...'
                            : item?.name}
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
                            {item?.exchangeCurrency === 'IDR'
                              ? `IDR ${formatCurrency(item?.lastPrice?.close)}`
                              : `$${formatCurrency(
                                  item?.lastPrice?.close / item?.exchangeRate
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
                  ) : (
                    item.thumbnailType === 'quiz' ? (
                      <div
                        onClick={async () =>
                          await router
                            .push(`/play/quiz/${item?.id as string}`)
                            .catch(error => {
                              toast.error(error);
                            })
                        }
                        className="flex rounded-xl overflow-hidden shadow hover:shadow-lg duration-300 cursor-pointer"
                      >
                        <div className="w-full bg-white">
                          <div className="w-full rounded-t-xl overflow-hidden">
                            <div className="w-full h-auto max-w-[450px] flex justify-center items-center">
                              <Image
                                alt=""
                                src={
                                  item.banner?.image_url !== undefined &&
                                  item.banner?.image_url !== ''
                                    ? item.banner.image_url
                                    : 'https://dev-assets.seeds.finance/storage/cloud/4868a60b-90e3-4b81-b553-084ad85b1893.png'
                                }
                                width={1000}
                                height={1000}
                                className="w-full h-auto"
                              />
                            </div>
                          </div>
                          <div className="flex justify-between bg-[#3AC4A0] font-poppins px-4 py-2">
                            <div>
                              <div className="text-sm font-semibold text-white">
                                {item.name}
                              </div>
                              <div className="text-white flex gap-2 text-[10px] mt-2">
                                <div>
                                  <div className="text-[8.93px]">
                                    {t('quiz.entryFee')}
                                  </div>
                                  <div className="font-semibold text-[10.71px]">
                                    {item.admission_fee === 0
                                      ? t('quiz.free')
                                      : item.admission_fee.toLocaleString(
                                          'id-ID',
                                          {
                                            currency: 'IDR',
                                            style: 'currency'
                                          }
                                        )}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-[8.93px]">
                                    {t('playCenter.text4')}
                                  </div>
                                  <div className="font-semibold text-[10.71px]">
                                    {t('quiz.dayDuration', {
                                      duration: Math.floor(
                                        moment(item.ended_at).diff(
                                          moment(item.started_at),
                                          'days',
                                          true
                                        )
                                      )
                                    })}
                                  </div>
                                </div>
                                <div>
                                  <div className="text-[8.93px]">
                                    {t('quiz.players')}
                                  </div>
                                  <div className="font-semibold text-[10.71px]">
                                    {item.participants ?? 0}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex justify-between bg-[#3AC4A0] font-poppins">
                              <div className="my-auto items-center text-center hover:scale-110 duration-300">
                                {item?.is_joined === true ? (
                                  <div className="flex justify-center my-auto items-center cursor-pointer text-[10px] font-semibold text-[#3AC4A0] bg-white px-4 py-1 rounded-full hover:shadow-lg duration-300">
                                    {t('tournament.tournamentCard.openButton')}
                                  </div>
                                ) : (
                                  <div className="flex justify-center my-auto items-center cursor-pointer text-[10px] font-semibold text-[#3AC4A0] bg-white px-4 py-1 rounded-full hover:shadow-lg duration-300">
                                    {t('tournament.tournamentCard.joinButton')}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="flex rounded-t-3xl overflow-hidden shadow hover:shadow-lg duration-300"
                      >
                        <div className="w-full bg-white">
                          <div className="w-full overflow-hidden">
                            <div
                              onClick={async () =>
                                await router
                                  .push(`/play/team-battle/${item?.id as string}`)
                                  .catch(error => {
                                    toast.error(error);
                                  })
                              }
                              className="w-full h-auto max-w-[450px] flex justify-center items-center cursor-pointer"
                            >
                              <Image
                                alt=""
                                src={
                                  item.banner !== undefined &&
                                  item.banner !== ''
                                    ? item.banner
                                    : 'https://dev-assets.seeds.finance/storage/cloud/4868a60b-90e3-4b81-b553-084ad85b1893.png'
                                }
                                width={1000}
                                height={1000}
                                className="w-full h-auto"
                              />
                            </div>
                            <div className="p-4 flex flex-col justify-between bg-gradient-to-r from-[#227e7f] to-[#4760a8] font-poppins text-white">
                              <div className='w-full text-center mb-2 font-semibold'>
                                {item?.title ?? 'Team Battle'}
                              </div>
                              <div className='flex justify-center items-center gap-2'>
                                <div>
                                  <div className='flex justify-center items-center gap-1 text-xs'>
                                    <div>
                                      <FiLayers />
                                    </div>
                                    <div>
                                      {t('social.postSection.category')}
                                    </div>
                                  </div>
                                  <div className='flex justify-center items-center text-xs font-semibold'>
                                    {
                                      item?.category[0] === 'ID_STOCK'
                                        ? 'ID Stock'
                                        : item?.category[0] === 'US_STOCK'
                                          ? 'US Stock'
                                          : item?.category[0] === 'CRYPTO'
                                            ? 'Crypto'
                                            : item?.category[0]
                                    }
                                  </div>
                                </div>
                                <div className='border-x-[1px] px-4'>
                                  <div className='flex justify-center items-center gap-1 text-xs'>
                                    <div>
                                      <GoPeople />
                                    </div>
                                    <div>
                                      {t('social.postSection.joined')}
                                    </div>
                                  </div>
                                  <div className='flex justify-center items-center text-xs font-semibold'>
                                    {item?.participants ?? 0} {(item?.participants ?? 0) > 1 ? t('social.postSection.players') : t('social.postSection.player')}
                                  </div>
                                </div>
                                <div>
                                  <div className='flex justify-center items-center gap-1 text-xs'>
                                    <div>
                                      <BsTag />
                                    </div>
                                    <div>
                                      {t('social.postSection.fee')}
                                    </div>
                                  </div>
                                  <div className='flex justify-center items-center text-xs font-semibold'>
                                    {
                                      item?.admission_fee !== 0
                                        ? `${userInfo?.preferredCurrency}${standartCurrency(item?.admission_fee ?? 0).replace('Rp', '')}`
                                        : t('social.postSection.free')
                                    }
                                  </div>
                                </div>
                              </div>
                              <div className='flex justify-between items-center mt-4 px-2'>
                                <div
                                  onClick={() => {
                                    setIsShareModal(true)
                                    setSharedId(item?.id)
                                    setSharedName(item?.title)
                                  }}
                                  className='flex justify-center items-center gap-2 hover:scale-110 duration-300 cursor-pointer'
                                >
                                  <IoShareSocialOutline className='bg-[#2934B2] rounded-full w-[30px] h-[30px] p-[4px] border-[1px] border-white'/>
                                  <div>
                                    {t('social.postSection.share')}
                                  </div>
                                </div>
                                <div
                                  onClick={async () =>
                                    await router
                                      .push(`/play/team-battle/${item?.id as string}`)
                                      .catch(error => {
                                        toast.error(error);
                                      })
                                  }
                                  className='bg-[#2934B2] rounded-full border-2 border-white w-[100px] text-center text-sm py-1 hover:scale-110 hover:shadow-lg duration-300 cursor-pointer'
                                >
                                  {t('social.postSection.play')}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  );
                })}
              {
                // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
                additionalPostData?.asset_name && (
                  <div className="bg-[#b9fae2] text-[#2e745a] rounded-xl p-2 flex lg:gap-12 justify-between ">
                    <div className="flex gap-2 pr-5 lg:pr-12 my-auto">
                      <p className="font-poppins">
                        {additionalPostData?.order_type === 'buy'
                          ? 'Bought'
                          : additionalPostData?.order_type}
                      </p>
                      <p className="font-semibold font-poppins">
                        {additionalPostData?.asset_name}
                      </p>
                      <p className="font-poppins">at</p>
                      <p className="font-semibold font-poppins">
                        {'IDR'} {additionalPostData?.order_amount}
                      </p>
                    </div>
                    <img
                      src={additionalPostData?.asset_icon}
                      alt="icon"
                      className="w-[60px] rounded-full object-scale-down my-auto px-2"
                      width={40}
                      height={40}
                    />
                  </div>
                )
              }
            </div>
            <div className="flex justify-between items-center mt-4">
              <div className="flex gap-3 md:gap-5">
                <div className="flex items-center gap-1 pr-2">
                  <div
                    className={`p-2 rounded-full cursor-pointer`}
                    onClick={async () => {
                      isGuest()
                        ? await router.push('/auth')
                        : await likePost(1);
                    }}
                  >
                    {dataPost.status_like === true ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="#4FE6AF"
                      >
                        <path
                          d="M7 11L11 2C11.7956 2 12.5587 2.31607 13.1213 2.87868C13.6839 3.44129 14 4.20435 14 5V9H19.66C19.9499 8.99672 20.2371 9.0565 20.5016 9.17522C20.7661 9.29393 21.0016 9.46873 21.1919 9.68751C21.3821 9.90629 21.5225 10.1638 21.6033 10.4423C21.6842 10.7207 21.7035 11.0134 21.66 11.3L20.28 20.3C20.2077 20.7769 19.9654 21.2116 19.5979 21.524C19.2304 21.8364 18.7623 22.0055 18.28 22H7M7 11V22M7 11H4C3.46957 11 2.96086 11.2107 2.58579 11.5858C2.21071 11.9609 2 12.4696 2 13V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H7"
                          stroke="white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="white"
                      >
                        <path
                          d="M7 11L11 2C11.7956 2 12.5587 2.31607 13.1213 2.87868C13.6839 3.44129 14 4.20435 14 5V9H19.66C19.9499 8.99672 20.2371 9.0565 20.5016 9.17522C20.7661 9.29393 21.0016 9.46873 21.1919 9.68751C21.3821 9.90629 21.5225 10.1638 21.6033 10.4423C21.6842 10.7207 21.7035 11.0134 21.66 11.3L20.28 20.3C20.2077 20.7769 19.9654 21.2116 19.5979 21.524C19.2304 21.8364 18.7623 22.0055 18.28 22H7M7 11V22M7 11H4C3.46957 11 2.96086 11.2107 2.58579 11.5858C2.21071 11.9609 2 12.4696 2 13V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H7"
                          stroke="black"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <Typography
                    className={`${
                      dataPost.status_like === true
                        ? 'text-[#50E6AF]'
                        : 'text-black'
                    } text-sm`}
                  >
                    {dataPost.total_upvote}
                  </Typography>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="cursor-pointer flex gap-2"
                    onClick={async () => {
                      await router
                        .push(
                          isGuest()
                            ? '/auth'
                            : `/connect/comment/${dataPost.id as string}`
                        )
                        .catch((err: any) => {
                          toast(err, { type: 'error' });
                        });
                    }}
                  >
                    <Image
                      src={ChatBubble.src}
                      alt={ChatBubble.alt}
                      width={20}
                      height={20}
                    />
                    <Typography>{dataPost.total_comment}</Typography>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={async () => {
                      isGuest()
                        ? await router.push('/auth')
                        : handleCopyClick(`${dataPost.id as string}`).catch(
                            err => {
                              toast(err, { type: 'error' });
                            }
                          );
                    }}
                  >
                    <Image
                      src={ShareBlack.src}
                      alt={ShareBlack.alt}
                      width={20}
                      height={20}
                    />
                  </button>
                  {isShare && (
                    <div className="w-[420px] absolute z-50 bg-white ml-8 mt-[52vh] shadow-md rounded-xl">
                      <div className="flex flex-col px-4 py-2">
                        <div className="flex justify-between">
                          <Typography className="font-poppins font-semibold text-xl text-black">
                            Share This Post
                          </Typography>
                          <Image
                            src={XIcon}
                            alt="x"
                            width={20}
                            height={20}
                            className="cursor-pointer"
                            onClick={() => {
                              handleOpen();
                            }}
                          />
                        </div>
                        <div className="flex justify-center pt-5">
                          <Typography className="font-poppins font-light text-base text-neutral-medium">
                            Share links:
                          </Typography>
                        </div>
                        <div className="flex justify-center pb-4 border-b border-neutral-ultrasoft">
                          <div className="flex border rounded-xl justify-start border-neutral-ultrasoft p-2 min-w-[300px]">
                            <input
                              type="text"
                              readOnly
                              value={
                                process.env.NEXT_PUBLIC_DOMAIN !== undefined
                                  ? `${
                                      process.env.NEXT_PUBLIC_DOMAIN
                                    }/connect/comment/${dataPost.id as string}`
                                  : `https://user-dev-gcp.seeds.finance/connect/comment/${
                                      dataPost.id as string
                                    }`
                              }
                              onClick={() => {
                                handleCopyClick(
                                  process.env.NEXT_PUBLIC_DOMAIN !== undefined
                                    ? `${
                                        process.env.NEXT_PUBLIC_DOMAIN
                                      }/connect/comment/${
                                        dataPost.id as string
                                      }`
                                    : `https://user-dev-gcp.seeds.finance/connect/comment/${
                                        dataPost.id as string
                                      }`
                                ).catch((err: any) => {
                                  console.log(err);
                                });
                              }}
                              className="text-black w-[260px] outline-none focus:outline-none cursor-pointer"
                            />
                            <div className="flex items-center pl-2">
                              <button type="button">
                                <Image
                                  src={clipCopy}
                                  alt="copy"
                                  width={20}
                                  height={20}
                                  onClick={() => {
                                    handleCopyClick(
                                      process.env.NEXT_PUBLIC_DOMAIN !==
                                        undefined
                                        ? `${
                                            process.env.NEXT_PUBLIC_DOMAIN
                                          }/connect/comment/${
                                            dataPost.id as string
                                          }`
                                        : `https://user-dev-gcp.seeds.finance/connect/comment/${
                                            dataPost.id as string
                                          }`
                                    ).catch((err: any) => {
                                      console.log(err);
                                    });
                                  }}
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-center py-4 border-b border-neutral-ultrasoft">
                          <Typography className="font-poppins font-normal text-base text-black">
                            No recommended people to share with
                          </Typography>
                        </div>
                        <div className="grid grid-cols-4 gap-4 py-4">
                          {shareData.map((el: ShareData, i: number) => {
                            return (
                              <div
                                className="flex flex-col items-center"
                                key={`shareImage${i}`}
                              >
                                <Image
                                  src={el.image}
                                  alt="shareImage"
                                  width={40}
                                  height={40}
                                  onClick={() => {
                                    handleCopyClick(
                                      process.env.NEXT_PUBLIC_DOMAIN !==
                                        undefined
                                        ? `${
                                            process.env.NEXT_PUBLIC_DOMAIN
                                          }/connect/comment/${
                                            dataPost.id as string
                                          }`
                                        : `https://user-dev-gcp.seeds.finance/connect/comment/${
                                            dataPost.id as string
                                          }`
                                    ).catch((err: any) => {
                                      console.log(err);
                                    });
                                    handleItemClick(el.link);
                                  }}
                                  className={`cursor-pointer rounded-full ${el.class}`}
                                />
                                <Typography className="font-poppins font-normal text-base text-black">
                                  {el.name}
                                </Typography>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {isCopied && (
                  <div className="flex items-center">
                    <div className="flex gap-2 px-2 py-3 bg-white border border-[#E9E9E9] rounded-lg shadow-md absolute">
                      <Typography className="font-poppins font-normal text-base text-black">
                        {'Copied'}
                      </Typography>
                      <div className="flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_5900_68690)">
                            <path
                              d="M14.6667 7.38668V8.00001C14.6658 9.43763 14.2003 10.8365 13.3395 11.9879C12.4788 13.1393 11.2688 13.9817 9.89022 14.3893C8.5116 14.7969 7.03815 14.7479 5.68963 14.2497C4.3411 13.7515 3.18975 12.8307 2.40729 11.6247C1.62482 10.4187 1.25317 8.99205 1.34776 7.55755C1.44235 6.12305 1.99812 4.75756 2.93217 3.66473C3.86621 2.57189 5.1285 1.81027 6.53077 1.49344C7.93304 1.17662 9.40016 1.32157 10.7133 1.90668"
                              stroke="#3AC4A0"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M14.6667 2.66666L8 9.33999L6 7.33999"
                              stroke="#3AC4A0"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_5900_68690">
                              <rect width="16" height="16" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-5">
                <div className="flex items-center gap-1">
                  <div
                    className={`p-2 rounded-full cursor-pointer`}
                    onClick={async () => {
                      if (dataPost.circle !== undefined) {
                        await pinPost('connect');
                      } else {
                        await pinPost('social');
                      }
                    }}
                  >
                    {dataPost.is_pinned === true ? (
                      <Image src={UnPin} alt={'unpin'} width={20} height={20} />
                    ) : (
                      <Image
                        src={Pin.src}
                        alt={Pin.alt}
                        width={20}
                        height={20}
                      />
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className={`p-2 rounded-full cursor-pointer`}
                    onClick={async () => {
                      await savePost();
                    }}
                  >
                    {dataPost.status_saved === true ? (
                      <Image
                        src={BookmarkFill.src}
                        alt={BookmarkFill.alt}
                        width={20}
                        height={20}
                      />
                    ) : (
                      <Image
                        src={Bookmark.src}
                        alt={Bookmark.alt}
                        width={20}
                        height={20}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row mt-2">
              {dataPost.privacy === 'premium' ? (
                <div className="flex flex-row bg-[#DCFCE4] items-center py-1 px-2 rounded-xl">
                  <ArrowUpRightIcon className="h-4 w-4 text-[#3AC4A0] mr-2" />
                  <p className="text-[#3AC4A0]">Premium</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      {isShareModal && (
        <ModalShareBattle
          onClose={() => {
            setIsShareModal(prev => !prev);
          }}
          url={sharedId ?? ''}
          title={sharedName ?? ''}
        />
      )}
    </>
  );
};
export default PostSection;
