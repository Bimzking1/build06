// Use this if only you need faster query than router.query (example: search AuthSSO)
const queryList = (): {
  queries: Record<string, string>;
  totalQueries: number;
} => {
  const queries: Record<string, string> = {};
  for (const pair of Array.from(
    new URLSearchParams(window.location.search).entries()
  )) {
    queries[pair[0]] = pair[1];
  }
  const totalQueries = Object.keys(queries).length;
  return { queries, totalQueries };
};

export default queryList;
