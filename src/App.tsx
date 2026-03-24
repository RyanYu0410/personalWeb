import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion, useScroll, useSpring, useTransform, useMotionValueEvent } from 'framer-motion';
import {
  about,
  home,
  housingProject,
  interactiveProjects,
  researchEntries,
  sectionMeta,
  spatialStudies,
  uiCaseStudies,
  workIndex,
} from './content/systematicContent';
import InteractiveThreeSpine from './components/InteractiveThreeSpine';
import { useT } from './i18n/useT';
import { useLang } from './i18n/context';
import type { TranslationKey } from './i18n/translations';

/** Public folder URL (respects `vite.config.ts` `base`, e.g. GitHub Pages). */
function publicUrl(file: string) {
  const base = import.meta.env.BASE_URL;
  const path = file.startsWith('/') ? file.slice(1) : file;
  return `${base}${path}`;
}

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
  title,
  purpose,
  purposeAsLine,
}: {
  title: string;
  purpose: string;
  purposeAsLine?: boolean;
}) {
  return (
    <header className="mb-[var(--space-xl)]">
      <h2 className="type-h1 mb-[var(--space-sm)]">{title}</h2>
      {purposeAsLine ? (
        <div className="section-intro-line" aria-hidden />
      ) : (
        <p className="type-body max-w-3xl">{purpose}</p>
      )}
    </header>
  );
}

function SpineAccordion({
  title,
  open,
  onToggle,
  children,
  t,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  t: (k: TranslationKey) => string | readonly string[];
}) {
  return (
    <section className="spine-block">
      <button type="button" className="spine-head" onClick={onToggle} aria-expanded={open}>
        <span className="type-caption">{t('spine')}</span>
        <span className="text-[1.02rem] font-medium text-[var(--color-text)]">{title}</span>
        <span className="type-caption">{open ? t('fold') : t('unfold')}</span>
      </button>
      {open && <div className="spine-body">{children}</div>}
    </section>
  );
}

function PrecisionCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState(16);
  const [enabled, setEnabled] = useState(false);
  const prevPos = useRef({ x: 0, y: 0 });
  const smoothSpeed = useRef(0);
  const rafId = useRef(0);

  useEffect(() => {
    const media = window.matchMedia('(pointer:fine)');
    const update = () => setEnabled(media.matches);
    update();
    media.addEventListener('change', update);

    const onMove = (event: MouseEvent) => {
      const dx = event.clientX - prevPos.current.x;
      const dy = event.clientY - prevPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      prevPos.current = { x: event.clientX, y: event.clientY };

      smoothSpeed.current += (dist - smoothSpeed.current) * 0.3;

      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        const baseSize = 16;
        const maxExtra = 60;
        const logSize = baseSize + maxExtra * (Math.log1p(smoothSpeed.current * 0.5) / Math.log1p(50));
        setSize(Math.min(logSize, baseSize + maxExtra));
        setPos({ x: event.clientX, y: event.clientY });
      });
    };

    const decay = () => {
      smoothSpeed.current *= 0.92;
      if (smoothSpeed.current > 0.3) {
        const baseSize = 16;
        const maxExtra = 60;
        const logSize = baseSize + maxExtra * (Math.log1p(smoothSpeed.current * 0.5) / Math.log1p(50));
        setSize(Math.min(logSize, baseSize + maxExtra));
      } else {
        setSize(16);
      }
      requestAnimationFrame(decay);
    };
    const decayFrame = requestAnimationFrame(decay);

    window.addEventListener('mousemove', onMove);
    return () => {
      media.removeEventListener('change', update);
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId.current);
      cancelAnimationFrame(decayFrame);
    };
  }, []);

  if (!enabled) return null;

  const half = size / 2;

  return (
    <div className="pointer-events-none fixed inset-0 z-[70] hidden md:block" aria-hidden="true">
      <motion.div
        className="absolute rounded-full border border-[var(--color-accent-primary)]/55 bg-white/15 backdrop-blur-[2px]"
        animate={{ x: pos.x - half, y: pos.y - half, width: size, height: size }}
        transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.35 }}
      />
    </div>
  );
}

const navLabelKeys: Record<string, TranslationKey> = {
  'page-00': 'navHome',
  'page-01': 'navAbout',
  'page-03': 'navUISystems',
  'page-03a': 'navUICase',
  'page-housing': 'navHousing',
  'page-04': 'navInteractive',
  'page-04a': 'navIntProject',
  'page-05': 'navResearch',
  'page-06': 'navSpatial',
  'page-06a': 'navStudy',
  'page-08': 'navResume',
};

