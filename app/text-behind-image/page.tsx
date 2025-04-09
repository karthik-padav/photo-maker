"use client";

import { useAppProvider } from "@/lib/app-provider";
import textBehindImageConstants from "@/text-behind-image/utils/constants";
import CustomizeImage from "@/text-behind-image/components/CustomizeImage";
import "@/app/fonts.css";
import BreadcrumbWrapper from "@/components/breadcrumbWrapper";
import ADS from "@/components/ads";
import Image from "next/image";

export default function TextBehindImage() {
  const { selectedImage, controlerValue, user } = useAppProvider();

  return (
    <main className="body-font min-h-[75vh]">
      <section className="px-5 md:px-0 md:container">
        <BreadcrumbWrapper
          list={[{ href: "/", title: "Home" }, { title: "Text Behind Image" }]}
        />
      </section>
      <section className="text-center px-5 md:px-0 md:container flex flex-col justify-center mx-auto py-10 md:py-40">
        <h1 className="pb-4 bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text text-4xl font-bold tracking-tighter lg:text-8xl md:text-7xl text-center">
          {textBehindImageConstants.landingPage.title}
        </h1>
        <p className="mx-auto my-4 lg:text-2xl md:text-xl font-normal leading-relaxed lg:w-2/3 text-center">
          {textBehindImageConstants.landingPage.subtitle}
        </p>
      </section>

      <section className="grid md:grid-cols-12 grid-cols-1 gap-4 md:container mx-auto p-0">
        <div className="col-span-2">
          <ADS />
        </div>
        <div className="col-span-8">
          <section className="text-center px-5 md:px-0 flex flex-col justify-center mx-auto pb-10 md:pb-20">
            <h2 className="title-font pb-4 md:pb-8 font-medium md:text-4xl text-2xl text-gray-600 dark:text-white">
              Design in Just 4 Easy Steps
            </h2>
            <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
              {[
                {
                  title: "Upload Your Image",
                  subtitle: "Choose any photo from your device.",
                },
                {
                  title: "Add & Customize Text",
                  subtitle: "Insert text and adjust its style.",
                },
                {
                  title: "Position Text Behind Objects",
                  subtitle: "Effortlessly position text within your image.",
                },
                {
                  title: "Download Your Design",
                  subtitle: "Save it as a high-quality.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="relative border border-input bg-background backdrop-blur-lg rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg p-4"
                >
                  <p className="rounded-md text-2xl md:text-4xl bg-violet-500 font-bold text-white flex justify-center items-center h-10 w-10 md:h-12 md:w-12 mb-2">
                    {index + 1}
                  </p>
                  <div className="text-left">
                    <h3 className="text-xl font-medium">{item.title}</h3>
                    <p>{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="px-0 flex flex-col justify-center mx-auto pb-10 md:pb-20">
            <CustomizeImage />
          </section>
        </div>
        <div className="col-span-2">
          <ADS />
        </div>
      </section>

      <section className="md:container mx-auto pb-10 md:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="grid grid-cols-1 gap-4">
            {[
              "text-behind-image-1",
              "text-behind-image-2",
              "text-behind-image-3",
            ].map((item, index) => (
              <div
                key={index}
                className="relative drop-shadow-xl rounded-lg overflow-hidden"
              >
                <Image
                  alt="banner-dp"
                  src={`/images/${item}.webp`}
                  style={{ objectFit: "contain" }}
                  priority
                  width={800}
                  height={800}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              "text-behind-image-3",
              "text-behind-image-1",
              "text-behind-image-2",
            ].map((item, index) => (
              <div
                key={index}
                className="relative drop-shadow-xl rounded-lg overflow-hidden"
              >
                <Image
                  alt="banner-dp"
                  src={`/images/${item}.webp`}
                  style={{ objectFit: "contain" }}
                  priority
                  width={800}
                  height={800}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              "text-behind-image-2",
              "text-behind-image-3",
              "text-behind-image-1",
            ].map((item, index) => (
              <div
                key={index}
                className="relative drop-shadow-xl rounded-lg overflow-hidden"
              >
                <Image
                  alt="banner-dp"
                  src={`/images/${item}.webp`}
                  style={{ objectFit: "contain" }}
                  priority
                  width={800}
                  height={800}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
