export default function About() {
  return (
    <main className="text-black body-font">
      <section className="px-5 md:px-0 md:container mx-auto py-10">
        <h1 className="title-font pb-2 md:pb-4 font-medium md:text-5xl text-3xl text-gray-600 dark:text-white">
          About {process.env.NEXT_PUBLIC_WEBSITE_NAME}
        </h1>

        <h2 className="text-gray-600 text-lg md:text-xl dark:text-white font-bold pt-4 pb-2">
          Your Go-To AI-Powered {process.env.NEXT_PUBLIC_WEBSITE_NAME}
        </h2>

        <p className="pb-2 md:pb-4 text-lg text-gray-600 dark:text-gray-300">
          At {process.env.NEXT_PUBLIC_WEBSITE_NAME}, we make it effortless to
          remove backgrounds, edit images, and create stunning profile pictures
          with just a few clicks. Our AI-powered tool helps you customize,
          enhance, and download high-quality profile pictures for social media,
          business, gaming, and more!
        </p>

        <h2 className="text-gray-600 text-lg md:text-xl dark:text-white font-bold pt-4 pb-2">
          What We Offer
        </h2>

        <ul className="pb-2 md:pb-4 text-lg text-gray-600 dark:text-gray-300">
          <li>
            🚀 Instant Background Removal – AI-powered precision to make your
            images stand out.
          </li>
          <li>
            🎨 Custom Editing Tools – Add outulnes, borders, colors, and
            gradients to perfect your profile picture.
          </li>
          <li>
            🔄 Rotate & Scale – Adjust your image for the best fit on any
            platform.
          </li>
          <li>
            🖼️ Background Templates – Choose from a variety of backgrounds,
            colors, and textures.
          </li>
          <li>
            📥 High-Resolution Downloads – Get crisp, professional-quality
            profile pictures for free!
          </li>
        </ul>

        <h2 className="text-gray-600 text-lg md:text-xl dark:text-white font-bold pt-4 pb-2">
          Our Mission
        </h2>

        <p className="pb-2 md:pb-4 text-lg text-gray-600 dark:text-gray-300">
          We believe everyone deserves a unique and eye-catching profile
          picture. Whether you're a content creator, influencer, gamer, or
          professional, our tool is designed to help you create the perfect look
          effortlessly.
        </p>

        <h2 className="text-gray-600 text-lg md:text-xl dark:text-white font-bold pt-4 pb-2">
          Why Choose Us?
        </h2>

        <ul className="pb-2 md:pb-4 text-lg text-gray-600 dark:text-gray-300">
          <li>✅ AI-Powered & Easy to Use – No design skills needed!</li>
          <li>
            ✅ Fast & Free – Get results in seconds without complex software.
          </li>
          <li>
            ✅ Perfect for Any Platform – Facebook, Instagram, LinkedIn, Twitch,
            YouTube, and more!
          </li>
        </ul>
      </section>
    </main>
  );
}
