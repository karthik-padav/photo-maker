import constants from "@/lib/constants";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { cn } from "@/lib/utils";
import GradientCard from "@/components/gradientCard";
import HeroBanner from "@/components/heroBanner";

export default async function Home() {
  return (
    <main className="body-font">
      <HeroBanner
        title={constants.landingPage.title}
        subtitle={constants.landingPage.subtitle}
      />

      <section className="px-5 md:px-0 md:container pb-10 md:py-20">
        <h2 className="text-center title-font pb-2 md:pb-12 font-medium md:text-4xl text-2xl text-gray-600 dark:text-white">
          Explore Our Tools
        </h2>
        <div className="grid md:grid-cols-4 grid-cols-1 gap-4">
          {constants.headerMenuList
            .filter((l) => l.code === "OUR_TOOLS")
            .map((item) => (
              <React.Fragment key={item.code}>
                {(item.list || []).map(
                  (l: {
                    title: string;
                    href: string;
                    description: string;
                    code: string;
                    external?: boolean;
                  }) => (
                    <React.Fragment key={l.code}>
                      <GradientCard className="backdrop-blur-lg shadow-sm hover:shadow-lg p-4 rounded-md">
                        <div className="flex flex-col justify-between h-full">
                          <div className="mb-2 md:mb-4">
                            <h3 className="text-md md:text-xl font-medium">
                              {l.title}
                            </h3>
                            <p className="text-muted-foreground">
                              {l.description}
                            </p>
                          </div>
                          <div className="text-right">
                            {l?.external ? (
                              <a
                                href={l.href}
                                className="inline-block border-2 relative rounded-full text-sm border border-violet-500 px-4 py-2"
                                target="_blank"
                              >
                                Try Now
                              </a>
                            ) : (
                              <Link
                                href={l.href}
                                className="inline-block border-2 relative rounded-full text-sm border border-violet-500 px-4 py-2"
                              >
                                Try Now
                              </Link>
                            )}
                          </div>
                        </div>
                      </GradientCard>
                    </React.Fragment>
                  )
                )}
              </React.Fragment>
            ))}

          <GradientCard className="backdrop-blur-lg shadow-sm hover:shadow-lg p-4 rounded-md">
            <div className="flex flex-col justify-center items-center text-center h-full">
              <h3 className="text-md md:text-xl font-medium">
                More Tools Coming Soon!
              </h3>
              <p className="text-muted-foreground">
                From image converters to advanced background editing — stay
                tuned!
              </p>
            </div>
          </GradientCard>
        </div>
      </section>

      <section className="text-center px-5 md:px-0 md:container flex flex-col justify-center mx-auto pb-10 md:py-20">
        <h2 className="pb-2 md:pb-12 font-medium md:text-4xl text-2xl text-gray-600 dark:text-white">
          {`Why ${process.env.NEXT_PUBLIC_WEBSITE_NAME}?`}
        </h2>
        <p className="mx-auto lg:text-2xl md:text-xl font-normal leading-relaxed text-center text-muted-foreground">
          Image Flex Studio is a powerful, user-friendly platform built to
          simplify creative workflows and enhance productivity. Whether you're
          crafting visuals, optimizing content, or working on design projects,
          it offers a growing range of smart tools to help you get things done
          faster and better. Its clean interface, smooth performance, and
          versatility make it ideal for creators, professionals, and everyday
          users alike. With consistently high-quality results and features that
          evolve with your needs, Image Flex Studio empowers you to bring your
          ideas to life effortlessly — all in one place.
        </p>
      </section>

      <section className="text-center px-5 md:px-0 flex flex-col justify-center mx-auto pb-10 md:py-20">
        <div className="md:container pb-2 md:pb-12 ">
          <h2 className="pb-2 md:pb-4 font-medium md:text-4xl text-2xl text-gray-600 dark:text-white">
            What People Are Saying
          </h2>
          <p className="mx-auto lg:text-2xl md:text-xl font-normal leading-relaxed text-muted-foreground">
            Don’t just take our word for it. Here’s what real people are saying
            about Saasfly.
          </p>
        </div>

        <div className="overflow-hidden whitespace-nowrap relative max-w-[2560px] w-full mx-auto">
          {["animate-marquee-l-r", "animate-marquee-r-l"].map(
            (animation, aIndex) => (
              <div
                key={aIndex}
                className={cn(
                  "flex w-max hover:[animation-play-state:paused]",
                  animation
                )}
              >
                <div className="flex space-x-4 px-4">
                  {constants.testimonials.map((item, index) => (
                    <div
                      key={index}
                      className="w-64 my-2 md:my-4 relative border border-input bg-background backdrop-blur-lg rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg p-4"
                    >
                      <div className="flex items-center mb-2">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden">
                          <Image
                            alt="avatar"
                            src={`https://avatar.vercel.sh/${item.name}`}
                            priority
                            width={200}
                            height={200}
                          />
                        </div>
                        <p className="ml-2">{item.name}</p>
                      </div>

                      <p className="text-left whitespace-normal line-clamp-2 text-ellipsis">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-gray-900" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-gray-900" />
        </div>
      </section>
    </main>
  );
}
