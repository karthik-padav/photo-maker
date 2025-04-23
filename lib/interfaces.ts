export interface ControlerValue {
  border?: { title: string; value: number };
  imageWrapperSize?: number;
  rotate?: number | string;
  scale?: number | string;
  pngShadow?: string;
  transformX?: number;
  transformY?: number;
  pngBorderColor?: string;
  backgroundColorType?: string;
  backgroundColor?: string;
  outerBorderColor?: string;
  outerBorderOpacity?: string;
  outerBorderWidth?: string;
  backgroundRotate?: string;
  backgroundImagePath?: string;
  backgroundScale?: string;
  imageSrc?: HTMLImageElement | null;
  outerBorderRadius?: string;
}

export interface SelectedImage {
  id: string;
  imagePath: string;
  key: string;
}

export interface SessionData {
  user: { email: string; photos: string[] };
}

export interface MyContoler {
  id: string;
  controler: ControlerValue;
  image: SelectedImage;
  downloadedImagePath?: string;
}

export interface User {
  id: string;
  credit: number | string;
}
