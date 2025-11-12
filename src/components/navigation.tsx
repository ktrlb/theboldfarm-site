"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FarmLogo } from "@/components/farm-logo";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Our Animals", href: "/animals" },
  { name: "Goats for Sale", href: "/goats" },
  { name: "Shop", href: "/shop" },
  { name: "Contact", href: "/contact" },
];

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-cream border-b border-meadow-green/30 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <FarmLogo variant="light" full={true} size="md" className="drop-shadow-sm" priority />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-bold-black hover:text-fresh-sprout-green px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Admin Link */}
              <Link
                href="/admin"
                className="text-deep-earth-brown hover:text-fresh-sprout-green px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                title="Admin Panel"
              >
                <Settings className="h-4 w-4" />
                <span className="sr-only">Admin Panel</span>
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-bold-black hover:text-fresh-sprout-green"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-cream border-t border-meadow-green/30">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-bold-black hover:text-fresh-sprout-green block px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Admin Link for Mobile */}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <Link
                href="/admin"
                className="text-deep-earth-brown hover:text-fresh-sprout-green flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className="h-4 w-4 mr-2" />
                Admin Panel
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
