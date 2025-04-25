export default function About() {
  return (
    <main className="body-font">
      <section className="px-5 md:px-0 md:container mx-auto py-10">
        <h1 className="title-font pb-2 md:pb-4 font-medium md:text-5xl text-3xl text-gray-600 dark:text-white">
          About {process.env.NEXT_PUBLIC_WEBSITE_NAME}
        </h1>
        <h2 className="text-gray-600 md:text-xl dark:text-white pt-4 pb-2">
          We’re building more than just image tools — we’re creating a space
          where creativity meets simplicity. Whether you’re a designer, content
          creator, business owner, or just someone who loves working with
          visuals, our platform is designed to help you work smarter, faster,
          and with more freedom.
        </h2>

        <h2 className="text-gray-600 md:text-xl dark:text-white font-bold pt-4 pb-2">
          What We Offer
        </h2>
        <p className="pb-2 md:pb-4">
          We offer a growing collection of browser-based tools tailored for
          image creation, enhancement, and customization. From profile photo
          makers to advanced features like text positioning and image
          transformations, every tool is built with ease of use and quality in
          mind — no downloads or complex software required.
        </p>

        <h2 className="text-gray-600 md:text-xl dark:text-white font-bold pt-4 pb-2">
          Our Mission
        </h2>
        <p className="pb-2 md:pb-4">
          Our mission is to empower creators of all skill levels by making
          powerful visual tools accessible to everyone. We aim to simplify the
          creative process, reduce friction, and inspire innovation — one tool
          at a time.
        </p>

        <h2 className="text-gray-600 md:text-xl dark:text-white font-bold pt-4 pb-2">
          Why Choose Us?
        </h2>
        <ul className="pb-2 md:pb-4">
          <li>
            ✅ User-Friendly Interface: Clean, intuitive design for seamless
            experiences.
          </li>

          <li>
            ✅ Versatile Tools: Useful for personal, professional, or creative
            projects.
          </li>

          <li>
            ✅ Always Improving: Regular updates based on real user feedback.
          </li>

          <li>
            ✅ Accessible Anywhere: Works smoothly across devices and browsers.
          </li>

          <li>
            ✅ All-in-One Platform: A unified hub for all your image needs.
          </li>
        </ul>
      </section>
    </main>
  );
}
