import {
  Dialog,
  DialogBody,
  Spinner,
  Typography
} from '@material-tailwind/react';

interface Props {
  open: boolean;
  handleOpen: () => void;
}

const Redirecting = ({ open, handleOpen }: Props): JSX.Element => {
  return (
    <Dialog
      open={open}
      handler={handleOpen}
      dismiss={{ enabled: false }}
      size="xs"
    >
      <DialogBody className="flex justify-center items-center gap-2 rounded-3xl">
        <Spinner color="teal" className="h-4 w-4 text-[#3AC4A0]/70" />
        <Typography className="font-normal font-poppins text-base text-[#3AC4A0]">
          Redirecting
        </Typography>
      </DialogBody>
    </Dialog>
  );
};

export default Redirecting;
