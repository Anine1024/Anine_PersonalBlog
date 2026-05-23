import { motion, useSpring } from 'framer-motion';
import { useReadingProgress } from '@/hooks/useReadingProgress';

export function ReadingProgress() {
  const progress = useReadingProgress();
  const scaleX = useSpring(progress, { stiffness: 100, damping: 30 });

  return (
    <motion.div
      className="fixed top-[64px] left-0 right-0 h-[3px] bg-accent-purple origin-left z-40 shadow-[0_0_8px_var(--color-accent-purple-glow)]"
      style={{ scaleX }}
    />
  );
}
