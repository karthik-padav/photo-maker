export default function HeroBanner({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="text-center px-5 md:px-0 md:container flex flex-col justify-center mx-auto min-h-[65vh]">
      <div className="py-10 md:py-20">
        <h1 className="bg-gradient-to-r from-blue-600 via-green-500 to-indigo-400 md:leading-relaxed inline-block text-transparent bg-clip-text text-4xl font-bold tracking-tighter lg:text-8xl md:text-7xl text-center">
          {title}
        </h1>
        <p className="mx-auto my-4 lg:text-2xl md:text-xl font-normal leading-relaxed text-muted-foreground lg:w-2/3 text-center">
          {subtitle}
        </p>
      </div>
    </section>
  );
}
