import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import type { ProjectStudyData } from '../content/projectStudies';

const ease = [0.25, 0.1, 0.25, 1] as const;

export default function ProjectStudy({ project }: { project: ProjectStudyData }) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const slideCount = project.slides.length + 1;
  const vhPerSlide = 120;
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start start', 'end end'],
  });
  const [step, setStep] = useState(0);
  const [local, setLocal] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(slideCount - 1, Math.floor(v * slideCount));
    setStep(idx);
    setLocal(v * slideCount - idx);
  });

  useEffect(() => {
    const v = scrollYProgress.get();
    const idx = Math.min(slideCount - 1, Math.floor(v * slideCount));
    setStep(idx);
    setLocal(v * slideCount - idx);
  }, [scrollYProgress, slideCount]);

  const progress = ((step + local) / slideCount) * 100;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-[var(--space-lg)] mb-[var(--space-xxxl)] items-start">
        <div className="flex-1 min-w-0 pt-[var(--space-md)]">
          <h1 className="type-h1">{project.heroName}</h1>
          <div className="flex gap-[var(--space-md)] mt-[var(--space-lg)]">
            <span className="type-caption">{project.year}</span>
            <span className="type-caption">{project.role}</span>
          </div>
        </div>
        <div className="w-full md:w-[55%] shrink-0">
          <img
            src={project.heroImage}
            alt={project.heroAlt}
            className="w-full rounded-xl object-cover"
            style={{ aspectRatio: '4 / 3' }}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-[var(--space-lg)] mt-[var(--space-xxxl)] mb-[var(--space-xxxl)] items-start py-[var(--space-xxl)] px-[var(--space-md)] border-t border-b border-black/8">
        <h3
          className="shrink-0 pt-[3px] text-[var(--color-text-muted)]"
          style={{ fontSize: 'clamp(1.05rem, 1.5vw, 1.25rem)', letterSpacing: '0.04em' }}
        >
          Overview
        </h3>
        <p className="leading-relaxed max-w-2xl ml-auto" style={{ fontSize: 'clamp(1rem, 1.3vw, 1.15rem)' }}>
          {project.overview}
        </p>
      </div>

      <motion.div
        className="mb-[var(--space-xxxl)]"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: 0.8, ease }}
      >
        <p className="font-bold leading-[1.1] tracking-tight text-[var(--color-text)]" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>
          {project.statement}
        </p>
        <p
          className="font-bold leading-[1.1] tracking-tight text-[var(--color-accent-primary)]"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}
        >
          {project.accentLine}
        </p>
        <p className="font-bold leading-[1.1] tracking-tight text-[var(--color-text)] text-right" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>
          {project.closingLine}
        </p>
        <img
          src={project.wideImage}
          alt={project.wideAlt}
          className="w-full rounded-xl object-cover mt-[var(--space-lg)]"
          style={{ maxHeight: 'clamp(200px, 35vw, 420px)' }}
        />
      </motion.div>

      <motion.section
        className="mb-[var(--space-xxxl)]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.6, ease }}
      >
        <h3 className="type-caption text-[1.1rem] tracking-wider mb-[var(--space-md)]">Aims</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-lg)] mb-[var(--space-xxl)]">
          {project.goals.map((goal, index) => (
            <div key={goal} className="border border-black/10 rounded-2xl px-[var(--space-lg)] py-[var(--space-md)] bg-black/[0.03]">
              <p className="type-caption text-[0.9rem] text-[var(--color-accent-primary)] mb-[var(--space-xs)]">
                {index === 0 ? 'Aim A' : 'Aim B'}
              </p>
              <p className="text-[1.1rem] leading-relaxed">{goal}</p>
            </div>
          ))}
        </div>

        <h3 className="type-caption text-[1.1rem] tracking-wider mb-[var(--space-md)]">System</h3>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr_auto_1fr] gap-[var(--space-sm)] items-stretch mb-[var(--space-xxl)]">
          {project.nodes.map((node, index) => (
            <div key={node.title} className="contents">
              <div
                className="rounded-2xl px-[var(--space-md)] py-[var(--space-lg)] border text-center"
                style={{
                  borderColor: node.accent ? 'color-mix(in srgb, var(--color-accent-primary) 35%, transparent)' : 'rgb(0 0 0 / 0.12)',
                  background: node.accent ? 'color-mix(in srgb, var(--color-accent-primary) 8%, transparent)' : 'rgb(0 0 0 / 0.03)',
                }}
              >
                <p className="text-[1.05rem] font-semibold mb-[var(--space-xs)]">{node.title}</p>
                {node.lines.map((line) => (
                  <p key={line} className="type-caption text-[var(--color-text-muted)]">{line}</p>
                ))}
              </div>
              {index < project.edges.length && (
                <div className="hidden md:flex items-center type-caption text-[var(--color-text-muted)] px-1">
                  {project.edges[index]}
                </div>
              )}
            </div>
          ))}
        </div>

        <h3 className="type-caption text-[1.1rem] tracking-wider mb-[var(--space-lg)]">How it developed</h3>
        <div className="flex flex-col sm:flex-row gap-0 mb-[var(--space-xxl)] border-t border-black/10">
          {project.steps.map((item, index) => (
            <div
              key={item.head}
              className={`flex-1 pl-[14px] pt-[var(--space-md)] pb-[var(--space-md)] pr-[var(--space-lg)] ${index < project.steps.length - 1 ? 'sm:border-r border-black/10' : ''}`}
            >
              <span className="type-caption text-[0.8rem] text-[var(--color-accent-primary)] block mb-[var(--space-xs)]">
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="text-[1.1rem] font-medium leading-snug mb-[2px]">{item.head}</p>
              <p className="text-[0.95rem] text-[var(--color-text-muted)] leading-snug whitespace-pre-line">{item.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[var(--space-md)]">
          {project.takeaways.map((item, index) => (
            <div
              key={item.label}
              className="group relative rounded-2xl p-[var(--space-md)] overflow-hidden border border-black/12"
              style={{ minHeight: '9rem' }}
            >
              <span
                className="absolute top-3 right-4 font-bold leading-none pointer-events-none"
                style={{ fontSize: '3.8rem', lineHeight: 1, color: 'var(--color-accent-primary)', opacity: 0.1 }}
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <p className="text-[1.1rem] font-medium leading-snug relative z-10 pt-[3.2rem]">{item.label}</p>
              <p className="text-[0.95rem] text-[var(--color-text-muted)] leading-relaxed relative z-10 mt-[var(--space-xs)]">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="mb-[var(--space-xxxl)]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.6, ease }}
      >
        <h3 className="type-caption text-[1.1rem] tracking-wider mb-[var(--space-lg)]">What it became</h3>
        <blockquote className="border-l-4 border-[var(--color-accent-primary)] pl-[var(--space-md)] max-w-4xl">
          <p className="text-[1.3rem] italic leading-relaxed">&ldquo;{project.quote}&rdquo;</p>
        </blockquote>
      </motion.section>

      <div
        ref={timelineRef}
        className="relative my-[var(--space-xxxl)] w-screen"
        style={{ marginLeft: 'calc(50% - 50vw)', height: `${slideCount * vhPerSlide}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden bg-[var(--color-bg)] z-10">
          <div className="relative h-screen w-full">
            <motion.div
              key={step}
              className="absolute inset-0"
              initial={{ y: '8vh', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              {step === 0 ? (
                <div className="h-screen w-full flex items-center justify-center px-[var(--space-xl)]">
                  <div className="max-w-3xl">
                    <div className="flex gap-[var(--space-sm)] flex-wrap mb-[var(--space-lg)]">
                      {project.intro.tags.map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-[0.65rem] tracking-widest uppercase px-3 py-1 rounded-full border"
                          style={{ borderColor: 'rgba(0,0,0,0.18)', color: 'var(--color-text-muted)' }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h2 className="font-bold leading-[1.05] tracking-tight m-0" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)' }}>
                      {project.intro.title}
                    </h2>
                    <p className="text-[1.1rem] leading-relaxed max-w-xl mt-[var(--space-md)] text-[var(--color-text-muted)]">
                      {project.intro.text}
                    </p>
                    <p className="type-caption mt-[var(--space-lg)] text-[var(--color-text-muted)]">Scroll to view the work ↓</p>
                  </div>
                </div>
              ) : (
                <div className="h-screen w-full flex items-center justify-center px-[var(--space-xl)]">
                  <img
                    src={project.slides[step - 1].src}
                    alt={project.slides[step - 1].alt}
                    className="w-full max-w-5xl rounded-2xl shadow-2xl object-contain"
                    style={{ maxHeight: '76vh' }}
                  />
                </div>
              )}
            </motion.div>
            <div className="pointer-events-none absolute left-0 right-0 z-20 px-[var(--space-lg)]" style={{ bottom: '1.25rem' }}>
              <div className="mx-auto max-w-5xl flex flex-col gap-3">
                <div className="flex items-baseline justify-between">
                  <span className="type-caption tracking-[0.12em] text-[var(--color-text-muted)]">
                    {step + 1} / {slideCount}
                  </span>
                  <span className="type-caption text-[var(--color-text-muted)] tabular-nums">{Math.round(progress)}%</span>
                </div>
                <div className="h-[3px] w-full rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.08)' }}>
                  <div className="h-full rounded-full" style={{ width: `${progress}%`, background: 'var(--color-accent-primary)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <motion.section
        className="mb-[var(--space-xxxl)]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.6, ease }}
      >
        <h3 className="type-caption text-[1.1rem] tracking-wider mb-[var(--space-lg)]">Inside the work</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-lg)]">
          {project.features.map((feature) => (
            <div key={feature.label}>
              <p className="text-[1.05rem] font-medium mb-[var(--space-xs)]">{feature.label}</p>
              <p className="type-body text-[var(--color-text-muted)] leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        className="mb-[var(--space-xxl)]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.6, ease }}
      >
        <h3 className="type-caption text-[1.1rem] tracking-wider mb-[var(--space-sm)]">Reflection</h3>
        <p className="text-[1.2rem] max-w-4xl leading-relaxed">{project.reflection}</p>
      </motion.section>

      <div className="border-t border-black/8 my-[var(--space-xxl)]" />

      <section className="mb-[var(--space-xxl)]">
        <h3 className="type-caption mb-[var(--space-sm)]">Credits</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--space-md)] mb-[var(--space-lg)]">
          {([
            ['Team', project.credits.team],
            ['Role', project.credits.role],
            ['Year', project.credits.year],
            ['Tools', project.credits.tools],
          ] as const).map(([label, value]) => (
            <div key={label}>
              <p className="type-caption mb-[var(--space-xs)]">{label}</p>
              <p className="type-body">{value}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-[var(--space-sm)]">
          {project.links.map((link) => (
            <a key={link.href} className="spine-open" href={link.href} target="_blank" rel="noreferrer">
              {link.label}
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
