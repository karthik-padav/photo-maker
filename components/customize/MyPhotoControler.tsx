import { myPhotoControlers } from "@/lib/common";
import { useAppProvider } from "../../lib/app-provider";
import ColorPicker from "../colorPicker";
import constants from "@/lib/constants";

export default function MyPhotoControler() {
  const { controlerValue, setControlerValue } = useAppProvider();

  const controler: any = myPhotoControlers(controlerValue);

  return (
    <>
      {Object.keys(controler).map((key: string) => {
        const data = controler[key];
        return (
          <div className="border-white drop-shadow-md pt-4" key={key}>
            <p className="flex justify-between mb-1">
              {data.label}
              <span>
                {data?.attr?.value || 0}
                {data.valuePrefix}
              </span>
            </p>
            <input
              onChange={(e) =>
                setControlerValue({
                  ...controlerValue,
                  [key]: e.target.value,
                })
              }
              {...data.attr}
            />
          </div>
        );
      })}

      <ColorPicker
        onClick={(obj: { [key: string]: string }) =>
          setControlerValue({
            ...controlerValue,
            pngBorderColor: obj.color,
          })
        }
        colorList={[
          {
            label: "Outline Solid Color",
            list: constants.solidColorCollection,
            type: "bg",
          },
          // {
          //   label: "Outline Gradients",
          //   list: constants.gradientColorCollection,
          //   type: "bgg",
          // },
        ]}
      />
    </>
  );
}
