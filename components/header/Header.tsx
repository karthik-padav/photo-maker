"use client";

import {
  Moon,
  Sun,
  Camera,
  AlignJustify,
  LaptopMinimal,
  Settings,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import constants from "@/lib/constants";
import { signOut, useSession } from "next-auth/react";
import { useAppProvider } from "@/lib/app-provider";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import coinImage from "@/assets/lottiefiles/coin.json";
import Lottie from "lottie-react";
import { Config, preload } from "@imgly/background-removal";
import Image from "next/image";

export default function Header() {
  const { setTheme } = useTheme();
  const themes = [
    {
      code: "light",
      label: "Light",
      icon: (
        <Sun className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all" />
      ),
    },
    {
      code: "dark",
      label: "Dark",
      icon: (
        <Moon className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all" />
      ),
    },
    {
      code: "system",
      label: "System",
      icon: (
        <LaptopMinimal className="h-[1rem] w-[1rem] rotate-0 scale-100 transition-all" />
      ),
    },
  ];
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [dropDownMenu, setDropdownMenu] = useState(false);
  const { data: session } = useSession();
  const {
    toggleLogin,
    setSelectedImage,
    setControlerValue,
    selectedImage,
    user,
  } = useAppProvider();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    preload()
      .then(() => {
        console.log("Assets preloaded successfully");
      })
      .catch((error) => {
        console.error("Error preloading assets:", error);
      });
  }, []);

  function renderList(isNav = false) {
    return (
      <>
        {constants.headerMenuList
          .filter((i) => {
            switch (i.code) {
              case "GENERATE":
              case "CUSTOMIZE":
              case "MY_PHOTOS":
                return !!session;
              default:
                return true;
            }
          })
          .map((item, index) => (
            <div
              key={item.code}
              className={`${
                isNav
                  ? `${
                      index != constants.headerMenuList.length - 1 && "border-b"
                    } px-2 py-1 dark:border-gray-800`
                  : "inline-block"
              }`}
            >
              {item?.requireSelectedImage ? (
                <Button
                  variant="ghost"
                  className={`w-full text-left p-0 hover:bg-transparent hover:text-violet-500 md:mr-6 md:inline block md:py-0 py-2 h-auto ${
                    pathname === item.href && "text-violet-500"
                  }`}
                  onClick={() => {
                    setNavbarOpen(false);
                    selectedImage
                      ? router.push(item.href)
                      : toast({
                          description:
                            "Please Upload An Image Before Proceeding.",
                        });
                  }}
                >
                  {item.title}
                </Button>
              ) : (
                <Link
                  onClick={() => setNavbarOpen(false)}
                  className={`md:mr-6 md:inline md:py-0 py-2 block hover:text-violet-500 font-medium ${
                    pathname === item.href && "text-violet-500"
                  }`}
                  href={item.href}
                >
                  {item.title}
                </Link>
              )}
            </div>
          ))}
      </>
    );
  }

  const showCoin =
    user &&
    process.env.NEXT_PUBLIC_ENABLE_PAYMENT == "true" &&
    (user?.credit || user.credit === 0);
  return (
    <header className="body-font py-5">
      <div className="container px-5 md:px-0 mx-auto">
        <div className="flex justify-between items-center">
          <Link href="/" className="relative h-auto w-[100px] md:w-[110px] ">
            <Image
              alt="Logo"
              src="/images/logo.webp"
              priority
              width={130}
              height={130}
            />
          </Link>
          <div className="flex items-center">
            <nav className="text-base justify-center font-semibold md:block hidden">
              {renderList()}
            </nav>
            {showCoin && (
              <div className="md:mr-6 pl-2 flex justify-center items-center bg-background drop-shadow-md rounded-full">
                <p className="-mr-2 text-violet-500 dark:text-white">
                  {user.credit}
                </p>
                <div className="h-8 -mr-2 flex justify-center items-center">
                  <Lottie
                    animationData={coinImage}
                    loop={true}
                    className="h-12 w-12"
                  />
                </div>
              </div>
            )}

            <div className="mr-4 md:hidden">
              <DropdownMenu open={navbarOpen} onOpenChange={setNavbarOpen}>
                <DropdownMenuTrigger asChild>
                  <AlignJustify className="w-8 h-8" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="min-w-[100vw] border-0 px-4"
                >
                  {renderList(true)}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <DropdownMenu open={dropDownMenu} onOpenChange={setDropdownMenu}>
              <DropdownMenuTrigger asChild>
                {session?.user?.image ? (
                  <div className="text-accent-foreground rounded-full h-10 w-10 border overflow-hidden">
                    <img alt="Profile Picture" src={`${session.user.image}`} />
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-accent-foreground hover:text-violet-500 rounded-full"
                  >
                    <Settings className="h-[1.3rem] w-[1.3rem] rotate-0 scale-100 transition-all" />
                  </Button>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {session?.user && (
                  <>
                    <div className="px-2 py-1.5">
                      <p className="">{session.user.name}</p>
                      <p className="text-sm">{session.user.email}</p>
                    </div>
                    <hr className="my-2 border border-input dark:border-gray-800" />
                  </>
                )}
                <>
                  <p className="px-2 py-1.5 text-md">Theme</p>
                  {themes.map((item) => (
                    <DropdownMenuItem
                      key={item.code}
                      onClick={() => setTheme(item.code)}
                    >
                      {item.icon}{" "}
                      <span className="ml-2 text-md">{item.label}</span>
                    </DropdownMenuItem>
                  ))}
                </>
                <hr className="my-2 border border-input dark:border-gray-800" />
                <>
                  {session ? (
                    <>
                      <Link href="/myphotos">
                        <DropdownMenuItem className="cursor-pointer">
                          <span className="ml-2 text-md">My photos</span>
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        onClick={() => {
                          signOut({ callbackUrl: "/" });
                          setSelectedImage(null);
                          setControlerValue(null);
                        }}
                      >
                        <span className="ml-2 text-md"> Sign Out</span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => {
                        setDropdownMenu(false);
                        toggleLogin();
                      }}
                    >
                      <span className="ml-2 text-md"> Sign In</span>
                    </DropdownMenuItem>
                  )}
                </>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
