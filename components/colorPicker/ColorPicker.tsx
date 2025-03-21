import constants from "@/lib/constants";
import { Ban, Pipette } from "lucide-react";
import { useRef } from "react";
import { hexToRgb } from "@/lib/common";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

export default function ColorPicker({
  onClick,
  colorList = [],
}: {
  onClick: (data: { color?: string; type?: string }) => void;
  colorList?: {
    label: string;
    list: { id: string; color: string }[];
    type: string;
  }[];
}) {
  const colorInput = useRef<HTMLInputElement>(null);

  function colorBox(item) {
    return (
      <div className={`grid grid-cols-8 md:grid-cols-8 gap-2`}>
        {item.list.map((i) => {
          let style = {
            background: i.color,
            border:
              i.color === "rgb(255, 255, 255)" ? "1px solid #ebebeb" : "none",
          };
          if (!i.color)
            return (
              <div
                className="rounded-full w-full h-full aspect-w-1 aspect-h-1 cursor-pointer"
                key={i.id}
                onClick={() => onClick({ color: "", type: "" })}
              >
                <Ban className="text-red-500" />
              </div>
            );
          return (
            <div
              className="rounded-full w-full h-full aspect-w-1 aspect-h-1 cursor-pointer"
              style={style}
              key={i.id}
              onClick={() => onClick({ color: i.color, type: item.type })}
            />
          );
        })}
        {item.type === "bg" && (
          <>
            <div
              className="rounded-full aspect-w-1 aspect-h-1 cursor-pointer border border-slate-200 dark:border-gray-800"
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
    );
  }

  return (
    <>
      <div className="md:hidden">
        <Accordion type="multiple" className="w-full text-sm md:text-lg">
          {colorList.map((item, index) => (
            <AccordionItem value={`index_${index}`} key={`index_${index}`}>
              <AccordionTrigger className="text-left text-gray-600 dark:text-gray-300">
                {item.label}
              </AccordionTrigger>
              <AccordionContent className="text-left text-gray-600 dark:text-gray-300">
                {colorBox(item)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="hidden md:block">
        {colorList.map((item) => (
          <div key={item.type} className="py-2">
            <p className="pb-4">{item.label}</p>
            {colorBox(item)}
          </div>
        ))}
      </div>
    </>
  );
}
