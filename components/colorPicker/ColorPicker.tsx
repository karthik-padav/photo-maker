import constants from "@/lib/constants";
import { Zap } from "lucide-react";
import Link from "next/link";

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
}: {
  onClick: (data: { color?: string; type?: string }) => void;
}) {
  return (
    <div className="py-4 px-2">
      {colorList.map((item) => (
        <div key={item.type} className="py-2">
          <p className="pb-4">{item.label}</p>
          <div className="grid grid-cols-12 md:grid-cols-12 gap-2">
            {item.list.map((i) => (
              <div
                className="rounded-full aspect-w-1 aspect-h-1 cursor-pointer"
                style={{ background: i.color }}
                key={i.id}
                onClick={() => onClick({ color: i.color, type: item.type })}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
