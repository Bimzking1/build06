export default function BgSection4({
  children
}: {
  children: React.ReactElement;
}): React.ReactElement {
  const circleSize = { height: '350px', width: '350px' };
  return (
    <div className="relative min-h-screen min-w-full overflow-hidden">
      <div className="flex min-w-full min-h-screen flex-col justify-between overflow-hidden absolute">
        <div className="w-full h-full justify-center flex opacity-70"></div>
        <div className="opacity-70 flex">
          <div
            className="rounded-full bg-seeds-green blur-[120px] -ml-32 absolute -bottom-[100px]"
            style={circleSize}
          />
          <div
            className="rounded-full bg-seeds-purple blur-[120px] -ml-40 absolute -bottom-[100px]"
            style={circleSize}
          />
        </div>
        <div className="flex justify-between">
          <div className="flex -mr-52 -mt-[1000px]">
            <div
              className="rounded-full bg-seeds-purple blur-[100px] mb-[30px] -ml-[600px]"
              style={circleSize}
            />
            <div
              className="rounded-full bg-seeds-green blur-[100px] mb-[30px] ml-[-50px]"
              style={circleSize}
            />
          </div>
          <div className="flex -mr-72 -mt-[1000px]">
            <div
              className="rounded-full bg-seeds-purple blur-[100px] mb-100 ml-[]"
              style={circleSize}
            />
            <div
              className="rounded-full bg-seeds-green blur-[100px] mb-100 ml-[-50px]"
              style={circleSize}
            />
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
