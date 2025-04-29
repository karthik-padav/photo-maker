import { useEffect, useRef } from "react";

export default function CanvasWrapper({ controler }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !controler) return;

    if (!workerRef.current) {
      const worker = new Worker(
        new URL("../utils/canvasWorker.ts", import.meta.url),
        { type: "module" }
      );
      workerRef.current = worker;

      const offscreen = canvasRef.current.transferControlToOffscreen();
      worker.postMessage(
        {
          canvas: offscreen,
          controler, // Only plain data like imageSrc, rbgSrc, texts, etc.
        },
        [offscreen]
      );
    } else {
      workerRef.current.postMessage({ controler });
    }
  }, [controler]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
