import ValidatePin from '@/components/forms/ValidatePin';
import PINModal from '@/components/popup/PINModal';
import { changePin } from '@/repository/profile.repository';
import { useState } from 'react';

const ChangePin: React.FC = () => {
  const [select, setSelect] = useState(0);
  const [form, setForm] = useState({ pin: '', old_pin: '' });
  const [pin, setPin] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const emptyPinIndex = pin.findIndex(number => number === '');
  const joinPin = pin.join('');

  const handleOpen = (): void => {
    setOpen(prev => !prev);
  };
  const handleSubmit = async (): Promise<void> => {
    try {
      const response = await changePin(form);
      handleOpen();
      setForm({ pin: '', old_pin: '' });
      if (response.data.message === 'pin/invalid') {
        setError(true);
      }
    } catch (error: any) {
      console.error(error.response.data.message);
    }
  };
  if (select === 0 && emptyPinIndex === -1) {
    setForm({ ...form, old_pin: joinPin });
    setPin(['', '', '', '', '', '']);
    setSelect(1);
  } else if (select === 1 && emptyPinIndex === -1) {
    setForm({ ...form, pin: joinPin });
    setPin(['', '', '', '', '', '']);
  } else if (form.pin !== '' && form.old_pin !== '') {
    handleSubmit()
      .then(() => {})
      .catch(() => {});
  }

  return (
    <>
      <ValidatePin
        pin={pin}
        setPin={setPin}
        error={error}
        setError={setError}
        emptyPinIndex={emptyPinIndex}
        className={select === 0 ? 'flex' : 'hidden'}
        title="Enter Your PIN"
        setSelect={setSelect}
      />
      <ValidatePin
        pin={pin}
        setPin={setPin}
        error={error}
        setError={setError}
        emptyPinIndex={emptyPinIndex}
        className={select === 1 ? 'flex' : 'hidden'}
        title="Create Your New PIN"
        setSelect={setSelect}
      />
      <PINModal open={open} handleOpen={handleOpen} />
    </>
  );
};

export default ChangePin;
