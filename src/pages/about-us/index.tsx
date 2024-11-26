'use client';
import Footer from '@/components/layouts/Footer';
import Section1 from '@/containers/about-us/Section1';
import Section2 from '@/containers/about-us/Section2';
import Section3 from '@/containers/about-us/Section3';
import Section4 from '@/containers/about-us/Section4';
import Section5 from '@/containers/about-us/Section5';
import React from 'react';

export default function AboutUsPage(): React.ReactElement {
  return (
    <>
      <Section1 />
      <Section2 />
      <Section3 />
      <Section4 />
      <Section5 />
      <Footer />
    </>
  );
}
