"use client";

import { ControlerValue, SelectedImage, User } from "@/lib/interfaces";
import { createContext, useContext, useState, useEffect } from "react";
import { geUser } from "./actions/services";
import { useSession } from "next-auth/react";

type Theme = {
  showLogin: boolean;
  toggleLogin: () => void;
  setSelectedImage: (value: SelectedImage | null) => void;
  setControlerValue: (value: ControlerValue | null) => void;
  setUserValue: (value: User | null) => void;
  setGlobalLoader: (value: boolean) => void;
  controlerValue: ControlerValue | null;
  selectedImage: SelectedImage | null;
  globalLoader: boolean;
  user: User | null;
};

const defaultValue: Theme = {
  showLogin: false,
  toggleLogin: () => {},
  setSelectedImage: () => {},
  setControlerValue: () => {},
  setGlobalLoader: () => {},
  setUserValue: () => {},
  controlerValue: {
    border: { title: "Round", value: "rounded-full" },
  },
  selectedImage: null,
  globalLoader: false,
  user: null,
};

const ThemeContext = createContext<Theme>(defaultValue);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  let localStoredData: {
    selectedImage: SelectedImage | null;
    controlerValue: ControlerValue | null;
  } | null = null;
  const storage =
    typeof window !== "undefined" &&
    sessionStorage.getItem(
      process.env.NEXT_PUBLIC_WEBSITE_CODE || "photoMaker"
    );
  if (storage) localStoredData = JSON.parse(storage);

  const [showLogin, setShowLogin] = useState<boolean>(defaultValue.showLogin);
  const [user, _setUser] = useState<User | null>(defaultValue.user);
  const [globalLoader, _setGlobalLoader] = useState<boolean>(
    defaultValue.globalLoader
  );
  const [selectedImage, _setSelectedImage] = useState<SelectedImage | null>(
    () => localStoredData?.selectedImage || defaultValue.selectedImage
  );

  const [controlerValue, _setControler] = useState<ControlerValue | null>(
    () => localStoredData?.controlerValue || defaultValue.controlerValue
  );
  const { data: session } = useSession();
  console.log(selectedImage, "selectedImage");
  console.log(controlerValue, "controlerValue");
  useEffect(() => {
    async function init() {
      if (session?.user?.email && !user) {
        const { data } = await geUser();
        if (data) _setUser(data);
      }
    }
    init();
  }, [session?.user?.email]);

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

  const setUserValue = (value: User | null) => {
    _setUser((prev) => {
      if (!value) return null;
      return { ...prev, ...value };
    });
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
        user,
        setUserValue,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppProvider = () => useContext(ThemeContext);
