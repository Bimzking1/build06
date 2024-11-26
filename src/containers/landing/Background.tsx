export default function Background(): React.ReactElement {
  const circleSize = { height: '350px', width: '350px' };
  return (
    <div className="absolute">
      <div className="w-full full justify-center flex fixed -top-64">
        <div
          className="rounded-full bg-seeds-purple blur-[100px] fixed left-[calc(50vw-20vw)] z-0"
          style={circleSize}
        />
        <div
          className="rounded-full bg-seeds-green blur-[100px] fixed right-[calc(50vw-15vw)] z-0"
          style={circleSize}
        />
      </div>
      <div className="w-full h-full justify-center flex fixed opacity-70">
        <div
          className="rounded-full bg-seeds-purple blur-[100px] fixed -bottom-[20vh] right-44"
          style={circleSize}
        />
        <div
          className="rounded-full bg-seeds-green blur-[100px] fixed -bottom-[0vh] -right-40"
          style={circleSize}
        />
      </div>
    </div>
  );
}
