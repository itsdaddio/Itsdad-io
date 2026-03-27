import { Route, Switch, Link, useLocation } from "wouter";
import Home from "./pages/Home";
import Memberships from "./pages/Memberships";
import Hubs from "./pages/Hubs";
import MeetDad from "./pages/MeetDad";
import Alliance from "./pages/Alliance";
import RefCapture from "./pages/RefCapture";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import FreeTools from "./pages/FreeTools";
import AffiliateLy from "./pages/AffiliateLy";
import StarterPack from "./pages/StarterPack";
import AffiliateLySuccess from "./pages/AffiliateLySuccess";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import EarningsDisclaimer from "./pages/EarningsDisclaimer";
import { DadGPTWidget } from "./components/DadGPTWidget";
import { SupportWidget } from "./components/SupportWidget";
import { CookieConsent } from "./components/CookieConsent";
import { useState } from "react";

function Navbar() {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // First Dollar Priority: Simplified navigation — only essential links
  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/meet-dad", label: "Meet Dad" },
    { href: "/memberships", label: "Memberships" },
    { href: "/free-tools", label: "Free Tools" },
    { href: "/hubs", label: "Knowledge Hub" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-slate-900/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center text-white">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight group-hover:text-amber-400 transition-colors">
              itsdad.io
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  location === link.href
                    ? "text-amber-400"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="/#start-here"
              className="ml-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-purple-600 text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Start Here
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-slate-300 hover:text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/10 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block text-sm font-medium px-2 py-1 transition-colors ${
                  location === link.href
                    ? "text-amber-400"
                    : "text-slate-300 hover:text-white"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <a
              href="/#start-here"
              className="block mt-2 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-purple-600 text-white text-sm font-semibold text-center hover:opacity-90 transition-opacity"
              onClick={() => setMenuOpen(false)}
            >
              Start Here
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-900 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-purple-600 flex items-center justify-center text-white">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <span className="text-white font-bold">itsdad.io</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              A supportive network for people ready to start earning online. Step-by-step systems, done-for-you tools, and a community that has your back from day one.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-slate-400 hover:text-white text-sm transition-colors">Home</Link></li>
              <li><Link href="/memberships" className="text-slate-400 hover:text-white text-sm transition-colors">Memberships</Link></li>
              <li><Link href="/free-tools" className="text-slate-400 hover:text-white text-sm transition-colors">Free Tools</Link></li>
              <li><Link href="/meet-dad" className="text-slate-400 hover:text-white text-sm transition-colors">Meet Dad</Link></li>
              <li><Link href="/hubs" className="text-slate-400 hover:text-white text-sm transition-colors">Knowledge Hub</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Connect</h4>
            <ul className="space-y-2">
              <li><a href="https://instagram.com/itsdad.io" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white text-sm transition-colors">Instagram</a></li>
              <li><a href="mailto:itsdad@itsdad.io" className="text-slate-400 hover:text-white text-sm transition-colors">itsdad@itsdad.io</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} itsdad.io. All rights reserved.
          </p>
          <div className="flex gap-4 text-slate-500 text-xs">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/disclaimer" className="hover:text-white transition-colors">Earnings Disclaimer</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  const [loc] = useLocation();
  const isStarter = loc === "/starter";

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {!isStarter && <Navbar />}
      <main>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/memberships" component={Memberships} />
          <Route path="/hubs" component={Hubs} />
          <Route path="/hubs/:slug" component={Hubs} />
          <Route path="/meet-dad" component={MeetDad} />
          <Route path="/alliance" component={Alliance} />
          <Route path="/free-tools" component={FreeTools} />
          <Route path="/ref/:code" component={RefCapture} />
          <Route path="/checkout/success" component={CheckoutSuccess} />
          <Route path="/starter" component={StarterPack} />
          <Route path="/affiliate-ly" component={AffiliateLy} />
          <Route path="/affiliate-ly/success" component={AffiliateLySuccess} />
          <Route path="/privacy" component={PrivacyPolicy} />
          <Route path="/terms" component={Terms} />
          <Route path="/disclaimer" component={EarningsDisclaimer} />
          <Route>
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <h1 className="text-4xl font-bold mb-4">404 — Page Not Found</h1>
              <p className="text-slate-400 mb-8">The page you're looking for doesn't exist.</p>
              <Link href="/" className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-500 to-purple-600 text-white font-semibold hover:opacity-90 transition-opacity">
                Go Home
              </Link>
            </div>
          </Route>
        </Switch>
      </main>
      {!isStarter && <Footer />}
      {/* Global floating chat widgets */}
      <DadGPTWidget />
      <SupportWidget />
      <CookieConsent />
    </div>
  );
}
