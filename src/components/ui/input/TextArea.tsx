import useWindowInnerHeight from '@/hooks/useWindowInnerHeight';

interface TextAreaProps {
  required?: boolean;
  showCount?: boolean;
  maxLength?: number;
  value: string;
  disabled?: boolean;
  variant?: 'outlined' | 'standard';
  label?: string;
  placeholder?: string;
  isError?: boolean;
  errorMessage?: string;
  errorClasses?: string;
  extraClasses?: string;
  extraInputClasses?: string;
  extraLabelClasses?: string;
  extraCounterClasses?: string;
  className?: string;
  style?: object;
  props?: object;
}

const TextArea: React.FC<TextAreaProps> = ({
  required = false,
  disabled = false,
  showCount = false,
  maxLength,
  value,
  variant = 'outlined',
  label = 'Comment',
  placeholder = ' ',
  isError,
  errorMessage,
  errorClasses,
  extraInputClasses = '',
  extraClasses = '',
  extraLabelClasses = '',
  extraCounterClasses = '',
  className,
  style,
  ...props
}) => {
  const height = useWindowInnerHeight();

  const isWithoutLabel = placeholder.trim().length > 0;

  if (variant === 'standard')
    return (
      <div className={className ?? `relative ${extraClasses}`} style={style}>
        <textarea
          {...props.props}
          value={value}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`resize-none peer h-full w-full border-b border-neutral-ultrasoft bg-transparent py-1.5 font-poppins text-neutral-soft outline outline-0 transition-all placeholder-shown:border-neutral-ultrasoft focus:border-seeds-button-green/80 focus:outline-0 disabled:border-0 disabled:bg-neutral-ultrasoft/10 disabled:cursor-not-allowed ${
            height !== undefined && height < 760 ? 'text-sm' : 'text-base'
          } ${extraInputClasses}`}
        />
        <label
          className={`after:content[' '] pointer-events-none absolute left-0 -top-6 flex h-full w-full select-none font-poppins font-semibold leading-6 text-neutral-medium transition-all after:absolute after:block after:w-full after:scale-x-0 after:border-b-2 after:border-seeds-button-green/80 after:transition-transform after:duration-300 peer-placeholder-shown:leading-6 peer-placeholder-shown:text-neutral-medium peer-focus:text-base peer-focus:leading-6 peer-focus:text-seeds-button-green/80 peer-focus:after:scale-x-100 peer-focus:after:border-seeds-button-green/80 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-neutral-medium ${
            height !== undefined && height < 760
              ? 'text-sm peer-focus:text-sm'
              : 'text-base peer-focus:text-base'
          } ${
            showCount ? 'after:bottom-1.5' : 'after:-bottom-[1.15rem]'
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

        {showCount && (
          <span
            className={`font-poppins font-light text-[#3C49D6] ${extraCounterClasses}`}
          >
            {value.length}/{maxLength}
          </span>
        )}
      </div>
    );

  return (
    <div className={className ?? 'relative'} style={style}>
      <>
        <textarea
          {...props.props}
          value={value}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`peer h-full w-full resize-none rounded-[7px] border border-neutral-soft bg-transparent px-3 py-2.5 font-poppins text-sm text-neutral-soft outline outline-0 transition-all placeholder:text-neutral-soft placeholder-shown:border placeholder-shown:border-neutral-soft placeholder-shown:border-t-neutral-soft focus:border-2 focus:border-seeds-button-green ${
            isWithoutLabel
              ? ''
              : 'border-t-transparent focus:border-t-transparent'
          } focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-neutral-ultrasoft/20 disabled:cursor-not-allowed`}
        />
        {!isWithoutLabel && (
          <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none font-poppins text-[11px] font-normal leading-tight text-neutral-soft transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-neutral-soft before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-neutral-soft after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-neutral-soft peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-seeds-button-green peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-seeds-button-green peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-seeds-button-green peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-neutral-soft">
            {label}
          </label>
        )}
        {isError === true && (
          <p
            className={
              errorClasses ?? 'mt-1 font-poppins text-xs text-warning-hard'
            }
          >
            {errorMessage}
          </p>
        )}
      </>
      {showCount && (
        <span className="font-poppins font-light text-[#3C49D6]">
          {value.length}/{maxLength}
        </span>
      )}
    </div>
  );
};

export default TextArea;
