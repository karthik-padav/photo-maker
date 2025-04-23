import Link from "next/link";
import BannerSection from "@/components/bannerSection";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import PPM from "@/profile-picture-maker/components/components/PPM";
import ADS from "@/components/ads";
import BreadcrumbWrapper from "@/components/breadcrumbWrapper";
import HeroBanner from "@/components/heroBanner";
import { get } from "http";
import { getMetaData } from "@/lib/common";
import PPMConstants from "@/profile-picture-maker/components/utils/ppmConstants";

export const metadata = getMetaData("profile-picture-maker");

export default function ProfilePictureMaker() {
  return (
    <main className="body-font">
      <BreadcrumbWrapper
        className="md:container md:p-0 px-5"
        list={[
          { href: "/", title: "Home" },
          { title: "Profile Picture Maker" },
        ]}
      />
      <HeroBanner
        title={PPMConstants.landingPage.title}
        subtitle={PPMConstants.landingPage.subtitle}
      />

      <section className="grid md:grid-cols-12 grid-cols-1 gap-4 md:container mx-auto p-0 pb-10 md:py-20">
        <div className="col-span-2">
          <ADS />
        </div>
        <div className="col-span-8 px-5 md:px-0">
          <>
            <PPM />
            <BannerSection />
            <div className="flex justify-center">
              <div className="grid grid-cols-5 w-full ml-10">
                {["dp-1", "dp-3", "dp-2", "dp-4", "dp-5"].map((i) => (
                  <div
                    key={i}
                    className="-ml-10 border-4 border-white drop-shadow-2xl rounded-full overflow-hidden relative"
                  >
                    <div className="aspect-w-1 aspect-h-1 w-full bg-cover">
                      <div className="drop-shadow-2xl rounded-full overflow-hidden">
                        <Image
                          alt="banner-dp"
                          src={`/images/${i}.webp`}
                          style={{ objectFit: "contain" }}
                          priority
                          width={300}
                          height={300}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <p className="mx-auto pt-10 md:pt-20 lg:text-2xl md:text-xl font-normal leading-relaxed text-muted-foreground text-center">
              Are you looking for the perfect profile picture maker to enhance
              your online presence? Our advanced AI-powered tool helps you
              remove backgrounds, add stylish outlines, change backgrounds, and
              customize your profile photo effortlessly. Whether it&apos;s for
              social media, LinkedIn, gaming avatars, or professional use,{" "}
              <Link href={PPMConstants.url || "/"} className="text-violet-500">
                {PPMConstants.url}
              </Link>{" "}
              ensures your profile picture stands out.
            </p>
          </>
        </div>
        <div className="col-span-2">
          <ADS />
        </div>
      </section>

      <section className="px-5 md:px-0 md:container mx-auto pb-10 md:py-20">
        <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
          <div className="pb-2 text-left">
            <h2 className="title-font pb-2 md:pb-4 font-medium md:text-4xl text-2xl text-gray-600 dark:text-white">
              {PPMConstants.landingPage.whyOurWebsite.heading}
            </h2>

            <Accordion
              type="multiple"
              defaultValue={PPMConstants.landingPage.whyOurWebsite.list.map(
                (i, index) => `index_${index}`
              )}
              className="w-full"
            >
              {PPMConstants.landingPage.whyOurWebsite.list.map(
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
              {PPMConstants.landingPage.howItWorks.heading}
            </h2>

            <Accordion
              type="multiple"
              defaultValue={PPMConstants.landingPage.howItWorks.list.map(
                (i, index) => `index_${index}`
              )}
              className="w-full"
            >
              {PPMConstants.landingPage.howItWorks.list.map((item, index) => (
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
        </div>
      </section>
    </main>
  );
}
