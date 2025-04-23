import { cn } from "@/lib/utils";

export default function GradientCard({ children, className = "" }: any) {
  return (
    // <div className="my-2 md:my-4 relative border border-input bg-background backdrop-blur-lg rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg p-4">

    <div
      className={cn(
        "transition-all duration-300 relative border-[1.2px] border-input hover:border-transparent hover:animate-border-spin hover:bg-border-gradient hover:bg-[length:200%_200%] hover:bg-clip-border",
        className
      )}
    >
      <div className="absolute inset-0 bg-background m-[1.2px] rounded-md z-10" />
      <div className="z-20 relative h-full w-full">{children}</div>
    </div>
  );
}
