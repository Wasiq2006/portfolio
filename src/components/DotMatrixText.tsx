import DotMatrixCharacter from './DotMatrixCharacter';

interface DotMatrixTextProps {
  text: string;
  dotSizeClass?: string;
  dotColorClass?: string;
  charGapClass?: string;
  className?: string;
}

export const DotMatrixText = ({
  text,
  dotSizeClass,
  dotColorClass,
  charGapClass = 'gap-3 md:gap-5',
  className = '',
}: DotMatrixTextProps) => {
  return (
    <div className={`inline-flex items-center ${charGapClass} ${className}`}>
      {text.split('').map((char, index) => (
        <DotMatrixCharacter
          key={index}
          char={char}
          dotSizeClass={dotSizeClass}
          dotColorClass={dotColorClass}
        />
      ))}
    </div>
  );
};

export default DotMatrixText;
