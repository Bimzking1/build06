import type { NextRouter } from 'next/router';

interface QueryType extends Record<string, string | string[] | undefined> {}

interface RedirectItem {
  logic: boolean;
  redirect: string;
}

interface RedirectList extends Array<RedirectItem> {}

const withRedirect = async <T extends QueryType>(
  router: NextRouter,
  query?: T,
  pathname?: string
): Promise<void> => {
  const currentUnixTime = Date.now() / 1000;
  const expiredUnixTime = parseInt(
    window.localStorage.getItem('expiresAt') as string
  );

  const redirectList: RedirectList = [
    {
      logic: query?.l !== undefined && query?.qi !== undefined,
      redirect: `/play/quiz/${query?.qi as string}/leaderboard`
    },
    {
      logic: query?.withdrawal !== undefined && query?.quizId !== undefined,
      redirect: `/withdrawal?quizId=${query?.quizId as string}`
    },
    {
      logic: query?.quizId !== undefined,
      redirect: `/play/quiz/${query?.quizId as string}`
    },
    {
      logic: query?.qi !== undefined,
      redirect: `/play/quiz/${query?.qi as string}`
    },
    {
      logic: query?.ci !== undefined,
      redirect: `/connect/post/${query?.ci as string}`
    },
    {
      logic: query?.ti !== undefined,
      redirect: `/play/tournament/${query?.ti as string}`
    }
  ];

  if (
    window.localStorage.getItem('accessToken') === null ||
    expiredUnixTime < currentUnixTime
  ) {
    await router.push({
      pathname,
      query
    });
  } else if (
    window.localStorage.getItem('accessToken') !== null &&
    expiredUnixTime > currentUnixTime
  ) {
    const redirectItem = redirectList.find(item => item.logic);
    if (redirectItem !== undefined && redirectItem !== null) {
      await router.push(redirectItem.redirect);
    } else {
      await router.push('/homepage');
    }
  }
};

export default withRedirect;
