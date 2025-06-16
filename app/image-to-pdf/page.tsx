import BreadcrumbWrapper from "@/components/breadcrumbWrapper";
import ADS from "@/components/ads";
import HeroBanner from "@/components/heroBanner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getMetaData } from "@/lib/common";
import ImageToPDF from "@/tools/image-to-pdf/components/ImageToPDF";
import ITPDFConstants from "@/tools/image-to-pdf/utils/ITPDFConstants";

export const metadata = getMetaData("image-to-pdf");

export default function ImageToPDFWrapper() {
  return (
    <main className="body-font">
      <BreadcrumbWrapper
        className="md:container md:p-0 px-5"
        list={[{ href: "/", title: "Home" }, { title: "Image To PDF" }]}
      />

      <HeroBanner
        title={ITPDFConstants.landingPage.title}
        subtitle={ITPDFConstants.landingPage.subtitle}
      />

      <section className="grid md:grid-cols-12 grid-cols-1 gap-4 md:container mx-auto pb-10 md:py-20">
        <div className="md:col-span-2">
          <ADS />
        </div>
        <div className="md:col-span-8">
          <div className="px-5 md:px-0 flex flex-col justify-center mx-auto">
            <p className="mx-auto pb-20 lg:text-2xl md:text-xl font-normal leading-relaxed text-muted-foreground text-center">
              {ITPDFConstants.landingPage.description}
            </p>
            <ImageToPDF />
          </div>
        </div>
        <div className="md:col-span-2">
          <ADS />
        </div>
      </section>

      <section className="px-5 md:container mx-auto pb-10 md:py-20">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
          <div className="pb-2 text-left">
            <h2 className="title-font pb-2 md:pb-4 font-medium md:text-4xl text-2xl text-gray-600 dark:text-white">
              {ITPDFConstants.landingPage.whyOurWebsite.heading}
            </h2>

            <Accordion
              type="multiple"
              defaultValue={ITPDFConstants.landingPage.whyOurWebsite.list.map(
                (i, index) => `index_${index}`
              )}
              className="w-full"
            >
              {ITPDFConstants.landingPage.whyOurWebsite.list.map(
                (item, index) => (
                  <AccordionItem
                    value={`index_${index}`}
                    key={`index_${index}`}
                  >
                    <AccordionTrigger className="text-left ">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent className="text-left ">
                      {item.desc}
                    </AccordionContent>
                  </AccordionItem>
                )
              )}
            </Accordion>
          </div>
          <div className="pb-2 text-left">
            <h2 className="title-font pb-2 md:pb-4 font-medium md:text-4xl text-2xl text-gray-600 dark:text-white">
              {ITPDFConstants.landingPage.faq.heading}
            </h2>

            <Accordion
              type="multiple"
              defaultValue={ITPDFConstants.landingPage.faq.list.map(
                (i, index) => `index_${index}`
              )}
              className="w-full"
            >
              {ITPDFConstants.landingPage.faq.list.map((item, index) => (
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
