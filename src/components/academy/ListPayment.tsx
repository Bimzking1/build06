import { useTranslation } from 'react-i18next';

interface ListPaymentProps {
  isHidden: boolean;
  virtualList: JSX.Element[];
  ewalletList: JSX.Element[];
  qrisList: JSX.Element[];
  paymentIsSelected: boolean;
  showPopUp: () => void;
}

const ListPayment: React.FC<ListPaymentProps> = ({
  isHidden,
  virtualList,
  ewalletList,
  qrisList,
  paymentIsSelected,
  showPopUp
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white p-3 rounded-xl shadow-md" hidden={isHidden}>
      <div className="text-2xl font-bold text-center mb-4">
        {t('academy.payment.method')}
      </div>

      <div className="mb-4">
        <div className="text-sm font-semibold mb-2 text-[#7C7C7C]">
          {t('academy.payment.va')}
        </div>
        {virtualList}
      </div>

      <div className="mb-4">
        <div className="text-sm font-semibold mb-2 text-[#7C7C7C]">
          {t('academy.payment.ew')}
        </div>
        {ewalletList}
      </div>

      <div className="mb-4">
        <div className="text-sm font-semibold mb-2 text-[#7C7C7C]">
          {t('academy.payment.other')}
        </div>
        {qrisList}
      </div>

      <button
        disabled={paymentIsSelected}
        className={`${
          paymentIsSelected
            ? 'bg-[#BDBDBD] text-[#7C7C7C] cursor-not-allowed'
            : 'bg-[#3AC4A0] text-white hover:shadow-lg'
        } mb-4 p-3 rounded-3xl w-full font-medium`}
        onClick={showPopUp}
      >
        {t('academy.payment.pay')}
      </button>
    </div>
  );
};

export default ListPayment;
