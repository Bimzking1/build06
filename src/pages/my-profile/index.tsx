'use client';
import UnderLineTab from '@/components/UnderlineTab';
import ProfileSection from '@/components/profile/ProfileSection';
import PageGradient from '@/components/ui/page-gradient/PageGradient';
import withAuth from '@/helpers/withAuth';
import { getCircle } from '@/repository/circle.repository';
import { getExpData } from '@/repository/exp.repository';
import { getPlayJoined } from '@/repository/play.repository';
import { getListPostByUserId } from '@/repository/post.repository';
import { getUserInfo } from '@/repository/profile.repository';
import { Card } from '@material-tailwind/react';
import { useEffect, useState } from 'react';

interface Post {
  limit: number;
  page: number;
}

interface Circle {
  limit: number;
  page: number;
  type: string;
}

interface Play {
  type: string;
}

const post: Post = {
  limit: 10,
  page: 1
};

const circle: Circle = {
  limit: 10,
  page: 1,
  type: 'joined'
};

const play: Play = {
  type: 'ALL'
};

const ProfilePage = (): JSX.Element => {
  const [profileData, setProfileData] = useState<Record<string, any>>();
  const [expData, setExpData] = useState<any>();
  const [circleData, setCircleData] = useState<any[]>([]);
  const [playData, setPlayData] = useState<any[]>([]);
  const [postData, setPostData] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const dataInfo = await getUserInfo();
        setProfileData(dataInfo);

        const expData = await getExpData();
        setExpData(expData);
        console.log(expData);

        const circleResponse = await getCircle(circle);
        setCircleData(circleResponse);

        const playResponse = await getPlayJoined(play);
        setPlayData(playResponse);

        if (dataInfo !== '') {
          const postResponse = await getListPostByUserId(dataInfo.id, post);
          setPostData(postResponse.data);
        }
      } catch (error: any) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData()
      .then()
      .catch(() => {});
  }, []);

  return (
    <PageGradient defaultGradient className="w-full">
      {/* New Card */}
      <Card className="p-4 md:p-5" shadow={false}>
        <ProfileSection profileData={profileData} expData={expData} />
      </Card>
      <Card className="py-5 md:rounded-lg my-4" shadow={false}>
        <UnderLineTab
          profileData={profileData}
          circleData={circleData}
          playData={playData}
          postData={postData}
          setData={setPostData}
        />
      </Card>
    </PageGradient>
  );
};

export default withAuth(ProfilePage);
