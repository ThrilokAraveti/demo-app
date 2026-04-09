"use client";

export default function Button({ text, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded w-full ${
        disabled
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-500 text-white"
      }`}
      disabled={disabled}

    >
      {text}
    </button>
  );
}