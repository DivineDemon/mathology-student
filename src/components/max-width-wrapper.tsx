import { cn } from "@/lib/utils";

interface MaxWidthWrapperProps {
  className?: string;
  children: React.ReactNode;
}

const MaxWidthWrapper = ({ className, children }: MaxWidthWrapperProps) => {
  return (
    <div className={cn("mx-auto h-full w-full max-w-screen-xl", className)}>
      {children}
    </div>
  );
};

export default MaxWidthWrapper;
