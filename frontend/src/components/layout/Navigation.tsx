"use client";

import Link from "next/link";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Menu } from "lucide-react";
import { useState } from "react";
import { useCategories } from "@/lib/hooks/useCategories";

const FALLBACK_CATEGORIES = [
  "Home", "World", "Politics", "Business", "Technology",
  "AI", "Sports", "Science", "Health", "Education",
  "Entertainment", "Opinion",
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: categories } = useCategories();

  const navItems = categories && categories.length > 0
    ? [{ name: "Home", slug: "" }, ...categories.map((c) => ({ name: c.name, slug: c.slug }))]
    : FALLBACK_CATEGORIES.map((name) => ({ name, slug: name.toLowerCase() }));

  return (
    <div className="w-full bg-background border-b border-border sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop & Scrollable Tablet Nav */}
        <div className="hidden md:flex items-center justify-center">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max space-x-6 lg:space-x-8 py-3 mx-auto">
              {navItems.map((item) => (
                <Link
                  key={item.slug || 'home'}
                  href={item.slug === "" ? "/" : `/category/${item.slug}`}
                  className="text-sm font-body font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="invisible" />
          </ScrollArea>
        </div>

        {/* Mobile Nav Header */}
        <div className="md:hidden flex items-center justify-between py-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 text-sm font-bold uppercase"
          >
            <Menu className="w-5 h-5" />
            Sections
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border grid grid-cols-2 gap-4">
            {navItems.map((item) => (
              <Link
                key={item.slug || 'home-mobile'}
                href={item.slug === "" ? "/" : `/category/${item.slug}`}
                className="text-sm font-body font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
