"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const FOOTER_LINKS = {
  Sections: ["World", "U.S.", "Politics", "N.Y.", "Business", "Opinion", "Tech", "Science", "Health", "Sports", "Arts", "Books", "Style", "Food", "Travel"],
  "About Us": ["Our Company", "Careers", "Journalistic Guidelines", "Accessibility", "Contact Us", "Work With Us"],
  Legal: ["Terms of Service", "Privacy Policy", "Cookie Policy", "California Notices", "Do Not Sell My Info"],
};

export function Footer() {
  return (
    <footer className="w-full bg-background border-t-4 border-foreground pt-12 pb-8 px-4 font-body">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <h2 className="font-editorial text-3xl font-bold tracking-tight text-foreground uppercase tracking-widest">
              IndoTimes<span className="text-primary">Media</span>
            </h2>
          </Link>
        </div>
        
        <Separator className="mb-8 bg-border" />

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-2 pr-8">
            <h3 className="font-bold uppercase text-xs tracking-widest mb-4">Subscribe</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get the finest journalism delivered straight to your inbox.
            </p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email Address"
                className="border border-border p-2 text-sm outline-none focus:border-foreground transition-colors"
              />
              <button className="bg-foreground text-background py-2 text-sm font-bold uppercase tracking-wider hover:bg-foreground/90 transition-colors">
                Sign Up
              </button>
            </form>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title} className="col-span-1 lg:col-span-1">
              <h3 className="font-bold uppercase text-xs tracking-widest mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href={`/${link.toLowerCase().replace(/[\s.]/g, "-")}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="mb-8 bg-border" />

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} IndoTimesMedia Company</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="/rss" className="hover:text-foreground">RSS</Link>
            <Link href="/sitemap" className="hover:text-foreground">Site Map</Link>
            <Link href="/help" className="hover:text-foreground">Help</Link>
            <Link href="/subscriptions" className="hover:text-foreground">Subscriptions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
