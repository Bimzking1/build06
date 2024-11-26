import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Typography
} from '@material-tailwind/react';
import Image from 'next/image';
import { useState } from 'react';

interface props {
  data: any;
}

const CardPromo: React.FC<props> = ({ data }) => {
  const [open, setOpen] = useState(false);

  function Icon({ open }: { open: boolean }): React.ReactElement {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${open ? 'rotate-180' : ''} h-5 w-5 transition-transform`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    );
  }

  return (
    <Accordion icon={<Icon open={open} />} open={open} className="mb-2">
      <AccordionHeader
        onClick={() => {
          setOpen(c => !c);
        }}
      >
        <div className="flex flex-row items-center">
          <Image src={data.image} alt={data.title} height={35} width={35} />
          <div className="flex-col">
            <Typography className="font-normal text-sm text-black ml-3">
              {data.title}
            </Typography>
            <Typography className="font-light text-xs text-[#7C7C7C] ml-3">
              {data.amount}
            </Typography>
          </div>
        </div>
      </AccordionHeader>
      {data.voucher.slice(0, 2).map((voucher: any, idx: any) => (
        <div key={idx}>
          <AccordionBody>
            <span className="mr-8px">&#8226;</span> {voucher}
          </AccordionBody>
          <hr />
        </div>
      ))}

      {data.voucher.length > 2 && (
        <div>
          <AccordionBody>
            <span className="text-xs font-normal mr-[8px] text-[#3C49D6]">
              See All ({data.voucher.length} vouchers)
            </span>
          </AccordionBody>
          <hr />
        </div>
      )}
    </Accordion>
  );
};

export default CardPromo;
