import Loading from '@/components/popup/Loading';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import CommentInput from '@/containers/circle/[id]/CommentInput';
import CommentSection from '@/containers/circle/[id]/CommentSection';
import GifSection from '@/containers/circle/[id]/GifSection';
import PostSection from '@/containers/circle/[id]/PostSection';
import UniqueInputComment from '@/containers/circle/[id]/UniqueInputComment';
import withAuth from '@/helpers/withAuth';
import {
  UseUploadMedia,
  createComment,
  getAllComment,
  getDetailCirclePost,
  getUserTagList
} from '@/repository/circleDetail.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ArrowBackwardIcon } from 'public/assets/vector';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
interface typeOfCommentForm {
  post_id: string;
  user_id: string;
  parent_id: string;
  content_text: string;
  media_url: string;
  media_type: string;
}

export interface typeOfForm {
  content_text: string;
  media_url: string;
  media_type: string;
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

interface typeOfSelected {
  id: string;
  tag: string;
}

interface typeOfParent {
  id: string;
  seedsTag: string;
}

const tagOption = [
  {
    id: 1,
    name: 'User'
  },
  {
    id: 2,
    name: 'Circle'
  },
  {
    id: 3,
    name: 'Play'
  }
];

const initialUserInfo = {
  id: '',
  name: '',
  seedsTag: '',
  email: '',
  pin: '',
  avatar: '',
  bio: '',
  birthDate: '',
  phone: '',
  preferredLanguage: '',
  verified: false,
  _pin: ''
};

const Comment: React.FC = () => {
  const router = useRouter();
  const postId: string | any = router.query.postId;
  const [golId, setGolId] = useState<number>(1);
  const [mediaArr, setMediaArr] = useState<string[]>([]);
  const [dataPost, setDataPost] = useState<null | any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingComment, setIsLoadingComment] = useState<boolean>(false);
  const [dataComment, setDataComment] = useState<[] | typeOfComment[]>([]);
  const [media, setMedia] = useState<any>();
  const [pages, setPages] = useState('text');
  const [isSymbol, setIsSymbol] = useState(false);
  const [lastWordWithSymbol, setLastWordsWithSymbol] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState<typeOfSelected>({
    id: '',
    tag: ''
  });
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [userInfo, setUserInfo] = useState<UserData>(initialUserInfo);
  const [displayValue, setDisplayValue] = useState('');
  const [tagMapping, setTagMapping] = useState({});
  const [form, setForm] = useState<typeOfForm>({
    content_text: '',
    media_url: '',
    media_type: ''
  });
  const [parent, setParent] = useState<typeOfParent>({
    id: '',
    seedsTag: ''
  });
  const [tagLists, setTagLists] = useState<any>([]);
  const [otherTagId, setOtherTagId] = useState(1);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [dollarLists, setDollarLists] = useState<any>([]);
  const [otherTagList, setOtherTagList] = useState<any>({
    peopleList: [],
    circleList: [],
    playList: []
  });

  const fetchDetailCirclePost = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { data } = await getDetailCirclePost({ postId });

