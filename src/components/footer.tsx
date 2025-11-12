import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { FarmLogo } from "@/components/farm-logo";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Farm Info */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">The Bold Farm</h3>
            <p className="text-gray-300 mb-4">
              Quality Nigerian Dwarf dairy goats, family cows, and homestead products. 
              Building a sustainable future, one animal at a time.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                  About Our Farm
                </Link>
              </li>
              <li>
                <Link href="/goats" className="text-gray-300 hover:text-white transition-colors">
                  Goats for Sale
                </Link>
              </li>
              <li>
                <Link href="/animals" className="text-gray-300 hover:text-white transition-colors">
                  Meet Our Animals
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-300 hover:text-white transition-colors">
                  Shop
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-serif font-bold mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-300">
                <Mail className="h-5 w-5 mr-2 text-honey-gold" />
                <a href="mailto:karlie@theboldfarm.com" className="hover:text-white transition-colors">
                  karlie@theboldfarm.com
                </a>
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="h-5 w-5 mr-2 text-honey-gold" />
                <span>Visit by appointment</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <div className="flex flex-col items-center space-y-4">
            <FarmLogo variant="dark" full={false} size="sm" />
            <p className="text-gray-400">&copy; {new Date().getFullYear()} The Bold Farm. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
