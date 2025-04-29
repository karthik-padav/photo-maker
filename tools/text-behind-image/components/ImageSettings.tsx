"use client";

import { TBIControlerValue } from "@/tools/text-behind-image/interfaces";
import { renderImageRange } from "@/tools/text-behind-image/utils/common";

export default function ImageSettings({
  controler,
  updateControler,
  disabled = false,
}: {
  controler: TBIControlerValue;
  updateControler: (value) => void;
  disabled: boolean;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {renderImageRange(controler).map((i, index) => (
        <div className="space-y-2 mt-2" key={index}>
          <label
            htmlFor={i.label}
            className="text-sm font-medium flex justify-between items-center w-full"
          >
            <span>{i.label}</span>
            <span>{i.attr.value}</span>
          </label>
          <input
            id={i.label}
            className="slider bg-violet-500 rounded-full disabled:cursor-not-allowed disabled:opacity-50 w-full"
            {...i.attr}
            type="range"
            disabled={disabled}
            onChange={(e) =>
              updateControler({ [i.attr.name]: parseInt(e.target.value) })
            }
          />
        </div>
      ))}
    </div>
  );
}
