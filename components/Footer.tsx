import Link from 'next/link';
import { Sun, Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <img
                src="/logo.png"
                alt="Mahalaxmi Solar Energies"
                className="h-12 w-auto"
              />
              </div>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
              Leading provider of solar energy solutions. Powering homes and businesses with clean,
              renewable energy.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/p/Mahalakshmi-Solar-Energies-61558430126387/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/maha.lakshmisolarenergies/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link href="/subsidy" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Subsidy Information
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Blog & News
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              Support
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-semibold text-slate-900 mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-slate-600">
                  Your Address Here
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-slate-400 flex-shrink-0" />
                <a href="tel:+91XXXXXXXXXX" className="text-sm text-slate-600 hover:text-slate-900">
                  +91-XXXXXXXXXX
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-slate-400 flex-shrink-0" />
                <a
                  href="mailto:info@mahalakshmisolarpower.com"
                  className="text-sm text-slate-600 hover:text-slate-900 break-all"
                >
                  info@mahalakshmisolarpower.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8">
          <p className="text-center text-sm text-slate-600">
            © {currentYear} Mahalaxmi Solar Energies. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
