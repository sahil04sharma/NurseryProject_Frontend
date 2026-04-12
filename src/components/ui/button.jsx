import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

// Local helper for combining class names
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// Updated button variants using manual Tailwind colors
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-green-100 text-white ",
        destructive:
          "bg-red-600 text-white hover:bg-red-500",
        outline:
          "border border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-900",
        secondary:
          "bg-gray-200 text-gray-900 hover:bg-gray-300",
        ghost:
          "bg-transparent hover:bg-gray-100 hover:text-gray-900",
        link:
          "bg-transparent text-blue-600 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
