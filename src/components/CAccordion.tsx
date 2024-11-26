'use client';
import {
  Accordion,
  AccordionBody,
  AccordionHeader
} from '@material-tailwind/react';
import React, { useState, type ReactElement } from 'react';

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

const CAccordion = ({
  title,
  description
}: {
  title: string;
  description: ReactElement<any, any>;
  titleColor?: string;
}): React.ReactElement => {
  const [open, setOpen] = useState(false);
  const titleColor = open ? '#3AC4A0' : '#000000';
  return (
    <Accordion icon={<Icon open={open} />} open={open}>
      <AccordionHeader
        onClick={() => {
          setOpen(c => !c);
        }}
        style={{ color: titleColor, textAlign: 'left' }}
      >
        {title}
      </AccordionHeader>
      <AccordionBody>{description}</AccordionBody>
    </Accordion>
  );
};

export default CAccordion;
