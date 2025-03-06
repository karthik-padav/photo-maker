import constants from "@/lib/constants";
import Link from "next/link";
import BannerSection from "@/components/bannerSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default async function Home() {
  return (
    <main className="text-black body-font min-h-[75vh]">
      <section className="text-center container flex flex-col justify-center mx-auto py-10 md:py-20">
        <h1 className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 inline-block text-transparent bg-clip-text text-4xl font-bold tracking-tighter lg:text-8xl md:text-7xl text-center">
          {constants.landingPage.title}
        </h1>
        <p className="mx-auto my-4 lg:text-2xl md:text-xl font-normal leading-relaxed text-gray-600 dark:text-gray-300 lg:w-2/3 text-center">
          {constants.landingPage.subtitle}
        </p>
        <BannerSection />
      </section>

      <section className="text-center container flex flex-col justify-center mx-auto pb-10 md:pb-20">
        <p className="mx-auto my-10 lg:text-2xl md:text-xl font-normal leading-relaxed text-gray-600 dark:text-gray-300 text-center">
          Are you looking for the perfect profile picture maker to enhance your
          online presence? Our advanced AI-powered tool helps you remove
          backgrounds, add stylish outlines, change backgrounds, and customize
          your profile photo effortlessly. Whether it&apos;s for social media,
          LinkedIn, gaming avatars, or professional use,{" "}
          <Link
            href={process.env.NEXT_PUBLIC_WEBSITE_URL || "/"}
            className="text-violet-500"
          >
            {process.env.NEXT_PUBLIC_WEBSITE_LABEL}
          </Link>{" "}
          ensures your profile picture stands out.
        </p>
      </section>

      <section className="text-center container flex flex-col justify-center mx-auto pb-10 md:pb-20">
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
                  <AccordionTrigger className="text-left text-gray-600 dark:text-gray-300">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-left text-gray-600 dark:text-gray-300">
                    {item.desc}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="pb-2 text-left">
            <h2 className="title-font pb-2 md:pb-4 font-medium md:text-4xl text-2xl text-gray-600 dark:text-white">
              {constants.landingPage.howItWorks.heading}
            </h2>

            <Accordion
              type="multiple"
              defaultValue={constants.landingPage.howItWorks.list.map(
                (i, index) => `index_${index}`
              )}
              className="w-full"
            >
              {constants.landingPage.howItWorks.list.map((item, index) => (
                <AccordionItem value={`index_${index}`} key={`index_${index}`}>
                  <AccordionTrigger className="text-left text-gray-600 dark:text-gray-300">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-left text-gray-600 dark:text-gray-300">
                    {item.desc}
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
