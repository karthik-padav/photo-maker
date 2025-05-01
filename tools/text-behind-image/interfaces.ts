interface Text {
  id: string;
  text: string;
  fontFamily: string;
  fontStyle: string;
  textDecoration: string;
  top: number;
  left: number;
  color: string;
  strokeColor: string;
  strokeWidth: number;
  fontSize: number;
  fontWeight: number;
  opacity: number;
  rotation: number;
}

export interface TBIControlerValue {
  imageSrc?: HTMLImageElement | null;
  rbgSrc?: HTMLImageElement | null;
  texts?: Text[];
  imageWrapperSize: number;
  bgBlur: number;
}
