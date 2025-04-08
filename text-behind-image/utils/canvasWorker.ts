// canvasWorker.ts
self.onmessage = async (e) => {
  const { canvas, controler } = e.data;

  if (!(canvas instanceof OffscreenCanvas) || !controler?.imageSrc) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const image = new Image();
  const rbg = new Image();

  image.src = controler.imageSrc;
  rbg.src = controler.rbgSrc;

  await Promise.all([
    image.decode().catch(() => {}),
    rbg.decode().catch(() => {}),
  ]);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const canvasSize = controler.imageWrapperSize || 300;
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  ctx.filter = `
      brightness(${controler.bgBrightness || 100}%)
      contrast(${controler.bgContrast || 100}%)
      saturate(${controler.bgSaturate || 100}%)
      hue-rotate(${controler.bgHueRotate || 0}deg)
      grayscale(${controler.bgGrayscale || 0}%)
      sepia(${controler.bgSepia || 0}%)
      invert(${controler.bgInvert || 0}%)
      blur(${controler.bgBlur || 0}px)
    `;

  ctx.drawImage(rbg, 0, 0, canvasSize, canvasSize);
  ctx.drawImage(image, 0, 0, canvasSize, canvasSize);

  if (controler.texts?.length) {
    ctx.filter = "none";
    for (const text of controler.texts) {
      ctx.font = `${text.size}px ${text.font}`;
      ctx.fillStyle = text.color;
      ctx.fillText(text.text, text.x, text.y);
    }
  }
};
