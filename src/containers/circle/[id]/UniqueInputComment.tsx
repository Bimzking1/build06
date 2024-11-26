import { type typeOfForm } from '@/pages/connect/comment/[postId]';
import Image from 'next/image';
import { GIFV2, galleryV2 } from 'public/assets/circle';
interface form {
  content_text: string;
  media_url: string;
  media_type: string;
}
interface props {
  setPages: any;
  setMedia: any;
  setForm: any;
  form: typeOfForm;
}
const UniqueInputComment: React.FC<props> = ({
  setPages,
  setMedia,
  setForm,
  form
}) => {
  const handlePages = (page: string): any => {
    return setPages(page);
  };

  const handleGallery = (): any => {
    document.getElementById('MediaUpload')?.click();
  };

  const handleImage = (event: any): any => {
    const fileMedia = event.target.files[0];
    const fileMediaEle = event.target;

    if (fileMedia?.type?.includes('video') === true) {
      const maxFileMediaSize = 128;
      const sizeFileOnMB: any = parseFloat(
        (fileMedia?.size / 1024 / 1024).toFixed(20)
      );
      if (sizeFileOnMB > maxFileMediaSize) {
        fileMediaEle.value = null;
        return new Error(
          'Vidio yang anda Upload melebihi batas maksimal Upload (128 Megabyte)'
        );
      } else {
        setForm((prevForm: form) => ({
          ...prevForm,
          media_url: '',
          media_type: 'video'
        }));
        return setMedia(fileMedia);
      }
    }

    const validation =
      fileMedia?.type !== 'image/jpg' &&
      fileMedia?.type !== 'image/jpeg' &&
      fileMedia?.type !== 'image/png';
    const maxFileMediaSize = 5;
    const sizeFileOnMB: any = parseFloat(
      (fileMedia?.size / 1024 / 1024).toFixed(20)
    );
    if (sizeFileOnMB > maxFileMediaSize && !validation) {
      fileMediaEle.value = null;
      return new Error(
        'Foto yang anda Upload melebihi batas maksimal Upload (5 Megabyte)'
      );
    } else {
      setForm((prevForm: form) => ({
        ...prevForm,
        media_url: '',
        media_type: 'image'
      }));
      return setMedia(fileMedia);
    }
  };

  const isEmpty = (): boolean => {
    if (form?.content_text === '' && form?.media_type === '') {
      return true;
    } else {
      return false;
    }
  };

  return (
    <div className="flex justify-between pb-10">
      <input
        type="file"
        id="MediaUpload"
        onChange={handleImage}
        className="hidden"
        accept="image/jpg,image/jpeg,image/png,video/mp4"
      />
      <div className="flex gap-4">
        {/* GIF */}
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => {
              handlePages('gif');
            }}
            className="pt-2"
          >
            <Image
              alt="unique_post"
              src={GIFV2}
              width={30}
              height={30}
              className="object-cover"
            />
          </button>
        </div>
        {/* gallery */}
        <div className="flex flex-col">
          <button type="button" onClick={handleGallery} className="pt-2">
            <Image
              alt="unique_post"
              src={galleryV2}
              width={30}
              height={30}
              className="object-cover"
            />
          </button>
        </div>
      </div>
      {/* post button */}
      <div className="flex justify-end h-full">
        <button
          disabled={isEmpty()}
          type="submit"
          className={`flex justify-center py-2 items-center rounded-full px-6 text-white font-semibold font-poppins h-fit ${
            isEmpty() ? 'bg-[#d3d3d3]' : 'bg-seeds-button-green'
          }`}
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default UniqueInputComment;
