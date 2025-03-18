export function drawOuterBorder({
  ctx,
  controler,
  borderRadius,
  borderRadiusPercent,
  parentWidth,
}) {
  if (
    !controler?.outerBorderWidth ||
    !controler?.outerBorderColor ||
    controler?.outerBorderWidth === "0"
  )
    return ctx;

  const borderWidth = Number(controler.outerBorderWidth);
  const borderColor = controler.outerBorderColor;
  const borderOpacity = controler.outerBorderOpacity
    ? Number(controler.outerBorderOpacity)
    : 1;

  const halfBorder = borderWidth / 2;
  const adjustedBorderRadius = Math.max(0, borderRadius - halfBorder);

  ctx.save();
  ctx.globalAlpha = borderOpacity;
  ctx.lineWidth = borderWidth;
  ctx.strokeStyle = borderColor;

  ctx.beginPath();

  if (borderRadiusPercent === 50) {
    // ✅ Perfect circle when borderRadius is 50%
    const radius = parentWidth / 2 - halfBorder;
    ctx.arc(parentWidth / 2, parentWidth / 2, radius, 0, Math.PI * 2);
  } else {
    // ✅ Handle any borderRadius (e.g., 30%, 40%, 20%)
    ctx.moveTo(adjustedBorderRadius + halfBorder, halfBorder);
    ctx.lineTo(parentWidth - adjustedBorderRadius - halfBorder, halfBorder);
    ctx.arcTo(
      parentWidth - halfBorder,
      halfBorder,
      parentWidth - halfBorder,
      adjustedBorderRadius + halfBorder,
      adjustedBorderRadius
    );
    ctx.lineTo(
      parentWidth - halfBorder,
      parentWidth - adjustedBorderRadius - halfBorder
    );
    ctx.arcTo(
      parentWidth - halfBorder,
      parentWidth - halfBorder,
      parentWidth - adjustedBorderRadius - halfBorder,
      parentWidth - halfBorder,
      adjustedBorderRadius
    );
    ctx.lineTo(adjustedBorderRadius + halfBorder, parentWidth - halfBorder);
    ctx.arcTo(
      halfBorder,
      parentWidth - halfBorder,
      halfBorder,
      parentWidth - adjustedBorderRadius - halfBorder,
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
  return ctx;
}

export function imageOutline({ controler, ctx }) {
  if (
    !controler?.pngShadow?.length ||
    controler?.pngShadow === "0" ||
    !controler?.pngBorderColor?.length
  )
    return;
  const strokeWidth = Number(controler.pngShadow) * 10;
  ctx.shadowColor = controler.pngBorderColor;
  ctx.shadowBlur = strokeWidth;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

export function drawBackground({ controler, canvas, ctx }) {
  const bgScale = controler?.backgroundScale
    ? Number(controler.backgroundScale)
    : 1;
  const bgRotate = controler?.backgroundRotate
    ? Number(controler.backgroundRotate)
    : 0;
  if (controler?.backgroundImagePath) {
    // Background Image with rotation and scaling
    const bgImage = new Image();
    bgImage.crossOrigin = "anonymous";
    bgImage.src = controler.backgroundImagePath;
    bgImage.onload = () => {
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
      return ctx;
    };
  } else if (controler?.backgroundColorType === "bg") {
    // Solid Background Color (No Rotation)
    ctx.fillStyle = controler.backgroundColor || "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    return ctx;
  } else if (controler?.backgroundColorType === "bgg") {
    // Background Gradient with Rotation
    const radians = (bgRotate * Math.PI) / 180;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(radians);

    const gradient = ctx.createLinearGradient(
      -canvas.width / 2,
      0,
      canvas.width / 2,
      0
    );
    const gradientColors = controler.backgroundColor.match(
      /rgb\((\d+, \d+, \d+)\)/g
    );
    if (gradientColors) {
      gradient.addColorStop(0, gradientColors[0]);
      gradient.addColorStop(1, gradientColors[1]);
    } else {
      gradient.addColorStop(0, "red");
      gradient.addColorStop(1, "yellow");
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(
      -canvas.width / 2,
      -canvas.height / 2,
      canvas.width,
      canvas.height
    );

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    return ctx;
  }
  return ctx;
}

export function drawImageLayer({
  canvas,
  img,
  scale,
  rotate,
  controler,
  ctx,
  position,
  start,
}) {
  const scaleFactor =
    Math.min(canvas.width / img.width, canvas.height / img.height) * scale;
  const scaledWidth = img.width * scaleFactor;
  const scaledHeight = img.height * scaleFactor;

  const radians = (rotate * Math.PI) / 180;
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(radians);

  imageOutline({ controler, ctx });

  ctx.drawImage(
    img,
    -scaledWidth / 2,
    -scaledHeight / 2,
    scaledWidth,
    scaledHeight
  );

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  return ctx;
}

export function createCanvasRadius({ ctx, borderRadius, parentWidth }) {
  ctx.beginPath();
  ctx.moveTo(borderRadius, 0);
  ctx.lineTo(parentWidth - borderRadius, 0);
  ctx.arcTo(parentWidth, 0, parentWidth, borderRadius, borderRadius);
  ctx.lineTo(parentWidth, parentWidth - borderRadius);
  ctx.arcTo(
    parentWidth,
    parentWidth,
    parentWidth - borderRadius,
    parentWidth,
    borderRadius
  );
  ctx.lineTo(borderRadius, parentWidth);
  ctx.arcTo(0, parentWidth, 0, parentWidth - borderRadius, borderRadius);
  ctx.lineTo(0, borderRadius);
  ctx.arcTo(0, 0, borderRadius, 0, borderRadius);
  ctx.closePath();
  ctx.clip(); // ⬅️ Apply the rounded clipping to everything drawn
  return ctx;
}
