import { useCallback, useEffect, useRef, useState } from "react";

interface Position {
  x: number;
  y: number;
}

export default function Dragable(imgProps) {
  const { style = {}, defaultAxis = {}, onUpdate = () => {} } = { ...imgProps };
  if (!imgProps?.src) return null;
  const [position, setPosition] = useState<Position>({
    x: defaultAxis?.x || 0,
    y: defaultAxis?.y || 0,
  });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    if (!dragging) onUpdate(position);

    // Disable scrolling when dragging
    const disableScroll = (e: TouchEvent) => {
      if (dragging) e.preventDefault();
    };

    document.addEventListener("touchmove", disableScroll, { passive: false });
    return () => document.removeEventListener("touchmove", disableScroll);
  }, [dragging]);

  // Start dragging
  const handleMouseDown = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.preventDefault();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      setDragging(true);
      setOffset({ x: clientX - position.x, y: clientY - position.y });
    },
    [position]
  );

  // Move image while dragging
  const handleMouseMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!dragging) return;
      e.preventDefault();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      setPosition({ x: clientX - offset.x, y: clientY - offset.y });
    },
    [dragging, offset]
  );

  // Stop dragging
  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, []);

  return (
    <img
      {...imgProps}
      style={{
        ...style,
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(0, 0)",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleMouseDown}
      onTouchMove={handleMouseMove}
      onTouchEnd={handleMouseUp}
    />
  );
}
