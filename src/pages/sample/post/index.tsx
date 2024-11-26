'use client';
import SampleLayout from '@/components/layouts/SampleLayout';
import useService from '@/hooks/useFetch';
import { getPosts } from '@/repository/post';
import { Button, Input, Typography } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

const TodoPage = (): JSX.Element => {
  const router = useRouter();
  const [number, setNumber] = useState('1');
  const { data, error, loading } = useService(getPosts, number, 500);

  const stringifiedData = useMemo(() => {
    if (typeof data === 'undefined' || data === null || data === '') {
      return '{}';
    }
    return JSON.stringify(data);
  }, [data]);

  const RenderedData = (): JSX.Element => {
    if (loading) return <span>Loading ...</span>;
    if (error !== null && error !== '') return <span>Error</span>;
    return <span>{stringifiedData}</span>;
  };

  return (
    <>
      <form className="mt-8 mb-2">
        <div className="mb-4 flex flex-col gap-6">
          <Input
            label="Todo Number"
            size="lg"
            type="number"
            min={1}
            readOnly={loading}
            disabled={loading}
            value={number}
            onChange={e => {
              setNumber(e.target.value);
            }}
            icon={<span>☁</span>}
          />
        </div>
        <Typography color="gray" className="mt-4 text-center font-normal">
          <RenderedData />
        </Typography>
      </form>

      <Button
        fullWidth
        color="green"
        onClick={() => {
          void router.push('/sample/post/create');
        }}
      >
        create post
      </Button>
    </>
  );
};

TodoPage.getLayout = function getLayout(page: JSX.Element) {
  return <SampleLayout>{page}</SampleLayout>;
};

export default TodoPage;
