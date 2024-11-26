'use client';
import SampleLayout from '@/components/layouts/SampleLayout';
import useService from '@/hooks/useService';
import { createPost } from '@/repository/post';
import { isEmptyString, isUndefindOrNull } from '@/utils/common/utils';
import { Button, Input, Typography } from '@material-tailwind/react';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';

const TodoPage = (): JSX.Element => {
  const router = useRouter();
  const { data, error, loading, execute } = useService(createPost);

  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    userId: 1
  });

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

  const handleChangeFormData = (key: string, value: string): void => {
    if (
      isUndefindOrNull(key) ||
      isEmptyString(key) ||
      isUndefindOrNull(value)
    ) {
      return;
    }

    setForm({
      ...form,
      [key]: value
    });
  };

  const submit = (): void => {
    void (async () => {
      await execute(form);
    })();
  };

  return (
    <>
      <form className="mt-8 mb-2">
        <div className="mb-4 flex flex-col gap-6">
          <Input
            label="Title"
            size="lg"
            type="text"
            readOnly={loading}
            disabled={loading}
            value={form.title}
            onChange={e => {
              handleChangeFormData('title', e.target.value);
            }}
          />
          <Input
            label="Subtitle"
            size="lg"
            type="text"
            readOnly={loading}
            disabled={loading}
            value={form.subtitle}
            onChange={e => {
              handleChangeFormData('subtitle', e.target.value);
            }}
          />
          <Button
            disabled={loading}
            onClick={() => {
              submit();
            }}
          >
            submit
          </Button>
        </div>
        <Typography color="gray" className="mt-4 text-center font-normal">
          <RenderedData />
        </Typography>
      </form>

      <Button
        fullWidth
        color="green"
        onClick={() => {
          void router.push('/sample/post');
        }}
      >
        back to post
      </Button>
    </>
  );
};

TodoPage.getLayout = function getLayout(page: JSX.Element) {
  return <SampleLayout>{page}</SampleLayout>;
};

export default TodoPage;
