import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/lib/theme-provider";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/app/api/auth/[...nextauth]";
import { SessionProvider } from "next-auth/react";
import { AppProvider } from "@/lib/app-provider";
import LoginPopup from "@/components/loginPopup";
import constants from "@/lib/constants";
import Script from "next/script";
import GlobalLoader from "@/components/globalLoader";
import { getAllBgImage, getWebsiteData } from "@/lib/actions/services";
import Analytics from "@/components/Analytics";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_WEBSITE_URL || "https://dpg.vercel.app/"
  ),
  title: `${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
  description: constants.landingPage.subtitle,
  keywords: "photo editing, background remover, image editor, customize images",
  openGraph: {
    title: `${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
    description: constants.landingPage.subtitle,
    url: process.env.NEXT_PUBLIC_WEBSITE_URL,
    siteName: process.env.NEXT_PUBLIC_WEBSITE_NAME,
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 375,
        alt: `${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
    description: constants.landingPage.subtitle,
    images: ["/images/logo.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const { data: websiteDate } = await getWebsiteData();
  const { data: bgImages } = await getAllBgImage();
  return (
    <html lang="en">
      <body
        className={cn(
          "dark:bg-gray-900 font-sans antialiased",
          fontSans.variable
        )}
      >
        {process?.env?.NEXT_PUBLIC_GA_TRACKING_ID && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){window.dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
              }}
            />
          </>
        )}
        <SessionProvider session={session}>
          <AppProvider bgImages={bgImages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
              <Analytics />
              <div className="flex flex-col justify-between min-h-screen">
                <div className="flex-none">
                  <Header />
                </div>
                <div className="grow py-6">{children}</div>
                <div className="flex-none">
                  <Footer data={websiteDate} />
                </div>
              </div>
              <LoginPopup />
              <GlobalLoader />
            </ThemeProvider>
          </AppProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
