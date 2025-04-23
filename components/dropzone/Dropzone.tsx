import { Upload, LoaderCircle } from "lucide-react";
import { useCallback, useRef, useState } from "react";

export default function Dropzone(props) {
  const {
    onChange = () => {},
    loading = false,
    session,
    toggleLogin = () => {},
  } = props;

  const maxSize = Number(process.env.NEXT_PUBLIC_MAX_IMAGE_UPLOAD_SIZE);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleChange = (files) => {
    onChange(files);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (!session?.user) return toggleLogin();
      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        handleChange(files);
      }
    },
    [onChange, session, toggleLogin]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const openFileDialog = () => {
    if (session?.user) {
      inputRef.current?.click();
    } else {
      toggleLogin();
    }
  };

  return (
    <div className="flex items-center justify-center w-full h-full">
      <div
        className={`${
          loading ? "cursor-not-allowed" : "cursor-pointer"
        } flex flex-col items-center justify-center w-full h-full border-2 ${
          isDragging ? "border-violet-500 bg-violet-50" : "border-gray-300"
        } border-dashed rounded-lg bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600`}
        onClick={openFileDialog}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
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
          type="file"
          ref={inputRef}
          hidden
          disabled={loading}
          onChange={(e) => handleChange(e.target.files)}
        />
      </div>
    </div>
  );
}
