import { useAppProvider } from "@/lib/app-provider";
import textBehindImageConstants from "@/text-behind-image/utils/constants";
import TBI from "@/text-behind-image/components/TBI";
import "@/app/fonts.css";
import BreadcrumbWrapper from "@/components/breadcrumbWrapper";
import ADS from "@/components/ads";
import Image from "next/image";
import HeroBanner from "@/components/heroBanner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import constants from "@/text-behind-image/utils/constants";
import { getMetaData } from "@/lib/common";

export const metadata = getMetaData("text-behind-image");

export default function TextBehindImage() {
  return (
    <main className="body-font">
      <BreadcrumbWrapper
        className="md:container md:p-0 px-5"
        list={[{ href: "/", title: "Home" }, { title: "Text Behind Image" }]}
      />

      <HeroBanner
        title="Create, Customize & Convert Images Effortlessly."
        subtitle="The ultimate toolkit for creators, professionals, and everyday users."
      />

      <section className="grid md:grid-cols-12 grid-cols-1 gap-4 md:container mx-auto pb-10 md:py-20">
        <div className="md:col-span-2">
          <ADS />
        </div>
        <div className="md:col-span-8">
          <div className="px-5 md:px-0 flex flex-col justify-center mx-auto pb-10 md:pb-20">
            <h2 className="title-font pb-4 md:pb-8 text-center font-medium md:text-4xl text-2xl text-gray-600 dark:text-white">
              Design in Just 4 Easy Steps
            </h2>
            <div className="grid md:grid-cols-4 grid-cols-2 gap-2 md:gap-4">
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
                  className="relative border border-input bg-background backdrop-blur-lg rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg p-4"
                >
                  <p className="rounded-md text-2xl md:text-4xl bg-violet-500 font-bold text-white flex justify-center items-center h-10 w-10 md:h-12 md:w-12 mb-2">
                    {index + 1}
                  </p>
                  <h3 className="text-md md:text-xl font-medium">
                    {item.title}
                  </h3>
                  <p className="hidden md:block text-muted-foreground">
                    {item.subtitle}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="px-5 md:px-0 flex flex-col justify-center mx-auto pb-10 md:py-20">
            <TBI />
          </div>
        </div>
        <div className="md:col-span-2">
          <ADS />
        </div>
      </section>

      <section className="px-5 md:px-0 md:container mx-auto pb-10 md:py-20">
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          <div className="grid grid-cols-1 gap-1 md:gap-4">
            {[
              "text-behind-image-1",
              "text-behind-image-2",
              "text-behind-image-3",
            ].map((item, index) => (
              <div key={index} className="relative drop-shadow-xl">
                <Image
                  alt="banner-dp"
                  src={`/images/${item}.webp`}
                  style={{ objectFit: "contain" }}
                  className="rounded-lg overflow-hidden"
                  priority
                  width={800}
                  height={800}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-1 md:gap-4">
            {[
              "text-behind-image-4",
              "text-behind-image-5",
              "text-behind-image-6",
            ].map((item, index) => (
              <div key={index} className="relative drop-shadow-xl">
                <Image
                  alt="banner-dp"
                  src={`/images/${item}.webp`}
                  style={{ objectFit: "contain" }}
                  className="rounded-lg overflow-hidden"
                  priority
                  width={800}
                  height={800}
                />
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-1 md:gap-4">
            {[
              "text-behind-image-2",
              "text-behind-image-7",
              "text-behind-image-8",
            ].map((item, index) => (
              <div key={index} className="relative drop-shadow-xl">
                <Image
                  alt="banner-dp"
                  src={`/images/${item}.webp`}
                  className="rounded-lg overflow-hidden"
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

      <section className="px-5 md:px-0 md:container mx-auto pb-10 md:py-20">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
          <div className="pb-2 text-left">
            <h2 className="title-font pb-2 md:pb-4 font-medium md:text-4xl text-2xl text-gray-600 dark:text-white">
              {constants.landingPage.whyOurWebsite.heading}
            </h2>

            <Accordion
              type="multiple"
              defaultValue={constants.landingPage.whyOurWebsite.list.map(
                (i, index) => `index_${index}`
              )}
              className="w-full"
            >
              {constants.landingPage.whyOurWebsite.list.map((item, index) => (
                <AccordionItem value={`index_${index}`} key={`index_${index}`}>
                  <AccordionTrigger className="text-left ">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-left ">
                    {item.desc}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="pb-2 text-left">
            <h2 className="title-font pb-2 md:pb-4 font-medium md:text-4xl text-2xl text-gray-600 dark:text-white">
              {constants.landingPage.faq.heading}
            </h2>

            <Accordion
              type="multiple"
              defaultValue={constants.landingPage.faq.list.map(
                (i, index) => `index_${index}`
              )}
              className="w-full"
            >
              {constants.landingPage.faq.list.map((item, index) => (
                <AccordionItem value={`index_${index}`} key={`index_${index}`}>
                  <AccordionTrigger className="text-left ">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-left ">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </main>
  );
}
