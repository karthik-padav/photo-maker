import constants from "@/lib/constants";
import { Camera } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Footer({ data }: any) {
  return (
    <footer className="py-4 w-full mx-auto border-t-2 border-input dark:border-gray-800">
      <div className="container px-5 md:px-0 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-4">
          <div className="py-2">
            <Link href="/" className="relative h-auto w-[100px] md:w-[110px]">
              <Image
                alt="Logo"
                src="/images/logo.webp"
                width={130}
                height={130}
                priority
              />
            </Link>
            <p className="text-md mt-2">
              Copyright © {new Date().getFullYear()} - All rights reserved
            </p>
          </div>

          <div className="py-2">
            <p className="text-violet-500 pb-2 font-bold">Company</p>
            <ul>
              {constants.footerCompanyList.map((item) => (
                <li key={item.code} className="pb-2 text-md">
                  <Link className="hover:text-violet-400" href={item.href}>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {data?.ourProducts && (
            <div className="py-2">
              <p className="text-violet-500 pb-2 font-bold">Our products</p>
              <ul>
                {data.ourProducts
                  .filter(
                    (item: any) =>
                      item.code !== process.env.NEXT_PUBLIC_WEBSITE_CODE
                  )
                  .map((item: any) => (
                    <li key={item.code} className="pb-2 text-md">
                      <Link
                        className="hover:text-violet-400"
                        href={item.href}
                        target="_blank"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
