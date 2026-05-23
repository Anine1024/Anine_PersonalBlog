import { motion } from 'framer-motion';
import { Container } from '../ui/Container';
import { SectionHeading } from '../ui/SectionHeading';
import { SKILLS } from '@/lib/constants';

export function SkillsTags() {
  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          title="技能方向"
          subtitle="专注的技术领域"
        />
        <div className="flex flex-wrap gap-3">
          {SKILLS.map((skill, i) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: i * 0.04 }}
              className="px-4 py-2 rounded-full text-sm font-medium bg-bg-card border border-border text-text-secondary hover:text-text-primary hover:border-accent-purple/30 hover:shadow-[0_0_16px_var(--color-accent-purple-glow)] transition-all duration-300 cursor-default"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </Container>
    </section>
  );
}
