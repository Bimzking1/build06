'use client';
import { Input } from '@material-tailwind/react';
import Image from 'next/image';
import faEyeSlash from 'public/assets/vector/eye-slash.svg';
import faEye from 'public/assets/vector/eye.svg';
import React, { useState } from 'react';

const InputPassword = (props?: any): React.ReactElement => {
  const [isFocused, setIsFocused] = useState(false);
  const [password, setpassword] = useState(true);
  const [value, setValue] = useState('');

  const onChangeHandler = (e: any): any => {
    Boolean(props?.onChange !== undefined) && props?.onChange?.(e);
    setValue(e.target.value);
  };

  const { errorMessage = null, ...rest } = { ...props };

  return (
    <>
      <Input
        {...rest}
        onChange={onChangeHandler}
        onFocus={() => {
          setIsFocused(true);
        }}
        onBlur={() => {
          setIsFocused(false);
        }}
        className={`placeholder:text-gray-600 transition-none placeholder:tracking-wider placeholder:text-base text-black ${
          password && Boolean(value?.length > 0)
            ? '!text-[3rem]'
            : '!text-[1.2rem]'
        }`}
        color="green"
        shrink={true}
        placeholder={isFocused ? '' : props?.placeholder}
        variant="standard"
        type={password ? 'password' : 'text'}
        icon={
          <Image
            alt="img"
            className="cursor-pointer"
            onClick={() => {
              setpassword(c => !c);
            }}
            src={password ? faEyeSlash : faEye}
          />
        }
      />
      {typeof errorMessage === 'string' ? (
        <p className="text-red-900">{errorMessage}</p>
      ) : null}
    </>
  );
};

export default InputPassword;
