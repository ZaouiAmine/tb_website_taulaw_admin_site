import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

export default function AppLogo({ className }: { className?: string }) {
  return (
    <div className="flex items-center gap-2 mx-auto">
      <Link to={"/"}>
        <img
          src="/logo.svg"
          alt="store logo"
          className={cn("w-16 h-16 mx-auto", className)}
        />
      </Link>
    </div>
  );
}
