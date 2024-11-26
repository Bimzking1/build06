'use client';
import type { color } from '@material-tailwind/react/types/components/button';
import { type StaticImageData } from 'next/image';

export interface IButton {
  children: React.ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  disabled?: boolean;
  type?: 'button' | 'reset' | 'submit' | undefined;
  onSubmit?: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => Promise<void>;
  color?: color | undefined;
  fullWidth?: boolean;
}

export interface ICard {
  children: React.ReactNode;
  className: string;
}

export interface ILanguage {
  id: string;
  label: string;
  icon: StaticImageData;
}

export interface ISlider {
  image: StaticImageData;
  title: string;
  text: string;
}

export interface ILastNews {
  topic: string;
  title: string;
  photo: StaticImageData;
  user: {
    photo: StaticImageData;
    name: string;
  };
  createdAt: string;
}

export interface ICompetitionItem {
  photo: StaticImageData;
  gift: number;
  title: string;
  participant: {
    total: number;
    max: number;
  };
  start: Date;
  end: Date;
  status: string;
}

export interface ICircleLandingPage {
  id: string;
  image: any;
  banner: string;
  name: string;
  totalMember: number;
  totalRating: number;
}

export interface IEventHighlightLandingPage {
  id: string;
  name: string;
  image: any;
  title: string;
  comment: string;
}
