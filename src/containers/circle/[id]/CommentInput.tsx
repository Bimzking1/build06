import { getUserInfo } from '@/repository/profile.repository';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface props {
  handleFormChange: any;
  displayValue: string;
  setIsLoading: any;
  renderUserSuggestion: JSX.Element | undefined;
  renderUserHashtags: JSX.Element | undefined;
  renderDollarSuggestion: JSX.Element | undefined;
}

interface UserData {
  name: string;
  seedsTag: string;
  email: string;
  pin: string;
  avatar: string;
  bio: string;
  birthDate: string;
  phone: string;
  _pin: string;
}

const CommentInput: React.FC<props> = ({
  handleFormChange,
  setIsLoading,
  displayValue,
  renderUserSuggestion,
  renderUserHashtags,
  renderDollarSuggestion
}) => {
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await getUserInfo();
        setUserInfo(response);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchData();
  }, []);

  return (
    <div className="mb-4">
      <div className="flex justify-start gap-4 h-fit">
        <img
          alt="bg-avatar-sm"
          src={userInfo?.avatar}
          className="h-[48px] w-[48px] rounded-full object-cover"
        />
        <div className="flex h-full w-full items-center">
          <textarea
            name="content_text"
            ref={textAreaRef}
            id="circle-post"
            onChange={handleFormChange}
            value={displayValue}
            className="w-[100%] h-fit focus:outline-none bg-transparent font-poppins placeholder:font-poppins placeholder:text-neutral-medium"
            placeholder={`${t('termAndCondition.circleMembership.reply')}`}
          ></textarea>
        </div>
      </div>
      {renderUserSuggestion}
      {renderUserHashtags}
      {renderDollarSuggestion}
    </div>
  );
};

export default CommentInput;
