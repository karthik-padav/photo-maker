"use client";

import { useAppProvider } from "@/lib/app-provider";
// import Image from "next/image";
// import constants from "@/lib/constants";
// import {
//   calcPercentage,
//   calcPx,
//   getBorderStyles,
//   getImageStyle,
// } from "@/lib/common";
// import { useAppProvider } from "../../lib/app-provider";
import { ControlerValue, SelectedImage } from "@/lib/interfaces";
import { useEffect, useRef, useState } from "react";
import {
  createCanvasRadius,
  drawBackground,
  drawImageLayer,
  drawOuterBorder,
  imageOutline,
} from "./utils";

interface Params {
  image: SelectedImage;
  controler?: ControlerValue;
  disabled?: boolean;
  saveCanvas: (canvas: HTMLCanvasElement | null) => void;
}

export default function DownloadImage({
  image,
  controler,
  saveCanvas = () => {},
}: Params) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const { setControlerValue } = useAppProvider();

  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  console.log(position, "position");
  console.log(start, "start");
  console.log(controler, "controler123");
  useEffect(() => {
    if (imageWrapperRef?.current?.offsetWidth)
      setControlerValue({
        imageWrapperSize: imageWrapperRef?.current?.offsetWidth,
      });
  }, [imageWrapperRef?.current?.offsetWidth]);

  // const downloadCanvasAsImage = () => {
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;

  //   // Convert canvas to a data URL
  //   const imageURI = canvas.toDataURL("image/png");

  //   // Create a download link
  //   const link = document.createElement("a");
  //   link.href = imageURI;
  //   link.download = "canvas-image.png"; // File name
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  const [_image, setImage] = useState<HTMLImageElement | null>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const img = new Image();
    img.src = `${process.env.NEXT_PUBLIC_IMAGE_URL}${image.imagePath}`;
    // img.src =
    //   "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D";

    img.onload = () => setImage(img);
  }, [image.imagePath]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!_image || !ctx || !canvas) return;

    const parentWidth = canvas.parentElement?.clientWidth || _image.width;

    // Get scale & rotation for image and background
    const scale = controler?.scale ? Number(controler.scale) : 1;
    const rotate = controler?.rotate ? Number(controler.rotate) : 0;

    // Set canvas dimensions
    canvas.width = parentWidth;
    canvas.height = parentWidth;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const scaleFactor =
      Math.min(canvas.width / _image!.width, canvas.height / _image!.height) *
      scale;
    const scaledWidth = _image.width * scaleFactor;
    const scaledHeight = _image.height * scaleFactor;

    const centerX = position.x + scaledWidth / 2;
    const centerY = position.y + scaledHeight / 2;

    ctx.save(); // Save current transformation state

    // OUTER BORDER START
    if (
      controler?.outerBorderWidth ||
      controler?.outerBorderColor ||
      (controler?.outerBorderWidth && controler.outerBorderWidth !== "0")
    ) {
      const borderWidth = Number(controler.outerBorderWidth);
      const borderOpacity = controler.outerBorderOpacity
        ? Number(controler.outerBorderOpacity)
        : 1;

      const halfBorder = borderWidth / 2; // Keeps the border inside the canvas
      const borderRadiusPercent =
        controler?.border?.value === "rounded-xl"
          ? 0
          : controler?.border?.value === "rounded-3xl"
          ? 4
          : 50;

      ctx.save();
      ctx.globalAlpha = borderOpacity;
      ctx.lineWidth = borderWidth;

      if (controler?.outerBorderColor)
        ctx.strokeStyle = controler.outerBorderColor;

      ctx.beginPath();

      if (borderRadiusPercent === 50) {
        // ✅ Draw a perfect circular border aligned to canvas edges
        const radius = canvas.width / 2 - halfBorder;
        ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
      } else {
        // ✅ Rectangular border aligned to canvas edges
        const adjustedBorderRadius = Math.max(
          0,
          borderRadiusPercent - halfBorder
        );
        ctx.moveTo(adjustedBorderRadius + halfBorder, halfBorder);
        ctx.lineTo(
          canvas.width - adjustedBorderRadius - halfBorder,
          halfBorder
        );
        ctx.arcTo(
          canvas.width - halfBorder,
          halfBorder,
          canvas.width - halfBorder,
          adjustedBorderRadius + halfBorder,
          adjustedBorderRadius
        );
        ctx.lineTo(
          canvas.width - halfBorder,
          canvas.height - adjustedBorderRadius - halfBorder
        );
        ctx.arcTo(
          canvas.width - halfBorder,
          canvas.height - halfBorder,
          canvas.width - adjustedBorderRadius - halfBorder,
          canvas.height - halfBorder,
          adjustedBorderRadius
        );
        ctx.lineTo(
          adjustedBorderRadius + halfBorder,
          canvas.height - halfBorder
        );
        ctx.arcTo(
          halfBorder,
          canvas.height - halfBorder,
          halfBorder,
          canvas.height - adjustedBorderRadius - halfBorder,
          adjustedBorderRadius
        );
        ctx.lineTo(halfBorder, adjustedBorderRadius + halfBorder);
        ctx.arcTo(
          halfBorder,
          halfBorder,
          adjustedBorderRadius + halfBorder,
          halfBorder,
          adjustedBorderRadius
        );
      }

      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }

    // DRAW BACKGROUND START

    // DRAW BACKGROUND END

    // Move origin to the center of the image
    ctx.translate(centerX, centerY);

    // ===================== Rotate Image around the center =====================
    const radians = (rotate * Math.PI) / 180;
    ctx.rotate(radians);
    // ===================== Rotate Image around the center =====================

    // ===================== OUTLINE FOR IMAGE START =====================
    if (
      controler?.pngShadow?.length ||
      controler?.pngShadow !== "0" ||
      controler?.pngBorderColor?.length
    ) {
      if (controler?.pngBorderColor) ctx.shadowColor = controler.pngBorderColor;
      if (controler?.pngShadow)
        ctx.shadowBlur = Number(controler.pngShadow) * 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }
    // ===================== OUTLINE FOR IMAGE END =====================

    // OUTER BORDER END

    // Draw image centered at (0,0) after transformation
    ctx.drawImage(
      _image,
      -scaledWidth / 2,
      -scaledHeight / 2,
      scaledWidth,
      scaledHeight
    );

    ctx.restore(); // Restore the previous state
    saveCanvas(canvasRef.current);
  }, [
    _image,
    position,
    controler?.rotate,
    controler?.scale,
    controler?.pngShadow,
    controler?.pngBorderColor,
    controler?.outerBorderWidth,
    controler?.outerBorderColor,
    controler?.outerBorderOpacity,
  ]);

  const handleMouseDown = (e) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (
      x >= position.x &&
      x <= position.x + (_image?.width || 0) &&
      y >= position.y &&
      y <= position.y + (_image?.height || 0)
    ) {
      setDragging(true);
      setOffset({ x: x - position.x, y: y - position.y });
    }
  };

  const handleMouseMove = (e) => {
    if (!dragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left - offset.x,
      y: e.clientY - rect.top - offset.y,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };
  return (
    <>
      {/* <button onClick={downloadCanvasAsImage}>Download Image</button> */}
      <div
        ref={imageWrapperRef}
        className={`w-full h-full overflow-hidden`}
        onDragOver={(e) => e.preventDefault()}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>
    </>
  );
}
