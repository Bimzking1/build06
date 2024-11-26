import {
  Button,
  Dialog,
  DialogBody,
  Typography
} from '@material-tailwind/react';

interface ModalImage {
  openImage: boolean;
  handleOpenImage: any;
  handleFileChange: any;
  setSelect: any;
}

const ModalImageEdit: React.FC<ModalImage> = ({
  openImage,
  handleOpenImage,
  handleFileChange,
  setSelect
}: ModalImage) => {
  return (
    <Dialog open={openImage} handler={handleOpenImage} size="xs">
      <DialogBody className="flex flex-col gap-4">
        <Typography className="font-poppins font-bold text-sm text-[#262626]">
          Add Profile Photo
        </Typography>
        <label
          className=" w-full py-3 px-6 font-poppins font-bold text-xs text-[#262626] bg-[#E9E9E9] rounded-full cursor-pointer shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
          htmlFor="fileInput"
        >
          Choose from Gallery
        </label>
        <input
          id="fileInput"
          type="file"
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />
        <Button
          onClick={() => {
            handleOpenImage();
            setSelect(2);
          }}
          className="w-full text-left capitalize font-poppins font-bold text-xs text-[#262626] bg-[#E9E9E9] rounded-full"
        >
          Choose Avatar
        </Button>
      </DialogBody>
    </Dialog>
  );
};

export default ModalImageEdit;
