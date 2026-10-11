import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4 text-sm">
        <div className="space-y-3">
          <Logo light />
          <p className="text-white/60">Find. Compare. Plan. Book Direct. Kolkata-first, built to scale.</p>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-white">Explore</h4>
          <Link className="block hover:text-gold" href="/venues">Venues</Link>
          <Link className="block hover:text-gold" href="/compare">Compare</Link>
          <Link className="block hover:text-gold" href="/budget">Budget Match</Link>
          <Link className="block hover:text-gold" href="/build-event">Build My Event</Link>
          <Link className="block hover:text-gold" href="/services">Services</Link>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-white">Partners</h4>
          <Link className="block hover:text-gold" href="/partner/list-property">List your property</Link>
          <Link className="block hover:text-gold" href="/partner/login">Partner login</Link>
          <Link className="block hover:text-gold" href="/about">Trust &amp; Scale</Link>
        </div>
        <div className="space-y-2">
          <h4 className="font-semibold text-white">Contact</h4>
          <p>67B, Maharaja Tagore Road, Dhakuria, Kolkata 700031</p>
          <p>+91 6290448823 · +91 6291540131</p>
          <p>info@venuewires.com</p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © Venue Wires · Prototype — sample data, not live pricing
      </div>
    </footer>
  );
}
