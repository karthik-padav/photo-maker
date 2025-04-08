interface Text {
  id: string;
  text: string;
  fontFamily: string;
  fontStyle: string;
  textDecoration: string;
  top: number;
  left: number;
  color: string;
  fontSize: number;
  fontWeight: number;
  opacity: number;
  shadowColor: string;
  shadowSize: number;
  rotation: number;
  tiltX: number;
  tiltY: number;
}

export interface TBIControlerValue {
  imageSrc?: HTMLImageElement | null;
  rbgSrc?: HTMLImageElement | null;
  texts?: Text[];
  imageWrapperSize: number;
  bgBlur: number;
  bgBrightness: number;
  bgContrast: number;
  bgSaturate: number;
  bgHueRotate: number;
  bgGrayscale: number;
  bgSepia: number;
  bgInvert: number;
}
