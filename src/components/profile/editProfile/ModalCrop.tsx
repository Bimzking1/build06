import { Button, Dialog, DialogFooter } from '@material-tailwind/react';
import { useState } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
interface ModalCrop {
  updateAvatar: any;
  openCrop: boolean;
  handleOpenCrop: any;
}

const ModalImageCrop: React.FC<ModalCrop> = ({
  updateAvatar,
  openCrop,
  handleOpenCrop
}: ModalCrop) => {
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    x: 25,
    y: 25,
    width: 50,
    height: 50
  });
  return (
    <>
      <Dialog
        open={openCrop}
        handler={handleOpenCrop}
        className="w-[500px] h-[500px]"
      >
        {updateAvatar === true && (
          <ReactCrop
            crop={crop}
            onChange={(pixel, percent) => {
              setCrop(percent);
            }}
            circularCrop
            keepSelection
          >
            <img
              src={URL.createObjectURL(updateAvatar)}
              alt="upload"
              className="h-[500px]"
            />
          </ReactCrop>
        )}
        <DialogFooter>
          <Button className="bg-[#3AC4A0] w-full rounded-full capitalize font-poppins font-bold text-sm">
            Upload Image
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default ModalImageCrop;
