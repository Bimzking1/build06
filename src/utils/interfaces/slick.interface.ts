import type { Settings } from '@ant-design/react-slick';

export interface IUseSlick {
  settings: Settings;
  slickRef: any;
  changeStep: (value: number | undefined) => void;
}
