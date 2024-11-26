import { XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogBody, DialogHeader } from '@material-tailwind/react';

interface props {
  handleOpen: () => void;
  isOpen: boolean;
  onPersonalClick: () => void;
  onGroupClick: () => void;
}

const ModalNewChat: React.FC<props> = ({
  handleOpen,
  isOpen,
  onPersonalClick,
  onGroupClick
}) => {
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
            onClick={onPersonalClick}
          >
            <p className="text-xs font-semibold text-black">Personal</p>
          </div>

          <div
            className="bg-gray-200 p-4 rounded-xl border border-gray-300 cursor-pointer"
            onClick={onGroupClick}
          >
            <p className="text-xs font-semibold text-black">Group</p>
          </div>
        </div>
      </DialogBody>
    </Dialog>
  );
};

export default ModalNewChat;
