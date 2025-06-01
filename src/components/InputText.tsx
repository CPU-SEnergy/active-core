import type React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

interface InputTextProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  className?: string;
}

export const InputText = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  error,
  className,
}: InputTextProps) => {
  const autocompleteType =
    type === "password" ? "new-password" : type === "email" ? "email" : "off";
  const isPhoneNumber = id === "phoneNumber" || type === "tel";

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPhoneNumber) {
      // Only allow digits and limit to 11 characters
      const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 11);

      // Create a new event with the filtered value
      const newEvent = {
        ...e,
        target: {
          ...e.target,
          value: digitsOnly,
        },
      };
      onChange(newEvent as React.ChangeEvent<HTMLInputElement>);
    } else {
      onChange(e);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isPhoneNumber) {
      // Allow: backspace, delete, tab, escape, enter, and arrow keys
      const specialKeys = [
        "Backspace",
        "Delete",
        "Tab",
        "Escape",
        "Enter",
        "ArrowLeft",
        "ArrowUp",
        "ArrowRight",
        "ArrowDown",
      ];

      if (
        specialKeys.includes(e.key) ||
        // Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        (e.key === "a" && e.ctrlKey === true) ||
        (e.key === "c" && e.ctrlKey === true) ||
        (e.key === "v" && e.ctrlKey === true) ||
        (e.key === "x" && e.ctrlKey === true)
      ) {
        return;
      }

      // Ensure that it is a number and stop the keypress
      if (!/^[0-9]$/.test(e.key)) {
        e.preventDefault();
      }

      // Prevent input if already at 11 digits
      if (value.length >= 11 && !["Backspace", "Delete"].includes(e.key)) {
        e.preventDefault();
      }
    }
  };

  return (
    <div className={cn("space-y-1", className)}>
      <label
        htmlFor={id}
        className="block text-xs sm:text-sm font-semibold text-gray-800 transition-colors duration-200"
      >
        {label}
      </label>
      <div className="relative">
        <Input
          id={id}
          type={isPhoneNumber ? "tel" : type}
          value={value}
          onChange={handlePhoneChange}
          onKeyDown={handleKeyDown}
          placeholder={
            isPhoneNumber ? "09XXXXXXXXX" : `Enter your ${label.toLowerCase()}`
          }
          maxLength={isPhoneNumber ? 11 : undefined}
          className={cn(
            "w-full h-8 sm:h-9 lg:h-11 px-2 sm:px-3 lg:px-4 rounded-lg border-2 transition-all duration-200 ease-in-out text-xs sm:text-sm lg:text-base",
            "focus:border-black focus:ring-4 focus:ring-gray-200",
            "hover:border-gray-400",
            "placeholder:text-gray-400",
            error
              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
              : value
                ? "border-gray-800"
                : "border-gray-300"
          )}
          required
          autoComplete={autocompleteType}
        />
      </div>
      {error && (
        <p className="text-xs sm:text-sm text-red-500 font-medium animate-in slide-in-from-top-1 duration-200">
          {error}
        </p>
      )}
    </div>
  );
};
