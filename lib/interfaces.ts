export interface ControlerValue {
  border?: { title: string; value: string };
  rotate?: number | string;
  scale?: number | string;
  transformX?: number;
  transformY?: number;
  pngShadow?: string;
  pngBorderColor?: string;
  outerBorderOpacity?: string;
  outerBorderWidth?: string;
  outerBorderColor?: string;
  imageWrapperSize?: number;
  backgroundColor?: string;
  backgroundColorType?: string;
  backgroundRotate?: string;
  backgroundImagePath?: string;
  backgroundScale?: string;
}

export interface SelectedImage {
  id: string;
  imagePath: string;
}

// export interface BgPngImage {
//   id?: string;
//   backgroundImagePath?: string;
// }

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
