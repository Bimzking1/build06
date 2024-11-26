import React from 'react';

interface PersonalChatMediaData {
  id: string;
  media_url?: string;
}

const MediaItem: React.FC<{ message: PersonalChatMediaData }> = ({
  message
}) => {
  if (
    (message.media_url?.includes('mp4') ?? false) ||
    (message.media_url?.includes('mov') ?? false)
  ) {
    return (
      <div className="w-1/3 h-42 rounded-md">
        <video width="320" height="240" controls>
          <source src={message.media_url} type="video/mp4" />
        </video>
      </div>
    );
  } else {
    return (
      <div className="w-1/3 h-42 rounded-md">
        <img
          src={message?.media_url}
          className="w-full h-36 object-contain"
          alt="Media"
        />
      </div>
    );
  }
};

export default MediaItem;
