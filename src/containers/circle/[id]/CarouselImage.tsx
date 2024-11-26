import React, { useState } from 'react';

interface ImageCarouselProps {
  images: string[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const goToPreviousSlide = (): any => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    return null;
  };

  const goToNextSlide = (): any => {
    setCurrentIndex(prevIndex =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
    return null;
  };

  const openModal = (): void => {
    setIsModalOpen(true);
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    setZoom(1);
  };

  const handleZoomIn = (): void => {
    setZoom(prevZoom => Math.min(prevZoom + 0.1, 3));
  };

  const handleZoomOut = (): void => {
    setZoom(prevZoom => Math.max(prevZoom - 0.1, 1));
  };

  return (
    <div className="flex justify-start w-full mb-20 md:pl-0">
      <div className="w-fit">
        <div className="max-w-full w-fit h-[200px] md:h-[300px] bg-transparent">
          <div className="relative bg-black max-w-full px-2 py-2">
            <h1 className="text-white font-poppins text-sm">
              {images.length} page
            </h1>
          </div>
          <div className="flex justify-center h-full w-full">
            {images[currentIndex].split('.')[
              images[currentIndex].split('.').length - 1
            ] !== 'mp4' ? (
              <img
                src={images[currentIndex]}
                alt={`Slide ${currentIndex}`}
                className="max-w-full max-h-[200px] md:max-h-[300px] object-fit transition-transform duration-300 transform"
                onClick={openModal}
              />
            ) : (
              <video
                controls
                className="max-w-[50vw] max-h-[50vh] object-fit"
                key={images[currentIndex]}
              >
                <source src={images[currentIndex]} type="video/mp4" />
                Browser Anda tidak mendukung tag video.
              </video>
            )}
          </div>
          <div className="relative bg-black max-w-full px-2 py-2">
            <h1 className="text-white font-poppins text-sm">
              {currentIndex + 1} / {images.length}
            </h1>
          </div>
          <div className="w-full p-4">
            <div className="relative bottom-10 flex justify-center space-x-2">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full ${
                    index === currentIndex ? 'bg-seeds-green' : 'bg-gray-300'
                  }`}
                  onClick={(): any => {
                    setCurrentIndex(index);
                  }}
                ></div>
              ))}
            </div>
            <div className="relative bottom-[25vh] flex justify-between">
              <button
                className="bg-gray-800 text-white p-1 rounded-full hover:bg-gray-600"
                onClick={goToPreviousSlide}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <button
                className="bg-gray-800 text-white p-1 rounded-full hover:bg-gray-600"
                onClick={goToNextSlide}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <button
            className="absolute top-4 right-4 bg-gray-800 text-white text-3xl z-10"
            onClick={closeModal}
          >
            X
          </button>
          <div className="relative">
            <div className="flex justify-center items-center">
              <img
                src={images[currentIndex]}
                alt={`Modal Image ${currentIndex}`}
                className="max-w-full max-h-[90vh] object-contain"
                style={{ transform: `scale(${zoom})` }}
              />
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-4">
            <button
              className="bg-white text-black p-3 rounded-full"
              onClick={handleZoomIn}
            >
              +
            </button>
            <button
              className="bg-white text-black p-3 rounded-full"
              onClick={handleZoomOut}
            >
              −
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
