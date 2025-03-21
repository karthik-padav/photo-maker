"use client";

import { useAppProvider } from "@/lib/app-provider";
import { ControlerValue, SelectedImage } from "@/lib/interfaces";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  createCanvasRadius,
  drawBackground,
  drawImageLayer,
  drawOuterBorder,
  imageOutline,
} from "./utils";
import { calcPercentage, calcPx } from "@/lib/common";

interface Params {
  image: SelectedImage;
  controler?: ControlerValue;
  disabled?: boolean;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export default function DownloadImage({ image, controler, canvasRef }: Params) {
  const imageWrapperRef = useRef<HTMLDivElement>(null);
  const { setControlerValue } = useAppProvider();

  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (imageWrapperRef?.current?.offsetWidth)
      setControlerValue({
        imageWrapperSize: imageWrapperRef.current.offsetWidth,
      });
  }, [imageWrapperRef?.current?.offsetWidth]);

  const imageWrapperWidth =
    imageWrapperRef?.current?.offsetWidth || controler?.imageWrapperSize || 300;

  const position = {
    x: calcPx(imageWrapperWidth, controler?.transformX || 0),
    y: calcPx(imageWrapperWidth, controler?.transformY || 0),
  };

  const [_image, setImage] = useState<HTMLImageElement | null>(null);
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);

  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (image.imagePath) {
      const img = new Image();
      img.src = `${process.env.NEXT_PUBLIC_IMAGE_URL}${image.imagePath}`;
      img.crossOrigin = "anonymous";
      img.onload = () => setImage(img);
    }
  }, [image.imagePath]);

  useEffect(() => {
    if (controler?.backgroundImagePath) {
      const bgImg = new Image();
      bgImg.src = `${process.env.NEXT_PUBLIC_IMAGE_URL}${controler.backgroundImagePath}`;

      bgImg.crossOrigin = "anonymous";
      bgImg.onload = () => setBgImage(bgImg);
    } else setBgImage(null);
  }, [controler?.backgroundImagePath]);

  useEffect(() => {
    const preventScroll = (e: TouchEvent) => {
      if (canvasRef.current?.contains(e.target as Node)) {
        e.preventDefault();
      }
    };

    document.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!_image || !ctx || !canvas) return;
    const borderRadiusPercent = controler?.border ? controler.border.value : 50;

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
      ctx.roundRect(0, 0, canvas.width, canvas.height, adjustedBorderRadius);
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
      drawShadowed({ ctx, scaledWidth, scaledHeight });
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

  const drawShadowed = useCallback(
    ({ ctx, scaledWidth, scaledHeight }) => {
      if (!_image) return;
      if (
        controler?.pngShadow?.length ||
        controler?.pngShadow !== "0" ||
        controler?.pngBorderColor?.length
      ) {
        if (
          !isNaN(Number(controler?.pngShadow)) &&
          Number(controler?.pngShadow)
        ) {
          if (controler?.pngBorderColor)
            ctx.shadowColor = controler.pngBorderColor;
          ctx.shadowBlur = Number(controler?.pngShadow) * 3;

          for (var x = -2; x <= 2; x++) {
            for (var y = -2; y <= 2; y++) {
              ctx.shadowOffsetX = x;
              ctx.shadowOffsetY = y;
              ctx.drawImage(
                _image,
                -scaledWidth / 2,
                -scaledHeight / 2,
                scaledWidth,
                scaledHeight
              );
            }
          }
        }
      }
    },
    [_image, controler?.pngShadow, controler?.pngBorderColor]
  );
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
    const x = e.clientX - rect.left - offset.x;
    const y = e.clientY - rect.top - offset.y;
    setControlerValue({
      transformX: calcPercentage(imageWrapperWidth, x),
      transformY: calcPercentage(imageWrapperWidth, y),
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMouseDown({
      clientX: touch.clientX,
      clientY: touch.clientY,
    } as MouseEvent);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    handleMouseMove({
      clientX: touch.clientX,
      clientY: touch.clientY,
    } as MouseEvent);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    handleMouseUp();
  };
  return (
    <>
      <div
        ref={imageWrapperRef}
        className={`w-full h-full overflow-hidden cursor-move`}
        onDragOver={(e) => e.preventDefault()}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
    </>
  );
}
