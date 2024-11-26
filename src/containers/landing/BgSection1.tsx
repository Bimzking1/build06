export default function BgSection1({
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
            className="rounded-full bg-seeds-purple blur-[100px] mt-[-200px] ml-[]"
            style={circleSize}
          />
          <div
            className="rounded-full bg-seeds-green blur-[100px] mt-[-200px] ml-[-50px]"
            style={circleSize}
          />
        </div>
        <div className="w-full h-full justify-center flex opacity-70 ml-[700px] rotate-[135deg]">
          <div
            className="rounded-full bg-seeds-purple blur-[100px] mt-[-100px] ml-[]"
            style={circleSize}
          />
          <div
            className="rounded-full bg-seeds-green blur-[100px] mt-[-100px] ml-[-50px]"
            style={circleSize}
          />
        </div>
      </div>
      {children}
    </div>
  );
}
