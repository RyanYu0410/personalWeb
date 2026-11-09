import { useId, useRef, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { motion } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1] as const;

function Block({
  title,
  children,
  className = '',
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      className={`mb-[var(--space-xxxl)] ${className}`}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.6, ease }}
    >
      <h3 className="type-caption text-[1.1rem] tracking-wider mb-[var(--space-lg)]">{title}</h3>
      {children}
    </motion.section>
  );
}

function PullTab({ width = 168 }: { width?: number }) {
  const stringLength = 28;
  const reach = 72;
  const lineRef = useRef<SVGLineElement>(null);
  const pendantRef = useRef<SVGGElement>(null);
  const drag = useRef({ dragging: false, startY: 0, offset: 0, velocity: 0, frame: 0 });
  const height = stringLength + 36;

  const place = (y: number) => {
    pendantRef.current?.setAttribute('transform', `translate(0, ${y})`);
    lineRef.current?.setAttribute('y2', String(stringLength + y));
  };
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    state.dragging = true;
    state.startY = event.clientY;
    if (state.frame) cancelAnimationFrame(state.frame);
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* A synthetic pointer has nothing to capture. Real drags still capture. */
    }
  };
  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const state = drag.current;
    if (!state.dragging) return;
    const travel = Math.max(0, event.clientY - state.startY);
    state.offset = reach * (1 - Math.exp(-travel / reach));
    place(state.offset);
  };
  const onPointerUp = () => {
    const state = drag.current;
    if (!state.dragging) return;
    state.dragging = false;
    state.velocity = 0;
    const spring = () => {
      state.velocity = (state.velocity + (0 - state.offset) * 0.18) * 0.78;
      state.offset += state.velocity;
      place(state.offset);
      if (Math.abs(state.velocity) < 0.3 && Math.abs(state.offset) < 0.3) {
        state.offset = 0;
        place(0);
        state.frame = 0;
      } else {
        state.frame = requestAnimationFrame(spring);
      }
    };
    state.frame = requestAnimationFrame(spring);
  };

  return (
    <div
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className="w-[180px] max-w-full justify-self-center cursor-grab touch-none select-none active:cursor-grabbing"
      role="img"
      aria-label="Pull tab from the welcome screen. Drag it down and it springs back."
    >
      <svg
        width={width}
        height={width * (height / 40)}
        viewBox={`0 0 40 ${height}`}
        overflow="visible"
        className="mx-auto block"
        aria-hidden
      >
        <line ref={lineRef} x1="20" y1="4" x2="20" y2={stringLength} stroke="#7a8078" strokeWidth="1.6" strokeLinecap="round" />
        <g ref={pendantRef}>
          <g transform={`translate(20, ${stringLength})`}>
            <ellipse cx="0" cy="32" rx="13" ry="2.4" fill="#000" opacity="0.07" />
            <path
              d="M 0 0 C -10 0 -14 7 -14 14 C -14 23 -8 28 0 28 C 8 28 14 23 14 14 C 14 7 10 0 0 0 Z"
              fill="#3a4a38"
            />
            <circle cx="0" cy="15" r="3.5" fill="#eae8e3" opacity="0.82" />
          </g>
        </g>
      </svg>
    </div>
  );
}

function Frame({
  ratio = 'video',
  tone = '#FFF8F1',
  className = '',
  children,
}: {
  ratio?: 'video' | 'wide';
  tone?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`w-full overflow-hidden rounded-3xl ${ratio === 'video' ? 'aspect-video' : 'aspect-[32/9]'} p-[2.5%] flex flex-col items-center justify-center gap-[3%] [&>svg]:max-h-full [&>svg]:min-h-0 ${className}`}
      style={{ background: tone }}
    >
      {children}
    </div>
  );
}

const principles = [
  { n: '01', title: 'A simple pull', text: 'A powerful reset. The phone stays, but a small ritual returns attention to the work.' },
  { n: '02', title: 'You are not alone', text: 'We study together. Presence from other students replaces an empty room at home.' },
  { n: '03', title: 'Small wins', text: 'They grow into a garden. Progress is visible, immediate, and tied to the session itself.' },
];

const scope = [
  { icon: 'home', label: 'A room for home study' },
  { icon: 'people', label: 'Company that motivates' },
  { icon: 'shield', label: 'Simple, safe, about learning' },
];

const impacts = [
  { kind: 'start' as const, label: 'Hard to start', text: 'Opening the book feels heavier than opening the phone.' },
  { kind: 'drift' as const, label: 'Easy to drift', text: 'One notification and attention leaves the page.' },
  { kind: 'momentum' as const, label: 'Loss of momentum', text: 'Progress stalls just before it starts to feel good.' },
  { kind: 'doubt' as const, label: 'Low confidence', text: 'Unfinished work turns into “maybe I just can’t.”' },
];

const offerArt = ['./pullback/icons/pull.png', './pullback/icons/together.png', './pullback/icons/garden.png'];

const needs = [
  { src: './pullback/pieces/need-people.png', title: 'Light supervision', text: 'Company and a gentle check-in, not monitoring.' },
  { src: './pullback/pieces/need-plan.png', title: 'Clear study plans', text: 'A defined start and a short list for tonight.' },
  { src: './pullback/pieces/need-chart.png', title: 'Visible progress', text: 'Progress he can see during the session.' },
  { src: './pullback/pieces/need-note.png', title: 'Calm breaks', text: 'A short, bounded rest that ends on its own.' },
  { src: './pullback/pieces/need-peers.png', title: 'Peer recognition', text: 'Light interaction and feedback from others.' },
];

const loopArt = [
  { src: './pullback/pieces/loop-open.png', label: 'The phone opens' },
  { src: './pullback/pieces/loop-notice.png', label: 'A cue answers back' },
  { src: './pullback/pieces/loop-reply.png', label: 'The room fills up' },
  { src: './pullback/pieces/loop-lost.png', label: 'The hour disappears' },
];

const screens = [
  { src: './pullback/pieces/welcome.png', label: 'Pull to begin' },
  { src: './pullback/pieces/room.png', label: 'Pick a seat' },
  { src: './pullback/pieces/focus.png', label: 'Stay with the timer' },
  { src: './pullback/pieces/break.png', label: 'Pull back from the break' },
  { src: './pullback/pieces/garden.png', label: 'The week becomes a garden' },
];

const limits = [
  { icon: 'game', title: 'No inner motivation' },
  { icon: 'gift', title: 'No reward swap' },
  { icon: 'lock', title: 'No autonomy' },
];

const oppStyle = [
  { icon: 'gift', bg: '#5FA35A' },
  { icon: 'user', bg: '#F2B935' },
  { icon: 'people', bg: '#4D7FCB' },
];

const interventions = [
  {
    title: 'Screen time limits',
    kind: 'Restrict',
    icon: 'hourglass',
    tone: '#4D7FCB',
    wash: '#E4ECF8',
    now: [
      { icon: 'timer', label: 'Usage timers' },
      { icon: 'lock', label: 'Parental lock' },
      { icon: 'moon', label: 'Downtime' },
      { icon: 'x', label: 'Block apps' },
    ],
    limit: 'Control, then rebound',
    next: 'Reward design',
  },
  {
    title: 'Physical separation',
    kind: 'Remove',
    icon: 'door',
    tone: '#C46A2E',
    wash: '#F8E6D6',
    now: [
      { icon: 'door', label: 'Other room' },
      { icon: 'move', label: 'Hand it over' },
      { icon: 'book', label: 'Phone-free study' },
      { icon: 'box', label: 'Phone locker' },
    ],
    limit: 'Feedback is gone',
    next: 'Substitute loop',
  },
  {
    title: 'Punishment and reward',
    kind: 'Reward / punish',
    icon: 'gift',
    tone: '#4E8A5B',
    wash: '#E3EFE1',
    now: [
      { icon: 'game', label: 'Game time' },
      { icon: 'down', label: 'Less fun' },
      { icon: 'star', label: 'Stickers' },
      { icon: 'chat', label: 'Praise / scold' },
    ],
    limit: 'Prize only at the end',
    next: 'Micro-feedback',
  },
];

const people = [
  {
    name: 'Nicole',
    meta: '13 · Student',
    need: 'Clear starting structure, gentle reminders, and relief during breaks.',
    note: 'Starts homework on purpose, then notifications and short videos take over. The phone is the break.',
  },
  {
    name: 'Parent',
    meta: '42 · Parent',
    need: 'Trust-based guidance, less conflict, and support for self-regulation.',
    note: 'Worried about phone addiction. Monitoring tools exist, but control and independence keep colliding.',
  },
  {
    name: 'Emily',
    meta: '13 · Student',
    need: 'Social presence, less isolation, and light interaction while focusing.',
    note: 'Prefers peers or a semi-social room. Studying alone feels lonely. Shared tasks hold attention.',
  },
];

const clusters = [
  { icon: 'user', title: 'Autonomy' },
  { icon: 'hourglass', title: 'Too slow' },
  { icon: 'cloud', title: 'A short relief' },
  { icon: 'people', title: 'Company' },
  { icon: 'spark', title: 'Instant reward' },
];

const competitors = [
  {
    name: 'Google Family Link',
    kind: 'Parental control',
    icon: 'shield',
    tone: '#4D7FCB',
    wash: '#E4ECF8',
    items: [
      { icon: 'check', label: 'App approval' },
      { icon: 'chartUp', label: 'Usage tracking' },
      { icon: 'lock', label: 'Remote lock' },
    ],
    gap: 'Lowers trust',
  },
  {
    name: 'Forest',
    kind: 'Pomodoro',
    icon: 'sproutPot',
    tone: '#4E8A5B',
    wash: '#E3EFE1',
    items: [
      { icon: 'timer', label: '25 min focus' },
      { icon: 'plant', label: 'Grow a plant' },
      { icon: 'phone', label: 'Phone = fail' },
    ],
    gap: 'Failure feels like punishment',
  },
  {
    name: 'Apple Screen Time',
    kind: 'System control',
    icon: 'hourglass',
    tone: '#7C63A7',
    wash: '#ECE5F5',
    items: [
      { icon: 'hourglass', label: 'App limits' },
      { icon: 'moon', label: 'Downtime' },
      { icon: 'settings', label: 'Parent settings' },
    ],
    gap: 'Raises reactance',
  },
];

const opportunities = [
  { n: '1', title: 'Replace the reward' },
  { n: '2', title: 'Let the child choose' },
  { n: '3', title: 'Light company' },
];

const day = [
  { time: '07:00', label: 'Wake up' },
  { time: '08:00–16:30', label: 'School' },
  { time: '17:00', label: 'Home' },
  { time: '18:00–19:00', label: 'Phone' },
  { time: '19:00–21:30', label: 'Try to study' },
  { time: '22:00+', label: 'Still awake' },
];

const journey = [
  { time: '19:00', stage: 'Get ready', emotion: 'Neutral', support: 'Smart reminder', thought: 'Let me put the phone away first.' },
  { time: '19:05', stage: 'Plan learning', emotion: 'Uncertain', support: 'Learning plan', thought: 'What should I study, and where do I start?' },
  { time: '19:10', stage: 'Enter the room', emotion: 'Calm', support: 'Virtual study room', thought: 'This room is quiet. Time to start.' },
  { time: '19:15', stage: 'Study with others', emotion: 'Focused', support: 'Study group', thought: 'Everyone is studying. I can stay with it.' },
  { time: '21:00', stage: 'Complete the task', emotion: 'Accomplished', support: 'Focus timer', thought: 'Pomodoro done. That felt good.' },
  { time: '21:30', stage: 'Review and grow', emotion: 'Proud', support: 'Garden', thought: 'I stayed with it. The tree is taller.' },
];

