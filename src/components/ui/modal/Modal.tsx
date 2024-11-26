import { useEffect, useState, type ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface BackdropProps {
  onClose?: () => void;
  className?: string;
  style?: object;
}

interface ModalOverlayProps {
  children: ReactNode;
  className?: string;
  style?: object;
}

interface ModalProps {
  onClose?: () => void;
  children: ReactNode;
  modalClasses?: string;
  backdropClasses?: string;
  modalStyle?: object;
  backdropStyle?: object;
  withRating?: boolean;
  withTextArea?: boolean;
  topPlacement?: string;
}

const backdropDefaultClasses =
  'z-20 fixed top-0 left-0 w-full h-screen bg-black/75';

const Backdrop: React.FC<BackdropProps> = ({ className, style, onClose }) => {
  return <div className={className} style={style} onClick={onClose} />;
};

const ModalOverlay: React.FC<ModalOverlayProps> = ({
  className,
  style,
  children
}) => {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
};

const Modal: React.FC<ModalProps> = ({
  withRating = false,
  withTextArea = false,
  modalClasses,
  backdropClasses,
  modalStyle,
  backdropStyle,
  onClose,
  children,
  topPlacement
}) => {
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalElement(document?.querySelector<HTMLElement>('#portal'));
  }, []);

  let top = 'top-[50%]';

  if (!withRating && withTextArea) {
    top = 'top-[45%]';
  } else if (withRating && withTextArea) {
    top = 'top-[40%]';
  }

  const modalDefaultClasses = `z-50 animate-slide-down fixed sm:left-[50%] ${
    topPlacement !== undefined ? topPlacement : top
  } left-[5%] sm:ml-[-13.125rem] mt-[-12.35rem] sm:w-[26.25rem] w-[90%] h-fit p-4 text-center rounded-3xl shadow-[0 2px 8px rgba(0, 0, 0, 0.25)] bg-white`;

  return portalElement !== null ? (
    <>
      {ReactDOM.createPortal(
        <Backdrop
          onClose={onClose}
          className={backdropClasses ?? backdropDefaultClasses}
          style={backdropStyle}
        />,
        portalElement
      )}
      {ReactDOM.createPortal(
        <ModalOverlay
          className={modalClasses ?? modalDefaultClasses}
          style={modalStyle}
        >
          {children}
        </ModalOverlay>,
        portalElement
      )}
    </>
  ) : null;
};

export default Modal;
