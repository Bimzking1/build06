interface props {
  imageUrl: string;
  children: React.ReactNode;
  className: string;
}
const ImageBackground: React.FC<props> = ({
  imageUrl,
  children,
  className
}) => {
  return (
    <div
      className={`bg-cover bg-center ${className}`}
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      {children}
    </div>
  );
};

export default ImageBackground;
