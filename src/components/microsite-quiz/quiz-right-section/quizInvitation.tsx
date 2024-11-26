interface Props {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
}

const QuizInvitation: React.FC<Props> = ({
  value,
  onChange,
  placeholder
}: Props) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full border p-2 rounded-md"
    />
  );
};

export default QuizInvitation;
