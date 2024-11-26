import { generateRandomColor } from '@/helpers/generateRandomColor';
import { getAssetById } from '@/repository/asset.repository';
import { getDetailCircle } from '@/repository/circleDetail.repository';
import { getPlayById } from '@/repository/play.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { getQuizById } from '@/repository/quiz.repository';
import { formatCurrency } from '@/utils/common/currency';
import { isUndefindOrNull } from '@/utils/common/utils';
import {
  type AssetThumbnail,
  type CircleThumbnail,
  type ForYouPostI,
  type Pie,
  type PlayThumbnail,
  type QuizThumbnail
} from '@/utils/interfaces/play.interface';
import { type UserInfo } from '@/utils/interfaces/tournament.interface';
import { Typography } from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { PlayLogo } from 'public/assets/circle';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import PieAssetPost from './PieAssetPost';

interface props {
  item: ForYouPostI;
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    data: number[];
    backgroundColor: string[];
  }>;
}

interface ExtractedOrderI {
  asset_name: string;
  order_type: 'buy' | 'sell' | '';
  order_amount: number;
  asset_icon: string;
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

type Thumbnail =
  | QuizThumbnail
  | CircleThumbnail
  | PlayThumbnail
  | AssetThumbnail;

const SocialCard: React.FC<props> = ({ item }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [chartData, setChartData] = useState<ChartData>(initialChartData);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [additionalPostData, setAdditionalPostData] =
    useState<ExtractedOrderI>();
  const [thumbnailList, setThumbnailList] = useState<Thumbnail[]>([]);
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

    item.pie.forEach((item: Pie) => {
      convertedData.labels.push(item.name);
      convertedData.datasets[0].data.push(item.allocation);
      convertedData.datasets[0].backgroundColor.push(generateRandomColor());
    });

    setChartData(convertedData);
  };
  const fetchData = async (): Promise<void> => {
    try {
      const dataInfo = await getUserInfo();
      setUserInfo(dataInfo);
    } catch (error) {
      toast.error(`Error fetching data: ${error as string}`);
    }
  };

  useEffect(() => {
    void fetchData();
  }, []);

  useEffect(() => {
    if (item?.pie?.length > 0) {
      handleSetChartData();
    }
  }, []);

  const toDetailTag = useCallback((item: Thumbnail) => {
    if (item?.thumbnailType === 'circle') {
      router.push(`/connect/post/${item.id}`).catch(err => {
        toast(err);
      });
    } else if (item?.thumbnailType === 'play') {
      router.push(`/play/tournament/${item?.id}`).catch(err => {
        toast(err);
      });
    } else if (item?.thumbnailType === 'asset') {
      router.push(`/homepage/assets/${item.id}`).catch(err => {
        toast(err);
      });
    }
  }, []);

  const onPressTag = (content: string): void => {
    if (content?.includes('-people')) {
      toUserProfile(content?.replace('-people', ''));
    } else if (content?.includes('-circle')) {
      toCircleDetail(content?.replace('-circle', ''));
    } else if (content?.includes('-asset')) {
      router
        .push(`/homepage/assets/${content?.replace('-asset', '')}`)
        .catch(err => {
          toast(err);
        });
    } else if (content?.includes('-play')) {
      router.push('').catch(err => {
        toast(err);
      });
    } else {
      router.push(`/social/search?hashtags=${content}`).catch(err => {
        toast(err);
      });
    }
  };

  const toUserProfile = (id: string): void => {
    if (item?.user_id === userInfo?.id && isUndefindOrNull(id)) {
      router.push('/my-profile').catch(err => {
        toast(err);
      });
    } else if (id !== undefined) {
      router.push(`/social/${id}`).catch(err => {
        toast(err);
      });
    } else {
      router.push('ProfileUserScreen').catch(err => {
        toast(err);
      });
    }
  };

  const handleItemClick = (link: string): void => {
    window.open(link, '_blank');
  };

  const toCircleDetail = useCallback((id: string) => {
    router.push(`/connect/post/${id}`).catch(err => {
      toast(err);
    });
  }, []);

  function removeDuplicateIds(data: Thumbnail[]): Thumbnail[] {
    const uniqueIds = new Set();
    return data.filter((item: Thumbnail) => {
      if (!uniqueIds.has(item.id)) {
        uniqueIds.add(item.id);
        return true;
      }
      return false;
    });
  }

