import { borderControlers } from "@/profile-picture-maker/components/utils/common";
import ColorPicker from "../colorPicker";
import constants from "@/lib/constants";
import { ControlerValue } from "@/lib/interfaces";
import { Slider } from "../ui/slider";

export default function Border({
  controler = {},
  disabled = false,
  updateControler,
}: {
  controler?: ControlerValue;
  disabled?: boolean;
  updateControler: (data) => void;
}) {
  const _controler: any = borderControlers();

  return (
    <>
      {Object.keys(_controler).map((key: string) => {
        const data = _controler[key];
        return (
          <div className="border-white drop-shadow-md md:pt-4 pt-2" key={key}>
            <p className="flex justify-between mb-1">
              {data.label}
              <span>
                {controler[data.attr.name] || 0}
                {data.postfix}
              </span>
            </p>
            <Slider
              {...data.attr}
              defaultValue={[controler[data.attr.name]]}
              value={[controler[data.attr.name]]}
              onValueChange={(value) =>
                updateControler({ [data.attr.name]: value[0] })
              }
              disabled={disabled}
              aria-label={data.label}
            />
          </div>
        );
      })}

      <ColorPicker
        onClick={(obj: { [key: string]: string }) =>
          updateControler({ outerBorderColor: obj.color })
        }
        disabled={disabled}
        colorList={[
          {
            label: "Solid",
            list: constants.solidColorCollection,
            type: "bg",
          },
        ]}
      />
    </>
  );
}
