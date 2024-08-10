import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export default function DrawerWrapper({
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
    <Drawer open={open} onOpenChange={(value) => value !== open && onClose()}>
      <DrawerContent>
        <div className={className}>
          {title && (
            <DrawerHeader>
              <DrawerTitle className="text-center mb-4">{title}</DrawerTitle>
            </DrawerHeader>
          )}
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
