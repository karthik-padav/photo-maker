import { myPhotoControlers } from "@/lib/common";
import { useAppProvider } from "../../lib/app-provider";
import ColorPicker from "../colorPicker";

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
        cols="8"
        onClick={(obj: { [key: string]: string }) =>
          setControlerValue({
            ...controlerValue,
            pngBorderColor: obj.color,
          })
        }
      />
    </>
  );
}
