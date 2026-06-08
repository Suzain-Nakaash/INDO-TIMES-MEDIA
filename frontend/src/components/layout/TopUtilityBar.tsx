"use client";

import { Search, Globe, CloudSun, Menu } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function TopUtilityBar() {
  const [date] = useState(() => {
    return new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  return (
    <div className="w-full border-b border-border text-xs py-1.5 px-4 font-body text-muted-foreground bg-background">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <span>{date}</span>
          <span className="hidden md:flex items-center gap-1.5">
            <CloudSun className="w-3.5 h-3.5" />
            New York, 72°F
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Globe className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">English</span>
          </button>
          <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}