function App() {
  const t = useT();
  const { lang, setLang } = useLang();
  const [activeSection, setActiveSection] = useState<SectionId>('page-00');

  const [uiOpen, setUiOpen] = useState(uiCaseStudies[0].id);
  const [uiDeepOpen, setUiDeepOpen] = useState<string | null>(null);
  const [interactiveOpen, setInteractiveOpen] = useState(interactiveProjects[0].id);
  const [logOpen, setLogOpen] = useState(researchEntries[0].id);
  const [aboutFoldOpen, setAboutFoldOpen] = useState<'education' | 'paper' | 'other' | null>(null);
  const [focusOpen, setFocusOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [spatialOpen, setSpatialOpen] = useState<'installation' | 'coding'>('installation');
  const WORK_DETAIL_IDS = ['page-03', 'page-03a', 'page-housing', 'page-04', 'page-04a', 'page-05', 'page-06', 'page-06a'] as const;
  const [workDetailId, setWorkDetailId] = useState<string | null>(() => {
    const id = window.location.hash.slice(1);
    return WORK_DETAIL_IDS.includes(id as (typeof WORK_DETAIL_IDS)[number]) ? id : null;
  });
  const [isAboutView, setIsAboutView] = useState(() => window.location.hash === '#page-01');
  const [isResumeView, setIsResumeView] = useState(() => window.location.hash === '#page-08');
  const [bottomNavOpen, setBottomNavOpen] = useState(false);
  const bottomNavTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const sectionIds: SectionId[] = useMemo(() => sectionMeta.map((item) => item.id), []);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash;
      const id = hash.slice(1) || 'page-00';
      const onAbout = hash === '#page-01';
      const onResume = hash === '#page-08';
      const onWorkDetail = WORK_DETAIL_IDS.includes(id as (typeof WORK_DETAIL_IDS)[number]);
      if (id === 'page-02-ui' || id === 'page-02-interactive' || id === 'page-02-research') {
        setActiveSection('page-00');
        setIsAboutView(false);
        setIsResumeView(false);
        setWorkDetailId(null);
        window.history.replaceState(null, '', '#page-00');
        setTimeout(() => {
          const el = document.getElementById('page-00');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
        return;
      }
      setIsAboutView(onAbout);
      setIsResumeView(onResume);
      setWorkDetailId(onWorkDetail ? id : null);
      setActiveSection(
        onAbout ? 'page-01' : onResume ? 'page-08' : id as SectionId
      );

      if (onAbout || onResume || onWorkDetail) {
        setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
      } else if (id && id !== 'page-00') {
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    };
    onHashChange();
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);
  const { scrollYProgress } = useScroll();

  // Housing Timeline Horizontal Scroll
  const housingTimelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: housingTimelineScrollY } = useScroll({
    target: housingTimelineRef,
    offset: ["start start", "end end"]
  });
  const housingTimelineX = useTransform(housingTimelineScrollY, [0, 1], ["0%", "-75%"]);
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 24 });
  const footerOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.25, 0.5, 0.7], { clamp: true });
  const footerPathReveal = useTransform(smoothProgress, [0, 0.2, 0.85, 1], [1, 0.85, 0.15, 0], { clamp: true });
  const pathLength = 140;
  const footerDashOffset = useTransform(footerPathReveal, (v) => v * pathLength);

  // Housing Journey chart — scroll-driven compression
  const journeyChartRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: journeyChartScroll } = useScroll({
    target: journeyChartRef,
    offset: ['start end', 'end start']
  });
  const [journeyCompress, setJourneyCompress] = useState(0);
  useMotionValueEvent(journeyChartScroll, 'change', (v) => {
    const mapped = Math.min(1, Math.max(0, (v - 0.3) / 0.4));
    setJourneyCompress(mapped);
  });

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
  }, [sectionIds]);

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
    <div className="min-h-screen selection:bg-black selection:text-white pb-16 md:pb-[var(--space-xxxl)]">
      <a href="#main-content" className="skip-link">
        {t('skipToMain')}
      </a>
      <PrecisionCursor />

      <motion.div
        className="fixed right-2 md:right-4 top-0 h-full w-[2px] bg-black/10 origin-top z-[60]"
        style={{ scaleY: smoothProgress }}
      />

      <nav aria-label="Section navigation" className="section-nav surface-glass">
        <div className="section-nav-links">
          {sectionMeta.map((item) => {
            const isNested = ['page-03', 'page-03a', 'page-housing', 'page-04', 'page-04a', 'page-05', 'page-06', 'page-06a'].includes(item.id);
            if (isNested) return null;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`section-nav-item ${activeSection === item.id ? 'is-active' : ''}`}
                aria-current={activeSection === item.id ? 'location' : undefined}
                style={{ whiteSpace: 'nowrap' }}
              >
                {String(t(navLabelKeys[item.id]))}
              </a>
            );
          })}
        </div>
        <button
          type="button"
          className="section-nav-lang"
          onClick={() => setLang(lang === 'en' ? 'zh' : 'en')}
          aria-label={lang === 'en' ? 'Switch to Chinese' : 'Switch to English'}
        >
          {lang === 'en' ? '中' : 'EN'}
        </button>
      </nav>

      {/* Bottom work detail nav — appears when hovering near bottom */}
      {workDetailId && (
        <div
          className="work-detail-zone"
          onMouseEnter={() => {
            if (bottomNavTimer.current) clearTimeout(bottomNavTimer.current);
            setBottomNavOpen(true);
          }}
          onMouseLeave={() => {
            bottomNavTimer.current = setTimeout(() => setBottomNavOpen(false), 300);
          }}
        >
          <AnimatePresence>
            {bottomNavOpen && (
              <motion.nav
                aria-label="Work detail navigation"
                className="work-detail-nav-animated surface-glass"
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 16, opacity: 0 }}
                transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {(() => {
                  let idx = 0;
                  return sectionMeta.map((item) => {
                    const isNested = ['page-03', 'page-03a', 'page-housing', 'page-04', 'page-04a', 'page-05', 'page-06', 'page-06a'].includes(item.id);
                    if (!isNested) return null;
                    const i = idx++;
                    return (
                      <motion.a
                        key={item.id}
                        href={`#${item.id}`}
                        className={`section-nav-item ${activeSection === item.id ? 'is-active' : ''}`}
                        aria-current={activeSection === item.id ? 'location' : undefined}
                        style={{ whiteSpace: 'nowrap' }}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03, duration: 0.22, ease: 'easeOut' }}
                      >
                        {String(t(navLabelKeys[item.id]))}
                      </motion.a>
                    );
                  });
                })()}
              </motion.nav>
            )}
          </AnimatePresence>
        </div>
      )}

      <main id="main-content">
        {isAboutView ? (
          <section id="page-01" aria-label="About Node" className="system-shell section-shell py-[var(--space-xxxl)]">
            <div className="flex flex-col md:flex-row gap-[var(--space-lg)] items-start">
              <div className="flex-1 min-w-0">
                <h2 className="type-h1 mb-[var(--space-sm)]">{t('aboutTitle')}</h2>
                <motion.p
                  className="max-w-xl"
                  style={{
                    borderTop: '1px solid var(--color-accent-primary)',
                    borderBottom: '1px solid var(--color-accent-primary)',
                    fontStyle: 'italic',
                    letterSpacing: '0.01em',
                    color: 'var(--color-text)',
                  }}
                  initial={false}
                  animate={{
                    fontSize: (focusOpen || toolsOpen) ? 'clamp(1rem, 1.4vw, 1.15rem)' : 'clamp(1.3rem, 2.2vw, 1.7rem)',
                    lineHeight: (focusOpen || toolsOpen) ? '1.6' : '1.8',
                    marginTop: (focusOpen || toolsOpen) ? '16px' : '48px',
                    marginBottom: (focusOpen || toolsOpen) ? '16px' : '48px',
                    paddingTop: (focusOpen || toolsOpen) ? '12px' : '24px',
                    paddingBottom: (focusOpen || toolsOpen) ? '12px' : '24px',
                  }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <span style={{ color: 'var(--color-text-muted)' }}>{String(t('aboutDescPrefix'))}</span>{' '}
                  <span style={{ textDecoration: 'underline', textDecorationThickness: '1px', textUnderlineOffset: '3px' }}>{String(t('aboutDescHighlight'))}</span>
                </motion.p>
                <button
                  type="button"
                  className="type-caption mt-[var(--space-lg)] mb-[var(--space-sm)] cursor-pointer bg-transparent border-0 p-0 text-left"
                  onClick={() => setFocusOpen((v) => !v)}
                >
                  {t('focus')}{focusOpen ? ' −' : ' +'}
                </button>
                <motion.ul
                  className="space-y-[var(--space-xs)] mb-[var(--space-md)] overflow-hidden"
                  initial={false}
                  animate={{ height: focusOpen ? 'auto' : 0, opacity: focusOpen ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {(t('focusItems') as readonly string[]).map((item) => (
                    <li key={item} className="type-body">
                      {item}
                    </li>
                  ))}
                </motion.ul>
                <button
                  type="button"
                  className="type-caption mb-[var(--space-sm)] cursor-pointer bg-transparent border-0 p-0 text-left"
                  onClick={() => setToolsOpen((v) => !v)}
                >
                  {t('tools')}{toolsOpen ? ' −' : ' +'}
                </button>
                <motion.div
                  className="flex flex-wrap gap-[var(--space-xs)] mb-[var(--space-md)] overflow-hidden"
                  initial={false}
                  animate={{ height: toolsOpen ? 'auto' : 0, opacity: toolsOpen ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {about.tools.map((tool) => (
                    <span key={tool} className="tag-chip">
                      {tool}
                    </span>
                  ))}
                </motion.div>
              </div>
              <div className="w-4/5 mx-auto md:mx-0 md:w-80 lg:w-88 shrink-0">
                <img
                  src="./about-photo.jpg"
                  alt="Portrait of Ryan Yu"
                  className="w-full rounded-xl object-cover"
                  style={{ aspectRatio: '3 / 4' }}
                />
              </div>
            </div>
            <div className="flex flex-col md:flex-row gap-[var(--space-xxl)] items-start my-[var(--space-xxxl)] py-[var(--space-xxl)] border-t border-b border-black/8">
              <div className="flex-1 min-w-0">
                <p className="type-body mb-[var(--space-xs)]">{t('email')}</p>
                <p className="type-body text-[var(--color-text-muted)] mb-[var(--space-lg)]">{t('availability')}</p>
                <div className="flex flex-wrap gap-[var(--space-sm)]">
                  {about.links.map((link) => (
                    <a key={link.label} href={link.href} className="spine-open">
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
              <form
                className="flex-1 min-w-0 grid grid-cols-1 gap-[var(--space-sm)]"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const name = (form.elements.namedItem('contact-name') as HTMLInputElement).value;
                  const email = (form.elements.namedItem('contact-email') as HTMLInputElement).value;
                  const message = (form.elements.namedItem('contact-message') as HTMLInputElement).value;
                  if (name && email && message) {
                    window.location.href = `mailto:hryanyu@gmail.com?subject=Message from ${encodeURIComponent(name)}&body=${encodeURIComponent(message)}%0A%0AFrom: ${encodeURIComponent(name)} (${encodeURIComponent(email)})`;
                  }
                }}
              >
                <input name="contact-name" className="field" placeholder={String(t('placeholderName'))} aria-label={String(t('placeholderName'))} required />
                <input name="contact-email" type="email" className="field" placeholder={String(t('placeholderEmail'))} aria-label={String(t('placeholderEmail'))} required />
                <input name="contact-message" className="field" placeholder={String(t('placeholderMessage'))} aria-label={String(t('placeholderMessage'))} required />
                <button type="submit" className="spine-open" style={{ justifySelf: 'start' }}>SEND</button>
              </form>
            </div>
            <div className="space-y-[var(--space-sm)]">
              <button type="button" className="spine-head home-spine-link" onClick={() => setAboutFoldOpen((v) => (v === 'education' ? null : 'education'))} aria-expanded={aboutFoldOpen === 'education'}>
                <span className="type-caption">{t('optionalFold')}</span>
                <span className="text-[1rem] font-medium text-[var(--color-text)]">{t('educationFold')}</span>
                <span className="type-caption">{aboutFoldOpen === 'education' ? t('fold') : t('unfold')}</span>
              </button>
              {aboutFoldOpen === 'education' && (
                <div className="spine-body">
                  <p className="type-body">{about.fold.education}</p>
                  {about.fold.exhibitions && <p className="type-body mt-[var(--space-sm)]">{about.fold.exhibitions}</p>}
                </div>
              )}
              <button type="button" className="spine-head home-spine-link" onClick={() => setAboutFoldOpen((v) => (v === 'paper' ? null : 'paper'))} aria-expanded={aboutFoldOpen === 'paper'}>
                <span className="type-caption">{t('optionalFold')}</span>
                <span className="text-[1rem] font-medium text-[var(--color-text)]">{t('paperFold')}</span>
                <span className="type-caption">{aboutFoldOpen === 'paper' ? t('fold') : t('unfold')}</span>
              </button>
              {aboutFoldOpen === 'paper' && (
                <div className="spine-body">
                  <p className="type-body">{about.fold.paperReport}</p>
                </div>
              )}
              <button type="button" className="spine-head home-spine-link" onClick={() => setAboutFoldOpen((v) => (v === 'other' ? null : 'other'))} aria-expanded={aboutFoldOpen === 'other'}>
                <span className="type-caption">{t('optionalFold')}</span>
                <span className="text-[1rem] font-medium text-[var(--color-text)]">{t('otherFold')}</span>
                <span className="type-caption">{aboutFoldOpen === 'other' ? t('fold') : t('unfold')}</span>
              </button>
              {aboutFoldOpen === 'other' && (
                <div className="spine-body">
                  <p className="type-body">{about.fold.otherWorks}</p>
                </div>
              )}
            </div>
          </section>
        ) : isResumeView ? (
          <section id="page-08" aria-label="Resume Page" className="system-shell section-shell py-[var(--space-xxxl)]">
            <a href="#page-00" className="type-caption mb-[var(--space-md)] inline-block">{t('back')}</a>
            <SectionIntro
              title={String(t('resumeTitle'))}
              purpose={String(t('resumePurpose'))}
            />
            <div className="spine-body">
              <div className="image-block h-72 mb-[var(--space-sm)]" />
              <div className="flex gap-[var(--space-sm)] mb-[var(--space-sm)]">
                <a href="#" className="spine-open">
                  {t('downloadResume')}
                </a>
                <a href="#page-01" className="spine-open">
                  {t('navAbout')}
                </a>
              </div>
              <div className="pt-[var(--space-md)] pb-[var(--space-md)]" aria-hidden="true" />
            </div>
          </section>
        ) : workDetailId ? (
          <section id={workDetailId} aria-label="Work detail" className="system-shell section-shell py-[var(--space-xxxl)]">
            <a href="#page-00" className="type-caption mb-[var(--space-md)] inline-block">{t('back')}</a>
            {workDetailId === 'page-03' && (
              <>
                <SectionIntro title={String(t('uiSystemsDetailTitle'))} purpose={String(t('uiSystemsDetailPurpose'))} />
                <p className="type-body mb-[var(--space-lg)] max-w-3xl">{t('uiSystemsDetailDesc')}</p>
                <ul className="space-y-[var(--space-sm)]">
                  {uiCaseStudies.map((project) => (
                    <li key={project.id} className="spine-block">
                      <button type="button" className="spine-head" onClick={() => setUiOpen(project.id)}>
                        <span className="type-caption">{t('uiProject')}</span>
                        <span className="text-[1rem] font-medium text-[var(--color-text)]">{project.title}</span>
                        <span className="type-caption">{uiOpen === project.id ? t('open') : t('preview')}</span>
                      </button>
                      {uiOpen === project.id && (
                        <div className="spine-body">
                          <div className="flex flex-wrap items-center gap-[var(--space-sm)] mb-[var(--space-sm)]">
                            <span className="type-caption">{project.role}</span>
                            <a className="spine-open" href={project.link}>{t('link')}</a>
                          </div>
                          <p className="type-body mb-[var(--space-sm)]">{project.problem}</p>
                          <h4 className="type-caption mb-[var(--space-xs)]">{t('constraints')}</h4>
                          <ul className="space-y-[var(--space-xs)] mb-[var(--space-sm)]">
                            {project.constraints.map((item) => <li key={item} className="type-body">{item}</li>)}
                          </ul>
                          <h4 className="type-caption mb-[var(--space-xs)]">{t('approach')}</h4>
                          <ul className="space-y-[var(--space-xs)] mb-[var(--space-sm)]">
                            {project.approach.map((item) => <li key={item} className="type-body">{item}</li>)}
                          </ul>
                          <button type="button" className="spine-open" onClick={() => setUiDeepOpen((v) => (v === project.id ? null : project.id))}>
                            {uiDeepOpen === project.id ? t('hideIterationNotes') : t('showIterationNotes')}
                          </button>
                          {uiDeepOpen === project.id && (
                            <ul className="space-y-[var(--space-xs)] mt-[var(--space-sm)]">
                              {project.iterations.map((item) => <li key={item} className="type-body">{item}</li>)}
                            </ul>
                          )}
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {workDetailId === 'page-03a' && (
              <>
                <SectionIntro title={String(t('uiCaseTitle'))} purpose={String(t('uiCasePurpose'))} />
                <div className="spine-body">
                  <h3 className="type-caption mb-[var(--space-xs)]">{t('overview')}</h3>
                  <p className="type-body mb-[var(--space-sm)]">{currentUi.problem}</p>
                  <h3 className="type-caption mb-[var(--space-xs)]">{t('roleScope')}</h3>
                  <p className="type-body mb-[var(--space-sm)]">{currentUi.role}</p>
                  <h3 className="type-caption mb-[var(--space-xs)]">{t('system')}</h3>
                  <ul className="space-y-[var(--space-xs)] mb-[var(--space-sm)]">{currentUi.constraints.map((item) => <li key={item} className="type-body">{item}</li>)}</ul>
                  <h3 className="type-caption mb-[var(--space-xs)]">{t('process')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-sm)] mb-[var(--space-sm)]">
                    {Array.from({ length: 3 }).map((_, idx) => (
                      <figure key={idx} className="image-placeholder">
                        <div className="image-block" />
                        <figcaption className="type-caption mt-1">{t('processFrame')} {idx + 1}</figcaption>
                      </figure>
                    ))}
                  </div>
                  <h3 className="type-caption mb-[var(--space-xs)]">{t('outcome')}</h3>
                  <a href={currentUi.link} className="spine-open">{t('demoPrototypeRepo')}</a>
                </div>
              </>
            )}
            {workDetailId === 'page-housing' && (
              <>
                {/* Hero */}
                <div className="flex flex-col md:flex-row gap-[var(--space-lg)] mb-[var(--space-xxxl)] items-start">
                  <div className="flex-1 min-w-0 pt-[var(--space-md)]">
                    <h1 className="type-h1">{String(t('housingHeroName'))}</h1>
                    <div className="flex gap-[var(--space-md)] mt-[var(--space-lg)]">
                      <span className="type-caption">{String(t('housingYear'))}</span>
                      <span className="type-caption">{String(t('housingRole'))}</span>
                    </div>
                  </div>
                  <div className="w-full md:w-[55%] shrink-0">
                    <img
                      src="./housing-hero.png"
                      alt="Housing Solutions hero"
                      className="w-full rounded-xl object-cover"
                      style={{ aspectRatio: '4 / 3' }}
                    />
                  </div>
                </div>

                {/* Overview */}
                <div className="flex flex-col md:flex-row gap-[var(--space-lg)] mt-[var(--space-xxxl)] mb-[var(--space-xxxl)] items-start py-[var(--space-xxl)] px-[var(--space-md)] border-t border-b border-black/8">
                  <h3 className="shrink-0 pt-[3px] text-[var(--color-text-muted)]" style={{ fontSize: 'clamp(1.05rem, 1.5vw, 1.25rem)', letterSpacing: '0.04em' }}>{String(t('housingOverviewLabel'))}</h3>
                  <p className="leading-relaxed max-w-2xl ml-auto" style={{ fontSize: 'clamp(1rem, 1.3vw, 1.15rem)' }}>{String(t('housingOverview'))}</p>
                </div>

                {/* Large scroll-reveal statement */}
                <motion.div
                  className="mb-[var(--space-xxxl)]"
                  initial={{ opacity: 0, y: 60 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-15% 0px' }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <p className="font-bold leading-[1.1] tracking-tight text-[var(--color-text)]" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>
                    How to
                  </p>
                  <p className="font-bold leading-[1.1] tracking-tight text-[var(--color-accent-primary)]" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>
                    Rent &amp; Save Rent
                  </p>
                  <p className="text-right mt-[var(--space-xs)]">
                    <span className="text-[var(--color-accent-secondary)] font-semibold tracking-wide" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)' }}>for Students</span>
                  </p>
                  <p className="font-bold leading-[1.1] tracking-tight text-[var(--color-text)] text-right mt-[var(--space-xs)]" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>
                    in NYCity
                  </p>
                  <img
                    src="./housing-skyline.png"
                    alt="NYC Skyline overview"
                    className="w-full rounded-xl object-cover mt-[var(--space-lg)]"
                    style={{ maxHeight: 'clamp(200px, 35vw, 420px)' }}
                  />
                  <div className="mt-[calc(var(--space-xxxl)*2)] mb-[calc(var(--space-xxxl)*2)]">
                    <div className="flex flex-col items-center gap-[var(--space-sm)]">
                      <h3 className="type-caption m-0 w-full text-left" style={{ maxWidth: 'min(100%, 32rem)' }}>{String(t('housingVideoLabel'))}</h3>
                      <div
                        className="housing-video-frame relative overflow-hidden bg-black"
                        style={{ width: 'min(100%, 32rem)', aspectRatio: '2002 / 1346' }}
                      >
                        <video
                          className="absolute inset-0 box-border object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                          preload="auto"
                          controls={false}
                          disablePictureInPicture
                          tabIndex={-1}
                          src={publicUrl('housing-walkthrough.mp4')}
                          aria-label={String(t('housingVideoEmbedTitle'))}
                        >
                          <source src={publicUrl('housing-walkthrough.mp4')} type="video/mp4" />
                        </video>
                      </div>
                      <div className="flex items-center justify-between w-full" style={{ maxWidth: 'min(100%, 32rem)' }}>
                        <a
                          className="spine-open"
                          href="https://youtu.be/lzFJf66C4xs"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {String(t('housingVideoOpenYouTube'))}
                        </a>
                        <span className="type-caption m-0">0:55</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* ── User Interviews ── */}
                <motion.section
                  className="mb-[var(--space-xxl)]"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <h3 className="type-caption text-[1.1rem] tracking-wider mb-[var(--space-md)]">{String(t('housingInterviewsLabel'))}</h3>
                  <p className="text-[1.1rem] text-[var(--color-text-muted)] mb-[var(--space-lg)]">{String(t('housingInterviewsMethod'))}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-md)] mb-[var(--space-xl)]">
                    {(t('housingTakeawayItems') as readonly string[]).map((item, idx) => (
                      <div key={idx} className="border-t border-black/10 pt-[var(--space-sm)]">
                        <span className="type-caption text-[var(--color-text-muted)] block mb-[var(--space-xs)]">0{idx + 1}</span>
                        <p className="text-[1.1rem] leading-snug">{item}</p>
                      </div>
                    ))}
                  </div>

                  {/* Persona */}
                  <p className="font-bold text-[1.5rem] mb-[var(--space-xxs)]">{String(t('housingPersonaName'))}</p>
                  <p className="text-[1.1rem] text-[var(--color-text-muted)] mb-[var(--space-sm)]">{String(t('housingPersonaRole'))}</p>
                  <blockquote className="border-l-4 border-[var(--color-accent-primary)] pl-[var(--space-md)] mb-[var(--space-lg)]">
                    <p className="text-[1.2rem] italic leading-relaxed">&ldquo;{String(t('housingPersonaQuote'))}&rdquo;</p>
                  </blockquote>
                  <div className="flex flex-col sm:flex-row gap-[var(--space-lg)] border-t border-black/10 pt-[var(--space-md)]">
                    <div className="flex-1">
                      <h4 className="type-caption text-[1rem] mb-[var(--space-sm)]">Pain Points</h4>
                      <ul className="space-y-[var(--space-sm)]">
                        {(t('housingPersonaPainItems') as readonly string[]).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-[var(--space-xs)] text-[1.05rem] text-[var(--color-text-muted)]">
                            <span className="text-[var(--color-accent-primary)] mt-[2px]">×</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex-1">
                      <h4 className="type-caption text-[1rem] mb-[var(--space-sm)]">Behaviors</h4>
                      <ul className="space-y-[var(--space-sm)]">
                        {(t('housingPersonaBehaviorItems') as readonly string[]).map((item, idx) => (
                          <li key={idx} className="flex items-start gap-[var(--space-xs)] text-[1.05rem] text-[var(--color-text-muted)]">
                            <span className="text-[var(--color-accent-primary)] mt-[2px]">→</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.section>

                {/* ── Typical Housing Journey (scroll-compressed) ── */}
                <div ref={journeyChartRef} className="my-[var(--space-xxl)] pt-[var(--space-lg)]">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-10% 0px' }}
                    transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <h3 className="type-caption text-[1.1rem] tracking-wider mb-[var(--space-md)]">TYPICAL HOUSING JOURNEY</h3>
                    <div className="overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
                      {(() => {
                        const weeks = ['8w', '7w', '6w', '5w', '4w', '3w', '2w', '1w', '0', '+1', '+2', '+3', '+4'];
                        const phases: { label: string; active: number[] }[] = [
                          { label: 'Prep',       active: [0, 1, 2] },
                          { label: 'Search',     active: [2, 3, 4] },
                          { label: 'Shortlist',  active: [4, 5] },
                          { label: 'Tours',      active: [5, 6] },
                          { label: 'Screening',  active: [5, 6, 7] },
                          { label: 'Lease',      active: [6, 7] },
                          { label: 'Move-in',    active: [7, 8] },
                          { label: 'Setup',      active: [8, 9, 10, 11] },
                          { label: 'Transition', active: [11, 12] },
                        ];
                        const colW = 28;
                        const rowH = 24;
                        const labelW = 80;
                        const headerH = 20;
                        const c = journeyCompress;
                        const getX = (col: number) => {
                          if (col <= 7) return labelW + col * colW * (1 - 0.625 * c) + colW / 2;
                          return labelW + colW * (col - 5 * c) + colW / 2;
                        };
                        const w = labelW + weeks.length * colW + 10;
                        const h = headerH + phases.length * rowH + 8;
                        return (
                          <svg viewBox={`0 0 ${w} ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full min-w-[480px]" aria-label="Typical Housing Journey — calendar view">
                            {weeks.map((wk, i) => {
                              const fade = i > 0 && i < 7 ? 1 - c : 1;
                              return (
                                <text key={wk} x={getX(i)} y={12} textAnchor="middle" fill="currentColor" fontSize="7" opacity={0.35 * fade} dominantBaseline="central">{wk}</text>
                              );
                            })}
                            <line x1={getX(8)} y1={headerH - 2} x2={getX(8)} y2={h - 4} stroke="var(--color-accent-primary)" strokeWidth="1" opacity="0.25" strokeDasharray="3 3" />
                            {phases.map((phase, row) => {
                              const y = headerH + row * rowH + rowH / 2;
                              return (
                                <g key={phase.label}>
                                  <text x={labelW - 6} y={y + 1} textAnchor="end" fill="currentColor" fontSize="9" fontWeight="500" dominantBaseline="central">{phase.label}</text>
                                  {weeks.map((_, col) => {
                                    const cx = getX(col);
                                    const isActive = phase.active.includes(col);
                                    return (
                                      <circle key={col} cx={cx} cy={y} r={isActive ? 5 : 2.5} fill={isActive ? 'var(--color-accent-primary)' : 'currentColor'} opacity={isActive ? 1 : 0.1} />
                                    );
                                  })}
                                </g>
                              );
                            })}
                            {c > 0.2 && (
                              <text x={(getX(0) + getX(7)) / 2} y={h + 2} textAnchor="middle" fill="var(--color-accent-primary)" fontSize="8" opacity={Math.min(1, (c - 0.2) * 1.5)} fontWeight="500">↑ compressed with app</text>
                            )}
                          </svg>
                        );
                      })()}
                    </div>
                  </motion.div>
                </div>

                {/* ── Competitive Analysis ── */}
                <motion.section
                  className="mb-[var(--space-xxl)]"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <h3 className="type-caption text-[1.1rem] tracking-wider mb-[var(--space-md)]">{String(t('housingCompetitiveLabel'))}</h3>
                  <p className="text-[1.2rem] mb-[var(--space-lg)] max-w-4xl leading-relaxed">{String(t('housingCompetitiveDesc'))}</p>
                  
                  <div className="border border-black/10 rounded-xl overflow-hidden max-w-4xl">
                    <div className="bg-black/5 px-[var(--space-md)] py-[var(--space-sm)] border-b border-black/10">
                      <p className="type-caption text-[var(--color-text-muted)]">Industry Gaps</p>
                    </div>
                    <div className="divide-y divide-black/10">
                      {(t('housingGapItems') as readonly string[]).map((item, idx) => (
                        <div key={idx} className="px-[var(--space-md)] py-[var(--space-sm)] flex items-start gap-[var(--space-md)]">
                          <span className="text-[var(--color-text-muted)] mt-[2px]">✕</span>
                          <p className="text-[1.1rem] leading-snug">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.section>

                <div className="border-t border-black/8 my-[var(--space-xxl)]" />

                {/* ── Iterative Prototyping ── */}
                <motion.section
                  className="mb-[var(--space-xxl)]"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <h3 className="type-caption text-[1.1rem] tracking-wider mb-[var(--space-md)]">{String(t('housingPrototypingLabel'))}</h3>

                  <blockquote className="border-l-4 border-[var(--color-accent-primary)] pl-[var(--space-md)] mb-[var(--space-xl)] max-w-4xl">
                    <p className="text-[1.3rem] italic leading-relaxed">&ldquo;{String(t('housingPivotInsight'))}&rdquo;</p>
                  </blockquote>

                  <h4 className="type-caption text-[1rem] mb-[var(--space-md)]">{String(t('housingTimelineLabel'))}</h4>
                  <img
                    src={publicUrl('housing-slide-timeline.jpg')}
                    alt="Account and overall timeline view"
                    className="w-full rounded-xl object-cover mb-[var(--space-lg)] shadow-lg"
                  />
                </motion.section>

                <div ref={housingTimelineRef} className="relative h-[400vh] my-[var(--space-xxxl)] w-screen" style={{ marginLeft: 'calc(50% - 50vw)' }}>
                  <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-[var(--color-bg)] z-10">
                    <motion.div style={{ x: housingTimelineX }} className="flex w-[400vw] h-full">
                      {[
                        { label: 'housingExploreLabel' as const, desc: 'housingExploreDesc' as const, img: 'housing-slide-explore.jpg', alt: 'Explore section' },
                        { label: 'housingNewStartLabel' as const, desc: 'housingNewStartDesc' as const, img: 'housing-slide-newstart.jpg', alt: 'A New Start' },
                        { label: 'housingSubletLabel' as const, desc: 'housingSubletDesc' as const, img: 'housing-slide-sublet.jpg', alt: 'Break sublet' },
                        { label: 'housingMoveinLabel' as const, desc: 'housingMoveinDesc' as const, img: 'housing-slide-movein.jpg', alt: 'Move-in' },
                      ].map(({ label, desc, img, alt }) => (
                        <div key={label} className="w-screen h-full flex flex-col justify-center items-center px-[var(--space-xl)] py-[var(--space-xxxl)]">
                          <div className="max-w-5xl w-full">
                            <img src={publicUrl(img)} alt={alt} className="w-full rounded-2xl shadow-2xl object-cover mb-[var(--space-lg)]" style={{ maxHeight: '70vh' }} />
                            <div className="max-w-3xl">
                              <h4 className="type-caption text-[1.5rem] mb-[var(--space-xs)]">{String(t(label))}</h4>
                              <p className="type-body text-[1.2rem] text-[var(--color-text-muted)] leading-relaxed">{String(t(desc))}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                </div>

                {/* Reflection */}
                <motion.section
                  className="mb-[var(--space-xxl)]"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <h3 className="type-caption text-[1.1rem] tracking-wider mb-[var(--space-sm)]">{String(t('housingReflectionLabel'))}</h3>
                  <p className="text-[1.2rem] max-w-4xl leading-relaxed">{String(t('housingReflectionDesc'))}</p>
                </motion.section>

                <div className="border-t border-black/8 my-[var(--space-xxl)]" />

                {/* Credits */}
                <section className="mb-[var(--space-xxl)]">
                  <h3 className="type-caption mb-[var(--space-sm)]">{String(t('housingCreditsLabel'))}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--space-md)]">
                    <div>
                      <p className="type-caption mb-[var(--space-xs)]">{String(t('housingCreditsTeam'))}</p>
                      <p className="type-body">{housingProject.credits.team.join(', ')}</p>
                    </div>
                    <div>
                      <p className="type-caption mb-[var(--space-xs)]">{String(t('housingCreditsRole'))}</p>
                      <p className="type-body">{housingProject.credits.role}</p>
                    </div>
                    <div>
                      <p className="type-caption mb-[var(--space-xs)]">{String(t('housingCreditsYear'))}</p>
                      <p className="type-body">{housingProject.credits.year}</p>
                    </div>
                    <div>
                      <p className="type-caption mb-[var(--space-xs)]">{String(t('housingCreditsTools'))}</p>
                      <p className="type-body">{housingProject.credits.tools.join(', ')}</p>
                    </div>
                  </div>
                </section>
              </>
            )}
            {workDetailId === 'page-04' && (
              <>
                <SectionIntro title={String(t('interactiveDetailTitle'))} purpose={String(t('interactiveDetailPurpose'))} />
                <SpineAccordion t={t} title={String(t('chapterBrowserLab'))} open={currentInteractive.chapter === 'Browser Lab'} onToggle={() => { const m = interactiveProjects.find((p) => p.chapter === 'Browser Lab'); if (m) setInteractiveOpen(m.id); }}>
                  {interactiveProjects.filter((p) => p.chapter === 'Browser Lab').map((project) => (
                    <button key={project.id} type="button" className="spine-head mt-[var(--space-xs)]" onClick={() => setInteractiveOpen(project.id)}>
                      <span className="type-caption">{t('project')}</span>
                      <span className="text-[1rem] font-medium text-[var(--color-text)]">{project.title}</span>
                      <span className="type-caption">{t('open')}</span>
                    </button>
                  ))}
                </SpineAccordion>
                <SpineAccordion t={t} title={String(t('chapterUnityAR'))} open={currentInteractive.chapter === 'Unity / AR'} onToggle={() => { const m = interactiveProjects.find((p) => p.chapter === 'Unity / AR'); if (m) setInteractiveOpen(m.id); }}>
                  {interactiveProjects.filter((p) => p.chapter === 'Unity / AR').map((project) => (
                    <button key={project.id} type="button" className="spine-head mt-[var(--space-xs)]" onClick={() => setInteractiveOpen(project.id)}>
                      <span className="type-caption">{t('project')}</span>
                      <span className="text-[1rem] font-medium text-[var(--color-text)]">{project.title}</span>
                      <span className="type-caption">{t('open')}</span>
                    </button>
                  ))}
                </SpineAccordion>
                <div className="spine-body mt-[var(--space-sm)]">
                  <h3 className="type-caption mb-[var(--space-xs)]">{t('whatItTests')}</h3>
                  <p className="type-body mb-[var(--space-sm)]">{currentInteractive.tests}</p>
                  <h3 className="type-caption mb-[var(--space-xs)]">{t('inputsOutputs')}</h3>
                  <ul className="space-y-[var(--space-xs)] mb-[var(--space-sm)]">{currentInteractive.inputsOutputs.map((item) => <li key={item} className="type-body">{item}</li>)}</ul>
                  <h3 className="type-caption mb-[var(--space-xs)]">{t('interactionModel')}</h3>
                  <p className="type-body mb-[var(--space-sm)]">{currentInteractive.interaction}</p>
                  <h3 className="type-caption mb-[var(--space-xs)]">{t('buildNotes')}</h3>
                  <ul className="space-y-[var(--space-xs)]">{currentInteractive.buildNotes.map((item) => <li key={item} className="type-body">{item}</li>)}</ul>
                </div>
              </>
            )}
            {workDetailId === 'page-04a' && (
              <>
                <SectionIntro title={String(t('interactiveProjectTitle'))} purpose={String(t('interactiveProjectPurpose'))} />
                <div className="spine-body">
                  <h3 className="type-caption mb-[var(--space-xs)]">{t('purpose')}</h3>
                  <p className="type-body mb-[var(--space-sm)]">{currentInteractive.purpose}</p>
                  <h3 className="type-caption mb-[var(--space-xs)]">{t('interaction')}</h3>
                  <p className="type-body mb-[var(--space-sm)]">{currentInteractive.interaction}</p>
                  <h3 className="type-caption mb-[var(--space-xs)]">{t('implementation')}</h3>
                  <ul className="space-y-[var(--space-xs)] mb-[var(--space-sm)]">{currentInteractive.implementation.map((item) => <li key={item} className="type-body">{item}</li>)}</ul>
                  <h3 className="type-caption mb-[var(--space-xs)]">{t('evidence')}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-sm)] mb-[var(--space-sm)]">
                    {Array.from({ length: 2 }).map((_, idx) => (
                      <figure key={idx} className="image-placeholder">
                        <div className="image-block" />
                        <figcaption className="type-caption mt-1">{t('evidenceFrame')} {idx + 1}</figcaption>
                      </figure>
                    ))}
                  </div>
                  <div className="flex gap-[var(--space-sm)]">
                    <a href={currentInteractive.links.demo} className="spine-open">{t('demo')}</a>
                    <a href={currentInteractive.links.repo} className="spine-open">{t('repo')}</a>
                  </div>
                </div>
              </>
            )}
            {workDetailId === 'page-05' && (
              <>
                <SectionIntro title={String(t('researchTitle'))} purpose={String(t('researchPurpose'))} />
                <div className="flex flex-wrap gap-[var(--space-xs)] mb-[var(--space-md)]">
                  {['UI', 'Unity', 'AR', 'Hardware', 'Notes'].map((tag) => <span key={tag} className="tag-chip">{tag}</span>)}
                </div>
                <div className="rolling-tape" role="region" aria-label="Scrollable rolling tape">
                  <ul className="rolling-tape-track">
                    {researchEntries.map((entry) => (
                      <li key={entry.id} className={`tape-receipt ${logOpen === entry.id ? 'is-open' : ''}`}>
                        <button type="button" className="tape-head" onClick={() => setLogOpen(entry.id)}>
                          <span className="type-caption">{entry.date}</span>
                          <span className="text-[1rem] font-medium text-[var(--color-text)]">{entry.title}</span>
                          <span className="type-caption">{logOpen === entry.id ? t('open') : t('summary')}</span>
                        </button>
                        {logOpen === entry.id ? (
                          <div className="tape-body">
                            <p className="type-body mb-[var(--space-sm)]">{entry.summary}</p>
                            <div className="grid grid-cols-1 gap-[var(--space-sm)] mb-[var(--space-sm)]">{Array.from({ length: 3 }).map((_, idx) => <div key={idx} className="image-block h-28" />)}</div>
                            <ul className="space-y-[var(--space-xs)] mb-[var(--space-sm)]">{entry.body.map((line) => <li key={line} className="type-body">{line}</li>)}</ul>
                            <div className="flex flex-wrap gap-[var(--space-sm)]">{entry.links.map((link) => <a key={link.label} href={link.href} className="spine-open">{link.label}</a>)}</div>
                          </div>
                        ) : (
                          <div className="tape-body"><p className="type-body">{entry.summary}</p></div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="spine-body mt-[var(--space-md)]">
                  <h3 className="type-caption mb-[var(--space-xs)]">{t('logEntryDetail')}</h3>
                  <p className="type-body mb-[var(--space-sm)]">{currentLog.title}</p>
                  <p className="type-body">{t('logEntryDetailDesc')}</p>
                </div>
              </>
            )}
            {workDetailId === 'page-06' && (
              <>
                <SectionIntro title={String(t('spatialTitle'))} purpose={String(t('spatialPurpose'))} />
                <SpineAccordion t={t} title={String(t('installation'))} open={spatialOpen === 'installation'} onToggle={() => setSpatialOpen('installation')}>
                  <ul className="spine-list">
                    {spatialStudies.installation.map((item) => (
                      <li key={item.title} className="spine-row">
                        <div>
                          <p className="font-medium text-[var(--color-text)]">{item.title}</p>
                          <p className="type-body">{item.intent}</p>
                          <p className="type-caption">{item.medium} / {item.tools}</p>
                        </div>
                        <a href="#page-06a" className="spine-open">{t('open')}</a>
                      </li>
                    ))}
                  </ul>
                </SpineAccordion>
                <SpineAccordion t={t} title={String(t('creativeCoding'))} open={spatialOpen === 'coding'} onToggle={() => setSpatialOpen('coding')}>
                  <ul className="spine-list">
                    {spatialStudies.coding.map((item) => (
                      <li key={item.title} className="spine-row">
                        <div>
                          <p className="font-medium text-[var(--color-text)]">{item.title}</p>
                          <p className="type-body">{item.intent}</p>
                          <p className="type-caption">{item.medium} / {item.tools}</p>
                        </div>
                        <a href="#page-06a" className="spine-open">{t('open')}</a>
                      </li>
                    ))}
                  </ul>
                </SpineAccordion>
              </>
            )}
            {workDetailId === 'page-06a' && (
              <>
                <SectionIntro title={String(t('studyTitle'))} purpose={String(t('studyPurpose'))} />
                <div className="spine-body">
                  <h3 className="type-caption mb-[var(--space-xs)]">{t('intent')}</h3>
                  <p className="type-body mb-[var(--space-sm)]">{t('studyIntent')}</p>
                  <h3 className="type-caption mb-[var(--space-xs)]">{t('formMedium')}</h3>
                  <p className="type-body mb-[var(--space-sm)]">{t('studyMedium')}</p>
                  <h3 className="type-caption mb-[var(--space-xs)]">{t('experience')}</h3>
                  <p className="type-body mb-[var(--space-sm)]">{t('studyExperience')}</p>
                  <button type="button" className="spine-open">{t('buildTechFold')}</button>
                  <div className="mt-[var(--space-sm)]">
                    <a href="#" className="spine-open">{t('documentationLink')}</a>
                  </div>
                </div>
              </>
            )}
          </section>
        ) : (
          <>
        <SectionShell id="page-00" label="Home Entry Node">
          <div className="mb-[var(--space-md)]">
            <h2 className="text-[clamp(1rem,2.2vw,1.35rem)] font-medium text-[var(--color-text)] mb-[var(--space-xs)]">{String(t('homeTitle'))}</h2>
            <p className="type-caption text-[var(--color-text-muted)]">{String(t('homePurpose'))}</p>
          </div>
          <p className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight mb-[var(--space-sm)] break-words">{home.name}</p>
          <InteractiveThreeSpine 
            t={t}
            workIndex={workIndex}
          />
        </SectionShell>

          </>
        )}
      </main>

      <motion.footer
        className="system-shell site-footer py-[var(--space-xl)] flex items-center justify-between gap-4"
        aria-hidden
        style={{ opacity: footerOpacity }}
      >
        <svg className="footer-ornament-svg footer-ornament-svg--left" viewBox="0 0 140 50" fill="none" aria-hidden>
          <motion.path
            d="M 0 25 L 55 25 Q 90 25 105 42"
            stroke="var(--color-accent-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            pathLength={pathLength}
            strokeDasharray={pathLength}
            style={{ strokeDashoffset: footerDashOffset }}
          />
        </svg>
        <svg className="footer-ornament-svg footer-ornament-svg--right" viewBox="0 0 140 50" fill="none" aria-hidden>
          <motion.path
            d="M 140 25 L 85 25 Q 50 25 35 42"
            stroke="var(--color-accent-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            pathLength={pathLength}
            strokeDasharray={pathLength}
            style={{ strokeDashoffset: footerDashOffset }}
          />
        </svg>
      </motion.footer>
    </div>
  );
}

export default App;
