'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

interface NavbarProps {
  user?: any;
  onLogout?: () => void;
}

export default function Navbar({ user, onLogout }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    if (pathname === '/') {
      // If on homepage, scroll to section
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // If on another page, navigate to homepage with hash
      router.push(`/#${sectionId}`);
      // Wait for navigation then scroll
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
    setMobileMenuOpen(false);
  };

  const navigation: Array<{ name: string; href: string; isScroll?: boolean; sectionId?: string }> = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Services', href: '#services', isScroll: true, sectionId: 'services' },
    { name: 'Subsidy', href: '#subsidy', isScroll: true, sectionId: 'subsidy' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
    { name: 'Contact', href: '#contact', isScroll: true, sectionId: 'contact' },
  ];

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-emerald-200/60 bg-white/95 backdrop-blur-sm shadow-sm">
      <div className="mx-auto max-w-7xl w-full px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo - Clean Display */}
          <Link href="/" className="flex items-center flex-shrink-0 group relative z-10">
            <img
              src="/logo.png"
              alt="Mahalaxmi Solar Energies"
              className="h-5 sm:h-6 md:h-8 lg:h-10 w-auto transition-transform group-hover:scale-105 object-contain"
              style={{ 
                imageRendering: 'auto',
                filter: 'none !important',
                WebkitFilter: 'none !important',
                willChange: 'transform',
                transform: 'translateZ(0)',
                maxHeight: '100%',
                maxWidth: '200px',
              }}
            />
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex lg:items-center lg:space-x-8 lg:flex-1 lg:justify-center">
            {navigation.map((item) => (
              item.isScroll && item.sectionId ? (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleScrollClick(e, item.sectionId!)}
                  className={cn(
                    'text-sm font-medium transition-colors cursor-pointer',
                    pathname === '/' && pathname === item.href
                      ? 'text-emerald-700'
                      : 'text-gray-600 hover:text-emerald-700'
                  )}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'text-emerald-700'
                      : 'text-gray-600 hover:text-emerald-700'
                  )}
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>

          {/* Right side - CTAs */}
          <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="text-slate-700 hover:text-slate-900">
                    Dashboard
                  </Button>
                </Link>
                {user.role === 'admin' || user.role === 'super_admin' && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm" className="text-slate-700 hover:text-slate-900">
                      Admin
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onLogout}
                  className="text-slate-700 hover:text-slate-900"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/contact">
                  <Button variant="ghost" size="sm" className="text-slate-700 hover:text-slate-900">
                    Talk to Sales
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="sm" className="bg-emerald-600 text-white hover:bg-emerald-700 font-medium shadow-sm hover:shadow-md transition-all duration-300 border border-emerald-600">
                    Login
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button - Touch-friendly (44x44px minimum) */}
          <button
            type="button"
            className="lg:hidden p-3 text-slate-700 hover:bg-slate-100 active:bg-slate-200 rounded-lg transition-colors touch-manipulation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
            style={{
              minWidth: '44px',
              minHeight: '44px',
            }}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

          {/* Mobile menu - Enhanced for touch */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-lg max-h-[calc(100vh-80px)] overflow-y-auto">
          <div className="space-y-2 px-4 py-4">
            {navigation.map((item) => (
              item.isScroll && item.sectionId ? (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleScrollClick(e, item.sectionId!)}
                  className={cn(
                    'block px-4 py-3 text-base font-medium rounded-lg transition-colors touch-manipulation',
                    pathname === '/' && pathname === item.href
                      ? 'text-slate-900 bg-slate-100'
                      : 'text-slate-600 active:bg-slate-50 active:text-slate-900'
                  )}
                  style={{
                    minHeight: '44px',
                  }}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block px-4 py-3 text-base font-medium rounded-lg transition-colors touch-manipulation',
                    isActive(item.href)
                      ? 'text-slate-900 bg-slate-100'
                      : 'text-slate-600 active:bg-slate-50 active:text-slate-900'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    minHeight: '44px',
                  }}
                >
                  {item.name}
                </Link>
              )
            ))}
            
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
              {user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="block">
                    <Button variant="ghost" className="w-full justify-start text-slate-700 active:bg-slate-100 min-h-[48px] text-base">
                      Dashboard
                    </Button>
                  </Link>
                  {user.role === 'admin' || user.role === 'super_admin' && (
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block">
                      <Button variant="ghost" className="w-full justify-start text-slate-700 active:bg-slate-100 min-h-[48px] text-base">
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button 
                    variant="ghost" 
                    onClick={() => {
                      onLogout?.();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-slate-700 active:bg-slate-100 min-h-[48px] text-base"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block">
                    <Button variant="outline" className="w-full min-h-[48px] text-base">
                      Talk to Sales
                    </Button>
                  </Link>
                  <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)} className="block">
                    <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 active:bg-slate-700 min-h-[48px] text-base">
                      Login
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
