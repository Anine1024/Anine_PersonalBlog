import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Container } from '../ui/Container';
import { HERO_TITLE, HERO_SUBTITLE } from '@/lib/constants';

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0.3]);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
    >
      <Container className="relative z-20 py-20 text-center">
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.05] max-w-4xl mx-auto">
            <span className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent dark:from-white dark:via-white dark:to-white/60">
              {HERO_TITLE}
            </span>
          </h1>

          <motion.div
            className="mt-6 flex flex-wrap gap-2 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {HERO_SUBTITLE.map((role, i) => (
              <motion.span
                key={role}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.08 }}
                className="px-3 py-1 text-xs font-medium rounded-full border border-border bg-bg-card/60 backdrop-blur-sm text-text-secondary"
              >
                {role}
              </motion.span>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-6 text-text-secondary text-base md:text-lg max-w-xl mx-auto leading-relaxed"
          >
            探索 AI、Web 开发与个人知识管理的交叉地带，构建辅助思考的工具与方法。
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
            className="mt-8 flex flex-wrap gap-4 justify-center"
          >
            <Button href="/blog" variant="primary">
              浏览博客
              <ArrowRight size={16} />
            </Button>
            <Button href="/projects" variant="secondary">
              查看项目
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
