"use client";

import { getControler } from "@/lib/common";
import * as React from "react";
import { createContext, useContext, useState } from "react";

type Theme = {
  showLogin: boolean;
  toggleLogin: () => void;
  currentImage: {
    _id: string;
    imageURL: string;
    email: string;
  } | null;
  setCurrentImage: ({
    _id,
    imageURL,
    email,
  }: {
    _id: string;
    imageURL: string;
    email: string;
  }) => void;
  setControlerValue: (value: { [key: string]: any }) => void;
  controlerValue: any;
};

const defaultValue: Theme = {
  showLogin: false,
  toggleLogin: () => {},
  setCurrentImage: () => {},
  setControlerValue: () => {},
  controlerValue: { border: { title: "Round", value: "rounded-full" } },
  currentImage: {
    email: "karthikpadav@gmail.com",
    imageURL:
      "https://utfs.io/f/5d0062bf-12bb-41d5-8018-fd78bf25f319-47uawo.png",
    _id: "669bf80e25c9f16ccac8ece5",
  },
};

const ThemeContext = createContext<Theme>(defaultValue);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [showLogin, setShowLogin] = useState(defaultValue.showLogin);
  const [currentImage, _setCurrentImage] = useState(defaultValue.currentImage);
  const [controlerValue, _setControler] = useState(defaultValue.controlerValue);

  const toggleLogin = () => {
    setShowLogin((prevShowLogin) => !prevShowLogin);
  };

  const setCurrentImage = ({
    _id,
    imageURL,
    email,
  }: {
    _id: string;
    imageURL: string;
    email: string;
  }) => {
    _setCurrentImage({ _id, imageURL, email });
  };

  const setControlerValue = (value: { [key: string]: string }) => {
    _setControler((prev: any) => {
      return { ...prev, ...value };
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        showLogin,
        toggleLogin,
        setCurrentImage,
        currentImage,
        controlerValue,
        setControlerValue,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppProvider = () => useContext(ThemeContext);
