'use client';
import { Carousel, IconButton } from '@material-tailwind/react';
import { useEffect, useState } from 'react';

const CarouselNewsDesktop: React.FC = () => {
  const [carouselData, setCarouselData] = useState<any[]>([]);
  const devUrl = process?.env?.NEXT_PUBLIC_URL ?? '';
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const url: string = devUrl ?? '';
      if (url === '') {
        console.error('devUrl is an empty string.');
      } else {
        try {
          const response = await fetch(`${devUrl}/news/v1/hot?limit=5`);
          if (response.ok) {
            const data = await response.json();
            setCarouselData(data.news);
          } else {
            console.error('Error fetching data:', response.status);
          }
          return undefined;
        } catch (error) {
          console.error('Error fetching data:', error);
          return undefined;
        }
      }
      return undefined;
    };

    if (typeof devUrl === 'string' && devUrl !== '') {
      fetchData().catch(error => {
        console.error('Error fetching data:', error);
      });
    } else {
      console.error('devUrl is not a valid string or is an empty string.');
    }
  }, [devUrl, setCarouselData]);

  function isImageUrlValid(url: string): boolean {
    return url?.startsWith('http://') || url?.startsWith('https://');
  }

  const handleItemClick = (link: string): void => {
    window.open(link, '_blank');
  };
  return (
    <Carousel
      loop={true}
      autoplay={true}
      autoplayDelay={3000}
      className="rounded-xl"
      prevArrow={({ handlePrev }) => (
        <IconButton
          variant="text"
          color="white"
          size="lg"
          onClick={handlePrev}
          className="!absolute top-2/4 left-4 -translate-y-2/4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-8 w-8 bg-[#3AC4A0] rounded-full p-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
        </IconButton>
      )}
      nextArrow={({ handleNext }) => (
        <IconButton
          variant="text"
          color="white"
          size="lg"
          onClick={handleNext}
          className="!absolute top-2/4 !right-4 -translate-y-2/4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-8 w-8 bg-[#3AC4A0] rounded-full p-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </IconButton>
      )}
    >
      {carouselData.map((item, index) => {
        const defaultNews = '/assets/default-news.png';
        const imageUrl =
          typeof item.imageUrl === 'string' ? item.imageUrl : defaultNews;

        // Check if the imageUrl is valid before rendering the image
        const isImageValid = isImageUrlValid(imageUrl);

        return (
          <div
            key={index}
            className="border-2 relative border-[#7555DA] xl:w-[90%] mx-auto flex self-center align-middle rounded-lg xl:p-5 justify-end"
          >
            {isImageValid ? (
              <img
                src={imageUrl}
                alt={`image ${index + 1}`}
                className="h-[70vh] w-full object-cover mx-auto rounded-lg brightness-50"
              />
            ) : (
              <img
                src={defaultNews}
                alt="Default Image"
                className="h-[70vh] w-full object-cover mx-auto rounded-lg brightness-50"
              />
            )}
            <div
              className="absolute inset-0 h-[94%] w-[96%] object-cover m-auto cursor-pointertext-white rounded-lg p-5 z-20 left-0 right-0 top-0 bottom-0"
              onClick={e => {
                e.preventDefault();
                handleItemClick(item.link);
              }}
            >
              <h1 className="items-end text-start text-3xl font-semibold absolute bottom-2 left-2 text-[#FFFFFF]">
                {item.title}
              </h1>
            </div>
          </div>
        );
      })}
    </Carousel>
  );
};

export default CarouselNewsDesktop;
