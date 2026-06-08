import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="font-heading text-2xl font-bold tracking-tight">
              IndoTimes<span className="text-secondary">Media</span>
            </Link>
            <p className="text-sm text-primary-foreground/80">
              Delivering accurate, unbiased, and comprehensive news from around the globe. Stay informed with our expert analysis and breaking coverage.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="hover:text-secondary transition-colors">
                <FaFacebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="hover:text-secondary transition-colors">
                <FaTwitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="hover:text-secondary transition-colors">
                <FaInstagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="hover:text-secondary transition-colors">
                <FaYoutube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 font-heading text-lg font-bold">Categories</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="/category/politics" className="hover:text-white transition-colors">Politics</Link></li>
              <li><Link href="/category/business" className="hover:text-white transition-colors">Business</Link></li>
              <li><Link href="/category/technology" className="hover:text-white transition-colors">Technology</Link></li>
              <li><Link href="/category/sports" className="hover:text-white transition-colors">Sports</Link></li>
              <li><Link href="/category/world" className="hover:text-white transition-colors">World</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 font-heading text-lg font-bold">Company</h3>
            <ul className="space-y-2 text-sm text-primary-foreground/80">
              <li><Link href="/about-us" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 font-heading text-lg font-bold">Newsletter</h3>
            <p className="mb-4 text-sm text-primary-foreground/80">
              Subscribe to our newsletter to get the latest news delivered directly to your inbox.
            </p>
            <form className="flex space-x-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-sm placeholder:text-primary-foreground/50 focus:outline-none focus:ring-2 focus:ring-secondary"
                required
              />
              <button
                type="submit"
                className="rounded-md bg-secondary px-4 py-2 text-sm font-medium text-white hover:bg-secondary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <Separator className="my-8 bg-primary-foreground/20" />
        
        <div className="flex flex-col items-center justify-between space-y-4 text-sm text-primary-foreground/60 md:flex-row md:space-y-0">
          <p>© {new Date().getFullYear()} IndoTimesMedia. All rights reserved.</p>
          <div className="flex space-x-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms-conditions" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
