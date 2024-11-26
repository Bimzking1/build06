export default function BgSection6({
  children
}: {
  children: React.ReactElement;
}): React.ReactElement {
  return (
    <div className="relative min-h-[450px] min-w-full bg-gradient-to-tr from-seeds-green to-seeds-purple">
      <div className="flex min-w-full h-1/4 flex-col justify-between overflow-hidden absolute"></div>
      {children}
    </div>
  );
}
