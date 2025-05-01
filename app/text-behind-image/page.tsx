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
import constants from "@/tools/text-behind-image/utils/TBIConstants";
import { getMetaData } from "@/lib/common";
import dynamic from "next/dynamic";
import TBIConstants from "@/tools/text-behind-image/utils/TBIConstants";
import TBI from "@/tools/text-behind-image/components/TBI";

// const TBI = dynamic(() => import("@/tools/text-behind-image/components/TBI"), {
//   loading: () => <span>Loading...</span>,
// });

export const metadata = getMetaData("text-behind-image");

export default function TextBehindImage() {
  return (
    <main className="body-font">
      <BreadcrumbWrapper
        className="md:container md:p-0 px-5"
        list={[{ href: "/", title: "Home" }, { title: "Text Behind Image" }]}
      />

      <HeroBanner
        title={TBIConstants.landingPage.title}
        subtitle={TBIConstants.landingPage.subtitle}
      />

      <section className="grid md:grid-cols-12 grid-cols-1 gap-4 md:container mx-auto pb-20 md:py-20">
        <div className="md:col-span-2">
          <ADS />
        </div>
        <div className="md:col-span-8">
          <div className="px-5 md:px-0 flex flex-col justify-center mx-auto pb-20 md:pb-20">
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
                  className="relative border border-input bg-background backdrop-blur-lg rounded-xl transition-all duration-500 shadow-sm hover:shadow-lg p-4"
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

          <div className="px-5 md:px-0 flex flex-col justify-center mx-auto">
            <TBI />
          </div>
        </div>
        <div className="md:col-span-2">
          <ADS />
        </div>
      </section>

      <section className="px-5 md:px-0 md:container mx-auto pb-20 md:py-20">
        <div className="grid grid-cols-3 gap-1 md:gap-4">
          <div className="grid grid-cols-1 gap-1 md:gap-4">
            {[
              "text-behind-image-1",
              "text-behind-image-2",
              "text-behind-image-3",
            ].map((item, index) => (
              <div key={index} className="relative drop-shadow-xl">
                <Image
                  loading="lazy"
                  alt="banner-dp"
                  src={`/images/${item}.webp`}
                  className="rounded-lg overflow-hidden object-contain"
                  width={500}
                  height={500}
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
                  loading="lazy"
                  alt="banner-dp"
                  src={`/images/${item}.webp`}
                  className="rounded-lg overflow-hidden object-contain"
                  width={500}
                  height={500}
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
                  loading="lazy"
                  src={`/images/${item}.webp`}
                  className="rounded-lg overflow-hidden object-contain"
                  width={500}
                  height={500}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 md:px-0 md:container mx-auto pb-20 md:py-20">
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
