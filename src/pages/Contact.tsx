import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, Phone, Send, Github } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { SOCIAL_LINKS } from '@/lib/constants';

export function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:${SOCIAL_LINKS.email.replace('mailto:', '')}?subject=来自 ${form.name}&body=${encodeURIComponent(form.message)}`;
  };

  return (
    <>
      <Helmet>
        <title>Contact - Anine's Digital Garden</title>
      </Helmet>
      <Container className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-lg mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-text-primary tracking-tight">Get in Touch</h1>
            <p className="mt-2 text-text-secondary">
              有想法想交流？欢迎通过以下方式联系我。
            </p>
          </div>

          {/* Contact info */}
          <div className="space-y-3 mb-12">
            <a
              href={SOCIAL_LINKS.email}
              className="flex items-center gap-3 p-4 rounded-xl bg-bg-card border border-border hover:border-border-hover transition-colors"
            >
              <Mail size={18} className="text-accent-purple-light shrink-0" />
              <span className="text-sm text-text-primary">2386415771@qq.com</span>
            </a>
            <div className="flex items-center gap-3 p-4 rounded-xl bg-bg-card border border-border">
              <Phone size={18} className="text-accent-purple-light shrink-0" />
              <span className="text-sm text-text-primary">190 0707 2048（微信同号）</span>
            </div>
            <a
              href={SOCIAL_LINKS.gitee}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 rounded-xl bg-bg-card border border-border hover:border-border-hover transition-colors"
            >
              <Github size={18} className="text-accent-purple-light shrink-0" />
              <span className="text-sm text-text-primary">gitee.com/Anine-repo</span>
            </a>
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-bg-card border border-border text-text-primary placeholder-text-secondary text-sm outline-none focus:border-accent-purple/50 focus:shadow-[0_0_16px_var(--color-accent-purple-glow)] transition-all"
                placeholder="你的名字"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                className="w-full px-4 py-2.5 rounded-xl bg-bg-card border border-border text-text-primary placeholder-text-secondary text-sm outline-none focus:border-accent-purple/50 focus:shadow-[0_0_16px_var(--color-accent-purple-glow)] transition-all"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">Message</label>
              <textarea
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                required
                rows={5}
                className="w-full px-4 py-2.5 rounded-xl bg-bg-card border border-border text-text-primary placeholder-text-secondary text-sm outline-none focus:border-accent-purple/50 focus:shadow-[0_0_16px_var(--color-accent-purple-glow)] transition-all resize-none"
                placeholder="写下你想说的话..."
              />
            </div>
            <Button type="submit" variant="primary" className="w-full justify-center">
              <Send size={16} />
              发送消息
            </Button>
          </form>
        </motion.div>
      </Container>
    </>
  );
}
