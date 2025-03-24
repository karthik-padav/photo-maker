"use client";

import { useAppProvider } from "@/lib/app-provider";
import { ControlerValue, SelectedImage } from "@/lib/interfaces";
import { useCallback, useEffect, useRef, useState } from "react";
import { calcPercentage, calcPx } from "@/lib/common";
import Image from "next/image";
import constants from "@/lib/constants";
import { Button } from "../ui/button";
import * as htmlToImage from "html-to-image";

interface Params {
  image: SelectedImage;
  controler?: ControlerValue;
  disabled?: boolean;
}

function donwload() {
  const node = document.getElementById("my-node");

  if (node) {
    htmlToImage
      .toPng(node)
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = "image"; // Set the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // Clean up
      })
      .catch((err) => {
        console.error("oops, something went wrong!", err);
      });
  } else {
    console.error("Node not found!");
  }
}

export default function DownloadImageHtml({ image, controler }: Params) {
  if (!image.imagePath) return null;
  console.log(image, "image123");
  console.log(controler, "controler");
  console.log(
    `${process.env.NEXT_PUBLIC_IMAGE_URL}${controler?.backgroundImagePath}`
  );
  console.log(image.imagePath);
  return (
    <div className="w-full h-full relative">
      <Button className="absolute -top-10 left-0" onClick={donwload}>
        Download
      </Button>
      <div className="relative w-full h-full" id="my-node">
        {controler?.backgroundImagePath && (
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${controler?.backgroundImagePath}`}
            alt="bg image"
            className="w-full h-full absolute object-cover z-10"
            crossOrigin="anonymous"
          />
        )}
        <img
          src={image.imagePath}
          alt="image"
          className="w-full h-full absolute object-cover z-20"
          crossOrigin="anonymous"
        />
      </div>
    </div>
  );
}
