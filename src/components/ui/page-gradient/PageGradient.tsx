import type { ReactNode } from 'react';

interface PageGradientProps {
  children: ReactNode;
  className?: string;
  style?: object;
  defaultGradient?: boolean;
  customGradient?: JSX.Element;
  extraClasses?: string;
}

const PageGradient: React.FC<PageGradientProps> = ({
  children,
  className,
  style,
  defaultGradient = false,
  customGradient,
  extraClasses = 'flex flex-col justify-end items-center bg-[#F9F9F9]'
}) => {
  const defaultClasses = `z-0 relative overflow-hidden min-h-screen ${extraClasses}`;

  return (
    <div className={className ?? defaultClasses} style={style}>
      {/* -----Default Gradient----- */}
      {defaultGradient && customGradient === undefined && (
        <>
          <span className="-z-10 fixed bottom-10 -left-10 w-60 h-48 sm:bg-seeds-green bg-transparent blur-[90px] rotate-45" />
          <span className="-z-10 fixed bottom-0 left-0 w-24 h-24 sm:bg-seeds-green bg-transparent blur-[90px]" />
          <span className="-z-10 fixed -bottom-28 left-16 w-48 h-32 sm:bg-seeds-purple-2 bg-transparent blur-[90px] rotate-45" />
          <span className="-z-10 fixed top-64 -right-4 w-60 h-48 sm:bg-seeds-green bg-transparent blur-[90px] rotate-45 rounded-full" />
          <span className="-z-10 fixed bottom-36 right-0 w-32 h-32 sm:bg-seeds-purple-2 bg-transparent blur-[90px] rotate-90 rounded-full" />
        </>
      )}

      {/* -----Custom Gradient----- */}
      {!defaultGradient && customGradient !== undefined ? customGradient : null}

      {/* -----Page Content----- */}
      {children}
    </div>
  );
};

export default PageGradient;
