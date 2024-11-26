'use client';
import SampleLayout from '@/components/layouts/SampleLayout';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Input, Typography } from '@material-tailwind/react';

const StoragePage = (): JSX.Element => {
  const [data, setData] = useLocalStorage('accessToken', '');

  return (
    <form className="mt-8 mb-2">
      <div className="mb-4 flex flex-col gap-6">
        <Input
          label="Value"
          size="lg"
          value={data}
          onChange={e => setData(e.target.value)}
          icon={<span>☁</span>}
        />
      </div>
      <Typography color="gray" className="mt-4 text-center font-normal">
        {data}
      </Typography>
    </form>
  );
};

StoragePage.getLayout = function getLayout(page: JSX.Element) {
  return (
    <SampleLayout title="Local Storage" subtitle="Enter Any Value">
      {page}
    </SampleLayout>
  );
};

export default StoragePage;
