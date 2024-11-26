import React from 'react';

const Triangle: React.FC = () => {
  return (
    <div className="relative w-full h-20">
      <svg
        className="absolute top-0 left-0 w-full h-full"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <polygon
          points="50,0 100,100 0,100"
          fill="rgba(255, 255, 255, 0.3)"
          stroke="white"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};

export default Triangle;
