import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
  about,
  home,
  interactiveProjects,
  researchEntries,
  sectionMeta,
  spatialStudies,
  uiCaseStudies,
  workIndex,
  type SpineItem,
} from './content/systematicContent';
import HorizontalBlackFire from './components/HorizontalBlackFire';

type SectionId = (typeof sectionMeta)[number]['id'];

function SectionShell({
  children,
  id,
  label,
  className,
}: {
  children: React.ReactNode;
  id: SectionId | string;
  label: string;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <motion.section
      id={id}
      aria-label={label}
      initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={className ?? 'system-shell section-shell py-[var(--space-xxxl)]'}
    >
      {children}
    </motion.section>
  );
}

function SectionIntro({
  page,
  title,
  purpose,
}: {
  page: string;
  title: string;
  purpose: string;
}) {
  return (
    <header className="mb-[var(--space-xl)]">
      <p className="type-caption mb-[var(--space-sm)]">{page}</p>
      <h2 className="type-h1 mb-[var(--space-sm)]">{title}</h2>
      <p className="type-body max-w-3xl">{purpose}</p>
    </header>
  );
}

function SpineRow({ item }: { item: SpineItem }) {
  return (
    <li className="spine-row">
      <div>
        <p className="font-medium text-[var(--color-text)]">{item.title}</p>
        <p className="type-body">{item.outcome}</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="type-caption">{item.role}</span>
        <a href={item.href} className="spine-open">
          Open
        </a>
      </div>
    </li>
  );
}

function SpineAccordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="spine-block">
      <button type="button" className="spine-head" onClick={onToggle} aria-expanded={open}>
        <span className="type-caption">Spine</span>
        <span className="text-[1.02rem] font-medium text-[var(--color-text)]">{title}</span>
        <span className="type-caption">{open ? 'Fold' : 'Unfold'}</span>
      </button>
      {open && <div className="spine-body">{children}</div>}
    </section>
  );
}

function PrecisionCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(pointer:fine)');
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener('change', update);

    const onMove = (event: MouseEvent) => {
      setPos({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', onMove);
    return () => {
      media.removeEventListener('change', update);
      window.removeEventListener('mousemove', onMove);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] hidden md:block" aria-hidden="true">
      <motion.div
        className="absolute h-11 w-11 rounded-full border border-[var(--color-accent-primary)]/55 bg-white/15 backdrop-blur-[2px]"
        animate={{ x: pos.x - 22, y: pos.y - 22 }}
        transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.35 }}
      />
      <motion.div
        className="absolute h-[1px] w-7 bg-[var(--color-accent-primary)]/80"
        animate={{ x: pos.x - 14, y: pos.y }}
        transition={{ type: 'spring', stiffness: 520, damping: 35, mass: 0.2 }}
      />
      <motion.div
        className="absolute h-7 w-[1px] bg-[var(--color-accent-primary)]/80"
        animate={{ x: pos.x, y: pos.y - 14 }}
        transition={{ type: 'spring', stiffness: 520, damping: 35, mass: 0.2 }}
      />
    </div>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState<SectionId>('page-00');
  const [workOpen, setWorkOpen] = useState<'ui' | 'interactive' | 'research'>('ui');
  const [uiOpen, setUiOpen] = useState(uiCaseStudies[0].id);
  const [uiDeepOpen, setUiDeepOpen] = useState<string | null>(null);
  const [interactiveOpen, setInteractiveOpen] = useState(interactiveProjects[0].id);
  const [logOpen, setLogOpen] = useState(researchEntries[0].id);
  const [aboutFold, setAboutFold] = useState(false);
  const [spatialOpen, setSpatialOpen] = useState<'installation' | 'coding'>('installation');
  const [p03ToP06Open, setP03ToP06Open] = useState(false);

  const sectionIds: SectionId[] = useMemo(() => sectionMeta.map((item) => item.id), []);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 24 });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionId = entry.target.id as SectionId;
          if (entry.isIntersecting && sectionIds.includes(sectionId)) {
            setActiveSection(sectionId);
          }
        });
      },
      { root: null, threshold: 0.3, rootMargin: '-10% 0px -40% 0px' },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sectionIds, p03ToP06Open]);

  useEffect(() => {
    if (p03ToP06Open) {
      const isInside = ['page-03', 'page-03a', 'page-04', 'page-04a', 'page-05', 'page-06', 'page-06a'].includes(activeSection);
      const isAdjacent = ['page-02', 'page-07'].includes(activeSection);
      
      if (!isInside && !isAdjacent) {
        setP03ToP06Open(false);
      }
    }
  }, [activeSection, p03ToP06Open]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== '[' && event.key !== ']') return;
      const currentIndex = sectionIds.indexOf(activeSection);
      if (currentIndex < 0) return;
      const nextIndex =
        event.key === ']'
          ? Math.min(currentIndex + 1, sectionIds.length - 1)
          : Math.max(currentIndex - 1, 0);
      const target = document.getElementById(sectionIds[nextIndex]);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeSection, sectionIds]);

  const currentUi = uiCaseStudies.find((p) => p.id === uiOpen) ?? uiCaseStudies[0];
  const currentInteractive =
    interactiveProjects.find((p) => p.id === interactiveOpen) ?? interactiveProjects[0];
  const currentLog = researchEntries.find((p) => p.id === logOpen) ?? researchEntries[0];

  return (
    <div className="min-h-screen selection:bg-black selection:text-white pb-[var(--space-xxxl)]">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <PrecisionCursor />

      <motion.div
        className="fixed right-4 top-0 h-full w-[2px] bg-black/10 origin-top z-[60]"
        style={{ scaleY: smoothProgress }}
      />

      <header className="system-shell sticky top-0 z-50 surface-glass border-b border-black/5 py-6 md:py-8">
        <div className="layout-grid-12 items-end">
          <div className="col-span-8">
            <p className="type-caption mb-2">Ryan Yu // Folding Path Portfolio</p>
            <h1 className="type-h2">Systematic Entry Architecture</h1>
          </div>
          <p className="type-caption col-span-4 text-right hidden md:block">Page 00 - 08</p>
        </div>
      </header>

      <nav aria-label="Section navigation" className="section-nav surface-glass">
        <AnimatePresence>
          {sectionMeta.map((item) => {
            const isNested = ['page-03', 'page-03a', 'page-04', 'page-04a', 'page-05', 'page-06', 'page-06a'].includes(item.id);
            if (isNested && !p03ToP06Open) return null;

            return (
              <motion.a
                key={item.id}
                href={`#${item.id}`}
                className={`section-nav-item ${activeSection === item.id ? 'is-active' : ''}`}
                aria-current={activeSection === item.id ? 'location' : undefined}
                initial={isNested ? { opacity: 0, width: 0, paddingLeft: 0, paddingRight: 0, overflow: 'hidden', marginLeft: -4 } : false}
                animate={isNested ? { opacity: 1, width: 'auto', paddingLeft: 8, paddingRight: 8, marginLeft: 0 } : false}
                exit={isNested ? { opacity: 0, width: 0, paddingLeft: 0, paddingRight: 0, overflow: 'hidden', marginLeft: -4 } : undefined}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                style={{ whiteSpace: 'nowrap' }}
              >
                {item.label}
              </motion.a>
            );
          })}
        </AnimatePresence>
      </nav>

      <main id="main-content">
        <SectionShell id="page-00" label="Home Entry Node">
          <SectionIntro
            page="Page 00"
            title="a Multidisciplinary Designer"
            purpose="working worldwide"
          />
          <p className="type-display mb-[var(--space-lg)]">{home.name}</p>
          <HorizontalBlackFire />
          <div className="flex flex-wrap gap-[var(--space-sm)] mb-[var(--space-lg)]">
            <a href="#page-02" className="spine-open">
              View Work
            </a>
            <a href="#page-07" className="spine-open">
              Contact
            </a>
          </div>
          <ul className="spine-list">
            {home.featuredSpines.map((spine) => (
              <li key={spine} className="spine-row">
                <p className="text-[1.05rem] font-medium text-[var(--color-text)]">{spine}</p>
                <span className="type-caption">Spine</span>
              </li>
            ))}
          </ul>
        </SectionShell>

        <SectionShell id="page-01" label="About Node">
          <SectionIntro
            page="Page 01"
            title="About"
            purpose="Build credibility in 30 seconds through concise biography, focus, tools, and clear links."
          />
          <div className="layout-grid-12 gap-y-[var(--space-lg)]">
            <div className="col-span-12 md:col-span-7">
              <ul className="space-y-[var(--space-sm)]">
                {about.bio.map((line) => (
                  <li key={line} className="type-body text-[var(--color-text)]">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-12 md:col-span-5">
              <h3 className="type-caption mb-[var(--space-sm)]">Focus</h3>
              <ul className="space-y-[var(--space-xs)] mb-[var(--space-md)]">
                {about.focus.map((item) => (
                  <li key={item} className="type-body">
                    {item}
                  </li>
                ))}
              </ul>
              <h3 className="type-caption mb-[var(--space-sm)]">Tools</h3>
              <div className="flex flex-wrap gap-[var(--space-xs)] mb-[var(--space-md)]">
                {about.tools.map((tool) => (
                  <span key={tool} className="tag-chip">
                    {tool}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap gap-[var(--space-sm)]">
                {about.links.map((link) => (
                  <a key={link.label} href={link.href} className="spine-open">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-[var(--space-lg)]">
            <button type="button" className="spine-head" onClick={() => setAboutFold((v) => !v)}>
              <span className="type-caption">Optional Fold</span>
              <span className="text-[1rem] font-medium text-[var(--color-text)]">Education / Selected Exhibitions</span>
              <span className="type-caption">{aboutFold ? 'Fold' : 'Unfold'}</span>
            </button>
            {aboutFold && (
              <div className="spine-body">
                <p className="type-body mb-[var(--space-sm)]">{about.fold.education}</p>
                <p className="type-body">{about.fold.exhibitions}</p>
              </div>
            )}
          </div>
        </SectionShell>

        <SectionShell id="page-02" label="Work Index Node">
          <SectionIntro
            page="Page 02"
            title="Work Index"
            purpose="A directory node, not a project wall. Spines unfold into line-based project lists."
          />
          <SpineAccordion title="UI Systems" open={workOpen === 'ui'} onToggle={() => setWorkOpen('ui')}>
            <ul className="spine-list">
              {workIndex.ui.map((item) => (
                <SpineRow key={item.title} item={item} />
              ))}
            </ul>
          </SpineAccordion>
          <SpineAccordion
            title="Interactive Systems"
            open={workOpen === 'interactive'}
            onToggle={() => setWorkOpen('interactive')}
          >
            <ul className="spine-list">
              {workIndex.interactive.map((item) => (
                <SpineRow key={item.title} item={item} />
              ))}
            </ul>
          </SpineAccordion>
          <SpineAccordion
            title="Data / Research"
            open={workOpen === 'research'}
            onToggle={() => setWorkOpen('research')}
          >
            <ul className="spine-list">
              {workIndex.research.map((item) => (
                <SpineRow key={item.title} item={item} />
              ))}
            </ul>
          </SpineAccordion>
        </SectionShell>

        <SectionShell
          id="page-02-work"
          label="Work details P03–P06"
          className="p03-p06-section section-shell py-[var(--space-xxxl)]"
        >
          <SpineAccordion
            title="P03 – P06 Work details"
            open={p03ToP06Open}
            onToggle={() => setP03ToP06Open((v) => !v)}
          >
            <>
        <SectionShell id="page-03" label="UI Systems Node">
          <SectionIntro
            page="Page 03"
            title="UI Systems"
            purpose="Core track for product and internship contexts: concise statements, fold-out previews, and clear role ownership."
          />
          <p className="type-body mb-[var(--space-lg)] max-w-3xl">
            I build UI systems through constrained visual language, explicit hierarchy, and reusable interaction logic.
            I optimize for clarity first, then polish.
          </p>
          <ul className="space-y-[var(--space-sm)]">
            {uiCaseStudies.map((project) => (
              <li key={project.id} className="spine-block">
                <button type="button" className="spine-head" onClick={() => setUiOpen(project.id)}>
                  <span className="type-caption">UI Project</span>
                  <span className="text-[1rem] font-medium text-[var(--color-text)]">{project.title}</span>
                  <span className="type-caption">{uiOpen === project.id ? 'Open' : 'Preview'}</span>
                </button>
                {uiOpen === project.id && (
                  <div className="spine-body">
                    <div className="flex flex-wrap items-center gap-[var(--space-sm)] mb-[var(--space-sm)]">
                      <span className="type-caption">{project.role}</span>
                      <a className="spine-open" href={project.link}>
                        Link
                      </a>
                    </div>
                    <p className="type-body mb-[var(--space-sm)]">{project.problem}</p>
                    <h4 className="type-caption mb-[var(--space-xs)]">Constraints</h4>
                    <ul className="space-y-[var(--space-xs)] mb-[var(--space-sm)]">
                      {project.constraints.map((item) => (
                        <li key={item} className="type-body">
                          {item}
                        </li>
                      ))}
                    </ul>
                    <h4 className="type-caption mb-[var(--space-xs)]">Approach</h4>
                    <ul className="space-y-[var(--space-xs)] mb-[var(--space-sm)]">
                      {project.approach.map((item) => (
                        <li key={item} className="type-body">
                          {item}
                        </li>
                      ))}
                    </ul>
                    <button
                      type="button"
                      className="spine-open"
                      onClick={() => setUiDeepOpen((v) => (v === project.id ? null : project.id))}
                    >
                      {uiDeepOpen === project.id ? 'Hide Iteration Notes' : 'Show Iteration Notes'}
                    </button>
                    {uiDeepOpen === project.id && (
                      <ul className="space-y-[var(--space-xs)] mt-[var(--space-sm)]">
                        {project.iterations.map((item) => (
                          <li key={item} className="type-body">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </SectionShell>

        <SectionShell id="page-03a" label="UI Case Study Pages">
          <SectionIntro
            page="Page 03A / 03B / 03C"
            title="UI Case Study"
            purpose="Map-style unfolding: each fold reveals exactly one stage of the story and collapses the previous stage into a spine."
          />
          <div className="spine-body">
            <h3 className="type-caption mb-[var(--space-xs)]">Overview</h3>
            <p className="type-body mb-[var(--space-sm)]">{currentUi.problem}</p>
            <h3 className="type-caption mb-[var(--space-xs)]">Role & Scope</h3>
            <p className="type-body mb-[var(--space-sm)]">{currentUi.role}</p>
            <h3 className="type-caption mb-[var(--space-xs)]">System</h3>
            <ul className="space-y-[var(--space-xs)] mb-[var(--space-sm)]">
              {currentUi.constraints.map((item) => (
                <li key={item} className="type-body">
                  {item}
                </li>
              ))}
            </ul>
            <h3 className="type-caption mb-[var(--space-xs)]">Process</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-sm)] mb-[var(--space-sm)]">
              {Array.from({ length: 3 }).map((_, idx) => (
                <figure key={idx} className="image-placeholder">
                  <div className="image-block" />
                  <figcaption className="type-caption mt-1">Process frame {idx + 1}</figcaption>
                </figure>
              ))}
            </div>
            <h3 className="type-caption mb-[var(--space-xs)]">Outcome</h3>
            <a href={currentUi.link} className="spine-open">
              Demo / Prototype / Repo
            </a>
          </div>
        </SectionShell>

        <SectionShell id="page-04" label="Interactive Systems Node">
          <SectionIntro
            page="Page 04"
            title="Interactive Systems"
            purpose="Technical rigor over spectacle: chaptered browser and Unity/AR work shown sequentially, never side-by-side noise."
          />
          <SpineAccordion
            title="Chapter Spine 1: Browser Lab"
            open={currentInteractive.chapter === 'Browser Lab'}
            onToggle={() => {
              const match = interactiveProjects.find((p) => p.chapter === 'Browser Lab');
              if (match) setInteractiveOpen(match.id);
            }}
          >
            {interactiveProjects
              .filter((p) => p.chapter === 'Browser Lab')
              .map((project) => (
                <button key={project.id} type="button" className="spine-head mt-[var(--space-xs)]" onClick={() => setInteractiveOpen(project.id)}>
                  <span className="type-caption">Project</span>
                  <span className="text-[1rem] font-medium text-[var(--color-text)]">{project.title}</span>
                  <span className="type-caption">Open</span>
                </button>
              ))}
          </SpineAccordion>
          <SpineAccordion
            title="Chapter Spine 2: Unity / AR"
            open={currentInteractive.chapter === 'Unity / AR'}
            onToggle={() => {
              const match = interactiveProjects.find((p) => p.chapter === 'Unity / AR');
              if (match) setInteractiveOpen(match.id);
            }}
          >
            {interactiveProjects
              .filter((p) => p.chapter === 'Unity / AR')
              .map((project) => (
                <button key={project.id} type="button" className="spine-head mt-[var(--space-xs)]" onClick={() => setInteractiveOpen(project.id)}>
                  <span className="type-caption">Project</span>
                  <span className="text-[1rem] font-medium text-[var(--color-text)]">{project.title}</span>
                  <span className="type-caption">Open</span>
                </button>
              ))}
          </SpineAccordion>
          <div className="spine-body mt-[var(--space-sm)]">
            <h3 className="type-caption mb-[var(--space-xs)]">What it tests</h3>
            <p className="type-body mb-[var(--space-sm)]">{currentInteractive.tests}</p>
            <h3 className="type-caption mb-[var(--space-xs)]">Inputs / Outputs</h3>
            <ul className="space-y-[var(--space-xs)] mb-[var(--space-sm)]">
              {currentInteractive.inputsOutputs.map((item) => (
                <li key={item} className="type-body">
                  {item}
                </li>
              ))}
            </ul>
            <h3 className="type-caption mb-[var(--space-xs)]">Interaction model</h3>
            <p className="type-body mb-[var(--space-sm)]">{currentInteractive.interaction}</p>
            <h3 className="type-caption mb-[var(--space-xs)]">Build notes</h3>
            <ul className="space-y-[var(--space-xs)]">
              {currentInteractive.buildNotes.map((item) => (
                <li key={item} className="type-body">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </SectionShell>

        <SectionShell id="page-04a" label="Interactive Project Pages">
          <SectionIntro
            page="Page 04A / 04B / 04C"
            title="Interactive Project Detail"
            purpose="Technical-sheet style: one-sentence purpose, IO logic, concise implementation bullets, evidence, and links."
          />
          <div className="spine-body">
            <h3 className="type-caption mb-[var(--space-xs)]">Purpose</h3>
            <p className="type-body mb-[var(--space-sm)]">{currentInteractive.purpose}</p>
            <h3 className="type-caption mb-[var(--space-xs)]">Interaction</h3>
            <p className="type-body mb-[var(--space-sm)]">{currentInteractive.interaction}</p>
            <h3 className="type-caption mb-[var(--space-xs)]">Implementation</h3>
            <ul className="space-y-[var(--space-xs)] mb-[var(--space-sm)]">
              {currentInteractive.implementation.map((item) => (
                <li key={item} className="type-body">
                  {item}
                </li>
              ))}
            </ul>
            <h3 className="type-caption mb-[var(--space-xs)]">Evidence</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-sm)] mb-[var(--space-sm)]">
              {Array.from({ length: 2 }).map((_, idx) => (
                <figure key={idx} className="image-placeholder">
                  <div className="image-block" />
                  <figcaption className="type-caption mt-1">Evidence frame {idx + 1}</figcaption>
                </figure>
              ))}
            </div>
            <div className="flex gap-[var(--space-sm)]">
              <a href={currentInteractive.links.demo} className="spine-open">
                Demo
              </a>
              <a href={currentInteractive.links.repo} className="spine-open">
                Repo
              </a>
            </div>
          </div>
        </SectionShell>

        <SectionShell id="page-05" label="Research Log Node">
          <SectionIntro
            page="Page 05"
            title="Research Log / Rolling Tape"
            purpose="Receipt-style updates in time order. One entry fully open at a time; all others remain summary strips."
          />
          <div className="flex flex-wrap gap-[var(--space-xs)] mb-[var(--space-md)]">
            {['UI', 'Unity', 'AR', 'Hardware', 'Notes'].map((tag) => (
              <span key={tag} className="tag-chip">
                {tag}
              </span>
            ))}
          </div>
          <div className="rolling-tape" role="region" aria-label="Scrollable rolling tape">
            <ul className="rolling-tape-track">
              {researchEntries.map((entry) => (
                <li
                  key={entry.id}
                  className={`tape-receipt ${logOpen === entry.id ? 'is-open' : ''}`}
                >
                  <button type="button" className="tape-head" onClick={() => setLogOpen(entry.id)}>
                    <span className="type-caption">{entry.date}</span>
                    <span className="text-[1rem] font-medium text-[var(--color-text)]">{entry.title}</span>
                    <span className="type-caption">{logOpen === entry.id ? 'Open' : 'Summary'}</span>
                  </button>
                  {logOpen === entry.id ? (
                    <div className="tape-body">
                      <p className="type-body mb-[var(--space-sm)]">{entry.summary}</p>
                      <div className="grid grid-cols-1 gap-[var(--space-sm)] mb-[var(--space-sm)]">
                        {Array.from({ length: 3 }).map((_, idx) => (
                          <div key={idx} className="image-block h-28" />
                        ))}
                      </div>
                      <ul className="space-y-[var(--space-xs)] mb-[var(--space-sm)]">
                        {entry.body.map((line) => (
                          <li key={line} className="type-body">
                            {line}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap gap-[var(--space-sm)]">
                        {entry.links.map((link) => (
                          <a key={link.label} href={link.href} className="spine-open">
                            {link.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="tape-body">
                      <p className="type-body">{entry.summary}</p>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
          <div className="spine-body mt-[var(--space-md)]">
            <h3 className="type-caption mb-[var(--space-xs)]">Page 05A - Log Entry Detail</h3>
            <p className="type-body mb-[var(--space-sm)]">{currentLog.title}</p>
            <p className="type-body">Use this detail page only for larger records that need a complete process trace.</p>
          </div>
        </SectionShell>

        <SectionShell id="page-06" label="Spatial and Code Studies Node">
          <SectionIntro
            page="Page 06"
            title="Spatial & Code Studies"
            purpose="Creative work as a structured appendix. Two spines, non-card line previews, consistent system language."
          />
          <SpineAccordion
            title="Installation"
            open={spatialOpen === 'installation'}
            onToggle={() => setSpatialOpen('installation')}
          >
            <ul className="spine-list">
              {spatialStudies.installation.map((item) => (
                <li key={item.title} className="spine-row">
                  <div>
                    <p className="font-medium text-[var(--color-text)]">{item.title}</p>
                    <p className="type-body">{item.intent}</p>
                    <p className="type-caption">{item.medium} / {item.tools}</p>
                  </div>
                  <a href="#page-06a" className="spine-open">
                    Open
                  </a>
                </li>
              ))}
            </ul>
          </SpineAccordion>
          <SpineAccordion
            title="Creative Coding"
            open={spatialOpen === 'coding'}
            onToggle={() => setSpatialOpen('coding')}
          >
            <ul className="spine-list">
              {spatialStudies.coding.map((item) => (
                <li key={item.title} className="spine-row">
                  <div>
                    <p className="font-medium text-[var(--color-text)]">{item.title}</p>
                    <p className="type-body">{item.intent}</p>
                    <p className="type-caption">{item.medium} / {item.tools}</p>
                  </div>
                  <a href="#page-06a" className="spine-open">
                    Open
                  </a>
                </li>
              ))}
            </ul>
          </SpineAccordion>
        </SectionShell>

        <SectionShell id="page-06a" label="Study Detail Page">
          <SectionIntro
            page="Page 06A"
            title="Study Detail"
            purpose="Present artistic studies as verifiable systems through intent, medium, experience, build notes, and documentation links."
          />
          <div className="spine-body">
            <h3 className="type-caption mb-[var(--space-xs)]">Intent</h3>
            <p className="type-body mb-[var(--space-sm)]">Translate coded behavior into perceivable spatial structure.</p>
            <h3 className="type-caption mb-[var(--space-xs)]">Form / Medium</h3>
            <p className="type-body mb-[var(--space-sm)]">Projection, reactive graphics, and structured timing cues.</p>
            <h3 className="type-caption mb-[var(--space-xs)]">Experience</h3>
            <p className="type-body mb-[var(--space-sm)]">Viewers move, trigger state transitions, and observe response envelopes.</p>
            <button type="button" className="spine-open">
              Build / Tech (Fold)
            </button>
            <div className="mt-[var(--space-sm)]">
              <a href="#" className="spine-open">
                Documentation Link
              </a>
            </div>
          </div>
        </SectionShell>
            </>
          </SpineAccordion>
        </SectionShell>

        <SectionShell id="page-07" label="Contact Exit Node">
          <SectionIntro
            page="Page 07"
            title="Contact / Exit Node"
            purpose="Clean ending: direct contact, core links, and minimal form fields only."
          />
          <div className="spine-body">
            <p className="type-body mb-[var(--space-sm)]">Email: ryan@example.com</p>
            <div className="flex flex-wrap gap-[var(--space-sm)] mb-[var(--space-md)]">
              <a href="https://github.com/" className="spine-open">
                GitHub
              </a>
              <a href="https://www.linkedin.com/" className="spine-open">
                LinkedIn
              </a>
            </div>
            <p className="type-body mb-[var(--space-sm)]">Availability: open to product design engineering internships and collaborations.</p>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-sm)]">
              <input className="field" placeholder="Name" aria-label="Name" />
              <input className="field" placeholder="Email" aria-label="Email" />
              <input className="field" placeholder="Message" aria-label="Message" />
            </form>
          </div>
        </SectionShell>

        <SectionShell id="page-08" label="Resume Page">
          <SectionIntro
            page="Page 08"
            title="Resume"
            purpose="Fast review and download node for hiring contexts with optional highlights."
          />
          <div className="spine-body">
            <div className="image-block h-72 mb-[var(--space-sm)]" />
            <div className="flex gap-[var(--space-sm)] mb-[var(--space-sm)]">
              <a href="#" className="spine-open">
                Download Resume
              </a>
              <a href="#page-01" className="spine-open">
                Back to About
              </a>
            </div>
            <div className="pt-[var(--space-md)] pb-[var(--space-md)]" aria-hidden="true" />
          </div>
        </SectionShell>
      </main>

      <footer className="system-shell py-[var(--space-xl)]">
        <p className="type-caption text-center">Navigation tips: [ and ] move by section, Enter follows links, Esc reduces interaction load.</p>
      </footer>
    </div>
  );
}

export default App;
