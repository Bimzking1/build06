import { useTranslation } from 'react-i18next';

interface props {
  handleFormChange: any;
  displayValue: string;
  renderUserSuggestion: JSX.Element | undefined;
  renderUserHashtags: JSX.Element | undefined;
  renderDollarSuggestion: JSX.Element | undefined;
}

const CirclePostInputText: React.FC<props> = ({
  handleFormChange,
  displayValue,
  renderDollarSuggestion,
  renderUserHashtags,
  renderUserSuggestion
}) => {
  const { t } = useTranslation();

  return (
    <div className="mt-2">
      <textarea
        name="content_text"
        id="circle-post"
        onChange={handleFormChange}
        value={displayValue}
        className="w-[100%] h-[100px] focus:outline-none bg-transparent text-black font-poppins placeholder:font-poppins placeholder:text-neutral-soft placeholder:text-base"
        placeholder={`${t('circleDetail.textAreaPlaceholder')}`}
      ></textarea>
      {renderUserSuggestion}
      {renderUserHashtags}
      {renderDollarSuggestion}
    </div>
  );
};

export default CirclePostInputText;