  function checkPostOrderPlay(inputString: string): boolean {
    const patternRegex =
      /%\[[^\]]+\]\([^)]+\) &\[[^\]]+\]\([^)]+\) \*\[asset_icon\]\([^)]+\)$/;

    const isMatching = patternRegex.test(inputString);
    return isMatching;
  }

  const calculateDaysLeft = (startTime: Date, endTime: Date): number => {
    const daysDiff = moment(endTime).diff(moment(startTime), 'days');
    return daysDiff;
  };

  function extractIdsOrderPlay(inputString: string): ExtractedOrderI {
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
    if (checkPostOrderPlay(item?.content_text)) {
      const extractedDataPlayOrder = extractIdsOrderPlay(item?.content_text);
      setAdditionalPostData(extractedDataPlayOrder);
      setThumbnailList([]);
    } else {
      const res = extractIds(item?.content_text);

      const tempThumbnailList: Thumbnail[] = [];

      const promises = res?.map(async (el: string) => {
        if (el?.includes('-circle')) {
          await getDetailCircle({ circleId: el.replace('-circle', '') }).then(
            res => {
              tempThumbnailList.push({ thumbnailType: 'circle', ...res.data });
            }
          );
        } else if (el?.includes('-play')) {
          await getPlayById(el.replace('-play', '')).then(res => {
            tempThumbnailList.push({ thumbnailType: 'play', ...res });
          });
        } else if (el?.includes('-quiz')) {
          await getQuizById({
            id: el?.replace('-quiz', ''),
            currency: ''
          }).then(res => {
            tempThumbnailList.push({ thumbnailType: 'quiz', ...res });
          });
        } else if (el?.includes('-asset')) {
          await getAssetById(el.replace('-asset', '')).then(res => {
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
          toast(err);
        });
    }
  }, [item?.content_text]);

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
          } else if (part.match(/#\[[^\]]+\]\([^)]+\)/) !== null) {
            const matchResult = part.match(/#\[(.*?)\]/);
            const extractedValue = matchResult !== null ? matchResult[1] : null;
            return (
              <button
                key={index}
                onClick={() => {
                  onPressTag(extractedValue as string);
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
  return (
    <div className="border border-[#E9E9E9] rounded-md flex flex-col justify-start gap-2 p-2 min-w-[280px] max-w-[350px] mr-4">
      <div className="flex p-2 justify-between items-center">
        <div className="flex gap-2 items-center">
          <Image
            alt="Profile Image"
            width="48"
            height="48"
            src={item?.owner?.avatar}
            className="rounded-full"
          />
          <p className="font-bold text-black text-lg">
            @{(item?.owner?.seeds_tag)?.length > 12 ? `${(item?.owner?.seeds_tag)?.substring(0, 12)}...` : item?.owner?.seeds_tag}
          </p>
        </div>
        <p className="font-thin text-[#7C7C7C] text-sm">
          {/* {item?.created_at} */}
          {moment(new Date()).diff(moment(item?.created_at), 'hours')}h
        </p>
      </div>
      {additionalPostData?.asset_name === undefined && (
        <div className="flex items-center mb-2">
          {renderTouchableText(item?.content_text)}
        </div>
      )}

      <div className="flex justify-start gap-4 flex-wrap">
        {thumbnailList.length > 0 &&
          thumbnailList.map((item: Thumbnail, index: number) => {
            return item.thumbnailType !== 'quiz' ? (
              <div
                className="cursor-pointer border-2 rounded-xl border-neutral-ultrasoft bg-neutral-ultrasoft/10 min-w-[140px] max-w-[150px] h-fit"
                key={`${item?.id}${index}`}
                onClick={() => {
                  toDetailTag(item);
                }}
              >
                {item.thumbnailType === 'play' && item?.admission_fee > 0 ? (
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
                {item?.thumbnailType === 'circle' && item?.type !== 'free' ? (
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
                      ? item?.name.substring(0, 15) + '...'
                      : item?.name}
                  </Typography>
                </div>
                {item?.thumbnailType === 'play' ? (
                  <Typography className="text-neutral-soft font-poppins text-center pb-4 text-xs font-medium">
                    {item?.total_participants} participants
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
              <div
                onClick={async () =>
                  await router.push(`/play/quiz/${item?.id}`).catch(error => {
                    toast.error(error);
                  })
                }
                className="flex rounded-xl overflow-hidden shadow hover:shadow-lg duration-300"
              >
                <div className="w-full bg-white">
                  <div className="w-full rounded-xl overflow-hidden">
                    <div className="border border-[#E9E9E9] w-full h-[150px] flex justify-center items-center mb-2">
                      <Image
                        alt=""
                        src={
                          item.banner?.image_url !== undefined &&
                          item.banner?.image_url !== ''
                            ? item.banner.image_url
                            : 'https://dev-assets.seeds.finance/storage/cloud/4868a60b-90e3-4b81-b553-084ad85b1893.png'
                        }
                        width={100}
                        height={100}
                        className="w-auto h-full"
                      />
                    </div>
                    <div className="pl-2 flex justify-between bg-[#3AC4A0] font-poppins">
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {item.name}
                        </div>
                        <div className="text-white flex gap-2 text-[10px] mt-2">
                          <div className="mt-1">{t('playCenter.text4')}</div>
                          <div className="font-normal text-white mt-1">
                            {calculateDaysLeft(
                              new Date(item?.started_at),
                              new Date(item?.ended_at)
                            )}{' '}
                            {t('playCenter.text5')}
                          </div>
                          <div className="border border-1 border-white bg-[#3AC4A0] py-1 px-2 rounded-full text-white text-[8px]">
                            Quiz
                          </div>
                        </div>
                      </div>
                      <div className="my-auto items-center">
                        {item?.is_joined ? (
                          <div className="flex justify-center my-auto items-center cursor-pointer text-[10px] font-semibold text-[#3AC4A0] bg-white px-4 mx-2 py-1 rounded-full hover:shadow-lg duration-300">
                            {t('tournament.tournamentCard.openButton')}
                          </div>
                        ) : (
                          <div className="flex justify-center my-auto items-center cursor-pointer text-[10px] font-semibold text-[#3AC4A0] bg-white px-4 py-1 mx-2 rounded-full hover:shadow-lg duration-300">
                            {t('tournament.tournamentCard.joinButton')}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        {additionalPostData?.asset_name != null && (
          <div className="bg-[#b9fae2] text-[#2e745a] rounded-xl p-2 flex justify-between ">
            <div className="flex gap-2 pr-5">
              <p className="font-poppins ">{additionalPostData?.order_type}</p>
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
              className="w-[60px] rounded-full object-scale-down px-2"
              width={40}
              height={40}
            />
          </div>
        )}
      </div>
      {item?.pie?.length > 0 && (
        <PieAssetPost data={item} chartData={chartData} />
      )}
    </div>
  );
};

export default SocialCard;
