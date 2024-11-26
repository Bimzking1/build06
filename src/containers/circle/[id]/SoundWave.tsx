import { useEffect, useRef } from 'react';

interface SoundWaveProps {
  audioData: any;
}

const SoundWave: React.FC<SoundWaveProps> = ({ audioData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    draw(audioData);
  }, [audioData]);

  const draw = (data: any): void => {
    const canvas = canvasRef.current;
    if (canvas === null) return;
    const height = canvas.height;
    const width = canvas.width;
    const context = canvas.getContext('2d');
    if (context === null) return;
    let x = 0;
    const sliceWidth = (width * 1.0) / data.length;

    context.fillStyle = 'rgb(200, 200, 200)';
    context.fillRect(0, 0, width, height);

    context.lineWidth = 2;
    context.strokeStyle = 'rgb(0, 0, 0)';
    context.beginPath();

    let y = height / 2;

    for (const item of data) {
      y = (item / 256.0) * height;
      context.lineTo(x, y);
      x += sliceWidth;
    }

    context.lineTo(x, height / 2);
    context.stroke();
  };

  return (
    <div className="w-full h-40 bg-gray-200 rounded-lg">
      <canvas
        width="800"
        height="400"
        ref={canvasRef}
        className="w-full h-full"
      ></canvas>
    </div>
  );
};

export default SoundWave;
