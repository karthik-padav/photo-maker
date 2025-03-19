"use client";

import { Button } from "../ui/button";
import { useAppProvider } from "../../lib/app-provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import constants from "@/lib/constants";
import Link from "next/link";
import GenerateImageBtn from "../generateImageBtn";
import { cn } from "@/lib/utils";

export default function EditBar() {
  const { controlerValue, setControlerValue } = useAppProvider();
  const borderRadius = controlerValue?.border
    ? controlerValue.border.value
    : 50;
  return (
    <>
      <GenerateImageBtn className={`${constants.btnClass} rounded-full`} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`${constants.btnClass} rounded-full`}
          >
            <div
              className={cn(
                "h-4 w-4 md:h-6 md:w-6 dark:border-white border-dotted border-2 border-black mr-2",
                borderRadius > 49
                  ? "rounded-full"
                  : borderRadius > 19
                  ? "rounded-sm"
                  : ""
              )}
            />
            {controlerValue?.border?.title}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-46 md:w-56">
          {constants.borders.map((i) => (
            <DropdownMenuItem
              key={i.value}
              onClick={() => setControlerValue({ border: i })}
            >
              <div
                className={cn(
                  "h-4 w-4 md:h-6 md:w-6 dark:border-white border-dotted border-2 border-black mr-2",
                  i.value > 49
                    ? "rounded-full"
                    : i.value > 19
                    ? "rounded-sm"
                    : ""
                )}
              />
              {i.title}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <Link
        className={`${constants.btnClass} rounded-full flex justify-center items-center`}
        href="/myphotos"
      >
        My Photos
      </Link>
    </>
  );
}
