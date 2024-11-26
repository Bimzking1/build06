'use client';
import { Typography } from '@material-tailwind/react';

export interface ICErrorMessage {
  children?: React.ReactNode;
  className?: string;
}

export default function CErrorMessage({
  children,
  className
}: ICErrorMessage): React.ReactElement {
  return (
    <Typography
      variant="small"
      color="gray"
      className={`mt-1 flex items-center gap-1 font-normal text-red-700 italic ${
        className ?? ''
      }`}
    >
      {children ?? ''}
    </Typography>
  );
}
