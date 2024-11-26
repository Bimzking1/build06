import React from 'react';

export default function Stepper(): React.ReactElement {
  return (
    <div className="flex justify-between w-full ">
      {Array.from(Array(5), (e, i) => {
        return (
          <div
            key={i}
            className={`flex ${i < 4 ? 'w-full' : 'w-fit'}  items-center`}
          >
            <div className="w-5 h-5 bg-seeds-green rounded-full "></div>
            {i < 4 ? (
              <span className="flex-1 h-1 border-b border-seeds-green border-4 "></span>
            ) : (
              <span className="w-0"></span>
            )}
          </div>
        );
      })}
    </div>
  );
}
