"use client";

import { ControlerValue, SelectedImage } from "@/lib/interfaces";
import { createContext, useContext, useState, useEffect } from "react";

type Theme = {
  showLogin: boolean;
  toggleLogin: () => void;
  setSelectedImage: (value: SelectedImage | null) => void;
  setControlerValue: (value: ControlerValue | null) => void;
  setGlobalLoader: (value: boolean) => void;
  controlerValue: ControlerValue | null;
  selectedImage: SelectedImage | null;
  globalLoader: boolean;
};

const defaultValue: Theme = {
  showLogin: false,
  toggleLogin: () => {},
  setSelectedImage: () => {},
  setControlerValue: () => {},
  setGlobalLoader: () => {},
  controlerValue: {
    border: { title: "Round", value: "rounded-full" },
  },
  selectedImage: null,
  globalLoader: false,
};

const ThemeContext = createContext<Theme>(defaultValue);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  let localStoredData = null;
  const storage = sessionStorage.getItem(
    process.env.NEXT_PUBLIC_WEBSITE_CODE || "photoMaker"
  );
  if (storage) localStoredData = JSON.parse(storage);
  console.log(localStoredData?.selectedImage);

  const [showLogin, setShowLogin] = useState<boolean>(defaultValue.showLogin);
  const [globalLoader, _setGlobalLoader] = useState<boolean>(
    defaultValue.globalLoader
  );
  const [selectedImage, _setSelectedImage] = useState<SelectedImage | null>(
    () => localStoredData?.selectedImage || defaultValue.selectedImage
  );
  const [controlerValue, _setControler] = useState<ControlerValue | null>(
    () => localStoredData?.controlerValue || defaultValue.controlerValue
  );

  useEffect(() => {
    sessionStorage.setItem(
      process.env.NEXT_PUBLIC_WEBSITE_CODE || "photoMaker",
      JSON.stringify({ selectedImage, controlerValue })
    );
  }, [selectedImage, controlerValue]);

  const toggleLogin = () => {
    setShowLogin((prevShowLogin) => !prevShowLogin);
  };

  const setGlobalLoader = () => {
    _setGlobalLoader((prev) => !prev);
  };

  const setSelectedImage = (value: SelectedImage | null) => {
    _setSelectedImage(value);
  };

  const setControlerValue = (value: ControlerValue | null) => {
    _setControler((prev: ControlerValue | null) => {
      if (!value) return null;
      return { ...prev, ...value };
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        showLogin,
        toggleLogin,
        setSelectedImage,
        selectedImage,
        controlerValue,
        setControlerValue,
        globalLoader,
        setGlobalLoader,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppProvider = () => useContext(ThemeContext);
