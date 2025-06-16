"use client";
import { useState } from "react";
import { uid } from "uid";
import FileDisplay from "@/components/fileDisplay";
import { FileDisplayItemType } from "@/components/fileDisplay/fileDisplayInterfaces";
import { convertImagesToPdf, imageToBase64 } from "@/lib/common";

export default function ImageToPDF() {
  const [files, setImages] = useState<FileDisplayItemType[]>([]);
  const [loading, setLoading] = useState(false);

  async function onDownload(files: FileDisplayItemType[]) {
    if (files.length === 0) return;
    setLoading(true);
    await convertImagesToPdf(
      files
        .filter((item) => item.checked && item.base64)
        .map((item) => item?.base64 || "")
    );
    setLoading(false);
  }

  async function onImageChange(files) {
    if (!files) return;
    setLoading(true);
    let _promises: Promise<FileDisplayItemType>[] = [];
    for (let i = 0; i < files.length; i++) {
      _promises.push(
        new Promise(async (resolve) => {
          const file = files[i];
          const base64 = await imageToBase64(file);
          return resolve({ file, checked: true, uuid: uid(16), base64 });
        })
      );
    }
    const results = await Promise.all(_promises);
    setImages(results);
    setLoading(false);
  }

  return (
    <FileDisplay
      disabledDrag={false}
      onDownload={onDownload}
      onImageChange={onImageChange}
      onReset={() => setImages([])}
      files={files}
      loading={loading}
    />
  );
}
