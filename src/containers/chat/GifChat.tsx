import {
  getGifFromGhipy,
  searchGifFromGhipy
} from '@/repository/circleDetail.repository';
import { type GiphyData, type GiphyI } from '@/utils/interfaces/chat.interface';
import Image from 'next/image';
import { Search } from 'public/assets/vector';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface props {
  sendGif: (mediaUrl: string) => Promise<void>;
  onClose: () => void;
}

const GifChat: React.FC<props> = ({ onClose, sendGif }) => {
  const [dataGif, setData] = useState<GiphyData[] | undefined>();
  const [search, setSearch] = useState({
    searchGif: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const cancelHandler = (): void => {
    onClose();
  };

  const fetchGif = async (): Promise<void> => {
    try {
      setIsLoading(true);
      const { data } = (await getGifFromGhipy()) as GiphyI;
      setData(data);
    } catch (error: any) {
      toast(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderLoading = (): JSX.Element => (
    <div className="h-72 flex justify-center">
      <div className="animate-spinner w-16 h-16 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
    </div>
  );

  useEffect(() => {
    void fetchGif();
  }, []);

  const handlePostGif = async (url: string): Promise<void> => {
    await sendGif(url);
  };

  const handleFormChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const { name, value } = event.target;
    setSearch(prevSearch => ({ ...prevSearch, [name]: value }));
    try {
      setIsLoading(true);
      const { data } = await searchGifFromGhipy(value);
      setData(data);
    } catch (error: any) {
      toast(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hidden md:block bg-white pb-4 w-full">
      <div className="flex h-14 w-[375px] justify-between px-2">
        <div className="flex items-center">
          <h1 className="font-poppins font-semibold text-lg">GIF</h1>
        </div>
        <div className="flex flex-col justify-center">
          <button type="button" onClick={cancelHandler}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.281 18.2193C19.3507 18.289 19.406 18.3717 19.4437 18.4628C19.4814 18.5538 19.5008 18.6514 19.5008 18.7499C19.5008 18.8485 19.4814 18.9461 19.4437 19.0371C19.406 19.1281 19.3507 19.2109 19.281 19.2806C19.2114 19.3502 19.1286 19.4055 19.0376 19.4432C18.9465 19.4809 18.849 19.5003 18.7504 19.5003C18.6519 19.5003 18.5543 19.4809 18.4632 19.4432C18.3722 19.4055 18.2895 19.3502 18.2198 19.2806L12.0004 13.0602L5.78104 19.2806C5.64031 19.4213 5.44944 19.5003 5.25042 19.5003C5.05139 19.5003 4.86052 19.4213 4.71979 19.2806C4.57906 19.1398 4.5 18.949 4.5 18.7499C4.5 18.5509 4.57906 18.36 4.71979 18.2193L10.9401 11.9999L4.71979 5.78055C4.57906 5.63982 4.5 5.44895 4.5 5.24993C4.5 5.05091 4.57906 4.86003 4.71979 4.7193C4.86052 4.57857 5.05139 4.49951 5.25042 4.49951C5.44944 4.49951 5.64031 4.57857 5.78104 4.7193L12.0004 10.9396L18.2198 4.7193C18.3605 4.57857 18.5514 4.49951 18.7504 4.49951C18.9494 4.49951 19.1403 4.57857 19.281 4.7193C19.4218 4.86003 19.5008 5.05091 19.5008 5.24993C19.5008 5.44895 19.4218 5.63982 19.281 5.78055L13.0607 11.9999L19.281 18.2193Z"
                fill="#262626"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="flex justify-center mt-2 px-2 relative">
        <form>
          <input
            type="text"
            name="searchGif"
            value={search.searchGif}
            onChange={handleFormChange}
            className="h-10 pl-12 focus:outline-none placeholder:text-neutral-soft rounded-full w-[350px] border border-neutral-ultrasoft"
            placeholder="Memes Stock"
          />
        </form>
        <div className="flex justify-center flex-col absolute right-8 top-2">
          <Image alt="Search" src={Search} className="h-6 w-6 object-cover" />
        </div>
      </div>
      {isLoading ? (
        renderLoading()
      ) : (
        <div className="grid grid-cols-5 gap-3 mt-8 px-2">
          {dataGif?.map((el: GiphyData, i: number) => {
            return (
              <div
                className="max-h-[230px]"
                onClick={async () => {
                  await handlePostGif(el.images.preview_gif.url);
                }}
                key={`${i} + 'GHIPHY'`}
              >
                <img
                  alt="gif"
                  src={el?.images?.preview_gif.url}
                  className="h-full w-full object-cover cursor-pointer"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default GifChat;
