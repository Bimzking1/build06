export interface ICountDown {
  countdown: number;
  resetCountdown: () => void;
  blockHandler: () => void;
  stopHandler: () => void;
  countdownText: string;
  blockByCountdown: boolean;
}
