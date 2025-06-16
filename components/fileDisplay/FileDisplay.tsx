"use client";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Dropzone from "@/components/dropzone";
import { Button } from "@/components/ui/button";
import constants from "@/lib/constants";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSession } from "next-auth/react";
import { SessionData } from "@/lib/interfaces";
import { useAppProvider } from "@/lib/app-provider";
import { TouchSensor } from "@dnd-kit/core";
import { FileDisplayItemType } from "./fileDisplayInterfaces";
import { Download, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

const SortableItem = ({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

export default function FileDisplay({
  disabledDrag = false,
  onDownload = () => {},
  onReset = () => {},
  onImageChange = () => {},
  loading = false,
  files = [],
}: {
  disabledDrag?: boolean;
  onDownload?: (images: FileDisplayItemType[]) => void;
  onReset?: () => void;
  onImageChange?: (images: FileDisplayItemType[]) => void;
  files: FileDisplayItemType[];
  loading: boolean;
}) {
  const [_files, setImages] = useState<FileDisplayItemType[]>(files);
  const { toggleLogin } = useAppProvider();
  const { data: session } = useSession() as { data: SessionData | null };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setImages((items) => {
        const oldIndex: number = items.findIndex(
          (i: FileDisplayItemType) => i.uuid === active.id
        );
        const newIndex: number = items.findIndex(
          (i: FileDisplayItemType) => i.uuid === over.id
        );
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    })
  );

  useEffect(() => {
    if (files.length) setImages(files);
    else setImages([]);
  }, [files]);

  function onCheckedChange(uuid: string) {
    const updatedImages = _files.map((image) => {
      if (image.uuid === uuid) return { ...image, checked: !image.checked };
      return image;
    });
    setImages(updatedImages);
  }

  console.log(_files, "_files123");
  return (
    <>
      {_files.length > 0 ? (
        <>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={_files.map((i) => i.uuid)}
              strategy={rectSortingStrategy}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {_files.map((item, index) => (
                  <SortableItem key={item.uuid} id={item.uuid}>
                    <div
                      className={`draggable-item bg-gray-200 flex items-center justify-center rounded-lg shadow ${
                        disabledDrag ? "not-allowed" : "grab"
                      }`}
                      key={item.uuid}
                    >
                      <div className="w-full relative rounded-lg shadow-lg h-64 md:h-80">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => onCheckedChange(item.uuid)}
                          className="cursor-pointer p-2 w-6 md:w-8 h-6 md:h-8 z-50 rounded-full bg-green-500 shadow-lg absolute top-2 right-2 flex items-center justify-center text-green-600 border-0 focus:ring-transparent dark:focus:ring-transparent dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                        />
                        <Image
                          placeholder="blur"
                          blurDataURL={constants.blurDataURL}
                          src={item.base64 || ""}
                          layout="fill"
                          objectFit="contain"
                          alt={`Page: ${index + 1} `}
                          loading="lazy"
                        />
                        <span className="z-50 absolute bottom-2 right-2 text-sm text-white font-bold bg-opacity-50 bg-black rounded-md px-2 py-1">
                          Page: {index + 1}
                        </span>
                      </div>
                    </div>
                  </SortableItem>
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <div className="drop-shadow-xl bg-background border border-input p-2 md:p-4 md:mt-8 mt-4 flex justify-between items-center">
            {!!onDownload && (
              <Button
                aria-label="Download"
                variant="outline"
                onClick={() => onDownload(_files)}
                disabled={loading}
                className={cn(
                  loading ? "cursor-not-allowed" : "cursor-pointer",
                  "relative hover:bg-violet-500 hover:text-white text-violet-500 relative rounded-full text-sm md:mr-2 group"
                )}
              >
                <span className={`flex ${loading ? "opacity-0" : ""}`}>
                  Download PDF
                  <Download className="ml-2 w-5 h-5 text-violet-500 group-hover:text-white" />
                </span>
              </Button>
            )}

            {!!onReset && (
              <Button
                aria-label="Re-upload"
                variant="outline"
                className={cn(
                  "hover:bg-violet-500 hover:text-white text-violet-500 relative rounded-full text-sm md:ml-2"
                )}
                onClick={onReset}
                disabled={loading}
              >
                Re-upload
                <RotateCcw className="ml-2 w-5 h-5" />
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="my-8 h-[64vh]">
          <Dropzone
            onChange={onImageChange}
            requireLogin={true}
            session={session}
            toggleLogin={toggleLogin}
            description={`PNG, JPG or WEBP`}
            loading={loading}
            inputProps={{
              accept: "image/png, image/jpeg, image/jpg, image/gif, image/webp",
              multiple: true,
              type: "file",
            }}
          />
        </div>
      )}
    </>
  );
}
