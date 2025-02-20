import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: "default" | "dark";
  }
>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border",
      variant === "default" && "bg-card text-card-foreground shadow-sm",
      variant === "dark" && "bg-[#1C1C1C] border-[#2C2C2C]",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

export { Card };
