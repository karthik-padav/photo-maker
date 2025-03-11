"use client";
import Image from "next/image";
import { useTheme } from "next-themes";
import constants from "@/lib/constants";

interface Params {
  src?: string;
  src_dark?: string;
  src_light?: string;
  alt: string;
}

export default function ImageWrapper({
  src,
  src_dark,
  src_light,
  alt = "Banner Image",
}: Params) {
  const { theme } = useTheme();
  let _src = src;
  if (theme === "light") _src = src_light;
  if (theme === "dark") _src = src_dark;
  if (!_src) return null;
  return (
    <>
      <Image
        alt={alt}
        src={_src}
        width={1500}
        height={1500}
        placeholder="blur"
        blurDataURL={constants.blurDataURL}
        loading="lazy"
      />
    </>
  );
}
