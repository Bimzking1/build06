import { useMemo, useState } from 'react';

interface RatingProps {
  rating: number;
  count?: number;
  onRate: (rating: number) => void;
  color?: {
    filled: string;
    unfilled: string;
  };
}

const Rating: React.FC<RatingProps> = ({
  rating,
  count = 5,
  onRate,
  color = { filled: '#FDBA22', unfilled: '#E8E8E8' }
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const hoverHandler = (value: number) => () => {
    setHoverRating(value);
  };

  const starRating = useMemo(() => {
    const colorHandler = (value: number): string => {
      if (hoverRating >= value) {
        return color.filled;
      } else if (hoverRating === 0 && rating >= value) {
        return color.filled;
      }
      return color.unfilled;
    };

    return Array(count)
      .fill(0)
      .map((_, index) => index + 1)
      .map(item => (
        <button
          key={item}
          value={item}
          className="last:mr-0 mr-2"
          onClick={event => {
            onRate(+event.currentTarget.value);
          }}
          onMouseEnter={hoverHandler(item)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill={colorHandler(item)}
            viewBox="0 0 24 24"
            className="transition-colors h-7 w-7 drop-shadow-[0px_1.70886px_1.70886px_rgba(0,0,0,0.25)]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
            />
          </svg>
        </button>
      ));
  }, [rating, count, color, hoverRating, onRate]);

  return <div onMouseLeave={hoverHandler(0)}>{starRating}</div>;
};

export default Rating;
