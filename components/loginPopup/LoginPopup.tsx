"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { signIn } from "next-auth/react";
import { useAppProvider } from "@/lib/app-provider";
import constants from "@/lib/constants";
import { useState } from "react";
import { LoaderCircle } from "lucide-react";

export default function LoginPopup() {
  const [loader, setLoader] = useState<string>("");
  async function signinHandler(type: string) {
    setLoader(type);
    await signIn(type, { redirect: false });
    setLoader("");
  }

  const { showLogin, toggleLogin } = useAppProvider();

  return (
    <Dialog open={showLogin} onOpenChange={toggleLogin}>
      <DialogContent className="sm:max-w-md md:w-2/4">
        <DialogHeader>
          <DialogTitle>Let's Flex Some Images!</DialogTitle>
          <DialogDescription>
            Log in to edit, design, and express with Image Flex Studio.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {constants.loginProvider?.map((item) => (
            <Button
              className={`relative text-accent-foreground px-2 py-3 rounded-lg ${
                loader && "cursor-not-allowed"
              }`}
              key={item.code}
              onClick={() => signinHandler(item.code)}
              disabled={!!loader}
              variant="secondary"
            >
              {loader == item.code && (
                <span className="absolute top-0 bottom-0 left-o right-0 w-full flex justify-center items-center">
                  <LoaderCircle className="text-violet-500 animate-spin" />
                </span>
              )}
              <p
                className={`flex justify-center items-center ${
                  loader == item.code ? "opacity-0" : ""
                }`}
              >
                <item.icon className="mr-2 h-10 w-10" />
                <span className="mr-1 md:hidden">
                  {item.labelPrefix} {item.label}
                </span>
              </p>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
