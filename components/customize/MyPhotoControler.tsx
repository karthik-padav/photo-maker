import ColorPicker from "../colorPicker";
import constants from "@/lib/constants";
import { ControlerValue } from "@/lib/interfaces";
import { Slider } from "../ui/slider";
import { myPhotoControlers } from "@/tools/profile-picture-maker/components/utils/common";

export default function MyPhotoControler({
  controler = {},
  disabled = false,
  updateControler,
}: {
  controler?: ControlerValue;
  disabled?: boolean;
  updateControler: (data) => void;
}) {
  const _controler: any = myPhotoControlers();

  return (
    <>
      {Object.keys(_controler).map((key: string) => {
        const data = _controler[key];
        return (
          <div className="border-white drop-shadow-md md:pt-4 pt-2" key={key}>
            <label
              htmlFor={data.attr.name}
              className="flex justify-between mb-1"
            >
              {data.label}
              <span>
                {controler[data.attr.name] || 0}
                {data.postfix}
              </span>
            </label>

            <Slider
              id={data.attr.name}
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
          updateControler({ pngBorderColor: obj.color })
        }
        disabled={disabled}
        colorList={[
          {
            label: "Outline Solid",
            code: "OUTLINE_SOLID",
            list: constants.solidColorCollection,
            type: "bg",
          },
        ]}
      />
    </>
  );
}
