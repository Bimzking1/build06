'use client';
import CCard from '@/components/CCard';
import UnderLineTab from '@/components/UnderlineTab';
import ProfileSection from '@/components/profile/ProfileSection';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import withAuth from '@/helpers/withAuth';
import { getCircle } from '@/repository/circle.repository';
import { getExpUserData } from '@/repository/exp.repository';
import { getPlayJoined } from '@/repository/play.repository';
import { getListPostByUserId } from '@/repository/post.repository';
import { blockOtherUser, getOtherUser } from '@/repository/profile.repository';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface Post {
  limit: number;
  page: number;
}

interface Circle {
  limit: number;
  page: number;
  type: string;
  user_id: string;
}

interface Play {
  type: string;
  user_id: string;
}

const post: Post = {
  limit: 10,
  page: 1
};

function UserProfile(): JSX.Element {
  const router = useRouter();
  const id = router.query.id as string;
  const circle: Circle = {
    limit: 10,
    page: 1,
    type: 'others_circle',
    user_id: id
  };
  const play: Play = {
    type: 'ALL',
    user_id: id
  };

  const [userData, setUserData] = useState<Record<string, any>>();
  const [isBlock, setBlock] = useState<boolean>();
  const [expUserData, setExpUserData] = useState<any>();
  const [circleData, setCircleData] = useState<any[]>([]);
  const [playData, setPlayData] = useState<any[]>([]);
  const [postData, setPostData] = useState<any[]>([]);
  const [formDataBlock] = useState({ user_id: id });

  const handleBlock = (data: boolean): void => {
    setBlock(data);
  };

  const handleSubmitBlockUser = async (event: any): Promise<any> => {
    event.preventDefault();
    try {
      await blockOtherUser(formDataBlock);
      handleBlock(userData?.status_blocked);
    } catch (error) {
      console.error('Error:', error);
    }
  };
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const userData = await getOtherUser(id);
        setUserData(userData);
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, [id, isBlock]);
  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const expUserData = await getExpUserData(id);
        setExpUserData(expUserData);

        const circleResponse = await getCircle(circle);
        setCircleData(circleResponse);

        const playResponse = await getPlayJoined(play);
        setPlayData(playResponse);

        const postResponse = await getListPostByUserId(id, post);
        setPostData(postResponse.data);
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, [id]);

  return (
    <PageGradient defaultGradient className="w-full">
      {/* New Card */}
      <CCard className="p-4 md:p-5">
        <ProfileSection
          profileData={userData}
          expData={expUserData}
          id={id}
          handleSubmitBlockUser={handleSubmitBlockUser}
        />
      </CCard>
      <CCard className="py-5 md:rounded-lg my-4">
        <UnderLineTab
          profileData={userData}
          circleData={circleData}
          playData={playData}
          postData={postData}
          setData={setPostData}
          handleSubmitBlockUser={handleSubmitBlockUser}
        />
      </CCard>
    </PageGradient>
  );
}

export default withAuth(UserProfile);
