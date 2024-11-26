import CustomProgressBar from '@/components/academy/CustomProgressBar';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

interface VideoPlayerProps {
  videoSrc: string;
  title: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoSrc, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showProgressBar, setShowProgressBar] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [showPlayIcon, setShowPlayIcon] = useState(true);
  const [showTitle, setShowTitle] = useState(false);
  const [hideCursor, setHideCursor] = useState(false);
  const cursorTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const videoElement = videoRef.current;

    const handlePlay = (): void => {
      setIsPlaying(true);
      setShowProgressBar(true);
      setTimeout(() => {
        setShowPlayIcon(false);
      }, 1000);
      setTimeout(() => {
        setShowTitle(false);
      }, 1000);
    };

    const handlePause = (): void => {
      setIsPlaying(false);
      setShowPlayIcon(true);
      setShowTitle(true);
    };

    if (videoElement !== null) {
      videoElement.addEventListener('play', handlePlay);
      videoElement.addEventListener('pause', handlePause);
    }

    return () => {
      if (videoElement !== null) {
        videoElement.removeEventListener('play', handlePlay);
        videoElement.removeEventListener('pause', handlePause);
      }
    };
  }, []);

  const handlePlayPause = (): void => {
    const videoElement = videoRef.current;
    if (videoElement !== null) {
      if (document.fullscreenElement === null) {
        if (videoElement.paused) {
          void videoElement.play();
        } else {
          videoElement.pause();
        }
      }
    }
  };

  const handleMouseMove = (): void => {
    if (cursorTimeoutRef.current !== null) {
      clearTimeout(cursorTimeoutRef.current);
    }

    setHideCursor(false);

    cursorTimeoutRef.current = window.setTimeout(() => {
      setHideCursor(true);
    }, 2000);
  };

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement !== null) {
      videoElement.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      if (videoElement !== null) {
        videoElement.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);

  return (
    <div className={`video-container relative w-full aspect-video`}>
      <video
        ref={videoRef}
        width="100%"
        height="100%"
        src={videoSrc}
        className={`w-full h-full ${
          hideCursor ? 'cursor-none' : 'cursor-pointer'
        }
      `}
        onClick={handlePlayPause}
        controlsList="nodownload"
        onContextMenu={e => {
          e.preventDefault();
        }}
      >
        Your browser does not support the video tag.
      </video>
      {showPlayIcon && !isPlaying && (
        <div
          className="play-icon absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl text-white opacity-80 hover:opacity-100 cursor-pointer z-10"
          onClick={handlePlayPause}
        >
          <Image
            src={'/assets/academy/play-icon.svg'}
            width={100}
            height={100}
            alt="play-icon"
            className="w-10 sm:w-16 md:w-16 lg:w-24 xl:w-32"
          />
        </div>
      )}
      {showPlayIcon && isPlaying && (
        <div
          className="pause-icon absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl text-white opacity-80 hover:opacity-100 cursor-pointer z-10"
          onClick={handlePlayPause}
        >
          <Image
            src="/assets/academy/pause-icon.svg"
            width={100}
            height={100}
            alt="pause-icon"
            className="w-10 sm:w-16 md:w-16 lg:w-24 xl:w-32"
          />
        </div>
      )}
      {showTitle && (
        <div
          onClick={handlePlayPause}
          className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 text-white p-4 text-2xl font-bold z-0 cursor-pointer"
        >
          {title}
        </div>
      )}
      {showProgressBar && <CustomProgressBar videoElement={videoRef.current} />}
    </div>
  );
};

export default VideoPlayer;
