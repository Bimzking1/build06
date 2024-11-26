'use client';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  DialogBody,
  DialogHeader,
  IconButton,
  Dialog as TailwindDialog,
  Typography
} from '@material-tailwind/react';

interface Props {
  children: React.ReactNode;
  title: string;
  handleClose: () => void;
  isOpen: boolean;
  bottomSheetOnSmall?: boolean;
}

const Dialog: React.FC<Props> = ({
  title,
  handleClose,
  isOpen,
  children,
  bottomSheetOnSmall = false
}) => {
  const bottomSheetOnSmallClass = `max-h-[90vh] h-auto self-end mb-0 pb-16 md:pb-0 sm:self-center sm:mb-4 max-w-full sm:min-w-sm sm:max-w-sm sm:w-sm md:min-w-sm md:max-w-sm lg:min-w-sm lg:max-w-sm xl:min-w-sm xl:max-w-sm 2xl:min-w-sm 2xl:max-w-sm overflow-y-scroll`;

  return (
    <TailwindDialog
      size="sm"
      className={bottomSheetOnSmall ? bottomSheetOnSmallClass : undefined}
      open={isOpen}
      handler={handleClose}
    >
      <DialogHeader className="justify-between w-full p-6 pb-0">
        <Typography className="text-[#262626] text-md font-semibold">
          {title}
        </Typography>
        <IconButton
          color="blue-gray"
          size="sm"
          variant="text"
          onClick={handleClose}
        >
          <XMarkIcon strokeWidth={2} className="h-5 w-5" />
        </IconButton>
      </DialogHeader>
      <DialogBody className="overflow-y-scroll px-6">{children}</DialogBody>
    </TailwindDialog>
  );
};

export default Dialog;