      setDataPost(data);
    } catch (error) {
      toast.error(`Error fetching Circle Detail: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComment = async (): Promise<void> => {
    try {
      setIsLoadingComment(true);
      const { data } = await getAllComment({ postId });
      setDataComment(data);
    } catch (error) {
      toast.error(`Error fetching Circle Detail: ${error as string}`);
    } finally {
      setIsLoadingComment(false);
    }
  };
  useEffect(() => {
    void fetchDetailCirclePost();
    void fetchComment();
  }, [postId]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await getUserInfo();
        setUserInfo(response);
      } catch (error) {
        toast.error(`Error fetching data: ${error as string}`);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, []);

  useEffect(() => {
    if (selectedValue.tag.length > 0) {
      setIsSymbol(false);
      if (form.content_text.includes(' ')) {
        let isSpace = false;
        const words = form.content_text.split(' ');
        const currentWord = words[words.length - 1];
        const wordBefore = words[words.length - 2];
        if (wordBefore.endsWith(' ')) {
          wordBefore.replace(' ', '');
          words.pop();
          isSpace = true;
        }
        words.pop();
        let newVal = '';
        if (currentWord.includes('@')) {
          const newActualTag = `@[${selectedValue.tag}](${selectedValue.id})`;
          const newTagMapping = {
            ...tagMapping,
            [`@${selectedValue.tag}`]: newActualTag
          };
          setTagMapping(newTagMapping);
          if (isSpace) {
            newVal = words.join(' ') + wordBefore + newActualTag;
          } else {
            newVal = words.join(' ') + newActualTag;
          }
        }
        if (currentWord.includes('$')) {
          const newActualTag = `$[${selectedValue.tag}](${selectedValue.id})`;
          const newTagMapping = {
            ...tagMapping,
            [`$${selectedValue.tag}`]: newActualTag
          };
          setTagMapping(newTagMapping);
          newVal = words.join(' ') + newActualTag;
        }
        setForm(prevForm => ({
          ...prevForm,
          content_text: newVal
        }));
        setSelectedValue({
          id: '',
          tag: ''
        });
      } else {
        if (form.content_text.includes('@')) {
          const newActualTag = `@[${selectedValue.tag}](${selectedValue.id})`;
          const newTagMapping = {
            ...tagMapping,
            [`@${selectedValue.tag}`]: newActualTag
          };
          setTagMapping(newTagMapping);
          setForm(prevForm => ({
            ...prevForm,
            content_text: newActualTag
          }));
        }
        if (form.content_text.includes('$')) {
          const newActualTag = `$[${selectedValue.tag}](${selectedValue.id})`;
          const newTagMapping = {
            ...tagMapping,
            [`$${selectedValue.tag}`]: newActualTag
          };
          setTagMapping(newTagMapping);
          setForm(prevForm => ({
            ...prevForm,
            content_text: newActualTag
          }));
        }
        setSelectedValue({
          id: '',
          tag: ''
        });
      }
      if (displayValue.includes(' ')) {
        const words = displayValue.split(' ');
        const currentWord = words[words.length - 1];
        words.pop();
        let newVal = '';
        if (currentWord.includes('@')) {
          newVal = words.join(' ') + ` @${selectedValue.tag} `;
        }
        if (currentWord.includes('$')) {
          newVal = words.join(' ') + ` $${selectedValue.tag} `;
        }
        setDisplayValue(newVal);
        setSelectedValue({
          id: '',
          tag: ''
        });
      } else {
        if (displayValue.includes('@')) {
          setDisplayValue(`@${selectedValue.tag} `);
        }
        if (form.content_text.includes('$')) {
          setDisplayValue(`$${selectedValue.tag} `);
        }
        setSelectedValue({
          id: '',
          tag: ''
        });
      }
    }
  }, [selectedValue]);

  useEffect(() => {
    if (
      lastWordWithSymbol.includes('@') ||
      lastWordWithSymbol.includes('#') ||
      lastWordWithSymbol.includes('$')
    ) {
      setIsSymbol(true);
    } else {
      setIsSymbol(false);
    }
  }, [lastWordWithSymbol]);

  const handleFormChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): any => {
    const { name, value } = event.target;
    setDisplayValue(value);
    let newActualValue = value;
    for (const [key, value] of Object.entries(tagMapping)) {
      newActualValue = newActualValue.replace(key, value as string);
    }
    setForm(prevForm => ({ ...prevForm, [name]: newActualValue }));
    const API_TYPE = ['people', 'plays', 'circles'];
    const matches: any = value.match(/[@#$]\[.*?\]\(.*?\)|[@#$]\w+/g);
    const words = value.split(' ');
    const currentWord = words[words.length - 1];
    if (words.length > 0) {
      setLastWordsWithSymbol(currentWord);
    } else {
      setLastWordsWithSymbol(value);
    }
    if (matches?.length > 0) {
      const lastMention = matches[matches.length - 1];
      const cleanedValue = lastMention.replace(/[#$@]/g, '');
      if (debounceTimer !== null) clearTimeout(debounceTimer);
      if (lastMention.length > 3) {
        setDebounceTimer(
          setTimeout((): void => {
            void (async (): Promise<void> => {
              try {
                if (lastMention.includes('#') === true) {
                  const { data }: any = await getUserTagList(
                    'hashtags',
                    cleanedValue
                  );

                  setHashtags(
                    data?.map((item: any) => ({
                      ...item,
                      id: `${item.id as string}-hashtag`
                    }))
                  );
                } else if (lastMention.includes('$') === true) {
                  const { data }: any = await getUserTagList(
                    'assets',
                    cleanedValue
                  );

                  setDollarLists(
                    data?.map((item: any) => ({
                      ...item,
                      id: `${item.id as string}-asset`
                    }))
                  );
                } else if (lastMention.includes('@') === true) {
                  const promises = API_TYPE.map(async key => {
                    return await getUserTagList(key, cleanedValue);
                  });
                  const results: any = await Promise.all(promises);
                  setOtherTagList({
                    peopleList: results[0]?.data?.map((item: any) => ({
                      ...item,
                      id: `${item.id as string}-people`
                    })),
                    playList: results[1]?.data?.map((item: any) => ({
                      ...item,
                      id: `${item.id as string}-play`
                    })),
                    circleList: results[2]?.data?.map((item: any) => ({
                      ...item,
                      id: `${item.id as string}-circle`
                    }))
                  });
                  setTimeout(() => {
                    if (results[0]?.data?.length > 0) {
                      setOtherTagId(1);
                      setTagLists(
                        results[0].data.map((item: any) => ({
                          ...item,
                          id: `${item.id as string}-people`
                        }))
                      );
                    } else if (results[1]?.data?.length > 0) {
                      setOtherTagId(3);
                      setTagLists(
                        results[1].data.map((item: any) => ({
                          ...item,
                          id: `${item.id as string}-play`
                        }))
                      );
                    } else if (results[2]?.data?.length > 0) {
                      setOtherTagId(2);
                      setTagLists(
                        results[2].data.map((item: any) => ({
                          ...item,
                          id: `${item.id as string}-circle`
                        }))
                      );
                    }
                  }, 500);
                }
              } catch (err) {
                toast.error(`${err as string}`);
              }
            })();
          }, 500)
        );
      }
    }
  };
  const selectTypeTag = (type: any): void => {
    setOtherTagId(type?.id);
    if (type?.id === 1) {
      setTagLists(otherTagList?.peopleList);
    }
    if (type?.id === 2) {
      setTagLists(otherTagList?.circleList);
    }
    if (type?.id === 3) {
      setTagLists(otherTagList?.playList);
    }
  };

  const processText = (text: string): string => {
    const processedText = text.replace(/#(\w+)/g, '#[$1]()');
    return processedText;
  };

  useEffect(() => {
    const delay = 3000;
    const timeoutId = setTimeout(() => {
      const processedText = processText(form.content_text);
      if (hashtags?.length < 1) {
        setForm(prevForm => ({
          ...prevForm,
          content_text: processedText
        }));
      }
    }, delay);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [form.content_text]);

  const postMedia = async (mediaFile: any): Promise<void> => {
    try {
      const { data }: { data: { path: string } } = await UseUploadMedia(
        mediaFile
      );
      mediaArr.push(data.path);
    } catch (error) {
      toast.error(`Error Post Media: ${error as string}`);
    }
  };

  const handlePostCircle = async (event: any): Promise<void> => {
    event.preventDefault();
    try {
      setIsLoading(true);
      if (media !== undefined && media !== null) {
        await postMedia(media);
      }

      if (parent.id.length > 0) {
        const payload: typeOfCommentForm = {
          content_text: form.content_text.replace(`~${parent.seedsTag} `, ''),
          media_url: mediaArr.length > 0 ? mediaArr[0] : form.media_url,
          user_id: userInfo.id,
          post_id: dataPost?.id,
          parent_id: parent.id,
          media_type: form.media_type
        };
        await createComment(payload);
      } else {
        const payload: typeOfCommentForm = {
          content_text: form.content_text,
          media_url: mediaArr.length > 0 ? mediaArr[0] : form.media_url,
          user_id: userInfo.id,
          post_id: dataPost?.id,
          parent_id: parent.id,
          media_type: form.media_type
        };
        await createComment(payload);
      }

      setForm({
        content_text: '',
        media_url: '',
        media_type: ''
      });

      setParent({
        id: '',
        seedsTag: ''
      });
      setGolId(golId + 1);
      setDisplayValue('');
      setMediaArr([]);
      setMedia(undefined);
      setHashtags([]);
      await fetchDetailCirclePost();
      await fetchComment();
    } catch (error) {
      toast.error(`Error fetching Circle Detail: ${error as string}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (parent.seedsTag.length > 0) {
      setDisplayValue(`~${parent.seedsTag} `);
      setForm((prevForm: typeOfForm) => ({
        ...prevForm,
        content_text: `~${parent.seedsTag} `
      }));
    } else {
      setDisplayValue('');
      setForm((prevForm: typeOfForm) => ({
        ...prevForm,
        content_text: ''
      }));
    }
  }, [parent.id, parent.seedsTag]);

  const renderLoading = (): JSX.Element => (
    <div className="h-72 flex justify-center">
      <div className="animate-spinner w-16 h-16 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
    </div>
  );

  const handlePages = (): any => {
    if (pages === 'text') {
      return (
        <>
          <CommentInput
            handleFormChange={handleFormChange}
            displayValue={displayValue}
            setIsLoading={setIsLoading}
            renderUserSuggestion={renderUserSuggestion()}
            renderUserHashtags={renderUserHashtags()}
            renderDollarSuggestion={renderDollarSuggestion()}
          />
        </>
      );
    } else if (pages === 'gif') {
      return (
        <GifSection setPages={setPages} setForm={setForm} setMedia={setMedia} />
      );
    }
  };

  const renderAvatar = (imageUrl: string): JSX.Element => {
    return (
      <img
        src={imageUrl}
        alt={`image avatar`}
        className="rounded-full h-[48px] w-[48px] object-cover"
      />
    );
  };

  const renderNameAndTag = (name: string, seedsTag: string): JSX.Element => {
    return (
      <div className="flex flex-col">
        <Typography className="text-lg text-black font-poppins font-medium">
          {name}
        </Typography>
        <Typography className="font-poppins text-neutral-medium text-base">
          @{seedsTag}
        </Typography>
      </div>
    );
  };

  const renderHashtags = (name: string, desc: string): JSX.Element => {
    return (
      <div className="flex flex-col">
        <Typography className="text-lg text-black font-poppins font-medium">
          #{name}
        </Typography>
        <Typography className="font-poppins text-neutral-medium text-base">
          {desc} posts
        </Typography>
      </div>
    );
  };

  const renderUserSuggestion = (): JSX.Element | undefined => {
    if (
      lastWordWithSymbol.length > 3 &&
      lastWordWithSymbol.includes('@') &&
      isSymbol
    ) {
      return (
        <div className="absolute shadow-lg border-x w-[90%] border-b border-black/20 bg-white pb-2 rounded-b-xl">
          <div className="flex justify-center gap-4">
            {tagOption.map((el: { id: number; name: string }, i: number) => {
              return (
                <div
                  className={`flex items-center p-2 border rounded-lg cursor-pointer px-4 ${
                    otherTagId === el.id
                      ? 'border-seeds-button-green bg-seeds-button-green/20'
                      : 'border-neutral-soft'
                  }`}
                  key={el.id}
                  onClick={() => {
                    selectTypeTag(el);
                  }}
                >
                  <Typography
                    className={`font-poppins text-base font-normal ${
                      otherTagId === el.id
                        ? 'text-seeds-button-green'
                        : 'text-neutral-soft'
                    }`}
                  >
                    {el.name}
                  </Typography>
                </div>
              );
            })}
          </div>
          <div className="max-h-[400px] overflow-auto w-[90%] ml-10">
            {tagLists?.map((el: any, i: number) => {
              return (
                <div
                  className="flex py-2 border-b border-neutral-soft cursor-pointer gap-2"
                  key={el.id}
                  onClick={() => {
                    const newTag = {
                      tag: el.tag,
                      id: el?.id
                    };
                    if (
                      el?.members !== undefined ||
                      el?.participants !== undefined
                    ) {
                      newTag.tag = el?.name;
                    }
                    setOtherTagList({
                      peopleList: [],
                      circleList: [],
                      playList: []
                    });
                    setSelectedValue(newTag);
                    setIsSymbol(false);
                  }}
                >
                  {el?.avatar !== undefined
                    ? renderAvatar(el?.avatar)
                    : el?.banner !== undefined
                    ? renderAvatar(el?.banner)
                    : null}
                  {el?.tag !== undefined ? (
                    renderNameAndTag(el?.name, el?.tag)
                  ) : el?.members !== undefined ? (
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <Typography className="text-lg text-black font-poppins font-medium">
                          {el?.name}
                        </Typography>
                        <Typography className="font-poppins text-neutral-soft text-base font-normal">
                          {el?.members} members
                        </Typography>
                      </div>
                      <div className="flex items-center">
                        {el?.hashtags?.map((el: any, i: number) => {
                          return (
                            <Typography
                              key={`${el as string}${i}`}
                              className="font-poppins text-seeds-button-green text-base font-semibold"
                            >
                              #{el}
                            </Typography>
                          );
                        })}
                      </div>
                    </div>
                  ) : el?.participants !== undefined ? (
                    <div className="flex flex-col gap-2">
                      <Typography className="text-lg text-black font-poppins font-medium">
                        {el?.name}
                      </Typography>
                      <Typography className="font-poppins text-neutral-soft text-base font-normal">
                        {el?.participants} participants
                      </Typography>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  const renderDollarSuggestion = (): JSX.Element | undefined => {
    if (
      lastWordWithSymbol.length > 3 &&
      lastWordWithSymbol.includes('$') &&
      isSymbol
    ) {
      return (
        <div className="absolute shadow-lg border-x w-[90%] border-b border-black/20 bg-white pb-2 rounded-b-xl">
          <div className="max-h-[400px] overflow-auto w-[90%] ml-10">
            {dollarLists?.map((el: any) => {
              return (
                <div
                  className="flex py-2 border-b border-neutral-soft cursor-pointer gap-2"
                  key={el.id}
                  onClick={() => {
                    const newDollar = {
                      tag: el.ticker,
                      id: el?.id
                    };
                    setSelectedValue(newDollar);
                    setIsSymbol(false);
                  }}
                >
                  {renderAvatar(el?.logo)}
                  <div className="flex flex-col">
                    <Typography className="text-lg text-black font-poppins font-medium">
                      {el?.ticker} / <span>{el?.currency}</span>
                    </Typography>
                    <Typography className="font-poppins text-neutral-soft text-base font-normal">
                      {el?.name}
                    </Typography>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  const renderUserHashtags = (): JSX.Element | undefined => {
    if (
      lastWordWithSymbol.length > 3 &&
      lastWordWithSymbol.includes('#') &&
      isSymbol
    ) {
      return (
        <div className="absolute shadow-lg border-x w-[90%] border-b border-black/20 bg-white pb-2 rounded-b-xl">
          <div className="max-h-[400px] overflow-auto w-[90%] ml-10">
            {hashtags?.map((hashtag: any) => {
              return (
                <div
                  className="flex py-2 border-b border-neutral-soft cursor-pointer gap-2"
                  key={hashtag.counter}
                  onClick={() => {
                    const newTag = {
                      tag: hashtag.hashtag,
                      id: ''
                    };
                    setSelectedValue(newTag);
                    setIsSymbol(false);
                  }}
                >
                  {renderHashtags(hashtag.hashtag, hashtag.counter)}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };
  return (
    <PageGradient defaultGradient className="overflow-hidden">
      {isLoading && <Loading />}
      <div className="flex justify-center">
        <div className="bg-transparent w-full">
          <div className="flex md:gap-8 flex-col">
            <div className="relative">
              <div className="bg-white my-8 rounded-xl shadow-sm">
                <div className="flex justify-start pl-16 gap-10 pt-4">
                  <Image
                    src={ArrowBackwardIcon}
                    alt="Back"
                    width={30}
                    height={30}
                    className="cursor-pointer"
                    onClick={() => {
                      router.back();
                    }}
                  />
                  <Typography className="text-xl font-semibold font-poppins">
                    Comment
                  </Typography>
                </div>
                <div className="h-fit w-full py-8 px-8 md:px-14">
                  <div className="flex flex-col">
                    {dataPost !== null && (
                      <PostSection
                        dataPost={dataPost}
                        setData={setDataPost}
                        userInfo={userInfo}
                      />
                    )}
                  </div>
                  <div className="block bg-white w-full rounded-xl">
                    <div className="flex flex-col pt-8 border-b border-neutral-ultrasoft">
                      {handlePages()}
                      {/* form text section */}
                      <form onSubmit={handlePostCircle}>
                        {media !== undefined && pages !== 'gif' && (
                          <div className="flex justify-start pb-2 pl-14">
                            {media.type.includes('image') === true ? (
                              <img
                                src={URL?.createObjectURL(media)}
                                alt="Preview Image"
                                className="object-cover max-h-[30vh] w-fit"
                              />
                            ) : (
                              <video
                                controls
                                className="max-w-[50vw] max-h-[50vh] object-fit"
                                key={URL?.createObjectURL(media)}
                              >
                                <source
                                  src={URL?.createObjectURL(media)}
                                  type="video/mp4"
                                />
                                Browser Anda tidak mendukung tag video.
                              </video>
                            )}
                          </div>
                        )}

                        <div className="flex justify-start pl-14 gap-4">
                          {form.media_url.length > 0 && pages !== 'gif' && (
                            <img
                              src={form.media_url}
                              alt="gif"
                              className="h-[230px] w-[230px] object-cover"
                            />
                          )}
                        </div>
                        {pages !== 'gif' && (
                          <UniqueInputComment
                            setPages={setPages}
                            setMedia={setMedia}
                            setForm={setForm}
                            form={form}
                          />
                        )}
                      </form>
                    </div>
                  </div>
                  <div className="mt-4">
                    {isLoadingComment && renderLoading()}
                    {dataPost !== undefined && dataPost !== null && (
                      <div className="flex flex-col">
                        {dataPost.total_comment > 0 ? (
                          <div className="py-2">
                            {dataComment !== undefined &&
                              !isLoadingComment &&
                              dataComment.map(
                                (el: typeOfComment, i: number) => {
                                  return (
                                    <CommentSection
                                      dataPost={el}
                                      idx={i}
                                      setDataComment={setDataComment}
                                      setParent={setParent}
                                      golId={golId}
                                      key={`${el.id} ${i}`}
                                    />
                                  );
                                }
                              )}
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <Typography className="text-base text-black font-medium font-poppins">
                              Be the first to comment!
                            </Typography>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageGradient>
  );
};

export default withAuth(Comment);
