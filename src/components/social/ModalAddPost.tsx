import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogBody, DialogHeader } from '@material-tailwind/react';
import { useRouter } from 'next/router';

interface props {
  handleOpen: any;
  isOpen: boolean;
  openModalPost: any;
}

const ModalAddPost: React.FC<props> = ({
  handleOpen,
  isOpen,
  openModalPost
}) => {
  const router = useRouter();

  return (
    <Dialog
      open={isOpen}
      handler={handleOpen}
      size="sm"
      className="max-w-full w-[90%] md:w-[50%] lg:w-[20%]"
    >
      <DialogHeader className="flex justify-between items-center p-2">
        <p></p>
        <XMarkIcon
          className="cursor-pointer"
          width={30}
          height={30}
          onClick={handleOpen}
        />
      </DialogHeader>

      <DialogBody>
        <div className="flex flex-col ">
          <div
            className="bg-gray-200 p-4 rounded-xl mb-4 border border-gray-300 cursor-pointer"
            onClick={openModalPost}
          >
            <p className="text-xs font-semibold text-black">Create Post</p>
            <p className="text-xs font-normal text-[#7C7C7C]">
              Share your story now
            </p>
          </div>

          <div
            className="bg-gray-200 p-4 rounded-xl border border-gray-300 cursor-pointer"
            onClick={() => {
              void router.push('/connect/create-circle');
            }}
          >
            <p className="text-xs font-semibold text-black">Create Circle</p>
            <p className="text-xs font-normal border-gray-100 text-[#7C7C7C]">
              Create your own Circle
            </p>
          </div>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default ModalAddPost;
