"use client";

/**
 * @typedef {import("react").ChangeEvent<HTMLInputElement>} InputChangeEvent
 * @typedef {{
 *   type?: string;
 *   placeholder?: string;
 *   value: string;
 *   onChange: (event: InputChangeEvent) => void;
 * }} InputProps
 */

/**
 * @param {InputProps} props
 */
export default function Input({ type = "text", placeholder, value, onChange }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border p-2 rounded w-full mb-3"
    />
  );
}