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
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export default function DownloadImage({ image, controler, canvasRef }: Params) {
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

  const [_image, setImage] = useState<HTMLImageElement | null>(null);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);

  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (image.imagePath) {
      const img = new Image();
      img.src = `${process.env.NEXT_PUBLIC_IMAGE_URL}${image.imagePath}`;
      // img.src =
      //   "https://plus.unsplash.com/premium_photo-1689568126014-06fea9d5d341?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D";
      img.crossOrigin = "anonymous";
      img.onload = () => setImage(img);
    }
  }, [image.imagePath]);

  useEffect(() => {
    if (controler?.backgroundImagePath) {
      const bgImg = new Image();
      // bgImg.src = controler.backgroundImagePath;
      bgImg.src =
        "https://photo-maker.s3.ap-south-1.amazonaws.com/bg-collection/26.jpg";

      bgImg.crossOrigin = "anonymous";
      bgImg.onload = () => setBgImage(bgImg);
    } else setBgImage(null);
  }, [controler?.backgroundImagePath]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!_image || !ctx || !canvas) return;
    const borderRadiusPercent =
      controler?.border?.value === "rounded-xl"
        ? 0
        : controler?.border?.value === "rounded-3xl"
        ? 4
        : 50;

    const parentWidth = canvas.parentElement?.clientWidth || _image.width;

    // Get scale & rotation for image and background
    const scale = controler?.scale ? Number(controler.scale) : 1;
    const rotate = controler?.rotate ? Number(controler.rotate) : 0;

    // Set canvas dimensions
    canvas.width = parentWidth;
    canvas.height = parentWidth;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply Clipping (overflow hidden effect)
    ctx.save();
    ctx.beginPath();

    if (borderRadiusPercent > 49) {
      // ✅ Clip to a circle
      const radius = canvas.width / 2;
      ctx.arc(canvas.width / 2, canvas.height / 2, radius, 0, Math.PI * 2);
    } else if (borderRadiusPercent > -1) {
      // ✅ Clip to a rounded rectangle
      const adjustedBorderRadius =
        (borderRadiusPercent / 100) * (canvas.width / 2);
      ctx.moveTo(adjustedBorderRadius, 0);
      ctx.arcTo(
        canvas.width,
        0,
        canvas.width,
        canvas.height,
        adjustedBorderRadius
      );
      ctx.arcTo(
        canvas.width,
        canvas.height,
        0,
        canvas.height,
        adjustedBorderRadius
      );
      ctx.arcTo(0, canvas.height, 0, 0, adjustedBorderRadius);
      ctx.arcTo(0, 0, canvas.width, 0, adjustedBorderRadius);
    }

    ctx.closePath();
    ctx.clip();
    // ✅ Apply clip to keep everything inside the shape

    const scaleFactor =
      Math.min(canvas.width / _image!.width, canvas.height / _image!.height) *
      scale;
    const scaledWidth = _image.width * scaleFactor;
    const scaledHeight = _image.height * scaleFactor;

    const centerX = position.x + scaledWidth / 2;
    const centerY = position.y + scaledHeight / 2;

    ctx.save(); // Save current transformation state

    // DRAW BACKGROUND START
    if (bgImage) {
      const bgScale = controler?.backgroundScale
        ? Number(controler.backgroundScale)
        : 1;
      const bgRotate = controler?.backgroundRotate
        ? Number(controler.backgroundRotate)
        : 0;
      const scaleFactor =
        Math.min(canvas.width / bgImage.width, canvas.height / bgImage.height) *
        bgScale;
      const bgWidth = bgImage.width * scaleFactor;
      const bgHeight = bgImage.height * scaleFactor;

      const radians = (bgRotate * Math.PI) / 180;
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(radians);

      ctx.drawImage(bgImage, -bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight);
      ctx.setTransform(1, 0, 0, 1, 0, 0);
    } else if (controler?.backgroundColorType === "bg") {
      // Solid Background Color (No Rotation)
      ctx.fillStyle = controler.backgroundColor || "white";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (controler?.backgroundColorType === "bgg") {
      // Background Gradient with Rotation & Scaling
      const bgScale = controler?.backgroundScale
        ? Number(controler.backgroundScale)
        : 1;
      const bgRotate = controler?.backgroundRotate
        ? Number(controler.backgroundRotate)
        : 0;

      const radians = (bgRotate * Math.PI) / 180;

      // Scale factor calculation (similar to bgImage)
      const bgWidth = canvas.width * bgScale;
      const bgHeight = canvas.height * bgScale;

      // Apply transformations
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(radians);
      ctx.scale(bgScale, bgScale); // ✅ Scale the background gradient

      // Create the gradient
      const gradient = ctx.createLinearGradient(
        -bgWidth / 2,
        0,
        bgWidth / 2,
        0
      );
      const gradientColors =
        controler.backgroundColor &&
        controler.backgroundColor.match(/rgb\((\d+, \d+, \d+)\)/g);
      if (gradientColors) {
        gradient.addColorStop(0, gradientColors[0]);
        gradient.addColorStop(1, gradientColors[1]);
      } else {
        gradient.addColorStop(0, "red");
        gradient.addColorStop(1, "yellow");
      }

      ctx.fillStyle = gradient;

      // Draw the gradient background
      ctx.fillRect(-bgWidth / 2, -bgHeight / 2, bgWidth, bgHeight);

      ctx.restore(); // ✅ Restore previous state

      // Reset transformations
      // ctx.setTransform(1, 0, 0, 1, 0, 0);
    }
    // DRAW BACKGROUND END

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
    // OUTER BORDER END

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

    // Draw image centered at (0,0) after transformation
    ctx.drawImage(
      _image,
      -scaledWidth / 2,
      -scaledHeight / 2,
      scaledWidth,
      scaledHeight
    );

    ctx.restore(); // Restore the previous state

    console.log(canvasRef.current, "canvasRef.current");
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
    bgImage,
    controler?.backgroundColor,
    controler?.backgroundRotate,
    controler?.backgroundScale,
    controler?.border?.value,
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
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
        />
      </div>
    </>
  );
}
