'use client';
import { Input } from '@material-tailwind/react';
import type {
  color,
  size,
  variant
} from '@material-tailwind/react/types/components/input';
import Image from 'next/image';
import { Eye, EyeSlash } from 'public/assets/vector';
import { useState } from 'react';

export interface ICInputPassword {
  className?: string;
  onChange: (password: string) => void;
  placeholder?: string;
  size?: size;
  variant?: variant;
  color?: color;
  error?: boolean;
}

const CInputPassword = ({
  className = 'text-lg',
  onChange,
  placeholder,
  size = 'md',
  variant = 'standard',
  color = 'gray',
  error = false
}: ICInputPassword): React.ReactElement => {
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <Input
      className={className}
      type={showPassword ? 'text' : 'password'}
      color={color}
      onChange={e => {
        setPassword(e.target.value);
        onChange(e.target.value);
      }}
      size={size}
      variant={variant}
      placeholder={placeholder}
      icon={
        <Image
          onClick={() => {
            setShowPassword(!showPassword);
          }}
          src={showPassword ? Eye : EyeSlash}
          alt=""
        />
      }
      value={password}
      error={error}
    />
  );
};

export default CInputPassword;
