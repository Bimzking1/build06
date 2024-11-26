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
  const defaultClass =
    'p-2 items-center rounded-3xl font-semibold text-lg normal-case';
  const activeClass = 'bg-[#3AC4A0] text-[white]';
  const disabledClass = 'bg-[#BDBDBD] text-[white]';

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      onSubmit={onSubmit}
      className={`${defaultClass} ${
        disabled === true ? disabledClass : activeClass
      } ${className ?? ''}`}
      color={color}
      fullWidth={true}
      type="submit"
    >
      {children}
    </Button>
  );
}
