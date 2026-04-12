import React, { forwardRef } from "react";

// Local helper for combining class names
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Textarea = forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex w-full min-h-[120px]  border border-gray-300 bg-white px-3 py-2 text-base placeholder-gray-400 " +
        "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm " +
        "focus:outline-none  focus:border-green-900 " +
        "resize-none", // optional: remove if you want resizable
        className
      )}
      ref={ref}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
