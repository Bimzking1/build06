export interface ICSwitchSelectItem {
  className?: string;
  children?: string;
  isActive?: boolean;
  onClick?: () => void;
}

export default function CSwitchSelectItem({
  className,
  children,
  isActive = false,
  onClick
}: ICSwitchSelectItem): React.ReactElement {
  return (
    <div
      onClick={onClick}
      className={`rounded-full w-full py-1 text-center cursor-pointer hover:bg-[#3AC4A0] hover:text-white ${
        isActive ? 'bg-[#3AC4A0] text-white' : ''
      } ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
