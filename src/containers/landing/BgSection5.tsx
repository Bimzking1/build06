export default function BgSection5({
  children
}: {
  children: React.ReactElement;
}): React.ReactElement {
  const circleSize = { height: '350px', width: '350px' };
  return (
    <div className="relative min-h-screen min-w-full overflow-hidden">
      <div className="flex min-w-full min-h-screen flex-col justify-between overflow-hidden absolute">
        <div className="w-full h-full justify-center flex opacity-70">
          <div
            className="rounded-full bg-transparent blur-[100px] mt-[-200px] ml-[]"
            style={circleSize}
          />
          <div
            className="rounded-full bg-transparent blur-[100px] mt-[-200px] ml-[-50px]"
            style={circleSize}
          />
        </div>
        <div className="flex items-center justify-center">
          <div className="flex">
            <div
              className="rounded-full bg-seeds-green blur-[120px] ml-[]"
              style={circleSize}
            />
            <div
              className="rounded-full bg-seeds-purple blur-[120px] ml-[-50px]"
              style={circleSize}
            />
          </div>
        </div>
        <div className="flex justify-between">
          <div>
            <div
              className="rounded-full bg-seeds-purple blur-[100px] -ml-48 -mb-72"
              style={circleSize}
            />
            <div
              className="rounded-full bg-seeds-green blur-[100px] -ml-20 -mb-72"
              style={circleSize}
            />
          </div>
          <div className="flex -mr-52 -mb-32">
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
