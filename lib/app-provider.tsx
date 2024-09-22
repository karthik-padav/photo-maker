"use client";

import { getControler } from "@/lib/common";
import { ControlerValue, SelectedImage } from "@/lib/interfaces";
import * as React from "react";
import { createContext, useContext, useState } from "react";

type Theme = {
  showLogin: boolean;
  toggleLogin: () => void;
  selectedImage: SelectedImage;
  setSelectedImage: ({ _id, imageURL, email, bgImage }: SelectedImage) => void;
  setControlerValue: (value: ControlerValue) => void;
  controlerValue: ControlerValue;
};

const defaultValue: Theme = {
  showLogin: false,
  toggleLogin: () => {},
  setSelectedImage: () => {},
  setControlerValue: () => {},
  controlerValue: {
    border: { title: "Round", value: "rounded-full" },
    pngShadow: "1",
  },
  selectedImage: {
    email: "karthikpadav@gmail.com",
    imageURL:
      "https://photo-maker.s3.ap-south-1.amazonaws.com/c36c465966dcfd14.png",
    _id: "669bf80e25c9f16ccac8ece5",
  },
};

const ThemeContext = createContext<Theme>(defaultValue);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [showLogin, setShowLogin] = useState(defaultValue.showLogin);
  const [selectedImage, _setSelectedImage] = useState(
    defaultValue.selectedImage
  );
  const [controlerValue, _setControler] = useState(defaultValue.controlerValue);

  const toggleLogin = () => {
    setShowLogin((prevShowLogin) => !prevShowLogin);
  };

  const setSelectedImage = ({
    _id,
    imageURL,
    email,
    bgImage,
  }: SelectedImage) => {
    _setSelectedImage({ _id, imageURL, email, bgImage });
  };

  const setControlerValue = (value: ControlerValue) => {
    _setControler((prev: any) => {
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
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppProvider = () => useContext(ThemeContext);
