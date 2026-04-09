import { useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import BlurText from './BlurText';

gsap.registerPlugin(ScrollTrigger);

interface SpineItem {
  title: string;
  outcome: string;
  role: string;
  href: string;
  thumb?: string;
  featured?: boolean;
}

interface InteractiveThreeSpineProps {
  workIndex: {
    ui: SpineItem[];
    interactive: SpineItem[];
    research: SpineItem[];
  };
}

export default function InteractiveThreeSpine({ workIndex }: InteractiveThreeSpineProps) {
  const gsapTriggersRef = useRef<ScrollTrigger[]>([]);

  const cardRef = useCallback((el: HTMLAnchorElement | null) => {
    if (!el) return;
    const trigger = gsap.fromTo(
      el,
      { opacity: 0, y: 28 },
      {
        opacity: 1,
        y: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom-=5%',
          end: 'top center+=15%',
          scrub: 0.5,
        },
      },
    );
    if (trigger.scrollTrigger) gsapTriggersRef.current.push(trigger.scrollTrigger);
  }, []);

  useEffect(() => {
    return () => {
      gsapTriggersRef.current.forEach((t) => t.kill());
      gsapTriggersRef.current = [];
    };
  }, []);

  const allItems: SpineItem[] = [
    ...workIndex.ui,
    ...workIndex.interactive,
    ...workIndex.research,
  ];

  const enterEase: [number, number, number, number] = [0.22, 1, 0.36, 1];

  return (
    <div className="spine-grid-wrapper">
      <motion.div
        className="spine-grid"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        variants={{
          hidden: {},
          show: {
            transition: { staggerChildren: 0.08, delayChildren: 0.04 },
          },
        }}
      >
        {allItems.map((item) => (
          <motion.div
            key={item.title}
            className="spine-card"
            variants={{
              hidden: { opacity: 0, y: 16 },
              show: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.5, ease: enterEase },
              },
            }}
          >
            <a ref={cardRef} href={item.href} className="spine-card-link">
              {item.thumb ? (
                <img
                  src={item.thumb}
                  alt={item.title}
                  className="spine-card-img"
                />
              ) : (
                <div className="spine-card-placeholder" />
              )}
              <div className="spine-card-content">
                <span className="spine-card-role">{item.role}</span>
                <BlurText
                  text={item.title}
                  className="spine-card-title"
                  delay={80}
                  animateBy="words"
                  direction="bottom"
                  stepDuration={0.4}
                  threshold={0.05}
                  rootMargin="0px 0px -10% 0px"
                />
                <BlurText
                  text={item.outcome}
                  className="spine-card-outcome"
                  delay={60}
                  animateBy="words"
                  direction="bottom"
                  stepDuration={0.35}
                  threshold={0.05}
                  rootMargin="0px 0px -10% 0px"
                  animationFrom={{ filter: 'blur(8px)', opacity: 0, y: 20 }}
                  animationTo={[
                    { filter: 'blur(3px)', opacity: 0.5, y: 3 },
                    { filter: 'blur(0px)', opacity: 1, y: 0 },
                  ]}
                />
              </div>
            </a>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
