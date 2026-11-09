export type QRType =
  | 'url'
  | 'text'
  | 'email'
  | 'phone'
  | 'sms'
  | 'vcard'
  | 'wifi'
  | 'location'
  | 'event'
  | 'crypto'
  | 'social';

export interface QROptions {
  width: number;
  height: number;
  margin: number;
  data: string;
  image?: string;
  qrOptions?: {
    typeNumber?: number;
    mode?: 'Numeric' | 'Alphanumeric' | 'Byte' | 'Kanji';
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  };
  dotsOptions: {
    color: string;
    type: 'rounded' | 'dots' | 'classy' | 'classy-rounded' | 'square' | 'extra-rounded';
    gradient?: {
      type: 'linear' | 'radial';
      rotation: number;
      colorStops: { offset: number; color: string }[];
    };
  };
  cornersSquareOptions: {
    color: string;
    type: 'dot' | 'square' | 'extra-rounded';
  };
  cornersDotOptions: {
    color: string;
    type: 'dot' | 'square';
  };
  backgroundOptions: {
    color: string;
  };
  imageOptions: {
    crossOrigin: string;
    margin: number;
    imageSize: number;
    hideBackgroundDots?: boolean;
    badgeStyle?: 'none' | 'white-circle' | 'white-rounded' | 'dark-circle';
    rawImage?: string;
  };
}

export interface QRHistoryItem {
  id: string;
  createdAt: number;
  type: QRType;
  data: any;
  options: QROptions;
  name: string;
}

export const defaultOptions: QROptions = {
  width: 320,
  height: 320,
  margin: 12,
  data: '',
  qrOptions: {
    errorCorrectionLevel: 'H',
  },
  dotsOptions: {
    color: '#000000',
    type: 'rounded',
  },
  cornersSquareOptions: {
    color: '#000000',
    type: 'extra-rounded',
  },
  cornersDotOptions: {
    color: '#000000',
    type: 'dot',
  },
  backgroundOptions: {
    color: '#ffffff',
  },
  imageOptions: {
    crossOrigin: 'anonymous',
    margin: 4,
    imageSize: 0.32,
    hideBackgroundDots: true,
    badgeStyle: 'white-circle',
  },
};
