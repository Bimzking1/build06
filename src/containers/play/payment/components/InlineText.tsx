'use client';
import { Typography } from '@material-tailwind/react';

const InlineText = ({
  label,
  value,
  className
}: {
  label: string;
  value: string;
  className?: string;
}): JSX.Element => {
  return (
    <div className={`flex justify-between ${className ?? ''}`}>
      <Typography className="text-[#201B1C] font-normal">{label}</Typography>
      <Typography className="text-[#201B1C] font-normal">{value}</Typography>
    </div>
  );
};

export default InlineText;
