"use client";

import { Button } from "@/components/ui/button";
import constants from "@/lib/constants";
import { TBIControlerValue } from "@/tools/text-behind-image/interfaces";
import { renderFontStyles } from "@/tools/text-behind-image/utils/common";
import { uid } from "uid";
import { renderTextRange } from "../utils/common";
import { Slider } from "@/components/ui/slider";
import ColorPicker from "@/components/colorPicker";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import dynamic from "next/dynamic";

const Trash2 = dynamic(() => import("lucide-react").then((mod) => mod.Trash2), {
  loading: () => <span>Loading...</span>,
});

const Copy = dynamic(() => import("lucide-react").then((mod) => mod.Copy), {
  loading: () => <span>Loading...</span>,
});

const FontPicker = dynamic(() => import("./FontPicker"), {
  loading: () => <span>Loading...</span>,
});

export default function Text({
  controler,
  updateControler,
  disabled = false,
}: {
  controler: TBIControlerValue;
  updateControler: (value) => void;
  disabled: boolean;
}) {
  function deleteText(id: string) {
    let { texts = [] } = { ...controler };
    updateControler({ texts: texts.filter((i) => i.id != id) });
  }

  function duplicate(index) {
    let { texts = [] } = { ...controler };
    const newTexts = [...texts];
    newTexts.splice(index, 0, { ...texts[index], id: uid(16) });
    updateControler({ texts: newTexts });
  }

  function handleField(value, field, item) {
    let { texts = [] } = { ...controler };
    const updatedTexts = texts.map((i) =>
      i.id === item.id ? { ...i, [field]: value } : i
    );
    updateControler({ texts: updatedTexts });
  }

  return (
    <>
      <Accordion
        type="single"
        collapsible
        className={`w-full ${disabled ? "cursor-not-allowed" : ""}`}
        disabled={disabled}
        defaultValue={controler?.texts?.[0]?.id}
      >
        {(controler?.texts || []).map((item, index) => (
          <AccordionItem
            value={item.id}
            key={item.id}
            className="border-b border-input"
          >
            <div className="flex items-center">
              <div className="grow">
                <AccordionTrigger>{item.text}</AccordionTrigger>
              </div>
              <div className="pl-2">
                <Button
                  variant="ghost"
                  aria-label="Copy"
                  onClick={() => duplicate(index)}
                  disabled={disabled}
                  className="p-2 mx-1 border border-input hover:text-violet-500 dark:text-white drop-shadow-2xl bg-transparent"
                >
                  <Copy className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  aria-label="Delete"
                  onClick={() => deleteText(item.id)}
                  disabled={disabled}
                  className="p-2 mx-1 border border-input hover:text-red-500 dark:text-white drop-shadow-2xl bg-transparent"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
            <AccordionContent>
              <div className="flex justify-between items-center mt-2">
                <input
                  type="text"
                  className="flex rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-b-violet-500 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                  value={item.text}
                  disabled={disabled}
                  onChange={(e) => handleField(e.target.value, "text", item)}
                />
                {renderFontStyles(item).map((b, index) => (
                  <Button
                    key={index}
                    aria-label={b.name}
                    variant={b?.variant as "ghost" | undefined}
                    className="p-2 mx-1 border border-input dark:text-white drop-shadow-2xl"
                    onClick={() => handleField(b.value, b.name, item)}
                    disabled={disabled}
                  >
                    {b.icon}
                  </Button>
                ))}
              </div>
              <ColorPicker
                onClick={(obj: { [key: string]: string }) =>
                  handleField(obj.color, "color", item)
                }
                disabled={disabled}
                colorList={[
                  {
                    label: "Color",
                    list: constants.solidColorCollection.filter((i) => i.color),
                    type: "bg",
                  },
                ]}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 mt-2">
                  <label htmlFor="font-size" className="text-sm font-medium">
                    Font Size
                  </label>
                  <input
                    id="font-size"
                    className="flex rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-b-violet-500 disabled:cursor-not-allowed disabled:opacity-50 w-full"
                    min="10"
                    type="number"
                    value={item.fontSize}
                    disabled={disabled}
                    onChange={(e) =>
                      handleField(Number(e.target.value), "fontSize", item)
                    }
                  />
                </div>

                <div className="space-y-2 mt-2">
                  <label className="text-sm font-medium">Font Family</label>
                  {disabled ? (
                    <div className="w-full h-8 opacity-50 border border-input rounded-md" />
                  ) : (
                    <FontPicker
                      currentFont={item.fontFamily}
                      disabled={disabled}
                      handleAttributeChange={(data) =>
                        handleField(data, "fontFamily", item)
                      }
                    />
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {renderTextRange(item).map((i, index) => (
                  <div className="space-y-2 mt-2" key={index}>
                    <label
                      htmlFor={i.attr.name}
                      className="text-sm font-medium flex justify-between items-center w-full"
                    >
                      <span>{i.label}</span>
                      <span>
                        {i.postfix
                          ? `${item[i.attr.name]}${i.postfix}`
                          : item[i.attr.name]}
                      </span>
                    </label>

                    <Slider
                      id={i.attr.name}
                      {...i.attr}
                      defaultValue={[item[i.attr.name]]}
                      value={[item[i.attr.name]]}
                      onValueChange={(value) =>
                        handleField(value[0], i.attr.name, item)
                      }
                      disabled={disabled}
                      aria-label={i.label}
                    />
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </>
  );
}
