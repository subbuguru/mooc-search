"use client";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center justify-between">
        <div className="container">
          <div className="px-8 hidden md:flex"></div>
        </div>
        <div className="px-8">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
