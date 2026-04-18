import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

interface BannerStatusSwitchProps
  extends React.ComponentProps<typeof SwitchPrimitive.Root> {
  checked?: boolean;
  disabled?: boolean;
}

function BannerStatusSwitch({
  className,
  checked = true,
  disabled = true,
  ...props
}: BannerStatusSwitchProps) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "peer inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-green-500",
        "data-[state=unchecked]:bg-gray-300",
        className
      )}
      checked={checked}
      disabled={disabled}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block h-3 w-3 rounded-full bg-white shadow-md ring-0 transition-transform",
          "data-[state=checked]:translate-x-[18px]",
          "data-[state=unchecked]:translate-x-[1px]",
          "border border-gray-300"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { BannerStatusSwitch };
