import { forwardRef, useEffect, useRef, useState } from "react";
import { Stage, Layer, Text, Image as KonvaImage } from "react-konva";
import Konva from "konva";
import { Stage as StageType } from "konva/lib/Stage";

const CanvaEditor = forwardRef<StageType, any>(
  ({ elements, canvaWidth }, ref) => {
    const aspectRatio = elements.imageSrc.height / elements.imageSrc.width;
    const scaledHeight = canvaWidth * aspectRatio;

    return (
      <>
        <Stage width={canvaWidth} height={scaledHeight} ref={ref}>
          <Layer>
            {elements.imageSrc && (
              <KonvaImage
                image={elements.imageSrc}
                x={0}
                y={0}
                width={canvaWidth}
                height={scaledHeight}
                ref={(node) => {
                  if (node) node.cache();
                }}
                filters={[Konva.Filters.Blur]}
                blurRadius={elements.bgBlur}
              />
            )}
            {(elements.texts || []).map((item: any) => {
              return (
                <Text
                  ref={(node) => {
                    if (node) {
                      node.offsetX(node.width() / 2);
                      node.offsetY(node.height() / 2);
                      node.cache();
                    }
                  }}
                  key={item.id}
                  text={item.text}
                  fontSize={item.fontSize * 3}
                  fontFamily={item.fontFamily}
                  rotation={item.rotation || 0}
                  textDecoration={item.textDecoration}
                  align="center"
                  verticalAlign="middle"
                  fontStyle={`${item.fontStyle} ${item.fontWeight}`}
                  fill={item.color}
                  x={item.left === 0 ? canvaWidth / 2 : item.left}
                  y={item.top === 0 ? scaledHeight / 2 : item.top}
                  // offsetX={width / 2}
                  // offsetY={height / 2}
                  draggable
                  opacity={item.opacity || 1}
                  onDragStart={() => {
                    // setIsDragging(true);
                  }}
                  onDragEnd={(e) => {
                    // setIsDragging(false);
                    // setPosition({
                    //   x: e.target.x(),
                    //   y: e.target.y(),
                    // });
                  }}
                  onMouseOver={(e) => {
                    const stage = e.target.getStage();
                    if (stage) {
                      stage.container().style.cursor = "move";
                    }
                  }}
                  onMouseOut={(e) => {
                    const stage = e.target.getStage();
                    if (stage) {
                      stage.container().style.cursor = "default";
                    }
                  }}
                />
              );
            })}
            {elements.rbgSrc && (
              <KonvaImage
                image={elements.rbgSrc}
                x={0}
                y={0}
                width={canvaWidth}
                height={scaledHeight}
                listening={false}
              />
            )}
          </Layer>
        </Stage>
      </>
    );
  }
);

export default CanvaEditor;
