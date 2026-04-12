import React, { forwardRef } from "react";

// Local helper for combining class names
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Input = forwardRef(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full  border border-gray-300 bg-white px-3 py-2 text-base placeholder-gray-400 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:outline-none  focus:border-green-900",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});


Input.displayName = "Input";

export { Input };
