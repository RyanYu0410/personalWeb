import { motion } from 'framer-motion';
import { Line, Node } from './LineSystem';

const logs = [
  { date: '2026.02.14', title: 'Generative Typography Variables', notes: 'Testing weight interpolation bounded by viewport dimensions.' },
  { date: '2026.01.09', title: 'Grid Snapping Algorithms', notes: 'Implemented a recursive quadtree approach for aligning floating elements.' },
  { date: '2025.11.22', title: 'Monochrome Palette Constraints', notes: 'Reduced palette to strictly two values. Exploring contrast ratios and accessible luminance.' },
  { date: '2025.09.18', title: 'SVG Path Iterations', notes: 'Dragon curve path generation via recursive L-system parsing.' },
];

const ResearchLog = () => {
  return (
    <section id="research" className="grid-container relative py-32">
      {/* 
        Incoming fold from Interactive Systems:
        The line was vertically going down the right edge (right: 40px).
        Now it needs to fold back left to the EXACT CENTER (50%).
      */}
      
      <Line direction="horizontal" length="50%" className="top-0 right-[40px] max-md:right-[16px]" delay={0.2} />
      <Line direction="vertical" length="100%" className="top-0 left-1/2 max-md:left-[16px]" delay={0.8} />
      <Node className="top-0 left-1/2 max-md:left-[16px] -translate-x-[1.5px]" delay={0.8} />

      {/* Mobile: indent by 1 column per plan (Section 4) */}
      <div className="col-span-12 max-md:col-start-2 max-md:col-span-3 pt-20 flex flex-col items-center max-md:items-start max-md:pl-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-24 text-center max-md:text-left"
        >
          <h2 className="font-bold uppercase tracking-tight text-3xl md:text-5xl mb-4">
            4) Research Log
          </h2>
          <p className="font-normal text-sm md:text-base leading-relaxed max-w-prose uppercase tracking-widest">
            Rolling tape: process notes, snapshots, and iterations.
          </p>
        </motion.div>

        {/* Rigid vertical timeline down exact center; entries pinned left/right with perpendicular 90° offshoots */}
        <div className="relative w-full max-w-4xl flex flex-col gap-16 md:gap-32">
          {logs.map((log, idx) => {
            const isLeft = idx % 2 === 0;
            return (
              <div
                key={idx}
                className={`relative flex w-full ${isLeft ? 'md:justify-start justify-end' : 'justify-end'}`}
              >
                {/* Short perpendicular 90° offshoot from central line to this entry */}
                <Line
                  direction="horizontal"
                  length="80px"
                  className={`absolute top-4 h-[var(--line-width)] -z-10 max-md:left-4 ${
                    isLeft ? 'left-[calc(50%-80px)]' : 'left-1/2'
                  }`}
                  delay={1 + idx * 0.2}
                />
                <motion.div
                  className={`w-full md:w-[42%] border-t border-[var(--line-color)] pt-4 ${
                    isLeft ? 'md:pr-16' : 'md:pl-16'
                  }`}
                  style={{ borderTopWidth: 'var(--line-width)' }}
                  initial={{ opacity: 0, x: isLeft ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <p className="text-[var(--accent-color)] font-medium uppercase tracking-widest text-xs mb-2">
                    {log.date}
                  </p>
                  <h4 className="font-bold uppercase tracking-widest text-sm mb-4">
                    {log.title}
                  </h4>
                  <p className="text-sm font-normal leading-relaxed opacity-80">
                    {log.notes}
                  </p>
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResearchLog;
