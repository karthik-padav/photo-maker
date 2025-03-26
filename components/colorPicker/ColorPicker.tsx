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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

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
      <div className={`grid grid-cols-8 md:grid-cols-8 lg:grid-cols-12 gap-2`}>
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
              className="rounded-full aspect-w-1 aspect-h-1 cursor-pointer"
              onClick={() => colorInput.current?.click()}
            >
              <div className="flex justify-center items-center h-full w-full">
                <Pipette className="h-[1.3rem] w-[1.3rem]" />
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
        <Accordion type="multiple" className="w-full">
          {colorList.map((item, index) => (
            <AccordionItem value={`index_${index}`} key={`index_${index}`}>
              <AccordionTrigger className="text-left">
                {item.label}
              </AccordionTrigger>
              <AccordionContent className="text-left">
                {colorBox(item)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      <div className="hidden md:block md:pt-4 pt-2">
        {colorList.length > 1 ? (
          <Tabs defaultValue={colorList[0].type} className="w-full">
            <TabsList className={`grid w-full grid-cols-${colorList.length}`}>
              {colorList.map((item) => (
                <TabsTrigger value={item.type} key={item.type}>
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {colorList.map((item) => (
              <TabsContent value={item.type} key={item.type}>
                <div className="mt-4">{colorBox(item)}</div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="border-white drop-shadow-md">
            <p className="mb-2">{colorList[0].label}</p>
            {colorBox(colorList[0])}
          </div>
        )}
      </div>
    </>
  );
}
