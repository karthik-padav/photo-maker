"use client";
import { Input } from "@/components/ui/input";
import constants from "@/lib/constants";
import { useState } from "react";

export default function Career() {
  const [keyword, setKeyword] = useState<string>("");

  const HighlightedText = ({
    text,
    keyword,
  }: {
    text: string;
    keyword: string;
  }) => {
    if (!keyword.trim()) return <span>{text}</span>;

    const regex = new RegExp(`(${keyword})`, "gi");
    const parts = text.split(regex);

    return (
      <span>
        {parts.map((part, index) =>
          part.toLowerCase() === keyword.toLowerCase() ? (
            <span key={index} className="bg-yellow-300">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <main className="text-black body-font">
      <section className="px-5 md:px-0 md:container mx-auto py-10">
        <h1 className="title-font pb-2 md:pb-4 font-medium md:text-5xl text-3xl text-gray-600 dark:text-white">
          Current Job Openings
        </h1>

        <Input
          type="text"
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Search Keyword"
          className="my-8 drop-shadow-xl border p-8 text-md"
        />
        <div className="grid grid-cols-2 gap-4">
          {constants.careers
            .filter((i) => {
              const _keyword = keyword.toLocaleLowerCase();
              if (
                i.jobTitle.toLocaleLowerCase().includes(_keyword) ||
                i.skills.join(" ").toLocaleLowerCase().includes(_keyword)
              )
                return true;
              return false;
            })
            .map((i) => (
              <div
                key={i.jobTitle}
                className="cursor-pointer text-muted-foreground bg-background dark:text-white drop-shadow-xl p-4 rounded-md border"
              >
                <p className="text-xl font-semibold mb-4">
                  <HighlightedText text={i.jobTitle} keyword={keyword} />
                </p>

                <p>
                  <span className="font-semibold">Experience: </span>
                  {i.experience}
                </p>
                <p>
                  <span className="font-semibold">Skills: </span>
                  <HighlightedText
                    text={i.skills.join(", ")}
                    keyword={keyword}
                  />
                </p>
                <p>
                  <span className="font-semibold">Location: </span>
                  {i.jobLocation}
                </p>
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}
