"use client";
export default function Button({
  label,
  onClick = () => {},
  disabled = false,
}) {
  return (
    <button
      className="rounded-md w-full py-2 font-semibold text-sm text-white bg-blue-600 disabled:bg-gray-400"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
