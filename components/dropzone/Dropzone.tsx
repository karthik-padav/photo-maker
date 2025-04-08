import constants from "@/lib/constants";
import { Camera, Upload, LoaderCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Dropzone(props) {
  const { otherAttr, ...rest } = props;
  const { loading = false, requireLogin = false } = { ...otherAttr };
  const maxSize = Number(process.env.NEXT_PUBLIC_MAX_IMAGE_UPLOAD_SIZE);
  return (
    <div className="flex items-center justify-center w-full h-full">
      <label
        htmlFor="dropzone-file"
        className={`${
          loading ? "cursor-not-allowed" : "cursor-pointer"
        } flex flex-col items-center justify-center w-full h-full border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {loading ? (
            <LoaderCircle className="mb-4 h-10 w-10 text-violet-500 animate-spin" />
          ) : (
            <Upload className="mb-4 h-10 w-10 text-violet-500" />
          )}
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SVG, PNG, JPG or GIF {maxSize ? `(MAX. ${maxSize}MB)` : ""}
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          {...rest}
          className="hidden"
          disabled={loading}
        />
      </label>
    </div>
  );
}
