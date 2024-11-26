import Modal from '../ui/modal/Modal';

const Loading: React.FC = () => {
  return (
    <Modal modalClasses="animate-fade-in z-50 fixed left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 w-36 h-36 rounded-3xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white">
      <div className="animate-spinner absolute top-1/2 left-1/2 -mt-8 -ml-8 w-16 h-16 border-8 border-gray-200 border-t-seeds-button-green rounded-full" />
    </Modal>
  );
};

export default Loading;
