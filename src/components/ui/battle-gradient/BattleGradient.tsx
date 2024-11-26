import type { ReactNode } from 'react';

interface PageGradientProps {
  children: ReactNode;
  className?: string;
  style?: object;
  defaultGradient?: boolean;
  customGradient?: JSX.Element;
  extraClasses?: string;
}

const BattleGradient: React.FC<PageGradientProps> = ({
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
          <span className="-z-10 fixed bottom-0 -left-0 w-full h-full bg-gradient-to-b from-seeds-battle-2 to-seeds-battle-1" />
        </>
      )}

      {/* -----Custom Gradient----- */}
      {!defaultGradient && customGradient !== undefined ? customGradient : null}

      {/* -----Page Content----- */}
      {children}
    </div>
  );
};

export default BattleGradient;
