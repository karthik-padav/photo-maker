export interface ControlerValue {
  border?: { title: string; value: string };
  backgroundColor?: { type: string; color: string };
  rotate?: number | string;
  scale?: number | string;
  transform?: string;
  pngShadow?: string;
  pngBorderColor?: string;
}

export interface CurrentImage {
  _id: string;
  imageURL: string;
  email: string;
}

export interface CustomImageControlers {
  pngShadow: any;
}
