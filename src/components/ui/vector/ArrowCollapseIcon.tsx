interface ArrowCollapseIconProps {
  isExpand?: boolean;
  expandAngle?: string;
  collapseAngle?: string;
  extraClasses?: string;
  props?: object;
  width?: string;
  height?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
}

const ArrowCollapseIcon: React.FC<ArrowCollapseIconProps> = ({
  isExpand = false,
  expandAngle = '',
  collapseAngle = '',
  extraClasses = '',
  width = '8',
  height = '12',
  fill = 'none',
  stroke = '#BDBDBD',
  strokeWidth = '1.16667',
  ...props
}) => {
  return (
    <svg
      {...props.props}
      width={width}
      height={height}
      viewBox="0 0 8 12"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      className={
        isExpand
          ? `transition-transform duration-300 ${expandAngle} ${extraClasses}`
          : `transition-transform duration-300 ${collapseAngle} ${extraClasses}`
      }
    >
      <path
        d="M1.5 10.9995L6.5 5.99951L1.5 0.999512"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowCollapseIcon;