const journeyArt = [
  './pullback/icons/reminder.png',
  './pullback/icons/plan.png',
  './pullback/icons/room.png',
  './pullback/icons/group.png',
  './pullback/icons/timer.png',
  './pullback/icons/pot.png',
];

const colors = [
  { name: 'Deep black', hex: '#0B0B0F' },
  { name: 'Dark surface', hex: '#15151C' },
  { name: 'Primary green', hex: '#8BE28B' },
  { name: 'Primary text', hex: '#FFFFFF', border: true },
  { name: 'Secondary text', hex: '#A7A7B3' },
  { name: 'Warning', hex: '#FFD166' },
  { name: 'Error', hex: '#FF6B6B' },
];

const setup = [
  { title: 'Onboarding and login', text: 'A name, an avatar, and a room that is already occupied by other students.' },
  { title: 'Preference setup', text: 'Daily start time, focus length, break length, and the subjects for tonight.' },
  { title: 'Learning environment', text: 'A group room for company, and a personal room for the running timer and the break.' },
  { title: 'Study garden', text: 'A calendar of sessions, streaks, subject progress, and the history of small rewards.' },
];

const process = [
  { n: '01', title: 'Prompt and explore', text: 'Describe the flow, the visual tone, and the interaction in plain language. Generate a first prototype and check that it can be built.' },
  { n: '02', title: 'Iterate the prototype', text: 'Read the output, name what is unclear, tighten the prompt, and generate the next version.' },
  { n: '03', title: 'Designer and model', text: 'The model speeds up execution. The designer holds the vision, the empathy, and the judgment.' },
];

function Mark({ children }: { children: ReactNode }) {
  return (
    <div
      className="w-[76px] h-[76px] rounded-full flex items-center justify-center mb-[var(--space-sm)]"
      style={{ background: 'linear-gradient(180deg, #DEF1E3 0%, #EBE1D9 78%)' }}
    >
      {children}
    </div>
  );
}

