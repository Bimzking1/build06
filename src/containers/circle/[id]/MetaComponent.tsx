import Head from 'next/head';
interface props {
  pageTitle: string;
  pageDescription: string;
}
const MetaPage: React.FC<props> = ({ pageTitle, pageDescription }) => {
  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDescription} />
    </Head>
  );
};

export default MetaPage;
