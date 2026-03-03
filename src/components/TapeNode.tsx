import { motion, AnimatePresence } from 'framer-motion';

interface TapeNodeProps {
  id: string;
  title: string;
  index: number;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'center';
}

export const TapeNode: React.FC<TapeNodeProps> = ({
  title,
  index,
  isOpen,
  onClick,
  children,
  direction = 'center'
}) => {
  // Determine alignment classes based on the tape direction
  const alignmentClass = 
    direction === 'left' ? 'items-start' : 
    direction === 'right' ? 'items-end' : 
    'items-center';

  return (
    <div className={`relative flex flex-col w-full ${alignmentClass} py-8 z-10`}>
      {/* Tape Node / Spine Button */}
      <motion.button
        layout
        onClick={onClick}
        className="group relative flex items-center gap-[var(--space-md)] bg-[var(--color-bg-elevated)]/70 hover:bg-[var(--color-surface-1)] matte-glass px-[var(--space-lg)] py-[var(--space-md)] rounded-xl cursor-pointer transition-colors duration-300 z-20 border border-black/5"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <span className="type-caption">0{index + 1}</span>
        <span className="text-[1.05rem] font-medium text-[var(--color-text)] tracking-[0.01em]">{title}</span>
        <div className={`w-2 h-2 rounded-full transition-colors ${isOpen ? 'bg-[var(--color-accent-primary)]' : 'bg-gray-300'}`} />
      </motion.button>

      {/* Unfolding Content Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, scaleY: 0.95, transformOrigin: 'top' }}
            animate={{ opacity: 1, height: 'auto', scaleY: 1 }}
            exit={{ opacity: 0, height: 0, scaleY: 0.95 }}
            transition={{ duration: 0.5, ease: [0.19, 1.0, 0.22, 1.0] }}
            className="w-full max-w-4xl mt-6 z-10 overflow-hidden origin-top"
          >
            <div className="matte-glass p-[var(--space-xl)] md:p-[var(--space-xxl)] rounded-2xl border border-white/50 bg-white/40 shadow-[var(--shadow-medium)]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
