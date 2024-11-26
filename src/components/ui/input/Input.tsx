import type { DefaultTFuncReturn } from 'i18next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useState, type SetStateAction } from 'react';

import { Flags } from 'public/assets/images';
import ID from 'public/assets/images/flags/ID.png';

import ArrowCollapseIcon from '../vector/ArrowCollapseIcon';

import useWindowInnerHeight from '@/hooks/useWindowInnerHeight';

import classes from './Input.module.css';
interface InputProps {
  redirectUrl?: string;
  isRedirectButton?: boolean;
  required?: boolean;
  type?: 'text' | 'isSelectPhoneNumber' | 'isSelect' | 'seedsTag' | 'date';
  label?: string | DefaultTFuncReturn;
  placeholder?: string;
  extraClasses?: string;
  extraInputClasses?: string;
  extraLabelClasses?: string;
  disabled?: boolean;
  isError?: boolean;
  errorMessage?: string | DefaultTFuncReturn;
  errorClasses?: string;
  selectedCountryFlag?: string;
  selectValue?: string | number;
  selectOptions?: any[];
  onSelect?: (
    event: SetStateAction<any>,
    countryFlag?: SetStateAction<any>
  ) => void;
  className?: string;
  style?: object;
  props?: object;
}

const Input: React.FC<InputProps> = ({
  redirectUrl,
  isRedirectButton = false,
  required = false,
  type = 'text',
  label = 'Label',
  placeholder = 'placeholder',
  extraClasses = '',
  extraInputClasses = '',
  extraLabelClasses = '',
  disabled = false,
  isError,
  errorMessage,
  errorClasses,
  selectedCountryFlag,
  selectValue,
  selectOptions,
  onSelect = () => {},
  className,
  style,
  ...props
}) => {
  const router = useRouter();

  const height = useWindowInnerHeight();

  const [isExpand, setIsExpand] = useState(false);

  const expandHandler = (): void => {
    setIsExpand(prevExpand => !prevExpand);
  };

  const redirect = async (url: string): Promise<void> => {
    await router.push(url);
  };

  const redirectHandler = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (redirectUrl !== undefined) {
      redirect(redirectUrl).catch(error => {
        console.error('Error:', error);
      });
    }
  };

  const defaultInputClasses = `group relative ${
    type === 'isSelect' || type === 'isSelectPhoneNumber'
      ? 'flex items-baseline gap-2.5 pb-2 border-b border-neutral-ultrasoft'
      : ''
  } ${extraClasses}`;

  return (
    <div
      className={className ?? defaultInputClasses}
      style={style}
      onClick={isRedirectButton ? redirectHandler : undefined}
    >
      {isRedirectButton && (
        <div className="absolute right-2 bottom-1/3 group-hover:translate-x-1 group-hover:ease-in-out group-hover:duration-500 transition-all">
          <ArrowCollapseIcon stroke="#262626" strokeWidth="2" />
        </div>
      )}
      {type === 'text' && (
        <>
          <input
            {...props.props}
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            className={`peer h-full w-full border-b border-neutral-ultrasoft bg-transparent py-1.5 font-poppins text-neutral-soft outline outline-0 transition-all placeholder-shown:border-neutral-ultrasoft disabled:border-0 disabled:bg-neutral-ultrasoft/10 disabled:cursor-not-allowed ${
              height !== undefined && height < 760 ? 'text-sm' : 'text-base'
            } ${
              isRedirectButton
                ? 'cursor-pointer'
                : 'focus:border-seeds-button-green/80 focus:outline-0'
            } ${extraInputClasses}`}
          />
          <label
            className={`after:content[' '] pointer-events-none absolute left-0 -top-6 flex h-full w-full select-none font-poppins font-semibold leading-6 text-neutral-medium transition-all after:absolute after:-bottom-6 after:block after:w-full after:scale-x-0 after:border-b-2 after:transition-transform after:duration-300 peer-placeholder-shown:leading-6 peer-placeholder-shown:text-neutral-medium peer-focus:text-base peer-focus:leading-6 peer-focus:after:scale-x-100 peer-disabled:peer-placeholder-shown:text-neutral-medium ${
              isRedirectButton
                ? ''
                : 'after:border-seeds-button-green/80 peer-focus:text-seeds-button-green/80 peer-focus:after:border-seeds-button-green/80'
            } ${
              height !== undefined && height < 760
                ? 'text-sm peer-focus:text-sm'
                : 'text-base peer-focus:text-base'
            } ${extraLabelClasses}`}
          >
            {label}
            {required && (
              <span className="font-poppins text-warning-hard">*</span>
            )}
          </label>
          {isError === true && (
            <p
              className={
                errorClasses ??
                `absolute sm:-bottom-[1.125rem] font-poppins text-xs text-warning-hard ${
                  height !== undefined && height >= 915
                    ? '-bottom-[1.125rem]'
                    : '-bottom-[2.125rem]'
                }`
              }
            >
              {errorMessage}
            </p>
          )}
        </>
      )}

      {(type === 'isSelect' || type === 'isSelectPhoneNumber') && (
        <>
          <button
            disabled={disabled}
            onClick={expandHandler}
            className="flex justify-between items-center gap-4 px-1 min-w-fit h-6 outline-2 focus:outline-seeds-button-green focus:outline-offset-4 disabled:cursor-not-allowed"
          >
            {type === 'isSelectPhoneNumber' ? (
              <Image
                src={
                  selectedCountryFlag !== undefined
                    ? Flags[selectedCountryFlag]
                    : ID
                }
                alt={`${
                  selectedCountryFlag !== undefined ? selectedCountryFlag : 'ID'
                }-flag`}
              />
            ) : (
              <span className="font-poppins text-base text-neutral-soft">
                Choose one
              </span>
            )}
            <ArrowCollapseIcon
              stroke="#535353"
              strokeWidth="1.75"
              width="6"
              isExpand={isExpand}
              expandAngle="rotate-[270deg]"
              collapseAngle="rotate-90"
            />
            {isExpand && (
              <div className="z-10 animate-slide-down absolute top-10 max-h-32 rounded-md bg-white shadow-[0px_0px_1.34767px_rgba(48,49,51,0.05),0px_2.69534px_5.39068px_rgba(48,49,51,0.1)]">
                <div
                  className={`flex flex-col w-full max-h-32 overflow-auto ${classes['custom-scrollbar']}`}
                >
                  {selectOptions?.map(option => (
                    <div
                      key={
                        type === 'isSelect'
                          ? option.id
                          : `${option.code as string}-${option.id as string}`
                      }
                      className={`${
                        selectValue === option.id || selectValue === option.code
                          ? 'bg-seeds-button-green/20 focus:bg-seeds-button-green/30 hover:bg-seeds-button-green/30'
                          : 'hover:bg-gray-200 active:bg-gray-300 focus:bg-gray-200'
                      } flex items-center gap-4 px-3 py-1 focus:outline-0 transition-all duration-300`}
                      tabIndex={0}
                      onClick={() => {
                        if (type === 'isSelect') {
                          onSelect(option.id);
                        } else {
                          onSelect(option.code, option.id);
                        }
                      }}
                      onKeyDown={(
                        event: React.KeyboardEvent<HTMLDivElement>
                      ): void => {
                        if (event.code === 'Enter' || event.code === 'Space') {
                          onSelect(
                            type === 'isSelect' ? option.id : option.code
                          );
                        }
                      }}
                    >
                      {type === 'isSelectPhoneNumber' && (
                        <Image
                          src={Flags[option.img]}
                          alt={`${option.img as string}-flag`}
                        />
                      )}
                      <span
                        className={`font-poppins text-neutral-medium ${
                          height !== undefined && height < 760
                            ? 'text-sm'
                            : 'text-base'
                        }`}
                      >
                        {type === 'isSelect'
                          ? option.name
                          : `${option.name as string} (${
                              option.code as string
                            })`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </button>
          {type === 'isSelectPhoneNumber' && (
            <span
              className={`block font-poppins text-neutral-soft ${
                height !== undefined && height < 760 ? 'text-sm' : 'text-base'
              }`}
            >
              {selectValue}
            </span>
          )}
          <input
            {...props.props}
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            className={`peer pb-px h-full w-full border-neutral-ultrasoft font-poppins text-neutral-soft outline outline-0 transition-all bg-transparent placeholder-shown:border-neutral-ultrasoft focus:border-seeds-button-green/80 focus:outline-0 disabled:border-0 disabled:bg-neutral-ultrasoft/10 disabled:cursor-not-allowed ${
              height !== undefined && height < 760 ? 'text-sm' : 'text-base'
            } ${extraInputClasses}`}
          />
          <label
            className={`after:content[' '] pointer-events-none absolute left-0 -top-8 flex h-full w-full select-none font-poppins font-semibold leading-6 text-neutral-medium transition-all after:absolute after:-bottom-[2.125rem] after:block after:w-full after:scale-x-0 after:border-b-2 after:border-seeds-button-green/80 after:transition-transform after:duration-300 peer-placeholder-shown:leading-6 peer-placeholder-shown:text-neutral-medium peer-focus:leading-6 peer-focus:text-seeds-button-green/80 peer-focus:after:scale-x-100 peer-focus:after:border-seeds-button-green/80 peer-disabled:peer-placeholder-shown:text-neutral-medium ${
              height !== undefined && height < 760
                ? 'text-sm peer-focus:text-sm'
                : 'text-base peer-focus:text-base'
            } ${extraLabelClasses}`}
          >
            {label}
            {required && (
              <span className="font-poppins text-warning-hard">*</span>
            )}
          </label>
          {isError === true && (
            <p
              className={
                errorClasses ??
                `absolute sm:-bottom-[1.125rem] font-poppins text-xs text-warning-hard ${
                  height !== undefined && height >= 915
                    ? '-bottom-[1.125rem]'
                    : '-bottom-[2.125rem]'
                }`
              }
            >
              {errorMessage}
            </p>
          )}
        </>
      )}

      {type === 'seedsTag' && (
        <div className="flex pb-2 border-b border-neutral-ultrasoft">
          <span
            className={`mr-px font-poppins text-neutral-soft ${
              height !== undefined && height < 760 ? 'text-sm' : 'text-base'
            }`}
          >
            @
          </span>
          <input
            {...props.props}
            required={required}
            disabled={disabled}
            placeholder={placeholder}
            className={`peer pb-px h-full w-full border-neutral-ultrasoft font-poppins text-neutral-soft outline outline-0 transition-all bg-transparent placeholder-shown:border-neutral-ultrasoft focus:border-seeds-button-green/80 focus:outline-0 disabled:border-0 disabled:bg-neutral-ultrasoft/10 disabled:cursor-not-allowed ${
              height !== undefined && height < 760 ? 'text-sm' : 'text-base'
            } ${extraInputClasses}`}
          />
          <label
            className={`after:content[' '] pointer-events-none absolute left-0 -top-8 flex h-full w-full select-none font-poppins font-semibold leading-6 text-neutral-medium transition-all after:absolute after:-bottom-[2rem] after:block after:w-full after:scale-x-0 after:border-b-2 after:border-seeds-button-green/80 after:transition-transform after:duration-300 peer-placeholder-shown:leading-6 peer-placeholder-shown:text-neutral-medium peer-focus:leading-6 peer-focus:text-seeds-button-green/80 peer-focus:after:scale-x-100 peer-focus:after:border-seeds-button-green/80 peer-disabled:peer-placeholder-shown:text-neutral-medium ${
              height !== undefined && height < 760
                ? 'text-sm peer-focus:text-sm'
                : 'text-base peer-focus:text-base'
            } ${extraLabelClasses}`}
          >
            {label}
            {required && (
              <span className="font-poppins text-warning-hard">*</span>
            )}
          </label>
          {isError === true && (
            <p
              className={
                errorClasses ??
                `absolute sm:-bottom-[1.125rem] font-poppins text-xs text-warning-hard ${
                  height !== undefined && height >= 915
                    ? '-bottom-[1.125rem]'
                    : '-bottom-[2.125rem]'
                }`
              }
            >
              {errorMessage}
            </p>
          )}
        </div>
      )}

      {type === 'date' && (
        <>
          <input
            {...props.props}
            required={required}
            type="text"
            onFocus={e => (e.target.type = 'date')}
            onBlur={e => (e.target.type = 'text')}
            disabled={disabled}
            placeholder={placeholder}
            className={`peer h-full w-full border-b border-neutral-ultrasoft bg-transparent py-1.5 font-poppins text-neutral-soft outline outline-0 transition-all placeholder-shown:border-neutral-ultrasoft disabled:border-0 disabled:bg-neutral-ultrasoft/10 disabled:cursor-not-allowed ${
              height !== undefined && height < 760 ? 'text-sm' : 'text-base'
            } ${
              isRedirectButton
                ? 'cursor-pointer'
                : 'focus:border-seeds-button-green/80 focus:outline-0'
            } ${extraInputClasses}`}
          />
          <label
            className={`after:content[' '] pointer-events-none absolute left-0 -top-6 flex h-full w-full select-none font-poppins font-semibold leading-6 text-neutral-medium transition-all after:absolute after:-bottom-6 after:block after:w-full after:scale-x-0 after:border-b-2 after:transition-transform after:duration-300 peer-placeholder-shown:leading-6 peer-placeholder-shown:text-neutral-medium peer-focus:text-base peer-focus:leading-6 peer-focus:after:scale-x-100 peer-disabled:peer-placeholder-shown:text-neutral-medium ${
              isRedirectButton
                ? ''
                : 'after:border-seeds-button-green/80 peer-focus:text-seeds-button-green/80 peer-focus:after:border-seeds-button-green/80'
            } ${
              height !== undefined && height < 760
                ? 'text-sm peer-focus:text-sm'
                : 'text-base peer-focus:text-base'
            } ${extraLabelClasses}`}
          >
            {label}
            {required && (
              <span className="font-poppins text-warning-hard">*</span>
            )}
          </label>
          {isError === true && (
            <p
              className={
                errorClasses ??
                `absolute sm:-bottom-[1.125rem] font-poppins text-xs text-warning-hard ${
                  height !== undefined && height >= 915
                    ? '-bottom-[1.125rem]'
                    : '-bottom-[2.125rem]'
                }`
              }
            >
              {errorMessage}
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Input;
