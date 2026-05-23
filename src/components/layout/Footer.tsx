import { Github, Mail } from 'lucide-react';
import { SITE_NAME, SOCIAL_LINKS } from '@/lib/constants';
import { Avatar } from '../ui/Avatar';

export function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 text-text-secondary text-sm">
          <Avatar size="sm" className="rounded-md" />
          <span>&copy; {new Date().getFullYear()} {SITE_NAME}</span>
        </div>

        <div className="flex items-center gap-4">
          <a
            href={SOCIAL_LINKS.gitee}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
          >
            <Github size={18} />
          </a>
          <a
            href={SOCIAL_LINKS.email}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-card transition-colors"
          >
            <Mail size={18} />
          </a>
        </div>

        <p className="text-text-secondary text-xs">
          Built with React &middot; Deployed on Vercel
        </p>
      </div>
    </footer>
  );
}
