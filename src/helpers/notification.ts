// import { useRouter } from 'next/router';

export const HandleNotificationOpened = (data: any): void => {
  // const routes = useRouter();
  console.log('data from notif', data);

  switch (data?.route_name) {
    case 'PaymentHistoryPage':
      // param.id = data?.play_id;
      // routes.push({ name: data?.route_name });
      break;
    case 'PlayArena':
    case 'PlayDetail':
    case 'TournamentResult':
    case 'PlayCancelled':
    case 'LeaderboardScreen':
      // param.id = data?.play_id;
      // param.play_id = data?.play_id;
      // routes.push({ name: data?.route_name, params: param });
      break;
    case 'PlayPortfolio':
      // routes = [
      //   {
      //     name: 'PlayArena',
      //     params: {
      //       id: data?.play_id
      //     }
      //   },
      //   {
      //     name: 'PlayPortfolio'
      //   }
      // ];
      break;
    case 'PostDetailScreen':
      // routes.push({
      //   name: data?.route_name,
      //   params: { id: data?.post_id }
      // });
      break;
    case 'QuizDetail':
      // routes = [
      //   {
      //     name: 'QuizDetailScreen',
      //     params: {
      //       id: data?.quiz_id
      //     }
      //   }
      // ];
      break;
    default:
      // routes = [{ name: 'NotificationScreen' }];
      break;
  }
};
