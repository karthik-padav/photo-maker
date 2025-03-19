import { Google, Github, Facebook } from "@/assets/icons";
import { uid } from "uid";

const constants = {
  btnClass:
    "bg-background drop-shadow-2xl dark:text-white hover:text-white hover:bg-violet-500 drop-shadow-2xl py-2 px-4 md:py-4 md:px-6 text-sm",
  blurDataURL: "/images/image-placeholder.webp",
  headerMenuList: [
    { code: "HOME", title: "Home", href: "/" },
    {
      code: "GENERATE",
      title: "Generate",
      href: "/generate",
      requireSelectedImage: true,
    },
    {
      code: "CUSTOMIZE",
      title: "Customize",
      href: "/customize",
      requireSelectedImage: true,
    },
    {
      code: "MY_PHOTOS",
      title: "My Photos",
      href: "/myphotos",
    },
  ],
  loginProvider: [
    {
      code: "google",
      labelPrefix: "Sign in with ",
      label: "Google",
      icon: Google,
    },
    {
      code: "github",
      labelPrefix: "Sign in with ",
      label: "GitHub",
      icon: Github,
    },
  ],
  footerCompanyList: [
    { code: "ABOUT US", title: "About Us", href: "/about-us" },
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
    login_title: `Join ${process.env.NEXT_PUBLIC_WEBSITE_NAME} To Create Stunning Images In Seconds`,
    title: "AI-Powered Profile Picture Maker",
    subtitle:
      "Remove Background, Edit, And Customize Your Profile Picture in Seconds!",
    whyOurWebsite: {
      heading: `Why ${process.env.NEXT_PUBLIC_WEBSITE_NAME}?`,
      list: [
        {
          title: "AI Background Removal",
          desc: "Instantly erase backgrounds with precision.",
        },
        {
          title: "Custom Backgrounds",
          desc: "Choose from solid colors, gradients, and templates to match your style.",
        },
        {
          title: "Outline & Borders",
          desc: "Add creative glowing, colored, or gradient outlines to highlight your image.",
        },
        {
          title: "Rotate & Scale",
          desc: "Adjust your photo size and angle for the perfect fit.",
        },
        {
          title: "High-Quality Download",
          desc: "Get HD profile pictures for any platform.",
        },
      ],
    },
    howItWorks: {
      heading: `How it works`,
      list: [
        {
          title: "Upload Your Image",
          desc: "Drag and drop or select an image to start editing.",
        },
        {
          title: "Remove Background",
          desc: "Our AI automatically removes the background in seconds.",
        },
        {
          title: "Customize Your Profile Picture",
          desc: "Apply borders, outlines, colors, and backgrounds to match your aesthetic.",
        },
        {
          title: "Enhance & Adjust",
          desc: "Rotate, scale, and fine-tune your image for the perfect look.",
        },
        {
          title: "Download & Share",
          desc: "Save your new profile picture in high resolution and use it anywhere!",
        },
      ],
    },
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
      color: "",
    },
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
    { title: "Round", value: 50 },
    { title: "Rounded Corners", value: 20 },
    { title: "Square", value: 0 },
  ],
  solidColorCollection: [
    { id: uid(16), color: "" },
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
  careers: [
    {
      jobTitle: "Frontend Developer (React.js)",
      jobLocation: "Remote",
      skills: ["React.js", "JavaScript", "HTML", "CSS", "Redux", "Next.js"],
      experience: "3-6 years",
      responsibilities: [
        "Develop and maintain high-performance web applications using React.js.",
        "Collaborate with designers and backend developers to create seamless user experiences.",
        "Optimize applications for maximum speed and scalability.",
        "Ensure the technical feasibility of UI/UX designs.",
        "Write clean, modular, and reusable code.",
        "Stay up-to-date with the latest frontend technologies.",
        "Troubleshoot and debug issues to improve application performance.",
      ],
      requirements: [
        "Proven experience as a React.js Developer.",
        "Strong knowledge of JavaScript, HTML, and CSS.",
        "Familiarity with RESTful APIs and state management (Redux).",
        "Experience with Next.js and SSR is a plus.",
        "Understanding of responsive design and cross-browser compatibility.",
        "Strong problem-solving skills and attention to detail.",
        "Excellent communication and teamwork skills.",
      ],
    },
    {
      jobTitle: "Backend Developer (Node.js)",
      jobLocation: "Remote",
      skills: ["Node.js", "Express.js", "MongoDB", "SQL", "REST API", "Docker"],
      experience: "4-8 years",
      responsibilities: [
        "Develop and maintain scalable backend services using Node.js.",
        "Design and implement RESTful APIs for frontend consumption.",
        "Optimize database queries for performance and reliability.",
        "Ensure security best practices in backend development.",
        "Write unit tests and perform code reviews.",
        "Collaborate with frontend teams to integrate APIs seamlessly.",
        "Monitor system performance and troubleshoot issues.",
      ],
      requirements: [
        "Proven experience as a Node.js Developer.",
        "Strong knowledge of JavaScript, Express.js, and database management.",
        "Experience working with both SQL and NoSQL databases.",
        "Familiarity with authentication and authorization protocols.",
        "Knowledge of containerization tools like Docker.",
        "Ability to optimize APIs for speed and efficiency.",
        "Good communication and problem-solving skills.",
      ],
    },
    {
      jobTitle: "Full Stack Developer (MERN Stack)",
      jobLocation: "Remote",
      skills: [
        "MongoDB",
        "Express.js",
        "React.js",
        "Node.js",
        "TypeScript",
        "GraphQL",
      ],
      experience: "3-7 years",
      responsibilities: [
        "Develop, test, and maintain full-stack web applications.",
        "Collaborate with frontend and backend teams to ensure smooth development.",
        "Design and implement REST and GraphQL APIs.",
        "Ensure responsiveness and cross-platform compatibility.",
        "Write unit and integration tests for reliability.",
        "Stay updated with the latest technologies in MERN stack.",
        "Troubleshoot and resolve technical issues efficiently.",
      ],
      requirements: [
        "Proven experience with MERN stack development.",
        "Strong knowledge of JavaScript, TypeScript, and React.js.",
        "Experience with MongoDB and SQL databases.",
        "Familiarity with GraphQL and REST APIs.",
        "Ability to write clean, scalable, and well-documented code.",
        "Understanding of cloud platforms like AWS or Firebase.",
        "Excellent analytical and problem-solving skills.",
      ],
    },
    {
      jobTitle: "UI/UX Designer",
      jobLocation: "Remote",
      skills: [
        "Figma",
        "Adobe XD",
        "Sketch",
        "Wireframing",
        "User Research",
        "Prototyping",
      ],
      experience: "2-5 years",
      responsibilities: [
        "Create wireframes, prototypes, and high-fidelity designs for web and mobile applications.",
        "Collaborate with developers to ensure accurate design implementation.",
        "Conduct user research to understand pain points and improve UX.",
        "Develop and maintain design systems for consistency.",
        "Optimize user flows and interactions for better engagement.",
        "Stay updated with the latest design trends and technologies.",
        "Test UI components for usability and accessibility.",
      ],
      requirements: [
        "Proven experience as a UI/UX Designer.",
        "Proficiency in design tools like Figma, Adobe XD, or Sketch.",
        "Understanding of user research methodologies.",
        "Knowledge of frontend development (HTML, CSS, JavaScript) is a plus.",
        "Ability to create responsive and accessible designs.",
        "Strong attention to detail and problem-solving skills.",
        "Excellent communication and teamwork skills.",
      ],
    },
    {
      jobTitle: "Digital Marketing Specialist",
      jobLocation: "Remote",
      skills: [
        "SEO",
        "Google Ads",
        "Social Media Marketing",
        "Email Marketing",
        "Content Strategy",
      ],
      experience: "3-6 years",
      responsibilities: [
        "Develop and execute digital marketing campaigns across multiple channels.",
        "Optimize website content for SEO and improve search rankings.",
        "Manage and monitor social media accounts and engagement.",
        "Analyze data to measure performance and optimize marketing strategies.",
        "Run paid advertising campaigns on Google Ads and social media.",
        "Collaborate with content teams to create compelling marketing materials.",
        "Stay updated with digital marketing trends and best practices.",
      ],
      requirements: [
        "Proven experience in digital marketing and SEO.",
        "Familiarity with Google Analytics, Google Ads, and Facebook Ads.",
        "Strong understanding of content marketing strategies.",
        "Ability to analyze data and optimize campaigns accordingly.",
        "Experience in email marketing and automation tools.",
        "Creative mindset with strong attention to detail.",
        "Excellent communication and project management skills.",
      ],
    },
    {
      jobTitle: "Customer Support Specialist",
      jobLocation: "Remote",
      skills: [
        "Customer Service",
        "Communication",
        "Zendesk",
        "Live Chat Support",
        "Problem Solving",
      ],
      experience: "2-5 years",
      responsibilities: [
        "Respond to customer inquiries via chat, email, and phone.",
        "Resolve customer issues efficiently and professionally.",
        "Work closely with technical teams to troubleshoot problems.",
        "Maintain records of customer interactions and resolutions.",
        "Assist in developing FAQs and knowledge base articles.",
        "Identify recurring issues and suggest improvements.",
        "Ensure customer satisfaction and maintain brand reputation.",
      ],
      requirements: [
        "Previous experience in a customer support role.",
        "Excellent verbal and written communication skills.",
        "Ability to multitask and prioritize work effectively.",
        "Familiarity with support tools like Zendesk or Freshdesk.",
        "Strong problem-solving skills and patience.",
        "Ability to work in a fast-paced environment.",
        "Team player with a customer-centric approach.",
      ],
    },
  ],
};
export default constants;
