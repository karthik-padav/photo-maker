/** @type {import('next-sitemap').IConfig} */
export default {
  siteUrl: process.env.NEXT_PUBLIC_WEBSITE_URL,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  additionalPaths: async (config) => [
    { loc: "/", lastmod: new Date().toISOString() },
    { loc: "/about-us", lastmod: new Date().toISOString() },
    // { loc: "/customize", lastmod: new Date().toISOString() },
    // { loc: "/generate", lastmod: new Date().toISOString() },
    // { loc: "/myphotos", lastmod: new Date().toISOString() },
    { loc: "/privacy-policy", lastmod: new Date().toISOString() },
    { loc: "/terms-and-conditions", lastmod: new Date().toISOString() },
  ],
};

// "postbuild": "next-sitemap"
