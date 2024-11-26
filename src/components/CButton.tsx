// eslint-disable-next-line @typescript-eslint/consistent-type-imports
'use client';
import type { IButton } from '@/utils/interfaces/components.interfaces';
import { Button } from '@material-tailwind/react';
import React from 'react';

export default function CButton({
  children,
  className,
  onClick,
  onSubmit,
  disabled,
  color,
  fullWidth
}: IButton): React.ReactElement {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      onSubmit={onSubmit}
      className={className}
      color={color}
      fullWidth={fullWidth}
    >
      {children}
    </Button>
  );
}
