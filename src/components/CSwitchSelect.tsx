interface ICSwitchSelect {
  className?: string;
  children?: React.ReactNode;
}

export default function CSwitchSelect({
  className,
  children
}: ICSwitchSelect): React.ReactElement {
  return (
    <div className={`flex gap-1 bg-white rounded-full p-1 ${className ?? ''}`}>
      {children ?? ''}
    </div>
  );
}
