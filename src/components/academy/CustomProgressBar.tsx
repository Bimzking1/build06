import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

interface CustomProgressBarProps {
  videoElement: HTMLVideoElement | null;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

const CustomProgressBar: React.FC<CustomProgressBarProps> = ({
  videoElement
}) => {
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const [isSpeedOptionsOpen, setIsSpeedOptionsOpen] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState(playbackRate);
  const [changeIcon, setChangeIcon] = useState(false);
  const speedOptions = [
    { value: 0.5, label: '0.5x' },
    { value: 1.0, label: 'Normal' },
    { value: 1.25, label: '1.25x' },
    { value: 1.5, label: '1.5x' },
    { value: 1.75, label: '1.75x' }
  ];

  useEffect(() => {
    if (videoElement !== null) {
      const handleTimeUpdate = (): void => {
        const currentProgress =
          (videoElement.currentTime / videoElement.duration) * 100;
        setProgress(currentProgress);
        setCurrentTime(videoElement.currentTime);
      };

      const handleLoadedMetadata = (): void => {
        setTotalDuration(videoElement.duration);
      };

      videoElement.addEventListener('timeupdate', handleTimeUpdate);
      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);

      if (videoElement.readyState >= 1) {
        handleLoadedMetadata();
      }

      return () => {
        videoElement.removeEventListener('timeupdate', handleTimeUpdate);
        videoElement.removeEventListener(
          'loadedmetadata',
          handleLoadedMetadata
        );
      };
    }
  }, [videoElement]);

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (videoElement !== null && progressBarRef.current !== null) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const newTime = (offsetX / rect.width) * videoElement.duration;
      videoElement.currentTime = newTime;
    }
  };

  const handleFullscreen = (): void => {
    const videoContainer = videoElement?.closest('.video-container');
    if (videoContainer != null) {
      videoContainer.classList.toggle('fullscreen');
      setChangeIcon(!changeIcon);
    }
  };
  // const handleFullscreen = (): void => {
  //   if (videoElement !== null) {
  //     // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  //     if (videoElement.requestFullscreen) {
  //       void videoElement.requestFullscreen();
  //       setChangeIcon(!changeIcon);
  //     }
  //   }
  // };

  const toggleSpeedOptions = (): void => {
    setIsSpeedOptionsOpen(!isSpeedOptionsOpen);
  };

  const selectSpeed = (speed: number): void => {
    setSelectedSpeed(speed);
    setPlaybackRate(speed);
    if (videoElement != null) {
      videoElement.playbackRate = speed;
    }
    setIsSpeedOptionsOpen(false);
  };

  return (
    <>
      <div className="absolute bottom-0 w-full">
        <div className="flex text-sm mb-2 mx-2 justify-between items-center">
          <span className="font-bold text-white bg-black bg-opacity-50 p-2 rounded text-xs">
            {formatTime(currentTime)} / {formatTime(totalDuration)}
          </span>
          <div className="flex flex-row gap-3">
            <button
              onClick={toggleSpeedOptions}
              className="text-white bg-black bg-opacity-50 p-2 rounded text-lg"
            >
              <Image
                src={'/assets/academy/play-speed-icon.svg'}
                width={100}
                height={100}
                alt="play-speed-icon"
                className="w-5"
              />
            </button>
            <button
              onClick={handleFullscreen}
              className="text-white bg-black bg-opacity-50 p-2 rounded text-lg"
            >
              <Image
                src={`${
                  changeIcon
                    ? '/assets/academy/minimize-icon.svg'
                    : '/assets/academy/maximize-icon.svg'
                }`}
                width={100}
                height={100}
                alt="fullscreen-icon"
                className="w-5"
              />
            </button>
          </div>
        </div>
        <div
          ref={progressBarRef}
          className="w-full h-2 bg-gray-300 relative cursor-pointer"
          onClick={handleClick}
        >
          <div
            className="h-2 bg-[#27A590]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      {isSpeedOptionsOpen && (
        <div className="absolute bottom-14 right-20 bg-white border border-gray-300 p-2 rounded-lg shadow-lg z-10 w-2/5 lg:w-1/5">
          <ul className="space-y-2">
            {speedOptions.map(({ value, label }) => (
              <li
                key={value}
                onClick={() => {
                  selectSpeed(value);
                }}
                className={`cursor-pointer p-2 ${
                  selectedSpeed === value
                    ? 'bg-[#DCFCE4] border border-2 border-[#1A857D] rounded-lg'
                    : ''
                }`}
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default CustomProgressBar;
