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
  bgSize?: string;
}

export interface SelectedImage {
  _id: string;
  imageURL: string;
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
