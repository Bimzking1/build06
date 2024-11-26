interface Props {
  title: string;
  extraElement: React.ReactElement;
  className?: string;
}

const QuizDetail: React.FC<Props> = ({
  title,
  extraElement,
  className
}: Props) => {
  return (
    <div className={className}>
      <div className="text-base font-semibold text-[#262626]">{title}</div>
      {extraElement}
    </div>
  );
};

export default QuizDetail;
