import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";


export default function CustomClipLoader({
  color = "primary",
  className,
  size = "default",
}: {
  color?: string;
  className?: string;
  size?: "small" | "default" | "large";
}) {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className="flex items-center justify-center p-8">
      <Loader2
        className={cn(
          "animate-spin",
          sizeClasses[size],
          className
        )}
        style={{
          color: `var(--${color})`,
        }}
      />
    </div>
  );
}

export function PageLoader({
  color = "primary",
  className,
  message = "Loading...",
}: {
  color?: string;
  className?: string;
  message?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
      <Loader2
        className={cn(
          "w-12 h-12 animate-spin mb-4",
          className
        )}
        style={{
          color: `var(--${color})`,
        }}
      />
      <p className="text-lg text-muted-foreground">{message}</p>
    </div>
  );
}


export function CompactLoader({
  color = "primary",
  className,
  size = "default",
}: {
  color?: string;
  className?: string;
  size?: "small" | "default" | "large";
}) {
  const sizeClasses = {
    small: "w-4 h-4",
    default: "w-6 h-6",
    large: "w-8 h-8",
  };

  return (
    <div className="flex items-center justify-center p-4">
      <Loader2
        className={cn(
          "animate-spin",
          sizeClasses[size],
          className
        )}
        style={{
          color: `var(--${color})`,
        }}
      />
    </div>
  );
}


export function InlineLoader({
  color = "primary",
  className,
  size = "default",
}: {
  color?: string;
  className?: string;
  size?: "small" | "default" | "large";
}) {
  const sizeClasses = {
    small: "w-3 h-3",
    default: "w-4 h-4",
    large: "w-5 h-5",
  };

  return (
    <Loader2
      className={cn(
        "animate-spin",
        sizeClasses[size],
        className
      )}
      style={{
        color: `var(--${color})`,
      }}
    />
  );
}
