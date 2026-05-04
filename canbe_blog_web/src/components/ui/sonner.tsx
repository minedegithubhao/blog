"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast: "group toast rounded-lg border-0 shadow-lg",
          title: "font-medium",
          description: "opacity-90",
          actionButton: "border-0 shadow-none",
          cancelButton: "border-0 shadow-none"
        }
      }}
      {...props}
    />
  );
};

export { Toaster };
