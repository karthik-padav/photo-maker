export interface ControlerValue {
  border?: { title: string; value: string };
  backgroundColor?: { type: string; color: string } | null;
  rotate?: number | string;
  scale?: number | string;
  transform?: { x?: number; y?: number };
  pngShadow?: string;
  pngBorderColor?: string;
  outerBorderOpacity?: string;
  outerBorderWidth?: string;
  outerBorderColor?: string;
  bgImage?: string;
  bgSize?: string | number;
  imageWrapperSize?: number;
}

export interface SelectedImage {
  _id: string;
  imageKey: string;
  email: string;
  bgImage?: string;
}

export interface BgPngImage {
  id?: string;
  bgImage?: string;
}

export interface SessionData {
  user: { email: string; photos: string[] };
}

export interface MyContoler {
  _id: string;
  controler: ControlerValue;
  imageId: SelectedImage | null;
  downloadedImageKey?: string;
}

export interface User {
  _id: string;
  credit: number | string;
}
