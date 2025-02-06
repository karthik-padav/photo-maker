import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter } from "next/font/google";
import "./globals.css";

import { Inter as FontSans } from "next/font/google";

import "./globals.css";

import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

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
import { getWebsiteData } from "@/lib/actions/services";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
  description: constants.landingPage.subtitle,
};

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  const { data: websiteDate } = await getWebsiteData();
  return (
    <html lang="en">
      <body
        className={cn(
          "dark:bg-gray-900 font-sans antialiased",
          fontSans.variable
        )}
      >
        {process?.env?.GOOGLE_ANALYTICS && (
          <>
            <Script
              id="gtm-script"
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
            />
            <Script id="gtm-script-2">
              {`  window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', ${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS})`}
            </Script>
          </>
        )}
        <SessionProvider session={session}>
          <AppProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Toaster />
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
          <Analytics />
          <SpeedInsights />
        </SessionProvider>
      </body>
    </html>
  );
}
