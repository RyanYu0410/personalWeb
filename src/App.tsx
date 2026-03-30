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
  const [bottomNavScrollTriggered, setBottomNavScrollTriggered] = useState(false);
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
  const { scrollYProgress, scrollY: globalScrollY } = useScroll();

  // Persona pill drag container + scroll-physics
  const personaCardRef = useRef<HTMLDivElement>(null);
  const scrollSmooth = useSpring(globalScrollY, { stiffness: 80, damping: 20 });
  const pillPhysicsY = useTransform(
    [globalScrollY, scrollSmooth],
    ([actual, smooth]: number[]) => (actual - smooth) * 0.25
  );

  // Housing Timeline Horizontal Scroll
  const housingTimelineRef = useRef<HTMLDivElement>(null);
  const housingTimelineSlides = [
    'housing-pdf-page-1.jpg',
    'housing-pdf-page-2.jpg',
    'housing-pdf-page-3.jpg',
    'housing-pdf-page-4.jpg',
    'housing-pdf-page-5.jpg',
    'housing-pdf-page-6.jpg',
  ];
  // +1 for the hero slide prepended before the PDF pages
  const housingTimelineCount = housingTimelineSlides.length + 1;
  const { scrollYProgress: housingTimelineScrollY } = useScroll({
    target: housingTimelineRef,
    offset: ["start start", "end end"]
  });
  // Snap horizontal movement so each stop is a full page.
  const housingTimelineStep = useTransform(housingTimelineScrollY, (v) => {
    const maxStep = housingTimelineCount - 1;
    return Math.max(0, Math.min(maxStep, Math.round(v * maxStep)));
  });
  const housingTimelineStepSmooth = useSpring(housingTimelineStep, {
    stiffness: 130,
    damping: 24,
    mass: 0.9,
  });
  const housingTimelineX = useTransform(
    housingTimelineStepSmooth,
    (step) => `-${(step / housingTimelineCount) * 100}%`
  );

  // Hero slide (slide 0) parallax / fade-out driven by timeline scroll
  const _heroStep0 = 1 / housingTimelineCount;
  const heroImgY   = useTransform(housingTimelineScrollY, [0, _heroStep0], ['0%',  '-6%']);
  const heroImgX   = useTransform(housingTimelineScrollY, [0, _heroStep0], ['0%', '-4%']);
  const heroImgOp  = useTransform(housingTimelineScrollY, [0, _heroStep0 * 0.6], [1, 0]);
  const heroTxtY   = useTransform(housingTimelineScrollY, [0, _heroStep0 * 0.5], ['0%', '-12%']);
  const heroTxtOp  = useTransform(housingTimelineScrollY, [0, _heroStep0 * 0.45], [1, 0]);
  const heroTagY   = useTransform(housingTimelineScrollY, [0, _heroStep0 * 0.35], ['0%', '-8%']);
  const heroTagOp  = useTransform(housingTimelineScrollY, [0, _heroStep0 * 0.3], [1, 0]);

  const smoothProgress = useSpring(scrollYProgress, { stiffness: 140, damping: 24 });
  const footerOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0.25, 0.5, 0.7], { clamp: true });

  // Show + enlarge the bottom nav only when fully scrolled to page bottom
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (v >= 0.995) {
      if (bottomNavTimer.current) clearTimeout(bottomNavTimer.current);
      setBottomNavOpen(true);
      setBottomNavScrollTriggered(true);
    } else {
      setBottomNavScrollTriggered(false);
      if (!bottomNavOpen) return;
      bottomNavTimer.current = setTimeout(() => setBottomNavOpen(false), 600);
    }
  });
  const footerPathReveal = useTransform(smoothProgress, [0, 0.2, 0.85, 1], [1, 0.85, 0.15, 0], { clamp: true });
  const pathLength = 140;
  const footerDashOffset = useTransform(footerPathReveal, (v) => v * pathLength);

  // Housing Journey compression — same sticky-scroll pattern as timeline.
  const journeyStickyRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: journeyScrollY } = useScroll({
    target: journeyStickyRef,
    offset: ['start start', 'end end'],
  });
  // Narrow active range (0.3→0.58) = fast snap in. Long hold after (0.58→1) = slow out feel.
  const journeyCompressMV = useTransform(journeyScrollY, [0, 0.3, 0.58, 1], [0, 0, 1, 1], { clamp: true });
  const journeyCompressSmooth = useSpring(journeyCompressMV, { stiffness: 260, damping: 38 });
  const [journeyCompress, setJourneyCompress] = useState(0);
  useMotionValueEvent(journeyCompressSmooth, 'change', (v) => setJourneyCompress(v));

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

      {/* Bottom work detail nav — hover near bottom OR scroll to page end */}
      {workDetailId && (
        <div
          className="work-detail-zone"
          onMouseEnter={() => {
            if (bottomNavTimer.current) clearTimeout(bottomNavTimer.current);
            setBottomNavOpen(true);
          }}
          onMouseLeave={() => {
            if (bottomNavScrollTriggered) return; // keep open while scroll-triggered
            bottomNavTimer.current = setTimeout(() => setBottomNavOpen(false), 300);
          }}
        >
          <AnimatePresence>
            {bottomNavOpen && (
              <motion.nav
                aria-label="Work detail navigation"
                className="work-detail-nav-animated surface-glass"
                initial={{ y: 20, opacity: 0, scale: 0.96 }}
                animate={{
                  y: 0,
                  opacity: 1,
                  scale: bottomNavScrollTriggered ? 1.06 : 1,
                  paddingTop: bottomNavScrollTriggered ? '10px' : undefined,
                  paddingBottom: bottomNavScrollTriggered ? '10px' : undefined,
                  paddingLeft: bottomNavScrollTriggered ? '18px' : undefined,
                  paddingRight: bottomNavScrollTriggered ? '18px' : undefined,
                }}
                exit={{ y: 12, opacity: 0, scale: 0.97 }}
                transition={{
                  duration: 0.9,
                  ease: [0.16, 1, 0.3, 1],
                  scale: { duration: 1.1, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.7, ease: 'easeOut' },
                }}
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
                        initial={{ opacity: 0, y: 6 }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        transition={{
                          delay: 0.12 + i * 0.04,
                          duration: 0.5,
                          ease: [0.16, 1, 0.3, 1],
                        }}
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
                  <p className="font-bold leading-[1.1] tracking-tight text-[var(--color-accent-primary)]" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', marginTop: '-13px', marginBottom: '-13px' }}>
                    Rent &amp; Save Rent
                  </p>
                  <p className="text-right mt-[var(--space-xs)]" style={{ marginTop: '-11px', marginBottom: '-18px' }}>
                    <span className="text-[var(--color-accent-secondary)] font-semibold tracking-wide" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)' }}>for Students</span>
                  </p>
                  <p className="font-bold leading-[1.1] tracking-tight text-[var(--color-text)] text-right mt-[var(--space-xs)]" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>
                    in NYCity
                  </p>
                  <img
                    src="./Housing_people.png"
                    alt="NYC student people overview"
                    className="w-full rounded-xl object-cover mt-[var(--space-lg)]"
                    style={{ maxHeight: 'clamp(200px, 35vw, 420px)', marginTop: '-34px' }}
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
                  className="mb-[var(--space-xxxl)]"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {/* Research Goals */}
                  <div className="mb-[var(--space-lg)]">
                    <h4 className="type-caption text-[1.1rem] tracking-wider mb-[var(--space-md)]">{String(t('housingResearchGoalsLabel'))}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-lg)]">
                      <div className="border border-black/10 rounded-2xl px-[var(--space-lg)] py-[var(--space-md)] bg-black/[0.03]">
                        <p className="type-caption text-[0.9rem] text-[var(--color-accent-primary)] mb-[var(--space-xs)]">Goal A</p>
                        <p className="text-[1.1rem] leading-relaxed">{String(t('housingResearchGoalA'))}</p>
                      </div>
                      <div className="border border-black/10 rounded-2xl px-[var(--space-lg)] py-[var(--space-md)] bg-black/[0.03]">
                        <p className="type-caption text-[0.9rem] text-[var(--color-accent-primary)] mb-[var(--space-xs)]">Goal B</p>
                        <p className="text-[1.1rem] leading-relaxed">{String(t('housingResearchGoalB'))}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stakeholder diagram */}
                  <h4 className="type-caption text-[1.1rem] tracking-wider mb-[var(--space-md)] mt-[var(--space-xxl)]">
                    STAKEHOLDERS
                  </h4>
                  <div className="mb-[var(--space-xl)]">
                    <svg viewBox="0 0 620 185" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" aria-label="Stakeholder diagram: Partners, Students, Landlords">
                      <defs>
                        <marker id="sh-arrow" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto-start-reverse">
                          <path d="M0,0.5 L0,5.5 L6.5,3 z" fill="currentColor" fillOpacity="0.45" />
                        </marker>
                        <marker id="sh-arrow-dash" markerWidth="7" markerHeight="7" refX="5" refY="3" orient="auto-start-reverse">
                          <path d="M0,0.5 L0,5.5 L6.5,3 z" fill="currentColor" fillOpacity="0.3" />
                        </marker>
                      </defs>

                      {/* Partners */}
                      <motion.g initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0, ease: [0.22, 1, 0.36, 1] }}>
                        <rect x="8" y="42" width="132" height="78" rx="14" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.18" />
                        <text x="74" y="72" textAnchor="middle" dominantBaseline="central" fill="currentColor" fontSize="13" fontWeight="600">Partners</text>
                        <text x="74" y="91" textAnchor="middle" dominantBaseline="central" fill="currentColor" fontSize="8.5" opacity="0.45">Universities</text>
                        <text x="74" y="106" textAnchor="middle" dominantBaseline="central" fill="currentColor" fontSize="8.5" opacity="0.45">NGOs</text>
                      </motion.g>

                      {/* Students — center, highlighted */}
                      <motion.g initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}>
                        <rect x="244" y="30" width="132" height="100" rx="14" fill="var(--color-accent-primary)" fillOpacity="0.08" stroke="var(--color-accent-primary)" strokeOpacity="0.35" />
                        <text x="310" y="62" textAnchor="middle" dominantBaseline="central" fill="currentColor" fontSize="13" fontWeight="700">Students</text>
                        <text x="310" y="80" textAnchor="middle" dominantBaseline="central" fill="currentColor" fontSize="8.5" opacity="0.45">International</text>
                        <text x="310" y="95" textAnchor="middle" dominantBaseline="central" fill="currentColor" fontSize="8.5" opacity="0.45">College Students</text>
                        <text x="310" y="110" textAnchor="middle" dominantBaseline="central" fill="currentColor" fontSize="8.5" opacity="0.45">NYC · 18–25</text>
                      </motion.g>

                      {/* Landlords */}
                      <motion.g initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: 0.56, ease: [0.22, 1, 0.36, 1] }}>
                        <rect x="480" y="42" width="132" height="78" rx="14" fill="currentColor" fillOpacity="0.04" stroke="currentColor" strokeOpacity="0.18" />
                        <text x="546" y="72" textAnchor="middle" dominantBaseline="central" fill="currentColor" fontSize="13" fontWeight="600">Landlords</text>
                        <text x="546" y="91" textAnchor="middle" dominantBaseline="central" fill="currentColor" fontSize="8.5" opacity="0.45">Private Owners</text>
                        <text x="546" y="106" textAnchor="middle" dominantBaseline="central" fill="currentColor" fontSize="8.5" opacity="0.45">Management Cos.</text>
                      </motion.g>

                      {/* Arrow: Partners → Students */}
                      <motion.path d="M140,81 L244,81" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" markerStart="url(#sh-arrow)" markerEnd="url(#sh-arrow)" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 0.95 }} />
                      <motion.text x="192" y="73" textAnchor="middle" fill="currentColor" fontSize="8" initial={{ opacity: 0 }} whileInView={{ opacity: 0.5 }} viewport={{ once: true }} transition={{ delay: 1.28, duration: 0.25 }}>Support</motion.text>

                      {/* Arrow: Students → Landlords */}
                      <motion.path d="M376,81 L480,81" stroke="currentColor" strokeWidth="1.2" strokeOpacity="0.4" markerStart="url(#sh-arrow)" markerEnd="url(#sh-arrow)" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.35, delay: 1.3 }} />
                      <motion.text x="428" y="73" textAnchor="middle" fill="currentColor" fontSize="8" initial={{ opacity: 0 }} whileInView={{ opacity: 0.5 }} viewport={{ once: true }} transition={{ delay: 1.62, duration: 0.25 }}>Housing &amp; Rent</motion.text>

                      {/* Arc: Partners → Landlords (dashed, below) */}
                      <motion.path d="M74,120 C74,162 546,162 546,120" stroke="currentColor" strokeWidth="1" strokeOpacity="0.28" strokeDasharray="4 3" fill="none" markerStart="url(#sh-arrow-dash)" markerEnd="url(#sh-arrow-dash)" initial={{ pathLength: 0, opacity: 0 }} whileInView={{ pathLength: 1, opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.65, delay: 1.7 }} />
                      <motion.text x="310" y="174" textAnchor="middle" fill="currentColor" fontSize="8" initial={{ opacity: 0 }} whileInView={{ opacity: 0.45 }} viewport={{ once: true }} transition={{ delay: 2.3, duration: 0.3 }}>Outreach &amp; Services</motion.text>
                    </svg>
                  </div>

                  <h3 className="type-caption text-[1.1rem] tracking-wider mb-[var(--space-lg)]">{String(t('housingInterviewsLabel'))}</h3>

                  {/* Research process steps */}
                  <div className="flex flex-col sm:flex-row gap-0 mb-[var(--space-xl)] border-t border-black/10">
                    {[
                      { n: '01', head: '10+ surveyed', sub: 'NYC residents\naged 18–25' },
                      { n: '02', head: '4 interviewed', sub: 'College students\nin person' },
                      { n: '03', head: 'Notes organized', sub: 'Transcribed &\ncategorised themes' },
                    ].map(({ n, head, sub }, i, arr) => (
                      <div key={n} className={`flex-1 pl-[14px] pt-[var(--space-md)] pb-[var(--space-md)] pr-[var(--space-lg)] ${i < arr.length - 1 ? 'sm:border-r border-black/10' : ''}`}>
                        <span className="type-caption text-[0.8rem] text-[var(--color-accent-primary)] block mb-[var(--space-xs)]">{n}</span>
                        <p className="text-[1.1rem] font-medium leading-snug mb-[2px]">{head}</p>
                        <p className="text-[0.95rem] text-[var(--color-text-muted)] leading-snug whitespace-pre-line">{sub}</p>
                      </div>
                    ))}
                  </div>

                  {/* Key Takeaways bubble map — full width, large */}
                  <motion.div
                    className="mb-[var(--space-xxl)]"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    <p className="type-caption text-[0.85rem] text-[var(--color-text-muted)] mb-[var(--space-md)]">KEY TAKEAWAYS</p>
                    {(() => {
                      const bubbles = [
                        { key: 'core',        x: 210, y: 165, r: 58,  label: 'Key\nTakeaways',          accent: true  },
                        { key: 'roommates',   x:  82, y:  88, r: 42,  label: 'Finding\nRoommates'                     },
                        { key: 'guarantor',   x:  88, y: 232, r: 36,  label: 'Guarantor'                              },
                        { key: 'document',    x: 270, y:  72, r: 36,  label: 'Document'                               },
                        { key: 'rent',        x: 320, y: 218, r: 46,  label: 'High\nRents',             accent: true  },
                        { key: 'cost',        x: 186, y: 278, r: 34,  label: '$500+\nutilities'                       },
                        { key: 'intl',        x: 136, y: 165, r: 30,  label: 'Language\nBarrier'                      },
                      ];
                      const W = 400; const H = 300;
                      return (
                        <svg
                          viewBox={`0 0 ${W} ${H}`}
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-full max-w-lg mx-auto pt-[13px] pb-[13px] overflow-visible"
                          aria-label="Key takeaways bubble map"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          {bubbles.map((b, i) => {
                            const fs = b.r >= 50 ? 11 : b.r >= 40 ? 9.5 : b.r >= 34 ? 8.5 : 7.5;
                            const fw = b.accent || b.r >= 50 ? '600' : '500';
                            return (
                              <motion.g
                                key={b.key}
                                initial={{ opacity: 0, scale: 0.7 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                                style={{ transformOrigin: `${b.x}px ${b.y}px` }}
                              >
                                <circle
                                  cx={b.x} cy={b.y} r={b.r}
                                  fill={b.accent ? 'var(--color-accent-primary)' : 'currentColor'}
                                  opacity={b.accent ? 0.13 : 0.07}
                                  stroke={b.accent ? 'var(--color-accent-primary)' : 'currentColor'}
                                  strokeOpacity={b.accent ? 0.4 : 0.22}
                                />
                                {b.label.split('\n').map((line, li, lines) => (
                                  <text
                                    key={li}
                                    x={b.x}
                                    y={b.y + (li - (lines.length - 1) / 2) * (fs * 1.35)}
                                    textAnchor="middle"
                                    dominantBaseline="central"
                                    fill="currentColor"
                                    fontSize={fs}
                                    fontWeight={fw}
                                    opacity={0.85}
                                  >
                                    {line}
                                  </text>
                                ))}
                              </motion.g>
                            );
                          })}
                        </svg>
                      );
                    })()}
                  </motion.div>

                  {/* Takeaway cage frames — interactive */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-[var(--space-md)] mb-[var(--space-xxl)]">
                    {([
                      { label: t('housingTakeawayItems')[0] as string, detail: 'Avg. NYC rent exceeds $2,800/mo. Students often share with strangers just to afford it.' },
                      { label: t('housingTakeawayItems')[1] as string, detail: 'Multiple platforms, repeated document uploads, no status tracking across portals.' },
                      { label: t('housingTakeawayItems')[2] as string, detail: 'No centralized resource for international students navigating the housing process.' },
                    ]).map(({ label, detail }, idx) => (
                      <motion.div
                        key={idx}
                        className="group relative rounded-2xl p-[var(--space-md)] overflow-hidden cursor-pointer select-none border border-black/12 hover:border-[var(--color-accent-primary)]/40 hover:bg-[var(--color-accent-primary)]/5"
                        style={{
                          minHeight: '9rem',
                          transition: 'border-color 0.25s, background 0.25s',
                        }}
                        initial={{ opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.4 }}
                        transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        whileHover={{ y: -4, transition: { duration: 0.22, ease: 'easeOut' } }}
                        whileTap={{ scale: 0.97, transition: { duration: 0.12 } }}
                      >
                        {/* ghost number */}
                        <span
                          className="absolute top-3 right-4 font-bold leading-none pointer-events-none"
                          style={{ fontSize: '3.8rem', lineHeight: 1, color: 'var(--color-accent-primary)', opacity: 0.1 }}
                        >
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        {/* label — slides up on hover */}
                        <p
                          className="text-[1.1rem] font-medium leading-snug relative z-10 pt-[3.2rem]"
                          style={{ transition: 'transform 0.22s ease, opacity 0.22s ease' }}
                        >
                          {label}
                        </p>
                        {/* detail — reveals on hover via max-height */}
                        <p
                          className="text-[0.88rem] text-[var(--color-text-muted)] leading-snug relative z-10 overflow-hidden opacity-0 group-hover:opacity-100 max-h-0 group-hover:max-h-24 mt-0 group-hover:mt-[var(--space-xs)]"
                          style={{ transition: 'max-height 0.35s ease, opacity 0.25s ease, margin 0.3s ease' }}
                        >
                          {detail}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Persona subtitle + card */}
                  <p className="type-caption text-[0.85rem] tracking-wider mt-[var(--space-xxl)] mb-[var(--space-sm)] text-[var(--color-text-muted)]">
                    PERSONA
                  </p>
                  <div ref={personaCardRef} className="border border-black/10 rounded-2xl overflow-hidden mt-0 mb-[var(--space-xl)]">
                    {/* header strip */}
                    <div className="flex items-baseline justify-between px-[var(--space-lg)] py-[var(--space-md)] border-b border-black/10 bg-black/[0.03]">
                      <p className="font-bold text-[1.4rem] leading-none">{String(t('housingPersonaName'))}</p>
                      <p className="type-caption text-[var(--color-text-muted)] text-[0.85rem]">{String(t('housingPersonaRole'))}</p>
                    </div>

                    {/* quote */}
                    <div className="px-[var(--space-lg)] py-[var(--space-lg)] border-b border-black/10">
                      <p className="text-[1.25rem] italic leading-relaxed text-[var(--color-text)]">
                        <span className="text-[var(--color-accent-primary)] not-italic font-bold mr-1">&ldquo;</span>
                        {String(t('housingPersonaQuote'))}
                        <span className="text-[var(--color-accent-primary)] not-italic font-bold ml-1">&rdquo;</span>
                      </p>
                    </div>

                    {/* pain + behavior — draggable pills with scroll physics, restrained by card */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-black/10 overflow-hidden">
                      <div className="px-[var(--space-lg)] py-[var(--space-md)]">
                        <p className="type-caption text-[0.85rem] text-[var(--color-text-muted)] mb-[var(--space-sm)]">PAIN POINTS</p>
                        <motion.div className="flex flex-wrap gap-[var(--space-xs)]" style={{ y: pillPhysicsY }}>
                          {(t('housingPersonaPainItems') as readonly string[]).map((item, idx) => (
                            <motion.span
                              key={idx}
                              drag
                              dragConstraints={personaCardRef}
                              dragElastic={0.08}
                              dragMomentum={false}
                              className="inline-flex items-center gap-[5px] border border-[var(--color-accent-primary)]/30 rounded-full px-[var(--space-sm)] py-[5px] text-[0.92rem] leading-snug cursor-grab select-none"
                              style={{ touchAction: 'none' }}
                              initial={{ scale: 0, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              viewport={{ once: true, amount: 0.5 }}
                              transition={{ type: 'spring', stiffness: 320, damping: 18, delay: idx * 0.1 }}
                              whileDrag={{ scale: 1.08, zIndex: 20, cursor: 'grabbing', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}
                            >
                              <span className="text-[var(--color-accent-primary)] text-[0.75rem] leading-none">✕</span>
                              {item}
                            </motion.span>
                          ))}
                        </motion.div>
                      </div>
                      <div className="px-[var(--space-lg)] py-[var(--space-md)]">
                        <p className="type-caption text-[0.85rem] text-[var(--color-text-muted)] mb-[var(--space-sm)]">BEHAVIORS</p>
                        <motion.div className="flex flex-wrap gap-[var(--space-xs)]" style={{ y: pillPhysicsY }}>
                          {(t('housingPersonaBehaviorItems') as readonly string[]).map((item, idx) => (
                            <motion.span
                              key={idx}
                              drag
                              dragConstraints={personaCardRef}
                              dragElastic={0.08}
                              dragMomentum={false}
                              className="inline-flex items-center gap-[5px] border border-black/20 rounded-full px-[var(--space-sm)] py-[5px] text-[0.92rem] leading-snug cursor-grab select-none"
                              style={{ touchAction: 'none' }}
                              initial={{ scale: 0, opacity: 0 }}
                              whileInView={{ scale: 1, opacity: 1 }}
                              viewport={{ once: true, amount: 0.5 }}
                              transition={{ type: 'spring', stiffness: 320, damping: 18, delay: idx * 0.1 + 0.2 }}
                              whileDrag={{ scale: 1.08, zIndex: 20, cursor: 'grabbing', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}
                            >
                              <span className="text-[var(--color-accent-primary)] text-[0.75rem] leading-none">→</span>
                              {item}
                            </motion.span>
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </motion.section>

                {/* ── Competitive Analysis ── */}
                <motion.section
                  className="mb-[var(--space-xxxl)]"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <h3 className="type-caption text-[1.1rem] tracking-wider mb-[var(--space-lg)]">{String(t('housingCompetitiveLabel'))}</h3>
                  <p className="text-[1.2rem] mb-[var(--space-xl)] max-w-4xl leading-relaxed">{String(t('housingCompetitiveDesc'))}</p>

                  {/* Unified competitive analysis panel */}
                  {(() => {
                    const W = 560; const H = 148;
                    const axisY = 96; const axisX0 = 28; const axisX1 = W - 28;
                    const features: { label: string; x: number; delay: number; accent?: boolean }[] = [
                      { label: 'Map',                     x: 88,   delay: 0.55 },
                      { label: 'Filter',                  x: 210,  delay: 0.72 },
                      { label: 'Realtime\nUpdates',        x: 352,  delay: 0.89 },
                      { label: 'Interior Image\n& Video',  x: 494,  delay: 1.06, accent: true },
                    ];
                    return (
                      <div className="border border-black/10 rounded-2xl overflow-hidden max-w-4xl">

                        {/* ── Top: feature importance axis ── */}
                        <div className="px-[var(--space-lg)] pt-[var(--space-lg)] pb-[var(--space-md)] border-b border-black/10">
                          <p className="type-caption text-[0.72rem] text-[var(--color-text-muted)] mb-[var(--space-md)] tracking-widest">HOW IMPORTANT IS THIS FEATURE TO USERS?</p>
                          <svg
                            viewBox={`0 0 ${W} ${H}`}
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full pt-[13px] pb-[13px] overflow-visible"
                            aria-label="Feature importance axis diagram"
                            preserveAspectRatio="xMidYMid meet"
                          >
                            {/* gradient fill under axis: trivial→critical */}
                            <defs>
                              <linearGradient id="axis-grad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="currentColor" stopOpacity="0.04" />
                                <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0.10" />
                              </linearGradient>
                            </defs>
                            <rect x={axisX0} y={axisY} width={axisX1 - axisX0} height="1.5" fill="url(#axis-grad)" rx="1" />

                            {/* Axis base line */}
                            <motion.line
                              x1={axisX0} y1={axisY} x2={axisX1} y2={axisY}
                              stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.28"
                              initial={{ pathLength: 0, opacity: 0 }}
                              whileInView={{ pathLength: 1, opacity: 1 }}
                              viewport={{ once: true, amount: 0.5 }}
                              transition={{ duration: 0.5, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
                            />

                            {/* End ticks */}
                            {[axisX0, axisX1].map((tx) => (
                              <motion.line key={tx} x1={tx} y1={axisY - 5} x2={tx} y2={axisY + 5}
                                stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.28"
                                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                                transition={{ duration: 0.18, delay: 0.35 }}
                              />
                            ))}

                            {/* Axis labels */}
                            <motion.text x={axisX0} y={axisY + 18} textAnchor="start"
                              fill="currentColor" fontSize="9" fontWeight="500"
                              initial={{ opacity: 0 }} whileInView={{ opacity: 0.38 }} viewport={{ once: true }}
                              transition={{ duration: 0.22, delay: 0.4 }}
                            >Trivial</motion.text>
                            <motion.text x={axisX1} y={axisY + 18} textAnchor="end"
                              fill="currentColor" fontSize="9" fontWeight="500"
                              initial={{ opacity: 0 }} whileInView={{ opacity: 0.38 }} viewport={{ once: true }}
                              transition={{ duration: 0.22, delay: 0.4 }}
                            >Critical</motion.text>

                            {/* Feature nodes */}
                            {features.map(({ label, x, delay, accent }) => {
                              const color = accent ? 'var(--color-accent-primary)' : 'currentColor';
                              const strokeOp = accent ? 0.7 : 0.48;
                              const fillOp   = accent ? 0.14 : 0.08;
                              return (
                                <motion.g
                                  key={label}
                                  initial={{ opacity: 0, y: 8 }}
                                  whileInView={{ opacity: 1, y: 0 }}
                                  viewport={{ once: true, amount: 0.4 }}
                                  transition={{ duration: 0.38, delay, ease: [0.22, 1, 0.36, 1] }}
                                >
                                  {/* dashed vertical connector */}
                                  <line x1={x} y1={axisY - 5} x2={x} y2={axisY - 32}
                                    stroke={color} strokeWidth="1" strokeOpacity="0.22" strokeDasharray="2.5 2"
                                  />
                                  {/* dot */}
                                  <circle cx={x} cy={axisY} r={accent ? 5 : 4}
                                    fill={color} fillOpacity={fillOp}
                                    stroke={color} strokeWidth="1.5" strokeOpacity={strokeOp}
                                  />
                                  {/* label lines above */}
                                  {label.split('\n').map((ln, li, lns) => (
                                    <text
                                      key={li}
                                      x={x}
                                      y={axisY - 38 - (lns.length - 1 - li) * 13}
                                      textAnchor="middle"
                                      dominantBaseline="auto"
                                      fill={color}
                                      fontSize={accent ? 10 : 9.5}
                                      fontWeight={accent ? '700' : '600'}
                                      opacity={accent ? 0.9 : 0.75}
                                    >{ln}</text>
                                  ))}
                                </motion.g>
                              );
                            })}
                          </svg>
                        </div>

                        {/* ── Bottom: industry gaps ── */}
                        <div className="px-[var(--space-lg)] py-[var(--space-lg)]">
                          <p className="type-caption text-[0.72rem] text-[var(--color-text-muted)] mb-[var(--space-md)] tracking-widest">WHAT COMPETITORS MISS</p>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-[var(--space-xl)] gap-y-[var(--space-md)]">
                            {(t('housingGapItems') as readonly string[]).map((item, idx) => (
                              <motion.div
                                key={idx}
                                className="flex items-start gap-[10px]"
                                initial={{ opacity: 0, y: 8 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.32, delay: 0.15 + idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
                              >
                                <span
                                  className="shrink-0 mt-[3px] text-[0.65rem] font-bold leading-none border rounded-full flex items-center justify-center"
                                  style={{
                                    width: '16px', height: '16px',
                                    color: 'var(--color-accent-primary)',
                                    borderColor: 'var(--color-accent-primary)',
                                    opacity: 0.7,
                                  }}
                                >✕</span>
                                <p className="text-[1rem] leading-snug text-[var(--color-text)]">{item}</p>
                              </motion.div>
                            ))}
                          </div>
                        </div>

                      </div>
                    );
                  })()}
                </motion.section>

                <div className="border-t border-black/8 my-[var(--space-xxl)]" />

                {/* ── Housing Journey exchange animation (sticky-scroll) ── */}
                <div ref={journeyStickyRef} className="relative h-[280vh] my-[var(--space-xxl)]">
                  <div className="sticky top-0 h-screen flex flex-col justify-center z-10 bg-[var(--color-bg)]">
                    <motion.div
                      className="w-full"
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      {/* crossfade title */}
                      <div className="relative mb-[var(--space-md)]" style={{ height: '1.4em' }}>
                        <h3
                          className="type-caption text-[1.1rem] tracking-wider absolute inset-0"
                          style={{ opacity: Math.max(0, 1 - journeyCompress * 4) }}
                        >
                          TYPICAL HOUSING JOURNEY
                        </h3>
                        <h3
                          className="type-caption text-[1.1rem] tracking-wider absolute inset-0"
                          style={{ opacity: Math.min(1, Math.max(0, (journeyCompress - 0.55) * 4)) }}
                        >
                          NEW HOUSING JOURNEY
                        </h3>
                      </div>

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
                          const colW = 23;
                          const rowH = 22;
                          const labelW = 80;
                          const headerH = 20;
                          const c = journeyCompress;

                          // phase 1: dots go orange → hollow (c 0→0.45)
                          // phase 2: columns compress + hollow dots shrink (c 0.45→0.75)
                          // phase 3: dark bar grows in (c 0.65→1)
                          const hollowT = Math.min(1, c / 0.45);               // 0→1 in phase 1
                          const shrinkT = Math.min(1, Math.max(0, (c - 0.45) / 0.3)); // 0→1 in phase 2
                          const barT    = Math.min(1, Math.max(0, (c - 0.65) / 0.35)); // 0→1 in phase 3

                          const getX = (col: number) => {
                            if (col <= 7) return labelW + col * colW * (1 - 0.6 * shrinkT) + colW / 2;
                            return labelW + colW * (col - 4.2 * shrinkT) + colW / 2;
                          };

                          const w = labelW + weeks.length * colW + 10;
                          const h = headerH + phases.length * rowH + 8;
                          const isPreCol   = (col: number)  => col <= 7;
                          const isPrePhase = (row: number) => row <= 5;

                          return (
                            <svg viewBox={`0 0 ${w} ${h}`} fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full min-w-[360px]" aria-label="Housing Journey exchange — calendar view">

                              {/* week labels — compress then fade, "~3w" appears */}
                              {weeks.map((wk, i) => {
                                const isZero = wk === '0';
                                let op: number;
                                if (isZero) {
                                  op = 0.5; // move-in reference always visible
                                } else if (isPreCol(i)) {
                                  // stay at full 0.35 through hollowT (so labels visibly move together),
                                  // then fade out in shrink phase
                                  op = 0.35 * Math.max(0, 1 - shrinkT * 1.4);
                                } else {
                                  op = 0.35;
                                }
                                return (
                                  <text
                                    key={wk}
                                    x={getX(i)}
                                    y={12}
                                    textAnchor="middle"
                                    fill={isZero ? 'var(--color-accent-primary)' : 'currentColor'}
                                    fontSize={isZero ? '8' : '7'}
                                    fontWeight={isZero ? '600' : undefined}
                                    opacity={op}
                                    dominantBaseline="central"
                                  >
                                    {wk}
                                  </text>
                                );
                              })}
                              {/* "~3w" summary label fades in as bar grows */}
                              {barT > 0 && (
                                <text
                                  x={(getX(0) + getX(7)) / 2}
                                  y={12}
                                  textAnchor="middle"
                                  fill="currentColor"
                                  fontSize="7"
                                  fontWeight="500"
                                  opacity={0.55 * barT}
                                  dominantBaseline="central"
                                >
                                  ~3w
                                </text>
                              )}

                              {/* move-in dashed line */}
                              <line x1={getX(8)} y1={headerH - 2} x2={getX(8)} y2={h - 4} stroke="var(--color-accent-primary)" strokeWidth="1" opacity="0.25" strokeDasharray="3 3" />

                              {phases.map((phase, row) => {
                                const y = headerH + row * rowH + rowH / 2;
                                const pre = isPrePhase(row);
                                const labelFade = pre ? Math.max(0.15, 1 - hollowT * 0.6) : 1;
                                const preActiveCols = phase.active.filter(isPreCol);

                                return (
                                  <g key={phase.label}>
                                    <text x={labelW - 6} y={y + 1} textAnchor="end" fill="currentColor" fontSize="9" fontWeight="500" dominantBaseline="central" opacity={labelFade}>{phase.label}</text>

                                    {weeks.map((_, col) => {
                                      const cx = getX(col);
                                      const isActive = phase.active.includes(col);
                                      const preC = isPreCol(col);

                                      if (!isActive) {
                                        const op = preC ? 0.1 * Math.max(0, 1 - hollowT) : 0.1;
                                        return <circle key={col} cx={cx} cy={y} r={2.5} fill="currentColor" opacity={op} />;
                                      }

                                      if (!preC) {
                                        // post move-in: always orange
                                        return <circle key={col} cx={cx} cy={y} r={5} fill="var(--color-accent-primary)" opacity={1} />;
                                      }

                                      // pre-move-in active dot: orange → hollow circle → shrink away
                                      const orangeOp  = Math.max(0, 1 - hollowT);
                                      const strokeOp  = hollowT * Math.max(0, 1 - shrinkT);
                                      const r = 5 * Math.max(0, 1 - shrinkT * 0.9);

                                      return (
                                        <g key={col}>
                                          {/* orange fill fading out */}
                                          <circle cx={cx} cy={y} r={r} fill="var(--color-accent-primary)" opacity={orangeOp} />
                                          {/* hollow ring fading in then out */}
                                          <circle cx={cx} cy={y} r={r} fill="none" stroke="currentColor" strokeWidth="1.2" opacity={strokeOp * 0.55} />
                                        </g>
                                      );
                                    })}

                                    {/* dark bar growing in for pre-move-in phases */}
                                    {pre && preActiveCols.length > 0 && barT > 0 && (() => {
                                      const x1 = getX(preActiveCols[0]) - 5;
                                      const x2 = getX(preActiveCols[preActiveCols.length - 1]) + 5;
                                      const bh = 5;
                                      const fullW = x2 - x1;
                                      return (
                                        <rect
                                          x={x1}
                                          y={y - bh / 2}
                                          width={fullW * barT}
                                          height={bh}
                                          rx={bh / 2}
                                          fill="currentColor"
                                          opacity={0.7 * barT}
                                        />
                                      );
                                    })()}
                                  </g>
                                );
                              })}
                            </svg>
                          );
                        })()}
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* ── Iterative Prototyping ── */}
                <motion.section
                  className="mb-[var(--space-xxxl)]"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-10% 0px' }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <h3 className="type-caption text-[1.1rem] tracking-wider mb-[var(--space-lg)]">{String(t('housingPrototypingLabel'))}</h3>

                  <blockquote className="border-l-4 border-[var(--color-accent-primary)] pl-[var(--space-md)] mb-[var(--space-xl)] max-w-4xl">
                    <p className="text-[1.3rem] italic leading-relaxed">&ldquo;{String(t('housingPivotInsight'))}&rdquo;</p>
                  </blockquote>
                </motion.section>

                <div
                  ref={housingTimelineRef}
                  className="relative my-[var(--space-xxxl)] w-screen"
                  style={{
                    marginLeft: 'calc(50% - 50vw)',
                    height: `${housingTimelineCount * 100}vh`,
                  }}
                >
                  <div className="sticky top-0 h-screen flex items-center overflow-hidden bg-[var(--color-bg)] z-10">
                    <motion.div style={{ x: housingTimelineX, width: `${housingTimelineCount * 100}vw` }} className="flex h-full">

                      {/* ── Slide 0: project hero ── */}
                      <div className="w-screen h-full flex items-center justify-center px-[var(--space-xl)]">
                        <div
                          className="w-full max-w-6xl grid gap-[var(--space-xxl)]"
                          style={{ gridTemplateColumns: '1fr 1fr', alignItems: 'center' }}
                        >
                          {/* Phone mockup — parallax out as user scrolls right */}
                          <motion.div
                            style={{ y: heroImgY, x: heroImgX, opacity: heroImgOp }}
                            className="flex justify-center"
                          >
                            <img
                              src={publicUrl('housing-hero-mockup.png')}
                              alt="Housing app — Week 1 screen"
                              style={{ maxHeight: '72vh', width: 'auto', filter: 'drop-shadow(0 32px 64px rgba(0,0,0,0.18))' }}
                            />
                          </motion.div>

                          {/* Text: tags → title → description → scroll hint */}
                          <div className="flex flex-col gap-[var(--space-lg)]">
                            <motion.div style={{ y: heroTagY, opacity: heroTagOp }} className="flex gap-[var(--space-sm)] flex-wrap">
                              {['UI System', 'UX Research', 'Prototyping'].map((tag) => (
                                <span
                                  key={tag}
                                  className="font-mono text-[0.65rem] tracking-widest uppercase px-3 py-1 rounded-full border"
                                  style={{ borderColor: 'rgba(0,0,0,0.18)', color: 'var(--color-text-muted)' }}
                                >{tag}</span>
                              ))}
                            </motion.div>

                            <motion.h2
                              style={{ y: heroTxtY, opacity: heroTxtOp, fontSize: 'clamp(2.2rem, 4.5vw, 3.8rem)', color: 'var(--color-text)' }}
                              className="font-bold leading-[1.05] tracking-tight m-0"
                            >
                              Housing Solutions
                              <br />
                              <span style={{ color: 'var(--color-accent-primary)' }}>for International Students</span>
                            </motion.h2>

                            <motion.p
                              style={{ y: heroTxtY, opacity: heroTxtOp, color: 'var(--color-text-muted)' }}
                              className="text-[1.1rem] leading-relaxed max-w-md m-0"
                            >
                              A timeline-based tool designed to guide international college students through NYC's off-campus housing process — from landing to lease.
                            </motion.p>

                            <motion.p
                              style={{ color: 'var(--color-text-muted)', y: heroTxtY, opacity: heroTxtOp }}
                              className="type-caption m-0"
                            >
                              Scroll to view process →
                            </motion.p>
                          </div>
                        </div>
                      </div>

                      {/* ── Slides 1–5: PDF pages ── */}
                      {housingTimelineSlides.map((img, idx) => (
                        <div key={img} className="w-screen h-full flex flex-col justify-center items-center px-[var(--space-xl)] py-[var(--space-xxxl)]">
                          <div className="max-w-5xl w-full">
                            <img
                              src={publicUrl(img)}
                              alt={`Housing slide ${idx + 1}`}
                              className="w-full rounded-2xl shadow-2xl object-contain"
                              style={{ maxHeight: '76vh' }}
                            />
                            <p className="type-caption mt-[var(--space-sm)] text-[var(--color-text-muted)]">
                              {`PAGE ${idx + 1} / ${housingTimelineSlides.length}`}
                            </p>
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
