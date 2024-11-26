import Footer from '@/components/layouts/Footer';
import NewSection1 from '../../components/product/NewSection1';
import NewSection2 from '../../components/product/NewSection2';
import NewSection3 from '../../components/product/NewSection3';
import NewSection4 from '../../components/product/NewSection4';
import NewSection5 from '../../components/product/NewSection5';
import NewSection6 from '../../components/product/NewSection6';

const Product = (): React.ReactElement => {
  return (
    <>
      <NewSection1 />
      <NewSection2 />
      <NewSection3 />
      <NewSection4 />
      <NewSection5 />
      <NewSection6 />
      <Footer />
    </>
  );
};

export default Product;
