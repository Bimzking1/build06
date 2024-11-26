import { trackEvent } from '@phntms/next-gtm';
import DeviceDetector from 'device-detector-js';

interface Tracker {
  event: string;
  [key: string]: any;
}

const TrackerEvent = ({ event, ...additionalData }: Tracker): void => {
  const dataList = [
    'userData',
    'quizData',
    'circleData',
    'paymentData',
    'postData'
  ];
  const dynamicData: Record<string, any> = {};
  const detector = new DeviceDetector();

  dataList.forEach(key => {
    if (additionalData[key] === undefined) {
      dynamicData[key] = undefined;
    }
  });

  trackEvent({
    event,
    data: {
      ...dynamicData,
      ...additionalData,
      created_at: new Date().toString(),
      device: {
        user_device: detector.parse(navigator.userAgent).device?.type,
        user_type: detector.parse(navigator.userAgent).client?.type,
        user_os: detector.parse(navigator.userAgent).os?.name
      }
    }
  });
};

export default TrackerEvent;
