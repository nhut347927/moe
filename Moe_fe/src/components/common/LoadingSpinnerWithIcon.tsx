"use client";
import logo from "../../assets/images/logo.png";

export default function LoadingSpinner() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white dark:bg-black">
      {/* Logo with border ring */}
      <div className="relative h-32 w-32 rounded-full overflow-hidden ring-4 ring-black">
        <img
          src={logo}
          alt="Logo"
          className="h-full w-full rounded-full object-cover"
        />
      </div>

      {/* Text under the logo */}
      <div
        className="mt-4 text-2xl font-semibold moe-font-jua text-black dark:text-white"
        style={{
          textShadow: "0px 2px 4px rgba(0, 0, 0, 0.4)", // Light mode shadow
        }}
      >
        <span
          className="block dark:text-shadow-lg"
          style={{
            textShadow: "0px 4px 6px rgba(255, 255, 255, 0.6)", // Dark mode shadow
          }}
        >
          MOE
        </span>
      </div>
    </div>
  );
}
