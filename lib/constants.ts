import { Google, Github, Facebook } from "@/assets/icons";
import { uid } from "uid";

const constants = {
  blurDataURL:
    "https://hatchet.com.au/static/3b5370e27fd88759edf39a45cb219962/4fb49/codioful-formerly-gradienta-rKv4HduvzIE-unsplash-scaled.jpg",
  headerMenuList: [
    { code: "HOME", title: "Home", href: "/" },
    { code: "GENERATE", title: "Generate", href: "/generate" },
  ],
  loginProvider: [
    {
      code: "google",
      labelPrefix: "Sign in with ",
      label: "Google",
      icon: Google,
    },
    // {
    //   code: "facebook",
    //   labelPrefix: "Sign in with ",
    //   label: "Facebook",
    //   icon: Facebook,
    // },
    {
      code: "github",
      labelPrefix: "Sign in with ",
      label: "GitHub",
      icon: Github,
    },
  ],
  footerLegalList: [
    {
      code: "TERMS_AND_CONDITIONS",
      title: "Terms And Conditions",
      href: "/terms-and-conditions",
    },
    {
      code: "PRIVACY_POLICY",
      title: "Privacy Policy",
      href: "/privacy-policy",
    },
  ],
  landingPage: {
    login_title: `Join ${process.env.NEXT_PUBLIC_WEBSITE_NAME} To Create Stunning Logo In Seconds`,
    title: "Just AI profile picture maker",
    subtitle: "Upload your photo and get an eye-catching profile picture!",
    detailed_desc: [
      "Simple to create and personalize.",
      "Design a stunning logo in minutes.",
      `Effortless logo creation with ${process.env.NEXT_PUBLIC_WEBSITE_NAME}.`,
      "Obtain a high-quality logo for download and use on websites, social media, print, and branding.",
    ],
    howItWorks: [
      {
        title: "Select or Upload an Icon",
        desc: "Begin by selecting a pre-designed icon from our extensive library or upload your own unique SVG.",
      },
      {
        title: "Customize Your Design",
        desc: "Use our easy-to-use tools to resize your icon, add colors, and apply background gradients to create a personalized logo.",
      },
      {
        title: "Preview Your Logo",
        desc: "Instantly see how your logo looks with our real-time preview feature, ensuring you get the perfect design.",
      },
      {
        title: "Download Your Logo",
        desc: "Once you're happy with your design, download your logo in high-quality SVG or PNG formats, ready for use across all platforms.",
      },
    ],
    detailedList: [
      {
        title: "Simple to create and personalize",
        desc: `${process.env.NEXT_PUBLIC_WEBSITE_NAME} makes it easy for anyone to design a unique and professional logo, regardless of design experience.`,
      },
      {
        title: "Design a stunning logo in minutes",
        desc: " Our intuitive platform allows you to craft beautiful logos quickly, saving you time and effort.",
      },
      {
        title: `Effortless logo creation with ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`,
        desc: "Choose from a wide selection of icons or upload your own, then customize with colors, gradients, and sizes.",
      },
      {
        title: "Obtain a high-quality logo for download",
        desc: "Export your logo in SVG or PNG formats, perfect for websites, social media, print, and branding.",
      },
      {
        title: "Perfect for all uses",
        desc: `Whether you need a logo for your business, personal project, or event, ${process.env.NEXT_PUBLIC_WEBSITE_NAME} provides the quality and flexibility you need.`,
      },
    ],
    faq: [
      {
        q: `Do I need any design experience to use ${process.env.NEXT_PUBLIC_WEBSITE_NAME}?`,
        a: `No, ${process.env.NEXT_PUBLIC_WEBSITE_NAME} is designed for users of all skill levels. Our intuitive interface and easy-to-use tools make it simple for anyone to create a professional logo.`,
      },

      {
        q: "Can I upload my own icons?",
        a: "Yes, you can upload your own icons and customize them using our platform.",
      },

      {
        q: "What formats are available for download?",
        a: "You can download your finished logo in SVG or PNG formats, ensuring high-quality results for any use.",
      },

      {
        q: "Is there a limit to the number of logos I can create?",
        a: `No, there are no limits on the number of logos you can create and download with ${process.env.NEXT_PUBLIC_WEBSITE_NAME}.`,
      },

      {
        q: "Can I use the logos I create for commercial purposes?",
        a: "Yes, once you download your logo, you have full rights to use it for any commercial or personal projects.",
      },
    ],
  },
  gradientColorCollection: [
    {
      id: uid(16),
      color:
        "linear-gradient(to right, rgb(142, 158, 171), rgb(238, 242, 243))",
    },
    {
      id: uid(16),
      color:
        "linear-gradient(to right, rgb(172, 203, 238), rgb(231, 240, 253))",
    },
    {
      id: uid(16),
      color:
        "linear-gradient(to right, rgb(211, 204, 227), rgb(233, 228, 240))",
    },
    {
      id: uid(16),
      color:
        "linear-gradient(to right, rgb(217, 167, 199), rgb(255, 252, 220))",
    },
    {
      id: uid(16),
      color:
        "linear-gradient(to right, rgb(251, 200, 212), rgb(151, 149, 240))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(255, 226, 89), rgb(255, 167, 81))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(247, 151, 30), rgb(255, 210, 0))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(248, 54, 0), rgb(249, 212, 35))",
    },
    {
      id: uid(16),
      color:
        "linear-gradient(to right, rgb(238, 156, 167), rgb(255, 221, 225))",
    },
    {
      id: uid(16),
      color:
        "linear-gradient(to right, rgb(252, 203, 144), rgb(213, 126, 235))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(255, 129, 119), rgb(177, 42, 91))",
    },
    {
      id: uid(16),
      color:
        "linear-gradient(to right, rgb(242, 112, 156), rgb(255, 148, 114))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(237, 66, 100), rgb(255, 237, 188))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(255, 68, 197), rgb(255, 241, 163))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(236, 0, 140), rgb(252, 103, 103))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(121, 0, 255), rgb(255, 88, 202))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(183, 33, 255), rgb(33, 212, 253))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(106, 17, 203), rgb(119, 212, 255))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(43, 152, 248), rgb(0, 254, 163))",
    },
    {
      id: uid(16),
      color:
        "linear-gradient(to right, rgb(84, 51, 255), rgb(32, 189, 255), rgb(165, 254, 203))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(202, 197, 49), rgb(243, 249, 167))",
    },
    {
      id: uid(16),
      color:
        "linear-gradient(to right, rgb(161, 255, 206), rgb(250, 255, 209))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(29, 151, 108), rgb(147, 249, 185))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(255, 224, 0), rgb(121, 159, 12))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(86, 171, 47), rgb(168, 224, 99))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(66, 147, 33), rgb(180, 236, 81))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(22, 160, 133), rgb(244, 208, 63))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(78, 247, 255), rgb(255, 205, 27))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(94, 231, 223), rgb(180, 144, 202))",
    },
    {
      id: uid(16),
      color:
        "linear-gradient(to right, rgb(186, 200, 224), rgb(106, 133, 182))",
    },
    {
      id: uid(16),
      color:
        "linear-gradient(to right, rgb(161, 196, 253), rgb(194, 233, 251))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(102, 126, 234), rgb(118, 75, 162))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(173, 83, 137), rgb(60, 16, 83))",
    },
    {
      id: uid(16),
      color:
        "linear-gradient(to right, rgb(102, 166, 255), rgb(137, 247, 254))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(97, 144, 232), rgb(167, 191, 232))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(71, 59, 123), rgb(48, 210, 190))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(20, 136, 204), rgb(43, 50, 178))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(9, 48, 40), rgb(35, 122, 87))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(100, 65, 165), rgb(42, 8, 69))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(35, 37, 38), rgb(65, 67, 69))",
    },
    {
      id: uid(16),
      color:
        "linear-gradient(to right, rgb(15, 32, 39), rgb(32, 58, 67), rgb(44, 83, 100))",
    },
    {
      id: uid(16),
      color: "linear-gradient(to right, rgb(20, 30, 48), rgb(36, 59, 85))",
    },
  ],

  borders: [
    { title: "Round", value: "rounded-full" },
    { title: "Rounded Corners", value: "rounded-3xl" },
    { title: "Square", value: "rounded-xl" },
  ],

  solidColorCollection: [
    { id: uid(16), color: "rgb(255, 255, 255)" },
    { id: uid(16), color: "rgb(195, 200, 215)" },
    { id: uid(16), color: "rgb(102, 124, 137)" },
    { id: uid(16), color: "rgb(237, 99, 55)" },
    { id: uid(16), color: "rgb(255, 65, 108)" },
    { id: uid(16), color: "rgb(255, 137, 0)" },
    { id: uid(16), color: "rgb(255, 228, 0)" },
    { id: uid(16), color: "rgb(165, 234, 32)" },
    { id: uid(16), color: "rgb(96, 246, 173)" },
    { id: uid(16), color: "rgb(70, 230, 209)" },
    { id: uid(16), color: "rgb(186, 225, 255)" },
    { id: uid(16), color: "rgb(76, 137, 248)" },
    { id: uid(16), color: "rgb(120, 68, 233)" },
    { id: uid(16), color: "rgb(63, 43, 150)" },
    { id: uid(16), color: "rgb(205, 90, 236)" },
  ],

  pngBgCollections: [
    {
      id: uid(16),
    },
    {
      id: uid(16),
      bgImage: "/images/png_files/shadow_1.png",
    },
    {
      id: uid(16),
      bgImage: "/images/png_files/shadow_2.png",
    },
    {
      id: uid(16),
      bgImage: "/images/png_files/shadow_3.png",
    },
    { id: uid(16), bgImage: "/images/bg/1.jpg" },
    { id: uid(16), bgImage: "/images/bg/2.jpg" },
    { id: uid(16), bgImage: "/images/bg/3.jpg" },
    { id: uid(16), bgImage: "/images/bg/4.jpg" },
    { id: uid(16), bgImage: "/images/bg/5.jpg" },
    { id: uid(16), bgImage: "/images/bg/6.jpg" },
    { id: uid(16), bgImage: "/images/bg/7.jpg" },
    { id: uid(16), bgImage: "/images/bg/8.jpg" },
    { id: uid(16), bgImage: "/images/bg/9.jpg" },
    { id: uid(16), bgImage: "/images/bg/10.jpg" },
    { id: uid(16), bgImage: "/images/bg/11.jpg" },
    { id: uid(16), bgImage: "/images/bg/12.jpg" },
    { id: uid(16), bgImage: "/images/bg/13.jpg" },
    { id: uid(16), bgImage: "/images/bg/14.jpg" },
    { id: uid(16), bgImage: "/images/bg/15.jpg" },
    { id: uid(16), bgImage: "/images/bg/16.jpg" },
    { id: uid(16), bgImage: "/images/bg/17.jpg" },
    { id: uid(16), bgImage: "/images/bg/18.jpg" },
    { id: uid(16), bgImage: "/images/bg/19.jpg" },
    { id: uid(16), bgImage: "/images/bg/20.jpg" },
    { id: uid(16), bgImage: "/images/bg/21.jpg" },
    { id: uid(16), bgImage: "/images/bg/22.jpg" },
    { id: uid(16), bgImage: "/images/bg/23.jpg" },
    { id: uid(16), bgImage: "/images/bg/24.jpg" },
    { id: uid(16), bgImage: "/images/bg/25.jpg" },
    { id: uid(16), bgImage: "/images/bg/26.jpg" },
    { id: uid(16), bgImage: "/images/bg/27.jpg" },
    { id: uid(16), bgImage: "/images/bg/28.jpg" },
    { id: uid(16), bgImage: "/images/bg/29.jpg" },
    { id: uid(16), bgImage: "/images/bg/30.jpg" },
    { id: uid(16), bgImage: "/images/bg/31.jpg" },
    { id: uid(16), bgImage: "/images/bg/32.jpg" },
    { id: uid(16), bgImage: "/images/bg/33.jpg" },
    { id: uid(16), bgImage: "/images/bg/34.jpg" },
    { id: uid(16), bgImage: "/images/bg/35.jpg" },
    { id: uid(16), bgImage: "/images/bg/36.jpg" },
    { id: uid(16), bgImage: "/images/bg/37.jpg" },
    { id: uid(16), bgImage: "/images/bg/38.jpg" },
    { id: uid(16), bgImage: "/images/bg/39.jpg" },
    { id: uid(16), bgImage: "/images/bg/40.jpg" },
    { id: uid(16), bgImage: "/images/bg/41.jpg" },
    { id: uid(16), bgImage: "/images/bg/42.jpg" },
    { id: uid(16), bgImage: "/images/bg/43.jpg" },
  ],
};
export default constants;
