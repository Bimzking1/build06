import talk from '@/assets/circle-page/talk.svg';
import Image from 'next/image';
import { useRef, useState } from 'react';
interface props {
  setLoading: any;
  setAudio: any;
  audio: any;
}
export const VoiceRecorder: React.FC<props> = ({
  setLoading,
  setAudio,
  audio
}) => {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  if (audio === '') {
    console.log(audioUrl);
  }
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = (): any => {
    setLoading(false);
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.start();

        setRecording(true);
        setAudioUrl(null);

        mediaRecorder.current.ondataavailable = event => {
          audioChunks.current.push(event.data);
        };

        mediaRecorder.current.onstop = () => {
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
          setAudioUrl(URL.createObjectURL(audioFile));

          audioChunks.current = [];
        };
      })
      .catch(error => {
        console.error('Error getting audio stream:', error);
      });
  };

  const stopRecording = (): void => {
    setLoading(false);
    if (mediaRecorder.current !== null && mediaRecorder.current !== undefined) {
      mediaRecorder.current.stop();
      setRecording(false);
    }
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
      <div className="flex items-center flex-col">
        <div
          className={`mb-4 rounded-full ${
            recording ? 'fade-background-color' : ''
          } p-4`}
        >
          <button
            onClick={recording ? stopRecording : startRecording}
            type="button"
            className={`p-4 m-2 border-seeds-button-green rounded-full bg-white ${
              recording ? 'border-2' : 'border'
            }`}
          >
            <Image width={40} height={40} src={talk} alt="talk" />
          </button>
        </div>
        {recording && <div className="text-red-500">Recording...</div>}
      </div>
    </>
  );
};
