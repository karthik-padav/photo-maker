import constants from "@/lib/constants";
import Link from "next/link";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import UploadImage from "@/components/dragAndDrop";
import ImageWrapper from "@/components/imageWrapper";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import { fetchImages } from "@/lib/actions/image.actions";
import { auth } from "./api/auth/[...nextauth]";

interface Session {
  data: {
    user: {
      photos: [string];
    };
  };
}

export default async function Home() {
  return (
    <main className="text-black body-font container">
      Home
      <Link href={process.env.STRIPE_PRODUCT_LINK || "/"} target="_blank">
        PAY
      </Link>
    </main>
  );
}
