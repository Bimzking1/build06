// import InputPin from '../InputPin';
import Modal from '../ui/modal/Modal';

interface Props {
  onClose: () => void;
  title: string;
  continueHandler: any;
}

const ConfirmPinPopUp: React.FC<Props> = ({
  onClose,
  continueHandler,
  title
}) => {
  return (
    <Modal
      onClose={onClose}
      modalClasses="z-30 animate-slide-down  fixed sm:left-[50%] top-[50%] left-[5%] sm:ml-[-13.125rem] mt-[-12.35rem] sm:w-[30rem] w-[90%] h-fit p-4 text-center rounded-3xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white"
    >
      <br />
      {/* <InputPin onCancel={onClose} onContinue={continueHandler} title={title} /> */}
    </Modal>
  );
};

export default ConfirmPinPopUp;
