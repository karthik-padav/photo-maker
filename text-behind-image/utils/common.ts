import { uid } from "uid";
import constants from "./constants";
import {
  Bold,
  Copy,
  Italic,
  LoaderCircle,
  Palette,
  Square,
  Trash2,
  Underline,
} from "lucide-react";
import React from "react"; // Import ReactNode for proper typing

export function addText(data: { [key: string]: string | number }) {
  return {
    id: uid(16),
    text: "edit",
    fontFamily: "Inter",
    fontStyle: "normal",
    textDecoration: "none",
    top: 0,
    left: 0,
    color: "white",
    fontSize: 40,
    fontWeight: 400,
    opacity: 1,
    shadowColor: "rgba(0, 0, 0, 0.8)",
    shadowSize: 4,
    rotation: 0,
    tiltX: 0,
    tiltY: 0,
    ...data,
  };
}

export function getUniqueRandomWord(arr: string[] = []) {
  if (!arr)
    return constants.randomWords[
      Math.floor(Math.random() * constants.randomWords.length)
    ];

  const filteredWords = constants.randomWords.filter(
    (word) => !arr.includes(word)
  );

  if (filteredWords.length === 0) return null;

  return filteredWords[Math.floor(Math.random() * filteredWords.length)];
}

export function renderTextRange(item) {
  return [
    {
      label: "Opacity",
      attr: {
        min: 0,
        max: 1,
        step: 0.1,
        name: "opacity",
      },
    },
    {
      label: "Rotation",
      postfix: "%",
      attr: {
        min: -180,
        max: 180,
        step: 1,
        name: "rotation",
      },
    },
  ];
}

export function renderImageRange(controler) {
  return [
    {
      label: "Background Blur",
      attr: {
        min: 0,
        max: 10,
        step: 0.1,
        value: controler.bgBlur || 0,
        name: "bgBlur",
      },
    },
    {
      label: "Brightness",
      attr: {
        min: -1,
        max: 1,
        step: 0.1,
        value: controler.bgBrightness || 0,
        name: "bgBrightness",
      },
    },
    {
      label: "Contrast",
      attr: {
        min: -100,
        max: 100,
        step: 10,
        value: controler.bgContrast || 0,
        name: "bgContrast",
      },
    },
    {
      label: "Saturate",
      attr: {
        min: 0,
        max: 200,
        step: 10,
        value: controler.bgSaturate || 100,
        name: "bgSaturate",
      },
    },
    {
      label: "Hue Rotate",
      attr: {
        min: 0,
        max: 100,
        step: 5,
        value: controler.bgHueRotate || 0,
        name: "bgHueRotate",
      },
    },
    {
      label: "Grayscale",
      attr: {
        min: 0,
        max: 100,
        step: 5,
        value: controler.bgGrayscale || 0,
        name: "bgGrayscale",
      },
    },
    {
      label: "Sepia",
      attr: {
        min: 0,
        max: 100,
        step: 5,
        value: controler.bgSepia || 0,
        name: "bgSepia",
      },
    },
    {
      label: "Invert",
      attr: {
        min: 0,
        max: 100,
        step: 5,
        value: controler.bgInvert || 0,
        name: "bgInvert",
      },
    },
  ];
}

export function renderFontStyles(item) {
  return [
    {
      name: "fontWeight",
      value: item?.fontWeight === 700 ? 400 : 700,
      variant: item.fontWeight > 400 ? undefined : "ghost",
      icon: React.createElement(Bold, { className: "h-5 w-5" }),
    },
    {
      name: "fontStyle",
      value: item?.fontStyle === "italic" ? "normal" : "italic",
      variant: item.fontStyle === "normal" ? "ghost" : undefined,
      icon: React.createElement(Italic, { className: "h-5 w-5" }),
    },
    {
      name: "textDecoration",
      value: item?.textDecoration === "underline" ? "none" : "underline",
      variant: item.textDecoration === "none" ? "ghost" : undefined,
      icon: React.createElement(Underline, { className: "h-5 w-5" }),
    },
  ];
}

export function getDefaultControler(controler) {
  return {
    imageSrc: "",
    rbgSrc: "",
    texts: [],
    imageWrapperSize: controler?.imageWrapperSize || 300,
    bgBlur: 0,
    bgBrightness: 100,
    bgContrast: 100,
    bgSaturate: 100,
    bgHueRotate: 0,
    bgGrayscale: 0,
    bgSepia: 0,
    bgInvert: 0,
  };
}
