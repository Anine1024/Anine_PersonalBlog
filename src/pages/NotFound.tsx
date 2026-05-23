import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';

export function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-8xl font-bold bg-gradient-to-br from-accent-purple to-accent-cyan bg-clip-text text-transparent">
          404
        </p>
        <h2 className="mt-6 text-2xl font-bold text-text-primary">
          页面未找到
        </h2>
        <p className="mt-2 text-text-secondary">
          你访问的页面不存在或已被移除。
        </p>
        <div className="mt-8">
          <Button href="/">返回首页</Button>
        </div>
      </motion.div>
    </div>
  );
}
