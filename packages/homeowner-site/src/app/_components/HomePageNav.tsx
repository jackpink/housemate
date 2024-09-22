"use client";
import Link from "next/link";
import { useState } from "react";
import { HorizontalLogo } from "../../../../ui/Atoms/Logo";
import React from "react";

export default function HomePageNav() {
  const [isVisible, setIsVisiable] = useState(false);

  const handleScroll = () => {
    const position = window.scrollY;
    if (position > 400) {
      setIsVisiable(true);
    } else {
      setIsVisiable(false);
    }
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed flex w-full items-center justify-between bg-brand/50 bg-white px-8 py-4 transition-opacity duration-700 ease-in ${isVisible ? "opacity-100" : "opacity-0"}`}
    >
      <HorizontalLogo height={40} fillColour="#7df2cd" />
      <div className="flex items-center justify-between gap-8">
        <Link
          href="/sign-in"
          className="rounded-full bg-brand px-5 py-3 font-bold text-black"
        >
          Sign In
        </Link>
      </div>
    </nav>
  );
}
