// components/ui/Input.tsx
import React from "react";

export default function Input(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      className={`
        w-full
        border border-gray-300
        rounded-md
        px-3 py-2
        text-sm
        text-gray-800
        placeholder-gray-400
        focus:outline-none
        focus:ring-2
        focus:ring-brand/30
        focus:border-brand
        ${props.className ?? ""}
      `}
    />
  );
}
