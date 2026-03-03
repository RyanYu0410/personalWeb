import { motion } from 'framer-motion';
import clsx from 'clsx';

type LineProps = {
  direction: 'horizontal' | 'vertical';
  length: string;
  className?: string;
  delay?: number;
};

type NodeProps = {
  className?: string;
  delay?: number;
};

export function Line({ direction, length, className, delay = 0 }: LineProps) {
  const isHorizontal = direction === 'horizontal';

  return (
    <motion.div
      initial={isHorizontal ? { scaleX: 0 } : { scaleY: 0 }}
      whileInView={isHorizontal ? { scaleX: 1 } : { scaleY: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.4, 0, 0.2, 1] }}
      className={clsx(
        'absolute bg-[var(--color-accent-primary)]',
        isHorizontal ? 'origin-left' : 'origin-top',
        className,
      )}
      style={{
        width: isHorizontal ? length : 'var(--line-width, 1px)',
        height: isHorizontal ? 'var(--line-width, 1px)' : length,
      }}
    />
  );
}

export function Node({ className, delay = 0 }: NodeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      className={clsx('absolute h-[3px] w-[3px] rounded-full bg-[var(--color-accent-primary)]', className)}
    />
  );
}
