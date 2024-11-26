import talk from '@/assets/circle-page/talk.svg';
import { Typography } from '@material-tailwind/react';
import Image from 'next/image';
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction
} from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
interface props {
  setLoading: Dispatch<SetStateAction<boolean>>;
  setAudio: Dispatch<SetStateAction<File | null>>;
  audio: File | null;
  postMedia: (mediaFile: File) => Promise<void>;
  setIsVoiceRecording: Dispatch<SetStateAction<boolean>>;
}
export const ChatVoiceRecorder: React.FC<props> = ({
  setLoading,
  setAudio,
  postMedia,
  setIsVoiceRecording
}) => {
  const [recording, setRecording] = useState(false);
  const { t } = useTranslation();
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const [time, setTime] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (recording) {
        setTime(prevTime => prevTime + 100);
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [recording]);

  const pad = (number: number, size: number = 2): string => {
    let padded: string = String(number);
    while (padded.length < size) {
      padded = '0' + padded;
    }
    return padded;
  };

  const formatTime = (time: number): string => {
    const seconds: number = Math.floor(time / 1000);
    const milliseconds: number = Math.floor((time % 1000) / 10);

    return `${seconds}.${pad(milliseconds)}`;
  };

  const startRecording = (): void => {
    setLoading(false);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.start();

        setRecording(true);

        mediaRecorder.current.ondataavailable = event => {
          audioChunks.current.push(event.data);
        };

        mediaRecorder.current.onstop = async () => {
          const audioBlob = new Blob(audioChunks.current, {
            type: 'audio/mpeg'
          });

          const currentDatetime = new Date();
          const filename = `Recording-${currentDatetime.toISOString()}.mpeg`;
          const audioFile = new File([audioBlob], filename, {
            type: audioBlob.type,
            lastModified: currentDatetime.getTime()
          });

          setAudio(audioFile);
          await postMedia(audioFile);
          audioChunks.current = [];
        };
      })
      .catch(error => {
        toast(error.message);
      });
  };

  const stopRecording = async (): Promise<void> => {
    setLoading(false);
    setTime(0);
    if (mediaRecorder.current !== null && mediaRecorder.current !== undefined) {
      mediaRecorder.current.stop();
      setRecording(false);
    }
    setIsVoiceRecording(false);
  };

  return (
    <>
      {/* {audioUrl !== null &&
        audioUrl !== undefined &&
        audioUrl !== '' &&
        audio !== null && (
          <div className="flex justify-center">
            <audio controls>
              <source src={audioUrl} type="audio/wav" className="w-full" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )} */}
      <div className="flex items-center w-full">
        <Typography className="font-poppins text-xs text-[#BDBDBD] flex-grow">
          {t('chat.tapAndHold')}
        </Typography>
        <div
          className={`rounded-full ${
            recording ? 'red-fade-background-color' : ''
          }`}
        >
          <button
            onClick={recording ? stopRecording : startRecording}
            type="button"
            className={`p-1 m-2 rounded-full bg-white ${
              recording
                ? 'border-2 border-[#FFEBEB]'
                : 'border border-seeds-button-green'
            }`}
          >
            {recording ? (
              <div className="flex">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_2427_60730)">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M9.17157 1.17157C9.92172 0.421427 10.9391 0 12 0C13.0609 0 14.0783 0.421427 14.8284 1.17157C15.5786 1.92172 16 2.93913 16 4V12C16 13.0609 15.5786 14.0783 14.8284 14.8284C14.0783 15.5786 13.0609 16 12 16C10.9391 16 9.92172 15.5786 9.17157 14.8284C8.42143 14.0783 8 13.0609 8 12V4C8 2.93913 8.42143 1.92172 9.17157 1.17157ZM12 2C11.4696 2 10.9609 2.21071 10.5858 2.58579C10.2107 2.96086 10 3.46957 10 4V12C10 12.5304 10.2107 13.0391 10.5858 13.4142C10.9609 13.7893 11.4696 14 12 14C12.5304 14 13.0391 13.7893 13.4142 13.4142C13.7893 13.0391 14 12.5304 14 12V4C14 3.46957 13.7893 2.96086 13.4142 2.58579C13.0391 2.21071 12.5304 2 12 2Z"
                      fill="#DD2525"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M5 9C5.55228 9 6 9.44772 6 10V12C6 13.5913 6.63214 15.1174 7.75736 16.2426C8.88258 17.3679 10.4087 18 12 18C13.5913 18 15.1174 17.3679 16.2426 16.2426C17.3679 15.1174 18 13.5913 18 12V10C18 9.44772 18.4477 9 19 9C19.5523 9 20 9.44772 20 10V12C20 14.1217 19.1571 16.1566 17.6569 17.6569C16.1566 19.1571 14.1217 20 12 20C9.87827 20 7.84344 19.1571 6.34315 17.6569C4.84285 16.1566 4 14.1217 4 12V10C4 9.44772 4.44772 9 5 9Z"
                      fill="#DD2525"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M12 18C12.5523 18 13 18.4477 13 19V23C13 23.5523 12.5523 24 12 24C11.4477 24 11 23.5523 11 23V19C11 18.4477 11.4477 18 12 18Z"
                      fill="#DD2525"
                    />
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M7 23C7 22.4477 7.44772 22 8 22H16C16.5523 22 17 22.4477 17 23C17 23.5523 16.5523 24 16 24H8C7.44772 24 7 23.5523 7 23Z"
                      fill="#DD2525"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_2427_60730">
                      <rect width="24" height="24" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <div>{formatTime(time)}</div>
              </div>
            ) : (
              <Image width={16} height={16} src={talk} alt="talk" />
            )}
          </button>
        </div>
      </div>
    </>
  );
};
