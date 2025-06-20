"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
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
import { useState } from "react";
import Image from "next/image";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { AlignJustify, LaptopMinimal, Moon, Settings, Sun } from "lucide-react";

// const Moon = dynamic(() => import("lucide-react").then((mod) => mod.Moon), {
//   loading: () => <span>Loading...</span>,
// });
// const Sun = dynamic(() => import("lucide-react").then((mod) => mod.Sun), {
//   loading: () => <span>Loading...</span>,
// });
// const AlignJustify = dynamic(
//   () => import("lucide-react").then((mod) => mod.AlignJustify),
//   {
//     loading: () => <span>Loading...</span>,
//   }
// );
// const LaptopMinimal = dynamic(
//   () => import("lucide-react").then((mod) => mod.LaptopMinimal),
//   {
//     loading: () => <span>Loading...</span>,
//   }
// );
// const Settings = dynamic(
//   () => import("lucide-react").then((mod) => mod.Settings),
//   {
//     loading: () => <span>Loading...</span>,
//   }
// );

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
  const { toggleLogin, setSelectedImage, setControlerValue, user } =
    useAppProvider();

  function renderList(
    list: {
      code: string;
      title: string;
      description: string;
      href: string;
      external?: boolean;
    }[] = []
  ) {
    if (list.length === 0) return null;
    return (
      <ul className="grid w-[350px] gap-3 p-4 md:w-[500px] md:grid-cols-2">
        {list.map((item) => (
          <li key={item.code}>
            <NavigationMenuLink asChild>
              {item.external ? (
                <a href={item.href} target="_blank" className="py-2 block">
                  <p className="text-sm font-medium leading-none mb-2">
                    {item.title}
                  </p>
                  <span className="line-clamp-1 text-sm leading-snug text-muted-foreground">
                    {item.description}
                  </span>
                </a>
              ) : (
                <Link href={item.href} className="py-2 block">
                  <>
                    <p className="text-sm font-medium leading-none mb-2">
                      {item.title}
                    </p>
                    <span className="line-clamp-1 text-sm leading-snug text-muted-foreground">
                      {item.description}
                    </span>
                  </>
                </Link>
              )}
            </NavigationMenuLink>
          </li>
        ))}
      </ul>
    );
  }

  // const showCoin =
  //   user &&
  //   process.env.NEXT_PUBLIC_ENABLE_PAYMENT == "true" &&
  //   (user?.credit || user.credit === 0);
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
          <div className="items-center flex">
            <NavigationMenu className="hidden md:block mr-4">
              <NavigationMenuList>
                {constants.headerMenuList.map((item) => (
                  <NavigationMenuItem key={item.code}>
                    {item.list ? (
                      <>
                        <NavigationMenuTrigger>
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          {renderList(item.list)}
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link
                        href={item.href}
                        className={navigationMenuTriggerStyle()}
                      >
                        {item.title}
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            {/* {showCoin && (
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
            )} */}

            <div className="mr-4 md:hidden">
              <DropdownMenu open={navbarOpen} onOpenChange={setNavbarOpen}>
                <DropdownMenuTrigger asChild>
                  <AlignJustify className="w-8 h-8" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="min-w-[100vw] border-0"
                >
                  <ul className="max-h-[80vh] overflow-y-auto px-4">
                    {constants.headerMenuList.map((item) => (
                      <li key={item.code}>
                        {item.list ? (
                          <>
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                            >
                              <AccordionItem
                                value={item.code}
                                className="border-0"
                              >
                                <AccordionTrigger className="py-2">
                                  {item.title}
                                </AccordionTrigger>
                                <AccordionContent>
                                  <ul className="pl-4">
                                    {item.list.map((l) => (
                                      <li key={l.code}>
                                        {l.external ? (
                                          <a
                                            href={l.href}
                                            target="_blank"
                                            className="py-2 block"
                                          >
                                            {l.title}
                                          </a>
                                        ) : (
                                          <Link
                                            href={l.href}
                                            onClick={() => setNavbarOpen(false)}
                                            className="py-2 block"
                                          >
                                            {l.title}
                                          </Link>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </>
                        ) : (
                          <Link
                            href={item.href}
                            className="py-2 block"
                            onClick={() => setNavbarOpen(false)}
                          >
                            {item.title}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
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
                    aria-label="Settings"
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
                      <DropdownMenuItem
                        onClick={() => {
                          signOut();
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
