'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Menu, X, Moon, Sun, Monitor, Heart } from 'lucide-react';
import { useTheme } from '@/lib/context';

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/movies', label: 'Movies' },
    { href: '/trending', label: 'Trending' },
    { href: '/watchlist', label: 'My List' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass shadow-lg' : 'bg-gradient-to-b from-background/90 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-red-700 flex items-center justify-center font-bold text-2xl text-primary-foreground shadow-lg shadow-primary/30">
              R
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">
              Reverse<span className="text-primary"> Movie Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              {isSearchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center">
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies..."
                    className="w-40 sm:w-64 px-4 py-2 rounded-full bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="ml-2 p-2 rounded-full hover:bg-secondary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 rounded-full hover:bg-secondary transition-colors"
                  aria-label="Open search"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Watchlist */}
            <Link
              href="/watchlist"
              className="p-2 rounded-full hover:bg-secondary transition-colors hidden sm:flex"
              aria-label="Watchlist"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {/* Theme Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                className="p-2 rounded-full hover:bg-secondary transition-colors"
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
                )}
              </button>
              
              {isThemeMenuOpen && (
                <>
                  <div
                    className="fixed inset-0"
                    onClick={() => setIsThemeMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-36 rounded-lg glass p-1 shadow-xl">
                    <button
                      onClick={() => {
                        setTheme('light');
                        setIsThemeMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                        theme === 'light' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                      }`}
                    >
                      <Sun className="w-4 h-4" /> Light
                    </button>
                    <button
                      onClick={() => {
                        setTheme('dark');
                        setIsThemeMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                        theme === 'dark' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                      }`}
                    >
                      <Moon className="w-4 h-4" /> Dark
                    </button>
                    <button
                      onClick={() => {
                        setTheme('system');
                        setIsThemeMenuOpen(false);
                      }}
                      className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors ${
                        theme === 'system' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary'
                      }`}
                    >
                      <Monitor className="w-4 h-4" /> System
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full hover:bg-secondary transition-colors md:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
