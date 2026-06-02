import { Link, useLocation } from 'react-router';
import { useState } from 'react';
import { Search, Github, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS, SITE_NAME } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '../ui/ThemeToggle';
import { Avatar } from '../ui/Avatar';
import { useSearch } from '@/hooks/useSearch';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface NavbarProps {
  scrolled: boolean;
}

export function Navbar({ scrolled }: NavbarProps) {
  const location = useLocation();
  const { open: openSearch } = useSearch();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-bg-primary/80 backdrop-blur-xl border-b border-border shadow-lg shadow-black/5'
          : 'bg-bg-primary/40 backdrop-blur-md border-b border-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-[64px] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <Avatar size="sm" className="rounded-lg" />
          <span className="font-semibold text-lg text-text-primary tracking-tight">
            {SITE_NAME}
          </span>
        </Link>

        {/* Desktop Nav */}
        {!isMobile && (
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = item.href === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    'relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200',
                    isActive
                      ? 'text-accent-purple-light'
                      : 'text-text-secondary hover:text-text-primary hover:bg-bg-card/50',
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-accent-purple/10 border border-accent-purple/20 rounded-lg"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1.5">
          <ThemeToggle />
          <a
            href="https://gitee.com/Anine-repo"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-card/50 transition-colors"
          >
            <Github size={18} />
          </a>
          <button
            onClick={openSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-card border border-border text-text-secondary hover:text-text-primary hover:border-border-hover transition-all text-sm"
          >
            <Search size={14} />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline text-xs px-1.5 py-0.5 rounded bg-bg-secondary text-text-secondary ml-1">
              ⌘K
            </kbd>
          </button>
          {isMobile && (
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-lg text-text-secondary hover:text-text-primary transition-colors"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden bg-bg-primary/95 backdrop-blur-xl border-t border-border"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = item.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      'px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-accent-purple/10 text-accent-purple-light'
                        : 'text-text-secondary hover:text-text-primary hover:bg-bg-card',
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
