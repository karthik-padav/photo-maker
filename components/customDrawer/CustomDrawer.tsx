import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export default function CustomDrawer({
  title,
  onClose,
  children,
  open,
  className = "mx-auto w-full max-w-4xl",
}: {
  open: boolean;
  className?: string;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  return (
    <div className="fixed bg-black bg-opacity-85 bottom-0 left-0 right-0 top-0 z-50">
      <div className="fixed bg-white bottom-0 left-0 right-0 z-50">
        <div className="flex-1 space-y-6 py-1" />
        <div className="container">
          {title && <p>{title}</p>}
          {children}
        </div>
      </div>
    </div>
  );
}
