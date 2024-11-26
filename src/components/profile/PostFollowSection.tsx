import { useRouter } from 'next/router';

interface Params {
  profileData: any;
  id?: any;
}

const PostFollowSection = ({ profileData, id }: Params): JSX.Element => {
  const router = useRouter();
  const _handleFollowers = (): any => {
    return router.push({
      pathname: `/${
        id !== undefined ? `social/${id as string}` : 'my-profile'
      }/follow-list`,
      query: { type: 'followers' }
    });
  };
  const _handleFollowing = (): any => {
    return router.push({
      pathname: `/${
        id !== undefined ? `social/${id as string}` : 'my-profile'
      }/follow-list`,
      query: { type: 'followings' }
    });
  };
  return (
    <div className="flex gap-10 h-[36px] md:h-11 justify-center md:justify-normal">
      <div className="w-[26px] md:w-20 flex flex-col items-center justify-center">
        <p className="text-black md:text-[#201B1C] text-sm md:text-lg font-semibold font-poppins">
          {profileData?.posts}
        </p>
        <p className="text-black/50 md:text-[#7C7C7C] text-xs font-normal font-poppins">
          Post
        </p>
      </div>
      <div
        onClick={() => _handleFollowers()}
        className="w-14 md:w-20 flex flex-col items-center justify-center cursor-pointer"
      >
        <p className="text-black md:text-[#201B1C] text-sm md:text-lg font-semibold font-poppins">
          {profileData?.followers}
        </p>
        <p className="text-black/50 md:text-[#7C7C7C] text-xs font-normal font-poppins">
          Followers
        </p>
      </div>
      <div
        onClick={() => _handleFollowing()}
        className="w-14 md:w-20 flex flex-col items-center justify-center cursor-pointer"
      >
        <div className="text-black md:text-[#201B1C] text-sm md:text-lg font-semibold font-poppins">
          {profileData?.following}
        </div>
        <p className="text-black/50 md:text-[#7C7C7C] text-xs font-normal font-poppins">
          Following
        </p>
      </div>
    </div>
  );
};

export default PostFollowSection;
