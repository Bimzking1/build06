import type { DefaultTFuncReturn } from 'i18next';
import type { StaticImageData } from 'next/image';
import Image from 'next/image';
import { Email, XIcon } from 'public/assets/vector';
import { useState } from 'react';

import Button from '../ui/button/Button';
import TextArea from '../ui/input/TextArea';
import Modal from '../ui/modal/Modal';
import Rating from '../ui/rating/Rating';

interface PopupProps {
  onClose: () => void;
  onContinue: (payload?: object) => void;
  title?: string | DefaultTFuncReturn;
  subtitle?: string | DefaultTFuncReturn;
  label?: string | DefaultTFuncReturn;
  src?: StaticImageData;
  alt?: string;
  imageClasses?: string;
  titleClasses?: string;
  subtitleClasses?: string;
  withRating?: boolean;
  withTextArea?: boolean;
}

const imageDefaultClasses = 'mx-auto mb-6 mt-10';

const titleDefaultClasses =
  'mb-1.5 font-semibold font-poppins text-neutral-medium';

const Popup: React.FC<PopupProps> = ({
  onClose,
  onContinue,
  title = 'Your Email : mar**i@gmail.com',
  subtitle = "We'll give you some information through email.",
  label = 'Change Email',
  src,
  alt,
  imageClasses,
  titleClasses,
  subtitleClasses,
  withRating = false,
  withTextArea = false
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const rateHandler = (rating: number): void => {
    setRating(rating);
  };

  const commentHandler = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setComment(event.target.value);
  };

  const submitHandler = (): void => {
    const payload: { rating?: number; comment?: string } = {};

    if (withRating) payload.rating = rating;
    if (withTextArea) payload.comment = comment;

    if (Object.keys(payload).length === 0) {
      onContinue();
    } else {
      onContinue(payload);
    }
  };

  const subtitleDefaultClasses = `${
    withRating ? 'mb-6' : ''
  } font-poppins text-sm text-neutral-soft`;

  return (
    <Modal
      onClose={onClose}
      withRating={withRating}
      withTextArea={withTextArea}
    >
      {/* -----Close Button----- */}
      <button
        className="absolute top-2 right-2 flex items-center justify-center rounded-full p-2 transition-colors duration-300 hover:bg-gray-300 active:bg-gray-400"
        data-ripple-dark="true"
        onClick={onClose}
      >
        <Image src={XIcon} alt="close" />
      </button>

      {/* -----Main Block----- */}
      <Image
        priority
        src={src ?? Email}
        alt={alt ?? 'email'}
        className={imageClasses ?? imageDefaultClasses}
      />
      <p className={titleClasses ?? titleDefaultClasses}>{title}</p>
      <p className={subtitleClasses ?? subtitleDefaultClasses}>{subtitle}</p>

      {/* -----Rating Block----- */}
      {withRating && <Rating rating={rating} onRate={rateHandler} />}

      {/* -----Text Area----- */}
      {withTextArea && (
        <TextArea
          value={comment}
          placeholder="Cool!"
          className={`relative w-[92%] mx-auto font-poppins ${
            withRating ? 'mt-5' : 'mt-8'
          }`}
          props={{ rows: 4, onChange: commentHandler }}
        />
      )}

      <Button
        label={label}
        extraClasses="w-full mt-6"
        variant="dark"
        props={{ onClick: submitHandler }}
      />
    </Modal>
  );
};

export default Popup;
