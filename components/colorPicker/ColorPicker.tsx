import constants from "@/lib/constants";
import { Zap } from "lucide-react";
import Link from "next/link";
import { Pipette } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { hexToRgb } from "@/lib/common";

const colorList = [
  {
    label: "Solid Color",
    list: constants.solidColorCollection,
    type: "bg",
  },
  {
    label: "Gradients",
    list: constants.gradientColorCollection,
    type: "bgg",
  },
];

export default function ColorPicker({
  onClick,
  cols = "12",
  allowedList = ["bg", "bgg"],
}: {
  onClick: (data: { color?: string; type?: string }) => void;
  cols?: string;
  allowedList?: string[];
}) {
  const colorInput = useRef<HTMLInputElement>(null);

  return (
    <>
      {colorList.map((item) => {
        if (allowedList.includes(item.type))
          return (
            <div key={item.type} className="py-2">
              <p className="pb-4">{item.label}</p>
              <div className={`grid grid-cols-8 md:grid-cols-8 gap-2`}>
                {item.list.map((i) => {
                  let style = {
                    background: i.color,
                    border:
                      i.color === "rgb(255, 255, 255)"
                        ? "1px solid #ebebeb"
                        : "none",
                  };
                  return (
                    <div
                      className="rounded-full aspect-w-1 aspect-h-1 cursor-pointer"
                      style={style}
                      key={i.id}
                      onClick={() =>
                        onClick({ color: i.color, type: item.type })
                      }
                    />
                  );
                })}
                {item.type === "bg" && (
                  <>
                    <div
                      className="rounded-full aspect-w-1 aspect-h-1 cursor-pointer border border-slate-200"
                      onClick={() => colorInput.current?.click()}
                    >
                      <div className="flex justify-center items-center h-full w-full">
                        <Pipette className="h-[1.5rem] w-[1.5rem]" />
                      </div>
                      <input
                        ref={colorInput}
                        onChange={(e) =>
                          onClick({
                            color: hexToRgb(e.target.value),
                            type: item.type,
                          })
                        }
                        type="color"
                        className="invisible"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        return null;
      })}
    </>
  );
}