const ink = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function iconNode(name: string) {
  switch (name) {
    case 'phone':
      return (<><rect x="8" y="3" width="8" height="18" rx="2" {...ink} /><path d="M11 18h2" {...ink} /></>);
    case 'bell':
      return (<><path d="M6 16a6 6 0 0 1 12 0c0 2.4 1.2 3.5 1.2 3.5H4.8S6 18.4 6 16z" {...ink} /><path d="M10 20.2a2 2 0 0 0 4 0M12 4v2" {...ink} /></>);
    case 'reply':
      return <path d="M4 12h10a4 4 0 0 0 0-8M4 12l4-4M4 12l4 4" {...ink} />;
    case 'scroll':
      return (<><path d="M7 5h8a2 2 0 0 1 2 2v12H9a2 2 0 0 0-2 2V7a2 2 0 0 1 2-2z" {...ink} /><path d="M10 9h5M10 13h5" {...ink} /></>);
    case 'lost':
      return (<><circle cx="12" cy="13" r="7" {...ink} /><path d="M12 10v4l2.5 1.5M9 3h6" {...ink} /></>);
    case 'people':
      return (<><circle cx="9" cy="8" r="2.2" {...ink} /><circle cx="16" cy="9" r="1.8" {...ink} /><path d="M4.5 19c.7-2.8 2.5-4 4.5-4s3.6 1.2 4.3 4M13.2 19c.4-2 1.6-3 2.7-3 1.2 0 2.3.9 2.7 3" {...ink} /></>);
    case 'spark':
      return <path d="M12 3l1.3 4.8L18 9.2l-4.7 1.4L12 16l-1.3-5.4L6 9.2l4.7-1.4L12 3z" {...ink} />;
    case 'loop':
      return <path d="M16 7a6 6 0 0 0-9.5 2M8 17a6 6 0 0 0 9.5-2M14.5 5.5L17 8l-3.2.2M9.5 18.5L7 16l3.2-.2" {...ink} />;
    case 'home':
      return <path d="M3.5 11 12 4l8.5 7M6 9.2V20h12V9.2M10 20v-5h4v5" {...ink} />;
    case 'brainCursor':
      return (<><path d="M11 5.2c-1.3-1.4-3.8-1-4.4.9-1.7.3-2.6 2-2 3.5-1.3 1-1.2 3.1.2 3.9-.4 1.7.7 3.2 2.4 3.3.6 1.6 2.4 2.2 3.8 1.3V5.2zM13 5.2c1.3-1.4 3.8-1 4.4.9 1.7.3 2.6 2 2 3.5" {...ink} /><path d="M11 9H8.6M11 12.6H7.4M13 9h2.4" {...ink} /><path d="M13.6 12.6 20.4 15l-2.9 1.1 2.4 2.4-1.3 1.3-2.4-2.4-1.1 2.9-1.5-7.7z" fill="currentColor" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" /></>);
    case 'peopleCloud':
      return (<><circle cx="8.3" cy="13.6" r="2.3" {...ink} /><circle cx="15.7" cy="13.6" r="2.3" {...ink} /><path d="M4.2 21c.4-2.6 2-3.9 4.1-3.9s3.7 1.3 4.1 3.9M11.6 21c.4-2.6 2-3.9 4.1-3.9s3.7 1.3 4.1 3.9" {...ink} /><path d="M9.6 8.7h4.9a1.9 1.9 0 0 0 .2-3.8 2.7 2.7 0 0 0-5.1-.4 2.1 2.1 0 0 0 0 4.2z" {...ink} /><path d="M12 8.7V7.2M12 7.4c-.2-.9-.9-1.3-1.6-1.3M12 7c.2-.8.8-1.2 1.5-1.2" {...ink} strokeWidth={1.1} /></>);
    case 'sprout':
      return (<><path d="M12 19.5v-8" {...ink} /><path d="M12 12.6C12 9 9.5 7 5.4 7c0 3.6 2.5 5.6 6.6 5.6zM12 11.2c0-3.6 2.5-5.6 6.6-5.6 0 3.6-2.5 5.6-6.6 5.6z" {...ink} /><path d="M4.5 20.5c2.3-1.1 4.8-1.6 7.5-1.6s5.2.5 7.5 1.6" {...ink} /></>);
    case 'alarm':
      return (<><circle cx="12" cy="13" r="6.6" {...ink} /><path d="M12 9.6v3.6l2.3 1.4M4.4 6.8 7 4.5M19.6 6.8 17 4.5M7.6 19l-1.4 1.7M16.4 19l1.4 1.7" {...ink} /></>);
    case 'school':
      return (<><path d="M3.5 20.5h17M5.5 20.5v-8h13v8M3.5 12.5 12 8l8.5 4.5M12 8V3.5h3.6v2.2H12" {...ink} /><path d="M10.5 20.5V17h3v3.5M7.6 14.6h1.6M14.8 14.6h1.6" {...ink} /></>);
    case 'openBook':
      return <path d="M12 6.6C10 5 7 4.6 3.8 5v13.2c3.2-.4 6.2 0 8.2 1.6 2-1.6 5-2 8.2-1.6V5C17 4.6 14 5 12 6.6zM12 6.6v13.2" {...ink} />;
    case 'moon':
      return (<><path d="M18.8 14.6A7.4 7.4 0 0 1 9.4 5.2a7.4 7.4 0 1 0 9.4 9.4z" {...ink} /><path d="M16.8 4.2v2.4M15.6 5.4H18" {...ink} strokeWidth={1.3} /></>);
    case 'clipboard':
      return (<><rect x="5.8" y="4.6" width="12.4" height="16" rx="1.8" {...ink} /><path d="M9.4 3.4h5.2v2.6H9.4zM9 10.2h6M9 13.4h6M9 16.6h3.8" {...ink} /></>);
    case 'chartUp':
      return <path d="M5.5 20v-4.5M10 20v-7M14.5 20v-5M19 20v-8.5M4 20.5h16M4.6 12.2l4.6-4 3.4 2.4 6-5.6M15.6 5h3.2v3.2" {...ink} />;
    case 'note':
      return (<><path d="M9 18V7.2l10-2.4V16" {...ink} /><circle cx="6.8" cy="18" r="2.2" {...ink} /><circle cx="16.8" cy="16" r="2.2" {...ink} /></>);
    case 'deskLamp':
      return (<><circle cx="9.4" cy="9.4" r="2.4" {...ink} /><path d="M5 17.4c.6-2.7 2.2-4.2 4.4-4.2s3.8 1.5 4.4 4.2M3 17.6h18M18.4 17.6V10l-2.4-2.4M13.8 8.6l2.9-2.9 1.7 1.7-2.9 2.9z" {...ink} /></>);
    case 'group':
      return (<><circle cx="12" cy="8.4" r="2.4" {...ink} /><circle cx="6.4" cy="10.4" r="1.9" {...ink} /><circle cx="17.6" cy="10.4" r="1.9" {...ink} /><path d="M8 19.5c.5-3 2-4.6 4-4.6s3.5 1.6 4 4.6M3 19c.3-2.3 1.6-3.6 3.4-3.6 1 0 1.8.4 2.4 1.1M21 19c-.3-2.3-1.6-3.6-3.4-3.6-1 0-1.8.4-2.4 1.1" {...ink} /></>);
    case 'tomato':
      return (<><circle cx="12" cy="13.8" r="6.6" {...ink} /><path d="M12 7.2V4.6M9.2 6.4 12 8l2.8-1.6M12 11v3l2 1.4" {...ink} /></>);
    case 'sproutPot':
      return (<><path d="M7.4 13.8h9.2l-1.3 6.2H8.7z" {...ink} /><path d="M12 13.8V10M12 11.2c0-2.6-2-4.2-4.6-4.2 0 2.6 2 4.2 4.6 4.2zM12 10c0-2.6 2-4.2 4.6-4.2 0 2.6-2 4.2-4.6 4.2z" {...ink} /></>);
    case 'shield':
      return <path d="M12 3.5 19 6.5v5.5c0 4.2-2.8 6.6-7 8.5-4.2-1.9-7-4.3-7-8.5V6.5l7-3z" {...ink} />;
    case 'book':
      return <path d="M6 5.5A2 2 0 0 1 8 3.5h11V19H8a2 2 0 0 0-2 2V5.5z" {...ink} />;
    case 'timer':
      return (<><circle cx="12" cy="14" r="6.5" {...ink} /><path d="M12 11v3.5l2 1.2M9 4h6M12 4v2" {...ink} /></>);
    case 'plant':
      return (<><path d="M12 21V12" {...ink} /><path d="M12 15c-3.5-.6-5.5-4-4.5-7 3.2.4 5 3.2 4.5 7zM12 16c3.5-.4 5.5-3.5 4.5-6.5-3.2 0-5 2.6-4.5 6.5z" {...ink} /></>);
    case 'lock':
      return (<><rect x="6" y="11" width="12" height="8" rx="1.5" {...ink} /><path d="M8 11V8.5a4 4 0 0 1 8 0V11" {...ink} /></>);
    case 'box':
      return <path d="M4 8.5 12 4.5l8 4v9l-8 4-8-4v-9zM12 12.5v5M4 8.5l8 4 8-4" {...ink} />;
    case 'gift':
      return (<><rect x="4" y="10" width="16" height="9" rx="1" {...ink} /><path d="M4 14h16M12 10v9M12 10c0-2.5-4-3-4 0h4c0-2.5 4-3 4 0h-4" {...ink} /></>);
    case 'down':
      return <path d="M4 7.5 9 12l3-3 8 8M14 17h6v-6" {...ink} />;
    case 'door':
      return (<><path d="M6 4h10v16H6V4z" {...ink} /><path d="M16 20h2M13.5 12h.01" {...ink} /></>);
    case 'sun':
      return (<><circle cx="12" cy="12" r="3.2" {...ink} /><path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18" {...ink} /></>);
    case 'list':
      return <path d="M9 7h10M9 12h10M9 17h10M5 7h.01M5 12h.01M5 17h.01" {...ink} />;
    case 'eye':
      return (<><path d="M2.5 12S6.5 7 12 7s9.5 5 9.5 5-4 5-9.5 5-9.5-5-9.5-5z" {...ink} /><circle cx="12" cy="12" r="2.2" {...ink} /></>);
    case 'user':
      return (<><circle cx="12" cy="8" r="3" {...ink} /><path d="M5.5 19c1-3 3.2-4.5 6.5-4.5s5.5 1.5 6.5 4.5" {...ink} /></>);
    case 'settings':
      return (<><circle cx="12" cy="12" r="3" {...ink} /><path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.4 1.4M16.6 16.6 18 18M18 6l-1.4 1.4M7.4 16.6 6 18" {...ink} /></>);
    case 'chat':
      return <path d="M5 6h14v8H9l-4 3V6z" {...ink} />;
    case 'check':
      return <path d="M5 12.5 10 17l9-10" {...ink} />;
    case 'x':
      return <path d="M7 7l10 10M17 7 7 17" {...ink} />;
    case 'camera':
      return (<><path d="M4 8h3.2L9 6h6l1.8 2H20v10H4V8z" {...ink} /><circle cx="12" cy="13" r="2.6" {...ink} /></>);
    case 'game':
      return (<><path d="M7 10h10a3.5 3.5 0 0 1 3.5 3.5v.5A2.5 2.5 0 0 1 18 16.5h-.8L15.5 15h-7l-1.7 1.5H6A2.5 2.5 0 0 1 3.5 14v-.5A3.5 3.5 0 0 1 7 10z" {...ink} /><path d="M8 12.5v2.5M6.8 13.7h2.4M16.2 13h.01M17.8 14.6h.01" {...ink} /></>);
    case 'music':
      return (<><path d="M9 17.5a2 2 0 1 1-1.2-1.8V7l9-2v8.2" {...ink} /><circle cx="16.2" cy="15.2" r="2" {...ink} /></>);
    case 'move':
      return (<><circle cx="12" cy="5.5" r="2" {...ink} /><path d="M9 20.5 11 13l1.2 2.2L13.4 13 15.5 20.5M10 10.5h4l.8 2.2H9.2l.8-2.2z" {...ink} /></>);
    case 'pencil':
      return <path d="M4 20l3.2-.8L18 8.4 15.6 6 4.8 16.8 4 20zM13.8 7.8l2.4 2.4" {...ink} />;
    case 'prompt':
      return (<><path d="M4 6h16v8H8l-4 3V6z" {...ink} /><path d="M8 9h8M8 12h5" {...ink} /></>);
    case 'refresh':
      return <path d="M19 12a7 7 0 1 1-2-5M19 4.5V9h-4.5" {...ink} />;
    case 'brain':
      return <path d="M9 7a2.5 2.5 0 0 0-2.5 2.5A2.5 2.5 0 0 0 7 14a2.5 2.5 0 0 0 2.5 2.5H11V7H9zm6 0h-2v9.5h1.5A2.5 2.5 0 0 0 17 14a2.5 2.5 0 0 0 .5-4.5A2.5 2.5 0 0 0 15 7z" {...ink} />;
    case 'hourglass':
      return <path d="M7 4h10M7 20h10M8 4c0 3.5 4 4.5 4 8s-4 4.5-4 8M16 4c0 3.5-4 4.5-4 8s4 4.5 4 8" {...ink} />;
    case 'cloud':
      return <path d="M7 17h9.2A3.6 3.6 0 0 0 16 10.2 4.6 4.6 0 0 0 7.6 12 3.2 3.2 0 0 0 7 17z" {...ink} />;
    case 'star':
      return <path d="m12 3.5 2 5.2 5.5.5-4.2 3.5 1.3 5.3L12 15.4 7.4 18l1.3-5.3L4.5 9.2l5.5-.5 2-5.2z" {...ink} />;
    default:
      return <circle cx="12" cy="12" r="6" {...ink} />;
  }
}

function Icon({ name, className = 'w-7 h-7' }: { name: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {iconNode(name)}
    </svg>
  );
}

function SvgIcon({ name, x, y, size = 18, color = 'currentColor' }: { name: string; x: number; y: number; size?: number; color?: string }) {
  return (
    <svg x={x} y={y} width={size} height={size} viewBox="0 0 24 24" style={{ color }}>
      {iconNode(name)}
    </svg>
  );
}

function IconTile({ name, label, tone = '#266B38' }: { name: string; label: string; tone?: string }) {
  return (
    <div className="flex flex-col items-center text-center gap-3 rounded-2xl border border-black/10 px-3 py-5 bg-black/[0.02]">
      <span className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ color: tone, background: '#F4EBE0' }}>
        <Icon name={name} className="w-8 h-8" />
      </span>
      <span className="text-[0.95rem] font-medium leading-tight">{label}</span>
    </div>
  );
}

function Badge({
  name,
  bg,
  fg,
  size = 'w-14 h-14',
  ring,
}: {
  name: string;
  bg: string;
  fg: string;
  size?: string;
  ring?: string;
}) {
  return (
    <span
      className={`${size} shrink-0 rounded-full flex items-center justify-center`}
      style={{ background: bg, color: fg, boxShadow: ring ? `0 0 0 5px ${ring}` : undefined }}
    >
      <Icon name={name} className="w-[64%] h-[64%]" />
    </span>
  );
}

const face = 'Inter, system-ui, sans-serif';

const art = {
  line: '#3D3A2E',
  skin: '#F2C9A5',
  blush: '#F4A38A',
  hair: '#3A2A22',
  hoodie: '#4E8A5B',
  hoodieShade: '#3F7A4C',
  wood: '#D8B48A',
  woodShade: '#B98D60',
  paper: '#FFF8EE',
};

const outline = {
  fill: 'none',
  stroke: art.line,
  strokeWidth: 1.1,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function Grain({ id, opacity = 0.18 }: { id: string; opacity?: number }) {
  return (
    <filter id={id} x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise" />
      <feColorMatrix in="noise" type="saturate" values="0" result="mono" />
      <feComponentTransfer in="mono" result="soft">
        <feFuncA type="linear" slope={opacity} />
      </feComponentTransfer>
      <feComposite in="soft" in2="SourceGraphic" operator="in" result="grain" />
      <feMerge>
        <feMergeNode in="SourceGraphic" />
        <feMergeNode in="grain" />
      </feMerge>
    </filter>
  );
}

function Desk({ y = 60 }: { y?: number }) {
  return (
    <>
      <ellipse cx="60" cy={y + 15} rx="50" ry="3" fill="#3D3A2E" opacity="0.08" />
      <rect x="8" y={y} width="104" height="5" rx="2" fill={art.wood} />
      <rect x="8" y={y + 4} width="104" height="2" rx="1" fill={art.woodShade} />
      <path d={`M16 ${y + 6}v9M104 ${y + 6}v9`} stroke={art.woodShade} strokeWidth="2.4" strokeLinecap="round" />
    </>
  );
}

function ImpactArt({ kind }: { kind: 'start' | 'drift' | 'momentum' | 'doubt' }) {
  const id = useId().replace(/:/g, '');
  const wash = `${id}w`;
  const glow = `${id}g`;
  const beam = `${id}b`;
  const cloud = `${id}c`;
  const hill = `${id}h`;
  const grain = `${id}n`;
  return (
    <svg viewBox="0 0 120 80" className="w-full h-auto" aria-hidden>
      <defs>
        <radialGradient id={wash} cx="50%" cy="58%" r="62%">
          <stop offset="0" stopColor="#FDEFD6" />
          <stop offset="0.7" stopColor="#FDEFD6" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FDEFD6" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={glow}>
          <stop offset="0" stopColor="#DBEE7B" stopOpacity="0.95" />
          <stop offset="1" stopColor="#DBEE7B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={beam} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE3A0" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFE3A0" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={cloud} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4F1EA" />
          <stop offset="1" stopColor="#C9CFD3" />
        </linearGradient>
        <linearGradient id={hill} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E3ECD4" />
          <stop offset="1" stopColor="#F3F0E4" />
        </linearGradient>
        <Grain id={grain} opacity={0.12} />
      </defs>
      <g filter={`url(#${grain})`}>
        <ellipse cx="60" cy="44" rx="60" ry="38" fill={`url(#${wash})`} />

        {kind === 'start' && (
          <>
            <polygon points="88,27 96,24 108,60 72,60" fill={`url(#${beam})`} />
            <path d="M100 60V31l-8-9" fill="none" stroke={art.line} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M84 21.5 94 16l4.5 8.5-10 5.2z" fill="#24633E" />
            <path d="M88.5 29.7 98.5 24.5" stroke="#FFE3A0" strokeWidth="1.2" strokeLinecap="round" />
            <Desk />
            <circle cx="22" cy="57" r="11" fill={`url(#${glow})`} />
            <rect x="15" y="56" width="15" height="4" rx="1.6" fill="#1C1917" />
            <rect x="17" y="56.8" width="8" height="1.2" rx="0.6" fill="#DBEE7B" />
            <rect x="66" y="51" width="27" height="9" rx="1.2" fill="#F89200" />
            <rect x="68" y="44" width="23" height="7" rx="1.2" fill="#24633E" />
            <rect x="65" y="38" width="26" height="6" rx="1.2" fill="#FDD6A0" />
            <path d="M68 55.5h22M70 47.5h18M67 41h21" stroke={art.paper} strokeWidth="0.7" opacity="0.8" />
            <path d="M72 33.5v2.6M78 31.5v4.2M84 33.5v2.6" stroke={art.woodShade} strokeWidth="1.1" strokeLinecap="round" />
            <path d="M30 60c1.6-11 9-17 19-17s16 6 18 17z" fill={art.hoodie} />
            <path d="M44 44c3 5 9 6 14 3" fill="none" stroke={art.hoodieShade} strokeWidth="1.2" />
            <path d="M31 58.5c7-3.2 17-3.4 25-.6" fill="none" stroke={art.hoodieShade} strokeWidth="5" strokeLinecap="round" />
            <circle cx="46" cy="47" r="9" fill={art.skin} />
            <path d="M37 46.5c-.5-7.5 6-11.5 12.4-10.2 5 1 8.2 5.2 7 9.4-3-3.2-8.4-4.4-12.4-3.2-3 1-5 2.8-7 4z" fill={art.hair} />
            <path d="M41.6 49.4c1 .8 2.5.8 3.5 0" {...outline} strokeWidth={0.9} />
            <circle cx="49.4" cy="51.2" r="1.6" fill={art.blush} opacity="0.55" />
            <path d="M28 33c-3.4-1.6-2.6-6 .8-6 .2-3.2 4.6-4 5.8-1.2 2-1.6 5-.2 4.4 2.4" fill="none" stroke="#9DB3A6" strokeWidth="1" strokeDasharray="1.6 2" strokeLinecap="round" />
          </>
        )}

        {kind === 'drift' && (
          <>
            <Desk />
            <path d="M80 56c4-3 9-3 13 0 4-3 9-3 13 0v4c-4-3-9-3-13 0-4-3-9-3-13 0z" fill={art.paper} stroke="#C9B79C" strokeWidth="0.8" opacity="0.75" />
            <path d="M93 56v4" stroke="#C9B79C" strokeWidth="0.6" />
            <circle cx="24" cy="34" r="22" fill={`url(#${glow})`} />
            <rect x="15" y="15" width="18" height="35" rx="4" fill="#1C1917" />
            <rect x="17" y="18" width="14" height="28" rx="2.2" fill="#24633E" />
            <rect x="18.4" y="21" width="11.2" height="4.2" rx="1.6" fill="#DBEE7B" />
            <rect x="18.4" y="27.2" width="11.2" height="4.2" rx="1.6" fill="#FDD6A0" />
            <rect x="18.4" y="33.4" width="7.6" height="4.2" rx="1.6" fill={art.paper} opacity="0.85" />
            <circle cx="32.5" cy="16" r="3.4" fill="#F89200" stroke="#FFF8EE" strokeWidth="1" />
            <path d="M38 22.5c2.8 2.2 2.8 6.4 0 8.6M41.4 19.4c5 3.8 5 11 0 14.8" fill="none" stroke="#F89200" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M36 37C47 34 53 28.5 61 31" fill="none" stroke="#F89200" strokeWidth="1.1" strokeDasharray="2 2.4" strokeLinecap="round" />
            <path d="M56 60c1-10 7-16 15-16s13 6 14 16z" fill={art.hoodie} />
            <path d="M64 46c2.4 3.6 7 4.6 11 2.4" fill="none" stroke={art.hoodieShade} strokeWidth="1.2" />
            <circle cx="68" cy="36" r="9" fill={art.skin} />
            <path d="M60 34.4c.8-7.4 8-10.4 14-8.4 4 1.4 6.2 5 5.2 8.4-3-3-7.2-3.4-10.4-2.2-3.8 1.4-6 2.2-8.8 2.2z" fill={art.hair} />
            <circle cx="63.4" cy="37.2" r="1.15" fill={art.line} />
            <path d="M62.6 41.4c1 .6 2.2.6 3 0" {...outline} strokeWidth={0.8} />
            <circle cx="66.6" cy="40" r="1.5" fill={art.blush} opacity="0.5" />
            <path d="M80.5 29.5 83.5 27.5M81.5 35h4M80.5 40.5l3 2" stroke="#9DB3A6" strokeWidth="1" strokeLinecap="round" />
          </>
        )}

        {kind === 'momentum' && (
          <>
            <path d="M0 72C26 68 44 54 62 46s34-14 58-16v42z" fill={`url(#${hill})`} />
            <path d="M2 71C28 67 45 53 62 46" fill="none" stroke="#4E8A5B" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M62 46c18-8 34-13 56-15" fill="none" stroke="#9DB3A6" strokeWidth="1" strokeDasharray="2 3" strokeLinecap="round" />
            {[
              [14, 68.6, '#24633E'],
              [28, 64.6, '#24633E'],
              [42, 58, '#4E8A5B'],
              [55, 50.2, '#A7C66A'],
            ].map(([x, y, c]) => (
              <g key={String(x)}>
                <ellipse cx={Number(x)} cy={Number(y) + 3} rx="5" ry="1.4" fill="#3D3A2E" opacity="0.1" />
                <circle cx={Number(x)} cy={Number(y)} r="4.4" fill={String(c)} />
                <path d={`M${Number(x) - 1.8} ${Number(y)}l1.3 1.3 2.4-2.6`} fill="none" stroke="#FFF8EE" strokeWidth="1" strokeLinecap="round" />
              </g>
            ))}
            {[
              [76, 40.4],
              [90, 36.4],
              [104, 33.4],
            ].map(([x, y]) => (
              <circle key={x} cx={x} cy={y} r="4" fill="none" stroke="#B7BFAF" strokeWidth="1" strokeDasharray="1.6 1.6" />
            ))}
            <path d="M64.5 41.5 67 45l-2 2.4 2.6 3" fill="none" stroke="#F89200" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M110 31V15" stroke={art.line} strokeWidth="1.2" strokeLinecap="round" />
            <path d="M110 15.5c3.2-1.4 6 1.4 9.4 0v6.4c-3.4 1.4-6.2-1.4-9.4 0z" fill="#F89200" opacity="0.55" />
            <circle cx="60" cy="38" r="3.6" fill={art.skin} />
            <path d="M56.6 37c.4-3 3-4.4 5.6-3.6 1.6.6 2.2 2 1.8 3.2-1.4-1.2-3.4-1.4-4.6-.8-1.2.6-1.8 1-2.8 1.2z" fill={art.hair} />
            <path d="M57.4 48.6c.2-3.6 1.4-6 2.8-6.6 1.6.4 2.6 2.8 2.6 6.2z" fill={art.hoodie} />
            <path d="M58 44.6 54.4 47M62.4 44.4 66 46" stroke={art.hoodieShade} strokeWidth="1.4" strokeLinecap="round" />
            <path d="M40 22l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1zM24 34l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7z" fill="#A7C66A" opacity="0.8" />
          </>
        )}

        {kind === 'doubt' && (
          <>
            <ellipse cx="48" cy="70" rx="30" ry="3.2" fill="#3D3A2E" opacity="0.1" />
            <path d="M74 30c-7 0-9.4-8.4-2.6-10.6-1-6.4 7.6-9.6 11-4.8 3.4-4.4 12-2 10.6 4.6 5.6.8 5.4 9.8-1 10.8z" fill={`url(#${cloud})`} stroke="#AEB6BA" strokeWidth="0.9" />
            <path d="M82 14.8a3 3 0 1 1 3.8 2.9c-.9.3-1.2.9-1.2 1.7v.8M84.6 23.4v.1" fill="none" stroke="#5E6B7A" strokeWidth="1.4" strokeLinecap="round" />
            <path d="M76 34l-1.4 4M83 34l-1.4 4M90 34l-1.4 4M79.4 41l-1 3M86.4 41l-1 3" stroke="#8FB7D6" strokeWidth="1.1" strokeLinecap="round" />
            <circle cx="66" cy="38" r="1.6" fill="#C9CFD3" />
            <circle cx="61" cy="43" r="1" fill="#C9CFD3" />
            <path d="M28 70c-2-12 4-22 16-23 10-.6 17 4 18 14l1 9z" fill={art.hoodie} />
            <path d="M40 54c6-2 14-1 20 4l2 12H36z" fill={art.hoodieShade} />
            <path d="M42 56c5-3 12-2 15 2" fill="none" stroke="#2F5E3B" strokeWidth="1.1" strokeLinecap="round" />
            <circle cx="48" cy="44" r="9" fill={art.skin} />
            <path d="M39 42c.4-7.4 7.4-11 13.6-9.2 4.6 1.4 7 5.6 5.6 9.4-3.2-3-8-3.8-11.8-2.6-3 1-5 1.6-7.4 2.4z" fill={art.hair} />
            <path d="M43.4 46.2h2.6M50.4 46.2H53M46.4 50.4c1.2-.6 2.6-.6 3.8 0" {...outline} strokeWidth={0.9} />
            <path d="M98 70v-6" stroke="#8A9A5B" strokeWidth="1.1" strokeLinecap="round" />
            <path d="M98 65c-3.6.4-5.4-1.6-5.8-4.4 3.2-.4 5.4 1.4 5.8 4.4zM98 64.4c1.4-3 4-4 6.4-3.4-.8 3-3.4 4-6.4 3.4z" fill="#C6CF8F" stroke="#8A9A5B" strokeWidth="0.7" />
            <path d="M92 70h12" stroke={art.woodShade} strokeWidth="1.4" strokeLinecap="round" />
          </>
        )}
      </g>
    </svg>
  );
}

function HomeSchool() {
  const home = [
    { icon: 'music', label: 'Short video', x: 200, y: 98 },
    { icon: 'camera', label: 'Social', x: 238, y: 168 },
    { icon: 'game', label: 'Games', x: 196, y: 236 },
  ];
  const school = [
    { icon: 'book', label: 'Class' },
    { icon: 'people', label: 'Friends' },
    { icon: 'move', label: 'Movement' },
  ];
  return (
    <svg viewBox="0 0 760 300" className="w-full" role="img" aria-label="At home the evening is the phone. At school the day is class, friends, and movement.">
      <defs>
        <linearGradient id="hs-home" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6D3A4" />
          <stop offset="1" stopColor="#FBEBD3" />
        </linearGradient>
        <linearGradient id="hs-school" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D9EAC6" />
          <stop offset="1" stopColor="#F1F6E6" />
        </linearGradient>
        <linearGradient id="hs-night" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#273257" />
          <stop offset="1" stopColor="#5B5E8E" />
        </linearGradient>
        <radialGradient id="hs-glow">
          <stop offset="0" stopColor="#FFE7B0" stopOpacity="0.95" />
          <stop offset="0.6" stopColor="#FFD58A" stopOpacity="0.35" />
          <stop offset="1" stopColor="#FFD58A" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="hs-sun">
          <stop offset="0" stopColor="#FFF4C2" />
          <stop offset="1" stopColor="#FFF4C2" stopOpacity="0" />
        </radialGradient>
        <filter id="hs-soft" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#5A3A12" floodOpacity="0.14" />
        </filter>
        <clipPath id="hs-clip-home">
          <rect x="8" y="8" width="360" height="284" rx="22" />
        </clipPath>
        <clipPath id="hs-clip-school">
          <rect x="392" y="8" width="360" height="284" rx="22" />
        </clipPath>
        <Grain id="hs-grain" opacity={0.1} />
      </defs>

      <g clipPath="url(#hs-clip-home)" filter="url(#hs-grain)">
        <rect x="8" y="8" width="360" height="284" fill="url(#hs-home)" />
        <rect x="8" y="246" width="360" height="46" fill="#EBC99A" />
        <path d="M8 246h360" stroke="#D9AE76" strokeWidth="1.5" />
        <rect x="268" y="22" width="78" height="62" rx="6" fill="url(#hs-night)" stroke="#C99A62" strokeWidth="4" />
        <path d="M307 22v62M268 53h78" stroke="#C99A62" strokeWidth="3" />
        <path d="M330 38a9 9 0 1 1-9-9 6.8 6.8 0 0 0 9 9z" fill="#FFF1C9" />
        <circle cx="284" cy="36" r="1.4" fill="#FFF1C9" />
        <circle cx="290" cy="72" r="1.1" fill="#FFF1C9" />
        <circle cx="332" cy="74" r="1.3" fill="#FFF1C9" />
        <circle cx="96" cy="152" r="104" fill="url(#hs-glow)" />
        <ellipse cx="160" cy="166" rx="92" ry="74" fill="none" stroke="#E59019" strokeOpacity="0.45" strokeWidth="1.5" strokeDasharray="3 7" />
        <ellipse cx="96" cy="244" rx="46" ry="6" fill="#5A3A12" opacity="0.14" />
        <rect x="52" y="66" width="88" height="172" rx="18" fill="#1C1917" filter="url(#hs-soft)" />
        <rect x="60" y="78" width="72" height="140" rx="11" fill="#FFF8EE" />
        <rect x="80" y="70" width="32" height="4" rx="2" fill="#3A3634" />
        <rect x="68" y="90" width="56" height="34" rx="7" fill="#F89200" opacity="0.85" />
        <path d="M91 100v14l11-7z" fill="#FFF8EE" />
        <rect x="68" y="132" width="56" height="8" rx="4" fill="#FDD6A0" />
        <rect x="68" y="146" width="40" height="8" rx="4" fill="#FDD6A0" opacity="0.7" />
        <rect x="68" y="166" width="25" height="25" rx="6" fill="#F8E6CD" />
        <rect x="99" y="166" width="25" height="25" rx="6" fill="#F8E6CD" />
        <circle cx="80.5" cy="178.5" r="5" fill="#E59019" opacity="0.6" />
        <path d="M107 178.5h9M111.5 174v9" stroke="#E59019" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <circle cx="96" cy="208" r="3" fill="#1C1917" opacity="0.2" />
        {home.map((item) => (
          <g key={item.label}>
            <path d={`M140 ${(item.y + 152) / 2} Q ${(140 + item.x) / 2} ${item.y} ${item.x - 26} ${item.y}`} fill="none" stroke="#E59019" strokeWidth="1.2" strokeOpacity="0.55" />
            <circle cx={item.x} cy={item.y} r="26" fill="#FFF8EE" filter="url(#hs-soft)" />
            <circle cx={item.x} cy={item.y} r="20" fill="#FCE3BF" />
            <SvgIcon name={item.icon} x={item.x - 12} y={item.y - 12} size={24} color="#C26A0A" />
            <text x={item.x + 34} y={item.y + 5} fill="#6B4410" fontSize="13" fontWeight="700" fontFamily={face}>{item.label}</text>
          </g>
        ))}
      </g>
      <text x="32" y="38" fill="#C26A0A" fontSize="18" fontWeight="800" fontFamily={face}>At home</text>
      <text x="32" y="56" fill="#8A5A12" fontSize="12" fontFamily={face}>19:00, the room goes quiet</text>
      <text x="32" y="276" fill="#8A5A12" fontSize="13" fontWeight="600" fontFamily={face}>Alone with the phone</text>

      <g clipPath="url(#hs-clip-school)" filter="url(#hs-grain)">
        <rect x="392" y="8" width="360" height="284" fill="url(#hs-school)" />
        <circle cx="712" cy="44" r="46" fill="url(#hs-sun)" />
        <circle cx="712" cy="44" r="13" fill="#FFE17A" />
        <path d="M712 20v-6M712 74v-6M688 44h-6M742 44h-6M695 27l-4-4M733 65l-4-4M729 27l4-4M691 65l4-4" stroke="#F2C14E" strokeWidth="2" strokeLinecap="round" />
        <path d="M392 252c40-14 90-16 140-6s120 8 220-8v54H392z" fill="#C9DDAF" />
        <path d="M392 266c60-10 120-8 190 0s110 4 170-6v32H392z" fill="#B3CF92" />
        <circle cx="720" cy="226" r="22" fill="#7FAF6A" />
        <circle cx="704" cy="236" r="16" fill="#8FBC77" />
        <path d="M716 246v20" stroke="#7A5A3A" strokeWidth="4" strokeLinecap="round" />
        <rect x="418" y="70" width="160" height="104" rx="8" fill="#9A774F" filter="url(#hs-soft)" />
        <rect x="425" y="77" width="146" height="90" rx="4" fill="#2F5D45" />
        <text x="438" y="104" fill="#F1F6E6" fontSize="15" fontFamily="'Comic Sans MS', 'Marker Felt', cursive" opacity="0.9">a² + b² = c²</text>
        <path d="M440 150l18-16 16 8 22-22 18 10" fill="none" stroke="#DBEE7B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
        <path d="M548 128l3 6 6.6 1-4.8 4.6 1.2 6.4-6-3.2-6 3.2 1.2-6.4-4.8-4.6 6.6-1z" fill="none" stroke="#FDD6A0" strokeWidth="1.5" />
        <rect x="430" y="174" width="136" height="5" rx="2" fill="#7A5A3A" />
        {[446, 484, 522, 560].map((x, i) => (
          <g key={x}>
            <path d={`M${x - 14} 232c0-14 6-22 14-22s14 8 14 22z`} fill={['#4E8A5B', '#F89200', '#4D7FCB', '#A57CC9'][i]} />
            <circle cx={x} cy="200" r="10" fill={art.skin} />
            <path d={`M${x - 10} 198c0-8 6-11 10-11s10 3 10 11c-3-3-6-4-10-4s-7 1-10 4z`} fill={art.hair} />
          </g>
        ))}
        <rect x="424" y="232" width="152" height="8" rx="3" fill={art.wood} />
        {school.map((item, i) => (
          <g key={item.label}>
            <circle cx={620} cy={92 + i * 54} r="22" fill="#FFF8EE" filter="url(#hs-soft)" />
            <circle cx={620} cy={92 + i * 54} r="17" fill="#E3ECD4" />
            <SvgIcon name={item.icon} x={609} y={81 + i * 54} size={22} color="#266B38" />
            <text x="652" y={97 + i * 54} fill="#2F4A37" fontSize="13" fontWeight="700" fontFamily={face}>{item.label}</text>
          </g>
        ))}
      </g>
      <text x="416" y="38" fill="#266B38" fontSize="18" fontWeight="800" fontFamily={face}>At school</text>
      <text x="416" y="56" fill="#47574C" fontSize="12" fontFamily={face}>08:00–16:30, a full room</text>
      <text x="416" y="276" fill="#2F4A37" fontSize="13" fontWeight="600" fontFamily={face}>Structure, company, and motion</text>
    </svg>
  );
}

function HabitLoop() {
  const steps = [
    { label: 'Open', icon: 'phone', time: '19:00' },
    { label: 'Notice', icon: 'bell', time: '19:02' },
    { label: 'Reply', icon: 'reply', time: '19:10' },
    { label: 'Browse', icon: 'scroll', time: '19:40' },
    { label: 'Lose it', icon: 'lost', time: '21:00' },
  ];
  return (
    <svg viewBox="0 0 880 240" className="w-full" role="img" aria-label="Habit loop: open the phone, notice a cue, reply, keep browsing, lose the task, then repeat">
      <defs>
        <linearGradient id="hl-track" gradientUnits="userSpaceOnUse" x1="90" y1="0" x2="790" y2="0">
          <stop offset="0" stopColor="#FDE3C4" />
          <stop offset="1" stopColor="#F89200" />
        </linearGradient>
        <radialGradient id="hl-node" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFEBD3" />
        </radialGradient>
        <radialGradient id="hl-last" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#F9A93C" />
          <stop offset="1" stopColor="#C2410C" />
        </radialGradient>
        <radialGradient id="hl-halo">
          <stop offset="0" stopColor="#F89200" stopOpacity="0.28" />
          <stop offset="1" stopColor="#F89200" stopOpacity="0" />
        </radialGradient>
        <filter id="pb-node" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#C2410C" floodOpacity="0.2" />
        </filter>
        <marker id="hl-arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 10 5 0 10z" fill="#F89200" />
        </marker>
      </defs>
      <path d="M90 86 H790" stroke="url(#hl-track)" strokeWidth="12" strokeLinecap="round" opacity="0.55" />
      <path d="M90 86 H790" stroke="#FFF8EE" strokeWidth="2" strokeDasharray="1 14" strokeLinecap="round" />
      <path d="M826 104 C866 146 846 196 726 196 H170 C70 196 36 156 50 114" fill="none" stroke="#F89200" strokeWidth="2" strokeDasharray="7 6" markerEnd="url(#hl-arrow)" />
      {[220, 380, 540, 700].map((x, i) => (
        <circle key={x} cx={x} cy={196} r={2.4 - i * 0.4} fill="#F89200" opacity={0.7 - i * 0.12} />
      ))}
      {steps.map((step, i) => {
        const x = 90 + i * 175;
        const last = i === steps.length - 1;
        return (
          <g key={step.label}>
            <circle cx={x} cy="86" r="50" fill="url(#hl-halo)" />
            <circle cx={x} cy="86" r="33" fill={last ? 'url(#hl-last)' : 'url(#hl-node)'} stroke="#F89200" strokeWidth="2" filter="url(#pb-node)" />
            <circle cx={x} cy="86" r="26" fill="none" stroke={last ? '#FFE3C4' : '#F89200'} strokeOpacity="0.35" strokeDasharray="2 3" />
            <SvgIcon name={step.icon} x={x - 16} y={70} size={32} color={last ? '#FFF8EE' : '#C2410C'} />
            <circle cx={x + 24} cy="60" r="10" fill="#1C1917" />
            <text x={x + 24} y="64" textAnchor="middle" fill="#FFF8EE" fontSize="11" fontWeight="800" fontFamily={face}>{i + 1}</text>
            <text x={x} y="144" textAnchor="middle" fill="#3A3C38" fontSize="14" fontWeight="800" fontFamily={face}>{step.label}</text>
            <text x={x} y="162" textAnchor="middle" fill="#C2410C" fillOpacity={0.45 + i * 0.12} fontSize="11" fontFamily="ui-monospace, Menlo, monospace">{step.time}</text>
          </g>
        );
      })}
      <rect x="370" y="208" width="140" height="26" rx="13" fill="#FFF3E6" stroke="#F89200" strokeOpacity="0.5" />
      <text x="440" y="225" textAnchor="middle" fill="#C2410C" fontSize="12" fontWeight="800" fontFamily={face}>The loop starts again</text>
    </svg>
  );
}

function SystemsMap() {
  const nodes = [
    { cx: 170, cy: 150, color: '#7C63A7', light: '#F4EEF8', mid: '#E3D7F0', title: 'Social', sub: 'mPFC · TPJ', icon: 'people' },
    { cx: 400, cy: 262, color: '#E07A2F', light: '#FFF3E8', mid: '#FDDCC0', title: 'Reward', sub: 'VTA → NAC', icon: 'spark' },
    { cx: 630, cy: 150, color: '#266B38', light: '#E8F3EA', mid: '#CDE5D2', title: 'Habit', sub: 'Striatum', icon: 'loop' },
  ];
  const links = [
    { d: 'M240 190 C290 240 320 250 330 252', color: '#7C63A7', label: 'approval', x: 262, y: 246 },
    { d: 'M470 252 C510 240 540 220 566 192', color: '#266B38', label: 'cue', x: 540, y: 248 },
    { d: 'M236 112 C330 50 470 50 566 112', color: '#E07A2F', label: 'craving', x: 400, y: 52 },
  ];
  return (
    <svg viewBox="0 0 800 390" className="w-full" role="img" aria-label="Three systems: social cognition, reward, and habit, linked in a triangle around the phone">
      <defs>
        <radialGradient id="sm-field" cx="50%" cy="50%" r="55%">
          <stop offset="0" stopColor="#F8D49C" stopOpacity="0.55" />
          <stop offset="1" stopColor="#F8D49C" stopOpacity="0" />
        </radialGradient>
        {nodes.map((node) => (
          <radialGradient key={node.title} id={`sm-${node.title}`} cx="40%" cy="35%" r="75%">
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset="0.55" stopColor={node.light} />
            <stop offset="1" stopColor={node.mid} />
          </radialGradient>
        ))}
        <radialGradient id="sm-phone">
          <stop offset="0" stopColor="#DBEE7B" stopOpacity="0.9" />
          <stop offset="1" stopColor="#DBEE7B" stopOpacity="0" />
        </radialGradient>
        <filter id="sm-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#3D3A2E" floodOpacity="0.14" />
        </filter>
        {links.map((link) => (
          <marker key={link.label} id={`sm-a-${link.label}`} viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto">
            <path d="M0 0 10 5 0 10z" fill={link.color} />
          </marker>
        ))}
        <Grain id="sm-grain" opacity={0.08} />
      </defs>
      <g filter="url(#sm-grain)">
        <ellipse cx="400" cy="195" rx="380" ry="190" fill="url(#sm-field)" />
        <path
          d="M400 66c-40-30-120-30-150 10-50-4-90 40-74 90-30 30-20 90 30 104 10 40 70 60 110 34 30 26 76 26 84 0 8 26 54 26 84 0 40 26 100 6 110-34 50-14 60-74 30-104 16-50-24-94-74-90-30-40-110-40-150-10z"
          fill="none"
          stroke="#C9A27A"
          strokeOpacity="0.28"
          strokeWidth="2"
          strokeDasharray="1 7"
          strokeLinecap="round"
        />
        <path d="M400 66v238" stroke="#C9A27A" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="1 7" strokeLinecap="round" />
      </g>
      {links.map((link) => (
        <g key={link.label}>
          <path d={link.d} fill="none" stroke={link.color} strokeWidth="2" strokeDasharray="6 5" markerEnd={`url(#sm-a-${link.label})`} />
          <rect x={link.x - 34} y={link.y - 13} width="68" height="22" rx="11" fill="#FFF8EE" stroke={link.color} strokeOpacity="0.4" />
          <text x={link.x} y={link.y + 3} textAnchor="middle" fill={link.color} fontSize="12" fontWeight="700" fontFamily={face}>{link.label}</text>
        </g>
      ))}
      <circle cx="400" cy="138" r="48" fill="url(#sm-phone)" />
      <rect x="384" y="110" width="32" height="56" rx="7" fill="#1C1917" />
      <rect x="388" y="116" width="24" height="42" rx="3" fill="#24633E" />
      <circle cx="400" cy="137" r="6" fill="#DBEE7B" />
      {nodes.map((node) => (
        <g key={node.title} filter="url(#sm-shadow)">
          <circle cx={node.cx} cy={node.cy} r="78" fill={`url(#sm-${node.title})`} stroke={node.color} strokeWidth="2.5" />
          <circle cx={node.cx} cy={node.cy} r="68" fill="none" stroke={node.color} strokeOpacity="0.25" strokeDasharray="2 5" />
          <circle cx={node.cx} cy={node.cy - 20} r="28" fill="#fff" stroke={node.color} strokeOpacity="0.2" />
          <SvgIcon name={node.icon} x={node.cx - 17} y={node.cy - 37} size={34} color={node.color} />
          <text x={node.cx} y={node.cy + 24} textAnchor="middle" fill={node.color} fontSize="17" fontWeight="800" fontFamily={face}>{node.title}</text>
          <text x={node.cx} y={node.cy + 44} textAnchor="middle" fill="#47574C" fontSize="12" fontFamily={face}>{node.sub}</text>
        </g>
      ))}
    </svg>
  );
}

function ConstantlyChart() {
  const person = (x: number, y: number, fill: string) => (
    <g key={`${x}-${y}`}>
      <circle cx={x} cy={y - 5} r="3.3" fill={fill} />
      <path d={`M${x - 5} ${y + 8}c0-5.2 2.2-7.6 5-7.6s5 2.4 5 7.6z`} fill={fill} />
    </g>
  );
  const rows = [
    { label: 'Then', y: 72, filled: 6, color: '#A7C66A', value: '24%' },
    { label: '2024', y: 116, filled: 12, color: '#266B38', value: '46%' },
  ];
  return (
    <svg viewBox="0 0 640 180" className="w-full max-w-2xl" role="img" aria-label="U.S. teens online almost constantly: 24 percent a decade ago, 46 percent in 2024">
      <text x="0" y="22" fill="#266B38" fontSize="15" fontWeight="800" fontFamily={face}>Online almost constantly</text>
      {rows.map((row) => (
        <g key={row.label}>
          <rect x="150" y={row.y - 15} width="370" height="30" rx="15" fill="#F4ECDD" />
          <text x="138" y={row.y + 4} textAnchor="end" fill="#47574C" fontSize="13" fontWeight="600" fontFamily={face}>{row.label}</text>
          {Array.from({ length: 25 }, (_, i) => person(164 + i * 14.4, row.y, i < row.filled ? row.color : '#DCD2C1'))}
          <text x="534" y={row.y + 6} fill={row.color} fontSize="18" fontWeight="800" fontFamily={face}>{row.value}</text>
        </g>
      ))}
      <text x="150" y="166" fill="#7C807D" fontSize="12" fontFamily={face}>Pew Research Center · U.S. teens 13–17 · each figure ≈ 4%</text>
    </svg>
  );
}

function Architecture() {
  const cols = [
    { title: 'Home', icon: 'home', items: [{ t: 'Today', icon: 'sun' }, { t: 'Focus', icon: 'timer' }] },
    { title: 'Learning', icon: 'book', items: [{ t: 'Group', icon: 'people' }, { t: 'Session', icon: 'timer' }] },
    { title: 'Progress', icon: 'plant', items: [{ t: 'Streak', icon: 'spark' }, { t: 'Garden', icon: 'plant' }] },
    { title: 'Profile', icon: 'user', items: [{ t: 'Length', icon: 'hourglass' }, { t: 'Settings', icon: 'settings' }] },
  ];
  const leaf = (x: number, y: number, flip = 1) => (
    <path
      key={`${x}-${y}`}
      d={`M${x} ${y}c${6 * flip}-8 ${16 * flip}-8 ${20 * flip}-4-${6 * flip} 8-${14 * flip} 8-${20 * flip} 4z`}
      fill="#A7C66A"
      stroke="#4E8A5B"
      strokeWidth="1"
    />
  );
  return (
    <svg viewBox="0 0 840 280" className="w-full" role="img" aria-label="Pull It branches into Home, Learning, Progress, and Profile">
      <defs>
        <linearGradient id="ia-root" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2F7A4A" />
          <stop offset="1" stopColor="#1E5233" />
        </linearGradient>
        <linearGradient id="ia-col" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#EAF6A6" />
          <stop offset="1" stopColor="#CFE36A" />
        </linearGradient>
        <filter id="ia-shadow" x="-20%" y="-30%" width="140%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="3.5" floodColor="#24633E" floodOpacity="0.16" />
        </filter>
      </defs>
      {cols.map((col, i) => {
        const cx = 24 + i * 204 + 90;
        return <path key={col.title} d={`M420 52 C420 84 ${cx} 72 ${cx} 104`} fill="none" stroke="#4E8A5B" strokeWidth="2.4" strokeLinecap="round" />;
      })}
      {leaf(267, 78, -1)}
      {leaf(369, 78, -1)}
      {leaf(471, 78)}
      {leaf(573, 78)}
      <rect x="330" y="8" width="180" height="44" rx="22" fill="url(#ia-root)" filter="url(#ia-shadow)" />
      <SvgIcon name="sprout" x={352} y={18} size={24} color="#DBEE7B" />
      <text x="430" y="36" textAnchor="middle" fill="#FFF8EE" fontSize="16" fontWeight="800" fontFamily={face}>Pull It</text>
      {cols.map((col, i) => {
        const x = 24 + i * 204;
        return (
          <g key={col.title}>
            <rect x={x} y="104" width="180" height="44" rx="14" fill="url(#ia-col)" filter="url(#ia-shadow)" />
            <circle cx={x + 26} cy="126" r="15" fill="#FFF8EE" />
            <SvgIcon name={col.icon} x={x + 15} y={115} size={22} color="#266B38" />
            <text x={x + 106} y="132" textAnchor="middle" fill="#1E5233" fontSize="15" fontWeight="800" fontFamily={face}>{col.title}</text>
            <path d={`M${x + 20} 148 V${230}`} stroke="#4E8A5B" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="2 4" />
            {col.items.map((item, j) => (
              <g key={item.t}>
                <circle cx={x + 20} cy={183 + j * 46} r="3" fill="#4E8A5B" />
                <rect x={x + 30} y={164 + j * 46} width="140" height="38" rx="12" fill="#FFF8EE" stroke="#47574C" strokeOpacity="0.12" filter="url(#ia-shadow)" />
                <SvgIcon name={item.icon} x={x + 42} y={172 + j * 46} size={20} color="#4E8A5B" />
                <text x={x + 108} y={188 + j * 46} textAnchor="middle" fill="#3A3C38" fontSize="13" fontWeight="600" fontFamily={face}>{item.t}</text>
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function DayLine() {
  const icons = ['alarm', 'school', 'home', 'phone', 'openBook', 'moon'];
  return (
    <svg viewBox="0 0 900 170" className="w-full" role="img" aria-label="Weekday from waking at 7 to still being awake after 10, from morning light to night">
      <defs>
        <linearGradient id="dl-sky" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#FCE3BE" />
          <stop offset="0.22" stopColor="#E2F0F4" />
          <stop offset="0.42" stopColor="#EAF2DA" />
          <stop offset="0.6" stopColor="#FBD3A6" />
          <stop offset="0.78" stopColor="#5C5F8E" />
          <stop offset="1" stopColor="#232B4F" />
        </linearGradient>
        <radialGradient id="dl-hot">
          <stop offset="0" stopColor="#FFD58A" stopOpacity="0.9" />
          <stop offset="1" stopColor="#FFD58A" stopOpacity="0" />
        </radialGradient>
        <clipPath id="dl-clip">
          <rect x="20" y="4" width="860" height="100" rx="24" />
        </clipPath>
        <Grain id="dl-grain" opacity={0.1} />
      </defs>
      <g clipPath="url(#dl-clip)" filter="url(#dl-grain)">
        <rect x="20" y="4" width="860" height="100" fill="url(#dl-sky)" />
        <path d="M20 92c90-14 170-12 260-2s180 8 260-4 200-10 340 2v20H20z" fill="#FFFFFF" opacity="0.28" />
        <circle cx="210" cy="22" r="12" fill="#FFE17A" opacity="0.9" />
        <circle cx="210" cy="22" r="20" fill="#FFE17A" opacity="0.2" />
        <path d="M826 20a9 9 0 1 1-9-9 6.6 6.6 0 0 0 9 9z" fill="#FFF1C9" />
        {[
          [700, 18],
          [748, 30],
          [778, 14],
          [860, 40],
          [688, 44],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.4" fill="#FFF1C9" />
        ))}
      </g>
      <path d="M80 62 H820" stroke="#FFFFFF" strokeOpacity="0.7" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
      {day.map((item, i) => {
        const x = 80 + i * 148;
        const hot = item.label === 'Try to study';
        const night = i >= 4;
        return (
          <g key={item.time}>
            {hot && <circle cx={x} cy="62" r="52" fill="url(#dl-hot)" />}
            <circle cx={x} cy="62" r="34" fill={hot ? '#F6D9B4' : night ? '#3A4170' : '#FFF8EE'} opacity={night && !hot ? 0.8 : 0.95} />
            <circle cx={x} cy="62" r="27" fill={hot ? '#C79A3E' : night ? '#262D52' : '#4D6F5F'} />
            <SvgIcon name={icons[i]} x={x - 14} y={48} size={28} color="#FFF4E2" />
            <text x={x} y="126" textAnchor="middle" fill="#266B38" fontSize="12" fontWeight="800" fontFamily="ui-monospace, Menlo, monospace">{item.time}</text>
            <text x={x} y="146" textAnchor="middle" fill={hot ? '#A06A12' : '#47574C'} fontSize="13" fontWeight="700" fontFamily={face}>{item.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function TimerRing() {
  return (
    <svg viewBox="0 0 220 180" className="w-full max-w-[220px]" role="img" aria-label="Focus timer showing 8 minutes 32 seconds remaining">
      <defs>
        <linearGradient id="tr-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#15151C" />
          <stop offset="1" stopColor="#0B0B0F" />
        </linearGradient>
        <linearGradient id="tr-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#DBEE7B" />
          <stop offset="1" stopColor="#5FC56F" />
        </linearGradient>
        <filter id="tr-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="8" y="8" width="204" height="164" rx="20" fill="url(#tr-bg)" />
      {Array.from({ length: 60 }, (_, i) => {
        const a = (i / 60) * Math.PI * 2;
        const r1 = i % 5 === 0 ? 58 : 60;
        return (
          <line
            key={i}
            x1={110 + Math.sin(a) * r1}
            y1={86 - Math.cos(a) * r1}
            x2={110 + Math.sin(a) * 63}
            y2={86 - Math.cos(a) * 63}
            stroke="#3A3A46"
            strokeWidth={i % 5 === 0 ? 1.6 : 0.8}
          />
        );
      })}
      <circle cx="110" cy="86" r="48" fill="none" stroke="#24242E" strokeWidth="8" />
      <circle cx="110" cy="86" r="48" fill="none" stroke="url(#tr-ring)" strokeWidth="8" strokeDasharray="210 302" strokeLinecap="round" transform="rotate(-90 110 86)" filter="url(#tr-glow)" />
      <text x="110" y="90" textAnchor="middle" fill="#fff" fontSize="22" fontFamily="ui-monospace, Menlo, monospace" fontWeight="700">08:32</text>
      <path d="M110 112v-8" stroke="#8BE28B" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M110 106c-4 0-6-2.4-6-5.4 3.6 0 6 2.2 6 5.4zM110 105c0-3.2 2.4-5.4 6-5.4 0 3-2 5.4-6 5.4z" fill="#8BE28B" />
      <text x="110" y="156" textAnchor="middle" fill="#8BE28B" fontSize="12" fontWeight="600">Focus mode</text>
    </svg>
  );
}

export default function PullBackStudy() {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-[var(--space-lg)] mb-[var(--space-xxxl)] items-start">
        <div className="flex-1 min-w-0 pt-[var(--space-md)]">
          <p className="type-caption text-[var(--color-accent-secondary)] mb-[var(--space-sm)]">Project 01</p>
          <h1 className="type-h1">Pull It</h1>
          <div className="flex gap-[var(--space-md)] mt-[var(--space-lg)] flex-wrap">
            <span className="type-caption">2026</span>
            <span className="type-caption">UI/UX design · Vibe coding</span>
          </div>
        </div>
        <div className="w-full md:w-[55%] shrink-0">
          <img
            src="./pullback/hero.jpg"
            alt="A student at a desk, phone open to Pull It, notebook and lamp nearby"
            className="w-full aspect-video rounded-3xl object-cover"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-[var(--space-lg)] mt-[var(--space-xxxl)] mb-[var(--space-xxxl)] items-start py-[var(--space-xxl)] px-[var(--space-md)] border-t border-b border-black/8">
        <h3 className="shrink-0 pt-[3px] text-[var(--color-text-muted)]" style={{ fontSize: 'clamp(1.05rem, 1.5vw, 1.25rem)', letterSpacing: '0.04em' }}>
          Overview
        </h3>
        <p className="leading-relaxed max-w-2xl ml-auto" style={{ fontSize: 'clamp(1rem, 1.3vw, 1.15rem)' }}>
          Middle school students often open their phones with a homework-related intention, but the room pulls them into messages, notifications, and endless content. Pull It is a homework companion for coming back in time.
        </p>
      </div>

      <motion.div
        className="mb-[var(--space-xxxl)]"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ duration: 0.8, ease }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-[var(--space-lg)] items-end">
          <div>
            <p className="font-bold leading-[1.1] tracking-tight" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>A simple pull.</p>
            <p className="font-bold leading-[1.1] tracking-tight text-[#24633E]" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>A powerful reset.</p>
            <p className="font-bold leading-[1.05] tracking-tight" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)' }}>Small wins grow into a garden.</p>
          </div>
          <PullTab />
        </div>
      </motion.div>

      <Block title="The offer" className="mt-[297px]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-lg)]">
          {principles.map((item, index) => (
            <div key={item.n} className="border border-[#24633E]/10 rounded-2xl px-[var(--space-lg)] py-[var(--space-md)] bg-[#F7F3EA]">
              <Mark><img src={offerArt[index]} alt="" className="w-14 h-14 object-contain" /></Mark>
              <p className="type-caption text-[#24633E] mb-[var(--space-xs)]">{item.n}</p>
              <p className="text-[1.15rem] font-medium mb-[var(--space-xs)]">{item.title}</p>
              <p className="type-body text-[var(--color-text-muted)] leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Social context">
        <p className="text-[1.15rem] leading-relaxed max-w-3xl mb-[var(--space-lg)]">
          Children come home without the structure of school. There is no classroom atmosphere, no teacher nearby, and no classmates around the table. Homework becomes something they manage alone.
        </p>
        <Frame>
          <HomeSchool />
          <ConstantlyChart />
        </Frame>
      </Block>

      <Block title="Design scope">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[var(--space-md)]">
          {scope.map((item, index) => (
            <div key={item.label} className="relative">
              <span className="absolute top-3 right-4 text-[2rem] font-bold leading-none text-[#266B38]/15">{index + 1}</span>
              <IconTile name={item.icon} label={item.label} />
            </div>
          ))}
        </div>
      </Block>

      <Block title="What the phone does">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--space-md)] mb-[var(--space-xl)]">
          {impacts.map((item, index) => (
            <article key={item.label} className="rounded-2xl overflow-hidden bg-[#FBEBD3] border-b-4 border-[#B9CF6A]">
              <p className="m-0 px-4 py-2 text-[0.9rem] font-bold text-[#24633E] bg-gradient-to-r from-[#E4EBA4] to-[#F5D9A6]">
                {index + 1}. {item.label}
              </p>
              <div className="mx-3 mt-3 aspect-video flex items-center justify-center [&>svg]:h-full [&>svg]:w-auto">
                <ImpactArt kind={item.kind} />
              </div>
              <p className="m-0 px-4 pb-4 pt-1 text-[0.9rem] leading-snug text-[#5A5244]">{item.text}</p>
            </article>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--space-md)] mb-[var(--space-md)]">
          {loopArt.map((item) => (
            <figure key={item.label} className="m-0">
              <div className="aspect-video rounded-2xl bg-[#F7F3EA] flex items-center justify-center p-[6%]">
                <img src={item.src} alt="" className="h-full! w-auto max-w-full object-contain" />
              </div>
              <figcaption className="mt-2 text-[0.95rem] font-medium text-[#24633E]">{item.label}</figcaption>
            </figure>
          ))}
        </div>
        <Frame ratio="wide" className="mb-[var(--space-md)]">
          <HabitLoop />
        </Frame>
        <Frame>
          <SystemsMap />
        </Frame>
      </Block>

      <Block title="What families already try">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-md)]">
          {interventions.map((item) => (
            <article key={item.title} className="rounded-3xl p-[var(--space-md)] flex flex-col gap-4" style={{ background: item.wash }}>
              <div className="flex items-center gap-3">
                <Badge name={item.icon} bg={item.tone} fg="#FFFFFF" size="w-12 h-12" ring={`${item.tone}2A`} />
                <div className="min-w-0">
                  <p className="m-0 type-caption" style={{ color: item.tone }}>{item.kind}</p>
                  <p className="m-0 font-semibold leading-tight text-[#1C1917]">{item.title}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {item.now.map((tile) => (
                  <div key={tile.label} className="flex items-center gap-2 rounded-2xl bg-white/70 px-3 py-2.5">
                    <Icon name={tile.icon} className="w-6 h-6 shrink-0" />
                    <span className="text-[0.8rem] font-medium leading-tight text-[#3A3C38]">{tile.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto flex flex-col gap-1.5">
                <div className="flex items-center gap-2 rounded-full bg-[#FDD6A0]/70 px-3 py-1.5 text-[#8A4B12]">
                  <Icon name="x" className="w-4 h-4 shrink-0" />
                  <span className="text-[0.85rem] font-semibold leading-tight">{item.limit}</span>
                </div>
                <svg viewBox="0 0 16 20" className="w-3 h-4 ml-5 text-[#24633E]/50" aria-hidden>
                  <path d="M8 2v14M3 11l5 6 5-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex items-center gap-2 rounded-full bg-[#24633E] px-3 py-1.5 text-white">
                  <Icon name="sprout" className="w-4 h-4 shrink-0" />
                  <span className="text-[0.85rem] font-semibold leading-tight">{item.next}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-[var(--space-md)] flex flex-wrap items-center justify-center gap-3 rounded-3xl bg-[#FFF8F1] px-[4%] py-[var(--space-md)]">
          {interventions.map((item) => (
            <span key={item.kind} className="flex items-center gap-2 rounded-full pl-1 pr-3 py-1 text-[0.85rem] font-semibold" style={{ background: `${item.tone}1F`, color: item.tone }}>
              <Badge name={item.icon} bg={item.tone} fg="#FFFFFF" size="w-8 h-8" />
              {item.kind}
            </span>
          ))}
          <svg viewBox="0 0 48 16" className="w-12 h-auto text-[#24633E]/50" aria-hidden>
            <path d="M2 8h40M36 3l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="flex items-center gap-2 rounded-full border border-dashed border-[#E9A77A] bg-[#FBEBD3] px-3 py-1.5 text-[0.85rem] font-semibold text-[#8A4B12]">
            <Icon name="brain" className="w-5 h-5" />
            Reward system unchanged
          </span>
        </div>
      </Block>

      <Block title="Depth interviews">
        <p className="text-[1.05rem] text-[var(--color-text-muted)] max-w-3xl mb-[var(--space-lg)] leading-relaxed">
          Two parents and one middle school student. The aim was to understand motivation, digital distraction, and what a self-directed study session actually feels like.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-lg)] mb-[var(--space-xl)]">
          {people.map((person, index) => (
            <article key={person.name} className="rounded-2xl px-[var(--space-lg)] py-[var(--space-md)] bg-black/[0.03]">
              <div className="w-16 h-16 rounded-full mb-[var(--space-sm)] flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #FFE59C, #B0DB60)', border: `1px dashed ${index === 1 ? '#CD5000' : '#3D563C'}`, color: index === 1 ? '#CD5000' : '#266B38' }}>
                <Icon name={index === 1 ? 'people' : 'user'} className="w-8 h-8" />
              </div>
              <p className="text-[1.2rem] font-medium">{person.name}</p>
              <p className="type-caption mb-[var(--space-sm)]">{person.meta}</p>
              <p className="leading-relaxed mb-[var(--space-sm)]">{person.need}</p>
              <p className="type-body text-[var(--color-text-muted)] leading-relaxed">{person.note}</p>
            </article>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[var(--space-md)]">
          {clusters.map((item) => (
            <IconTile key={item.title} name={item.icon} label={item.title} tone="#F89200" />
          ))}
        </div>
      </Block>

      <Block title="Competitor analysis">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-md)] mb-[var(--space-md)]">
          {competitors.map((item) => (
            <article key={item.name} className="rounded-3xl p-[var(--space-md)] flex flex-col gap-4" style={{ background: item.wash }}>
              <div className="flex items-center gap-3">
                <Badge name={item.icon} bg={item.tone} fg="#FFFFFF" size="w-12 h-12" ring={`${item.tone}2A`} />
                <div className="min-w-0">
                  <p className="m-0 type-caption" style={{ color: item.tone }}>{item.kind}</p>
                  <p className="m-0 font-semibold leading-tight text-[#1C1917]">{item.name}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {item.items.map((feat) => (
                  <div key={feat.label} className="flex flex-col items-center text-center gap-1.5 rounded-2xl bg-white/70 px-1 py-3">
                    <Icon name={feat.icon} className="w-7 h-7" />
                    <span className="text-[0.78rem] font-medium leading-tight text-[#3A3C38]">{feat.label}</span>
                  </div>
                ))}
              </div>
              <div className="mt-auto flex items-center gap-2 rounded-full bg-[#FDD6A0]/70 px-3 py-1.5 text-[#8A4B12]">
                <Icon name="x" className="w-4 h-4 shrink-0" />
                <span className="text-[0.85rem] font-semibold leading-tight">{item.gap}</span>
              </div>
            </article>
          ))}
        </div>
        <div className="w-full rounded-3xl bg-[#FFF8F1] md:aspect-[32/9] px-[4%] py-[var(--space-md)] md:py-[2.5%] flex">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-[3%] gap-y-3 w-full content-center">
            <p className="m-0 type-caption text-[#C2410C]">Their limit</p>
            <span />
            <p className="m-0 type-caption text-[#24633E]">Our opportunity</p>
            {limits.map((limit, index) => (
              <div key={limit.title} className="contents">
                <div className="flex items-center gap-3 rounded-full bg-[#FBEBD3] pl-1.5 pr-4 py-1.5">
                  <span className="w-[clamp(2rem,3.2vw,2.75rem)] h-[clamp(2rem,3.2vw,2.75rem)] shrink-0 rounded-full border border-dashed border-[#E9A77A] bg-[#FDF3D8] flex items-center justify-center text-[#D9763A]">
                    <Icon name={limit.icon} className="w-[72%] h-[72%]" />
                  </span>
                  <span className="text-[clamp(0.8rem,1.15vw,1rem)] font-semibold leading-tight text-[#8A4B12]">{limit.title}</span>
                </div>
                <svg viewBox="0 0 48 16" className="w-[clamp(2.5rem,5vw,4rem)] h-auto text-[#24633E]/50" aria-hidden>
                  <path d="M2 8h40M36 3l6 5-6 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex items-center gap-3 rounded-full pl-1.5 pr-4 py-1.5" style={{ background: `${oppStyle[index].bg}1F` }}>
                  <Badge
                    name={oppStyle[index].icon}
                    bg={oppStyle[index].bg}
                    fg="#FFFFFF"
                    size="w-[clamp(2rem,3.2vw,2.75rem)] h-[clamp(2rem,3.2vw,2.75rem)]"
                  />
                  <span className="text-[clamp(0.8rem,1.15vw,1rem)] font-semibold leading-tight" style={{ color: oppStyle[index].bg }}>
                    {opportunities[index].title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Block>

      <Block title="Information architecture">
        <Frame ratio="wide">
          <Architecture />
        </Frame>
      </Block>

      <Block title="Persona">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] md:aspect-[32/9] gap-[var(--space-lg)] items-center mb-[var(--space-md)] rounded-3xl bg-[#FFF8F1] p-[var(--space-md)] md:p-[2.5%]">
          <div className="relative aspect-video md:aspect-auto md:h-full rounded-2xl overflow-hidden">
            <img src="./pullback/pieces/portrait.png" alt="Chen Yuxuan writing at a desk" className="absolute inset-0 w-full h-full! object-cover" />
          </div>
          <div>
            <p className="text-[1.6rem] font-medium leading-tight">Chen Yuxuan</p>
            <p className="type-caption mb-[var(--space-md)]">17 · High school · Lives with parents</p>
            <blockquote className="border-l-4 border-[var(--color-accent-primary)] pl-[var(--space-md)] mb-[var(--space-md)]">
              <p className="text-[1.2rem] italic leading-relaxed">I know I should study, but it is really hard to get started at home.</p>
            </blockquote>
            <p className="leading-relaxed text-[var(--color-text-muted)] max-w-2xl">
              He is not clearly drawn to studying, and he procrastinates after school, usually on his phone. He understands that learning matters. He wants focus and a habit through light company, not through constant reminders from his parents.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-[var(--space-md)] mb-[var(--space-xl)]">
          {needs.map((item) => (
            <div key={item.title} className="rounded-2xl px-4 py-5 bg-[#F7F3EA]">
              <img src={item.src} alt="" className="w-12 h-12 object-contain" />
              <p className="m-0 mt-3 font-medium leading-tight text-[#24633E]">{item.title}</p>
              <p className="m-0 mt-1 text-[0.9rem] leading-snug text-[#5A5244]">{item.text}</p>
            </div>
          ))}
        </div>
        <Frame ratio="wide">
          <DayLine />
        </Frame>
      </Block>

      <Block title="Weekday evening">
        <p className="mb-[var(--space-lg)] text-[var(--color-text-muted)]">19:00–22:30. Zixuan finishes the daily math review.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-[var(--space-md)]">
          {journey.map((step, index) => (
            <div key={step.stage} className="text-center flex flex-col items-center">
              <span className="w-16 h-16 mb-2 rounded-full border border-[#24633E]/20 bg-[#F7F3EA] flex items-center justify-center">
                <img src={journeyArt[index]} alt="" className="w-10 h-10 object-contain" />
              </span>
              <p className="type-caption text-[#266B38]">{step.time}</p>
              <p className="font-medium leading-tight mt-1">{step.stage}</p>
              <p className="text-[0.9rem] text-[var(--color-text-muted)] mt-1">{step.support}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Design guide">
        <div className="flex flex-wrap gap-3 mb-[var(--space-lg)]">
          {colors.map((color) => (
            <div key={color.hex} className="flex items-center gap-2">
              <span
                className="inline-block w-8 h-8 rounded-full"
                style={{ background: color.hex, border: color.border ? '1px solid rgba(0,0,0,0.2)' : undefined }}
              />
              <span>
                <span className="block text-[0.95rem] font-medium leading-tight">{color.name}</span>
                <span className="type-caption">{color.hex}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr] md:aspect-[32/9] gap-[var(--space-lg)] items-center mb-[var(--space-md)] rounded-3xl bg-[#FFF8F1] p-[var(--space-md)] md:p-[2.5%]">
          <div className="aspect-video md:aspect-auto md:h-full flex items-center justify-center rounded-2xl bg-[#F1ECE2] [&>svg]:h-[80%] [&>svg]:w-auto">
            <TimerRing />
          </div>
          <p className="max-w-3xl leading-relaxed text-[1.15rem]">
            Calm, minimal, focused, and gently in control. Type is Inter. Motion runs 300–500ms, ease-in-out, with no aggressive alerts. The timer uses a 6px stroke: active green on a dark track.
          </p>
        </div>
        <p className="type-body text-[var(--color-text-muted)]">Navigation: Home, Stats, Settings. Selected state is the primary green.</p>
      </Block>

      <Block title="How it was built">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-lg)]">
          {process.map((item) => (
            <div key={item.n}>
              <p className="type-caption text-[var(--color-accent-secondary)] mb-[var(--space-xs)]">{item.n}</p>
              <p className="text-[1.15rem] font-medium mb-[var(--space-xs)]">{item.title}</p>
              <p className="type-body text-[var(--color-text-muted)] leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </Block>

      <Block title="Interface">
        <Frame tone="#F1ECE2" className="mb-[var(--space-xl)] flex-row! items-start! justify-between! gap-[2%]! px-[4%]!">
          {screens.map((screen, index) => (
            <figure key={screen.label} className="m-0 flex-1 min-w-0 h-[86%] flex flex-col items-center" style={{ marginTop: index % 2 === 0 ? 0 : '3%' }}>
              <img src={screen.src} alt={screen.label} className="min-h-0 flex-1 w-auto max-w-full object-contain" />
              <figcaption className="type-caption mt-2 text-center leading-tight">{screen.label}</figcaption>
            </figure>
          ))}
        </Frame>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-lg)]">
          {setup.map((item, index) => (
            <div key={item.title} className="flex gap-[var(--space-md)]">
              <p className="font-bold text-[1.4rem] text-[var(--color-accent-secondary)] leading-none">{index + 1}</p>
              <div>
                <p className="font-medium mb-[var(--space-xs)]">{item.title}</p>
                <p className="type-body text-[var(--color-text-muted)] leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </Block>

      <motion.section
        className="mb-[var(--space-xxl)]"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-10% 0px' }}
        transition={{ duration: 0.6, ease }}
      >
        <h3 className="type-caption text-[1.1rem] tracking-wider mb-[var(--space-sm)]">Reflection</h3>
        <p className="text-[1.2rem] max-w-4xl leading-relaxed">
          Restriction does not change desire. Pull It keeps the phone in the room and gives the study session its own start, its own company, and its own small reward. The garden is the record that the student came back.
        </p>
      </motion.section>

      <div className="border-t border-black/8 my-[var(--space-xxl)]" />

      <section className="mb-[var(--space-xxl)]">
        <h3 className="type-caption mb-[var(--space-sm)]">Credits</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--space-md)] mb-[var(--space-lg)]">
          {[
            ['Team', 'Ryan Yu'],
            ['Role', 'UI/UX design and vibe coding'],
            ['Year', '2026'],
            ['Tools', 'Figma, Inter, Quicksand, Codex'],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="type-caption mb-[var(--space-xs)]">{label}</p>
              <p className="type-body">{value}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-[var(--space-sm)]">
          <a className="spine-open" href="https://ryanyu0410.github.io/pullback/welcome" target="_blank" rel="noreferrer">Live</a>
          <a className="spine-open" href="https://github.com/RyanYu0410/pullback" target="_blank" rel="noreferrer">GitHub</a>
        </div>
      </section>
    </>
  );
}
