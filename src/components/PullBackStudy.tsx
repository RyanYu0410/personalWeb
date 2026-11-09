import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

const ease = [0.25, 0.1, 0.25, 1] as const;

function Block({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <motion.section
      className="mb-[var(--space-xxxl)]"
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
  { icon: 'game', title: 'No intrinsic motivation design', text: 'They control behavior but do not change desire.' },
  { icon: 'gift', title: 'No reward substitution', text: 'They remove the phone reward and do not replace it.' },
  { icon: 'lock', title: 'No autonomy support', text: 'The child is managed instead of choosing.' },
];

const oppStyle = [
  { icon: 'gift', bg: '#5FA35A' },
  { icon: 'user', bg: '#F2B935' },
  { icon: 'people', bg: '#4D7FCB' },
];

const interventions = [
  {
    title: 'Screen time limits',
    now: ['App usage timers', 'Parental lock', 'Scheduled downtime', 'Block entertainment apps'],
    limit: 'Control creates dependency and rebound. The reward system stays the same.',
    next: 'Move from time control to reward design, with scaffolding for self-regulation.',
  },
  {
    title: 'Physical separation',
    now: ['Phone in another room', 'Device handover', 'Phone-free study', 'App blocker and locker'],
    limit: 'Removing the phone does not replace the feedback the phone was giving.',
    next: 'Build a substitute loop: instant progress, and a quieter environmental reward.',
  },
  {
    title: 'Punishment and reward',
    now: ['Game time for finished homework', 'Less entertainment if unfinished', 'Stickers and points', 'Verbal reward or punishment'],
    limit: 'External rewards stay in charge. The learning process itself is not reinforced.',
    next: 'Give micro-feedback during the work, not only a prize at the end.',
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
  { name: 'Google Family Link', kind: 'Parental control', items: ['App approval', 'Usage tracking', 'Remote lock'], gap: 'Over-monitoring lowers trust. The child is managed, not designing their own study.' },
  { name: 'Forest / Focus Plant', kind: 'Pomodoro', items: ['25-minute focus', 'Grow a plant if the phone stays down', 'Phone use fails the task'], gap: 'Time control only. The reward is a plant, and failure feels like punishment.' },
  { name: 'Apple Screen Time', kind: 'System control', items: ['App limits', 'Downtime schedule', 'Parental controls'], gap: 'Strong restriction raises reactance. It never answers why the phone is opened.' },
];

const opportunities = [
  { n: '1', title: 'Replace the reward', text: 'Learning gets its own immediate feedback, micro-rewards, and a sense of progression.' },
  { n: '2', title: 'Let the child choose', text: 'A flexible path, goals they set, and progress they can see themselves.' },
  { n: '3', title: 'Light company', text: 'Peer visibility and shared sessions, so study does not feel like being alone.' },
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

const sketch = {
  fill: 'none',
  stroke: '#5E6B2C',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function ImpactArt({ kind }: { kind: 'start' | 'drift' | 'momentum' | 'doubt' }) {
  return (
    <svg viewBox="0 0 120 80" className="w-full h-auto" aria-hidden>
      {kind === 'start' && (
        <>
          <path d="M8 66h104" {...sketch} />
          <circle cx="52" cy="30" r="13" {...sketch} />
          <path d="M39 27c3-9 21-12 26-1M45 22c4 2 11 2 16-2" {...sketch} />
          <circle cx="47.5" cy="31" r="1.3" fill="#5E6B2C" />
          <circle cx="56.5" cy="31" r="1.3" fill="#5E6B2C" />
          <path d="M49 37.5c2-1 4-1 6 0" {...sketch} />
          <path d="M38 34c-4 6-2 14 4 16M66 34c4 6 2 14-4 16M34 66c2-10 8-15 18-15s16 5 18 15" {...sketch} />
          <path d="M34 66l18-6 18 6M52 60v6" {...sketch} />
          <path d="M26 16a4 4 0 1 1-5 6" {...sketch} strokeDasharray="2 2.5" />
          <path d="M93 66V52M86 66h14l-2-6H88z" {...sketch} />
          <path d="M93 54c-6-1-8-7-6-11 5 1 7 6 6 11zM93 51c2-5 7-7 11-5-1 5-6 7-11 5z" fill="#A7C66A" stroke="#5E6B2C" strokeWidth="1.3" />
          <rect x="76" y="61" width="12" height="5" rx="1" {...sketch} />
        </>
      )}
      {kind === 'drift' && (
        <>
          <rect x="16" y="12" width="28" height="54" rx="6" {...sketch} />
          <path d="M27 61h6" {...sketch} />
          <rect x="22" y="30" width="16" height="16" rx="3" fill="#C8DB8C" stroke="#5E6B2C" strokeWidth="1.3" />
          <path d="M26.5 41a3.5 3.5 0 0 1 7 0c0 1.3.7 2 .7 2h-8.4s.7-.7.7-2zM29 43.6a1 1 0 0 0 2 0" {...sketch} strokeWidth={1.1} />
          <circle cx="40" cy="28" r="4.5" fill="#2F8A3E" />
          <path d="M52 39h16" {...sketch} strokeDasharray="3 3" />
          <path d="M66 35l4 4-4 4" {...sketch} />
          <circle cx="92" cy="38" r="13" {...sketch} />
          <path d="M80 33c2-10 20-12 25-3M82 30c5 1 12 0 17-4" {...sketch} />
          <circle cx="86" cy="39" r="1.3" fill="#5E6B2C" />
          <path d="M80 42h-2M85 46c2 1 4 1 5 0M86 51c-6 3-10 9-11 15M98 51c6 3 10 9 11 15" {...sketch} />
          <path d="M98 18l2-4M104 21l4-2M102 16l1-5" {...sketch} strokeWidth={1.3} />
        </>
      )}
      {kind === 'momentum' && (
        <>
          <path d="M18 60 40 50 62 42 84 38" {...sketch} strokeDasharray="3 3" />
          <circle cx="18" cy="60" r="5" fill="#4F9A3F" />
          <circle cx="40" cy="50" r="5" fill="#A7C66A" stroke="#5E6B2C" strokeWidth="1.2" />
          <circle cx="62" cy="42" r="5" fill="#4F9A3F" />
          <circle cx="84" cy="38" r="5" fill="#FFF8EE" stroke="#5E6B2C" strokeWidth="1.4" />
          <path d="M84 26v-5M91 28l3-4M77 28l-3-4" {...sketch} strokeWidth={1.3} />
          <path d="M88 52l18 16M106 68l2 4-4-2M88 52l4-3 18 16-4 3z" {...sketch} />
        </>
      )}
      {kind === 'doubt' && (
        <>
          <path d="M14 68h92" {...sketch} />
          <circle cx="50" cy="38" r="13" {...sketch} />
          <path d="M37 35c2-10 21-13 26-2M42 30c5 2 11 1 16-3" {...sketch} />
          <path d="M45 40h3M53 40h3M48 46c1.5.7 3 .7 4.5 0" {...sketch} />
          <path d="M62 44c4 1 6 6 4 12M66 56h-8M34 68c0-9 6-14 16-14M50 54c4 0 7 2 8 5" {...sketch} />
          <path d="M80 26c-6 0-8-8-2-10-1-6 7-9 10-5 3-4 11-2 10 4 5 1 5 9-1 10-2 4-9 4-11 1-2 2-5 1-6 0z" fill="#E5F0B2" stroke="#5E6B2C" strokeWidth="1.4" />
          <path d="M86.5 16.5a2.8 2.8 0 1 1 3.6 2.7c-.8.3-1.1.8-1.1 1.6v.6M89 24.3v.1" {...sketch} strokeWidth={1.4} />
          <circle cx="74" cy="32" r="2" {...sketch} />
          <circle cx="69" cy="37" r="1.2" {...sketch} />
        </>
      )}
    </svg>
  );
}

const face = 'Inter, system-ui, sans-serif';

function HomeSchool() {
  const home = [
    { icon: 'music', label: 'Short video' },
    { icon: 'camera', label: 'Social' },
    { icon: 'game', label: 'Games' },
  ];
  const school = [
    { icon: 'book', label: 'Class' },
    { icon: 'people', label: 'Friends' },
    { icon: 'move', label: 'Movement' },
  ];
  return (
    <svg viewBox="0 0 760 300" className="w-full" role="img" aria-label="At home the evening is the phone. At school the day is class, friends, and movement.">
      <rect x="8" y="8" width="360" height="284" rx="22" fill="#F8E6CD" />
      <rect x="392" y="8" width="360" height="284" rx="22" fill="#E3ECD4" />
      <text x="32" y="44" fill="#E59019" fontSize="18" fontWeight="800" fontFamily={face}>At home</text>
      <text x="416" y="44" fill="#266B38" fontSize="18" fontWeight="800" fontFamily={face}>At school</text>
      <rect x="36" y="68" width="86" height="168" rx="16" fill="#1C1917" />
      <rect x="44" y="80" width="70" height="132" rx="10" fill="#FFF8EE" />
      <circle cx="79" cy="214" r="4" fill="#1C1917" />
      <circle cx="79" cy="128" r="18" fill="#F8E6CD" />
      <SvgIcon name="phone" x={68} y={117} size={22} color="#E59019" />
      {home.map((item, i) => (
        <g key={item.label}>
          <circle cx={168 + i * 72} cy="118" r="26" fill="#FFF8EE" />
          <SvgIcon name={item.icon} x={156 + i * 72} y={106} size={24} color="#E59019" />
          <text x={168 + i * 72} y="168" textAnchor="middle" fill="#47574C" fontSize="12" fontWeight="600" fontFamily={face}>{item.label}</text>
        </g>
      ))}
      <text x="32" y="250" fill="#8A5A12" fontSize="13" fontFamily={face}>Alone with the phone</text>
      <rect x="420" y="72" width="150" height="92" rx="12" fill="#FFF8EE" stroke="#266B38" strokeWidth="1.5" />
      <path d="M436 148V92h118v56" fill="none" stroke="#266B38" strokeWidth="2" />
      <path d="M495 92v56" stroke="#266B38" strokeWidth="1.2" />
      {school.map((item, i) => (
        <g key={item.label}>
          <circle cx={600} cy={86 + i * 58} r="22" fill="#FFF8EE" />
          <SvgIcon name={item.icon} x={589} y={75 + i * 58} size={22} color="#266B38" />
          <text x="632" y={92 + i * 58} fill="#47574C" fontSize="13" fontWeight="600" fontFamily={face}>{item.label}</text>
        </g>
      ))}
    </svg>
  );
}

function HabitLoop() {
  const steps = [
    { label: 'Open', icon: 'phone' },
    { label: 'Notice', icon: 'bell' },
    { label: 'Reply', icon: 'reply' },
    { label: 'Browse', icon: 'scroll' },
    { label: 'Lose it', icon: 'lost' },
  ];
  return (
    <svg viewBox="0 0 880 240" className="w-full" role="img" aria-label="Habit loop: open the phone, notice a cue, reply, keep browsing, lose the task, then repeat">
      <defs>
        <filter id="pb-node" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#C2410C" floodOpacity="0.16" />
        </filter>
      </defs>
      <path d="M90 86 H790" stroke="#F8D3B0" strokeWidth="10" strokeLinecap="round" />
      <path d="M790 86 C820 86 840 150 700 178 H180 C70 178 50 150 70 110" fill="none" stroke="#F89200" strokeWidth="2" strokeDasharray="7 6" />
      <polygon points="64,104 78,96 76,112" fill="#F89200" />
      {steps.map((step, i) => {
        const x = 90 + i * 175;
        return (
          <g key={step.label}>
            <circle cx={x} cy="86" r="32" fill="#fff" stroke="#F89200" strokeWidth="2" filter="url(#pb-node)" />
            <SvgIcon name={step.icon} x={x - 16} y={70} size={32} color="#C2410C" />
            <text x={x} y="142" textAnchor="middle" fill="#3A3C38" fontSize="14" fontWeight="700" fontFamily={face}>{step.label}</text>
          </g>
        );
      })}
      <text x="440" y="214" textAnchor="middle" fill="#F89200" fontSize="13" fontWeight="700" fontFamily={face}>The loop starts again</text>
    </svg>
  );
}

function SystemsMap() {
  const nodes = [
    { cx: 170, cy: 150, color: '#7C63A7', wash: '#F4EEF8', title: 'Social', sub: 'mPFC · TPJ', icon: 'people' },
    { cx: 400, cy: 230, color: '#E07A2F', wash: '#FFF3E8', title: 'Reward', sub: 'VTA → NAC', icon: 'spark' },
    { cx: 630, cy: 150, color: '#266B38', wash: '#E8F3EA', title: 'Habit', sub: 'Striatum', icon: 'loop' },
  ];
  return (
    <svg viewBox="0 0 800 390" className="w-full" role="img" aria-label="Three systems: social cognition, reward, and habit, linked in a triangle">
      <ellipse cx="400" cy="190" rx="300" ry="140" fill="#F8D49C" fillOpacity="0.28" />
      <path d="M230 175 C300 210 310 210 340 215" fill="none" stroke="#7C63A7" strokeWidth="1.6" strokeDasharray="5 4" />
      <path d="M460 215 C500 200 540 175 570 160" fill="none" stroke="#266B38" strokeWidth="1.6" strokeDasharray="5 4" />
      <path d="M220 120 C400 40 580 40 680 120" fill="none" stroke="#E07A2F" strokeWidth="1.6" strokeDasharray="5 4" />
      {nodes.map((node) => (
        <g key={node.title}>
          <circle cx={node.cx} cy={node.cy} r="78" fill={node.wash} stroke={node.color} strokeWidth="2.5" />
          <circle cx={node.cx} cy={node.cy - 20} r="28" fill="#fff" />
          <SvgIcon name={node.icon} x={node.cx - 17} y={node.cy - 37} size={34} color={node.color} />
          <text x={node.cx} y={node.cy + 22} textAnchor="middle" fill={node.color} fontSize="16" fontWeight="800" fontFamily={face}>{node.title}</text>
          <text x={node.cx} y={node.cy + 42} textAnchor="middle" fill="#47574C" fontSize="12" fontFamily={face}>{node.sub}</text>
        </g>
      ))}
    </svg>
  );
}

function ConstantlyChart() {
  return (
    <svg viewBox="0 0 640 180" className="w-full max-w-2xl" role="img" aria-label="U.S. teens online almost constantly: 24 percent a decade ago, 46 percent in 2024">
      <text x="0" y="22" fill="#266B38" fontSize="15" fontWeight="800" fontFamily={face}>Online almost constantly</text>
      <line x1="150" y1="48" x2="150" y2="140" stroke="#D9D1C5" />
      <line x1="150" y1="140" x2="560" y2="140" stroke="#D9D1C5" />
      <text x="140" y="78" textAnchor="end" fill="#47574C" fontSize="13" fontFamily={face}>Then</text>
      <text x="140" y="118" textAnchor="end" fill="#47574C" fontSize="13" fontFamily={face}>2024</text>
      <rect x="158" y="62" width="360" height="22" rx="11" fill="#EFE8DC" />
      <rect x="158" y="62" width="86" height="22" rx="11" fill="#B5C578" />
      <text x="254" y="78" fill="#3A3C38" fontSize="12" fontWeight="700" fontFamily={face}>24%</text>
      <rect x="158" y="102" width="360" height="22" rx="11" fill="#EFE8DC" />
      <rect x="158" y="102" width="166" height="22" rx="11" fill="#266B38" />
      <text x="334" y="118" fill="#fff" fontSize="12" fontWeight="700" fontFamily={face}>46%</text>
      <text x="158" y="168" fill="#7C807D" fontSize="12" fontFamily={face}>Pew Research Center · U.S. teens 13–17</text>
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
  return (
    <svg viewBox="0 0 840 280" className="w-full" role="img" aria-label="Pull It branches into Home, Learning, Progress, and Profile">
      <rect x="330" y="8" width="180" height="44" rx="12" fill="#266B38" />
      <text x="420" y="36" textAnchor="middle" fill="#FFF8EE" fontSize="16" fontWeight="700" fontFamily={face}>Pull It</text>
      <path d="M420 52 V78 M100 78 H740" stroke="#266B38" strokeWidth="1.6" fill="none" />
      {cols.map((col, i) => {
        const x = 24 + i * 204;
        return (
          <g key={col.title}>
            <path d={`M${x + 90} 78 V104`} stroke="#266B38" strokeWidth="1.6" />
            <rect x={x} y="104" width="180" height="44" rx="12" fill="#DBEE7B" />
            <SvgIcon name={col.icon} x={x + 14} y={115} size={22} color="#266B38" />
            <text x={x + 104} y="132" textAnchor="middle" fill="#266B38" fontSize="15" fontWeight="800" fontFamily={face}>{col.title}</text>
            {col.items.map((item, j) => (
              <g key={item.t}>
                <rect x={x + 10} y={164 + j * 46} width="160" height="38" rx="10" fill="#FFF8EE" stroke="#47574C" strokeOpacity="0.2" />
                <SvgIcon name={item.icon} x={x + 22} y={172 + j * 46} size={20} color="#47574C" />
                <text x={x + 96} y={188 + j * 46} textAnchor="middle" fill="#3A3C38" fontSize="13" fontWeight="600" fontFamily={face}>{item.t}</text>
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
    <svg viewBox="0 0 900 170" className="w-full" role="img" aria-label="Weekday from waking at 7 to still being awake after 10">
      <path d="M80 62 H820" stroke="#9DB3A6" strokeWidth="2" strokeDasharray="2 6" strokeLinecap="round" />
      {day.map((item, i) => {
        const x = 80 + i * 148;
        const hot = item.label === 'Try to study';
        return (
          <g key={item.time}>
            <circle cx={x} cy="62" r="34" fill={hot ? '#F6D9B4' : '#D6E2D9'} />
            <circle cx={x} cy="62" r="27" fill={hot ? '#C79A3E' : '#4D6F5F'} />
            <SvgIcon name={icons[i]} x={x - 14} y={48} size={28} color="#FFF4E2" />
            <text x={x} y="120" textAnchor="middle" fill="#266B38" fontSize="12" fontWeight="800" fontFamily={face}>{item.time}</text>
            <text x={x} y="140" textAnchor="middle" fill="#47574C" fontSize="13" fontWeight="600" fontFamily={face}>{item.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function TimerRing() {
  return (
    <svg viewBox="0 0 220 180" className="w-full max-w-[220px]" role="img" aria-label="Focus timer showing 8 minutes 32 seconds remaining">
      <rect x="8" y="8" width="204" height="164" rx="18" fill="#0B0B0F" />
      <circle cx="110" cy="86" r="48" fill="none" stroke="#30303A" strokeWidth="8" />
      <circle cx="110" cy="86" r="48" fill="none" stroke="#8BE28B" strokeWidth="8" strokeDasharray="210 302" strokeLinecap="round" transform="rotate(-90 110 86)" />
      <text x="110" y="92" textAnchor="middle" fill="#fff" fontSize="22" fontFamily="ui-monospace, Menlo, monospace" fontWeight="700">08:32</text>
      <text x="110" y="148" textAnchor="middle" fill="#8BE28B" fontSize="12">Focus mode</text>
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
            className="w-full rounded-xl object-cover"
            style={{ aspectRatio: '4 / 3' }}
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
          <img src="./pullback/pieces/break.png" alt="Break screen. Pull the bell to come back to the session." className="w-[180px] max-w-full h-auto justify-self-center" />
        </div>
      </motion.div>

      <Block title="The offer">
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
        <HomeSchool />
        <div className="mt-[var(--space-lg)]">
          <ConstantlyChart />
        </div>
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
              <div className="px-3 pt-3">
                <ImpactArt kind={item.kind} />
              </div>
              <p className="m-0 px-4 pb-4 pt-1 text-[0.9rem] leading-snug text-[#5A5244]">{item.text}</p>
            </article>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[var(--space-md)] mb-[var(--space-xl)]">
          {loopArt.map((item) => (
            <figure key={item.label} className="m-0">
              <img src={item.src} alt="" className="w-full h-auto rounded-2xl bg-[#F7F3EA]" />
              <figcaption className="mt-2 text-[0.95rem] font-medium text-[#24633E]">{item.label}</figcaption>
            </figure>
          ))}
        </div>
        <div className="mb-[var(--space-xl)] overflow-x-auto rounded-3xl bg-[#FFF8F1] px-2 py-4">
          <HabitLoop />
        </div>
        <div className="rounded-3xl bg-[#FFF8F1] px-2 py-2">
          <SystemsMap />
        </div>
      </Block>

      <Block title="What families already try">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-lg)]">
          {interventions.map((item) => (
            <article key={item.title} className="border border-black/10 rounded-2xl px-[var(--space-lg)] py-[var(--space-md)]">
              <p className="font-medium mb-[var(--space-sm)]">{item.title}</p>
              <ul className="m-0 pl-4 mb-[var(--space-sm)] text-[var(--color-text-muted)]">
                {item.now.map((line) => <li key={line} className="mb-1">{line}</li>)}
              </ul>
              <p className="type-caption mb-[var(--space-xs)]">Limit</p>
              <p className="type-body leading-relaxed mb-[var(--space-sm)]">{item.limit}</p>
              <p className="type-caption text-[var(--color-accent-secondary)] mb-[var(--space-xs)]">Direction</p>
              <p className="type-body leading-relaxed">{item.next}</p>
            </article>
          ))}
        </div>
        <p className="mt-[var(--space-lg)] text-[1.15rem] leading-relaxed max-w-4xl">
          Current interventions mainly restrict, remove, or reward and punish. They do not change the reward and attention systems underneath.
        </p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-lg)] mb-[var(--space-xl)]">
          {competitors.map((item, index) => (
            <article key={item.name} className="border border-black/10 rounded-2xl px-[var(--space-lg)] py-[var(--space-md)]">
              <p className="type-caption mb-[var(--space-xs)]">0{index + 1} · {item.kind}</p>
              <p className="text-[1.15rem] font-medium mb-[var(--space-sm)]">{item.name}</p>
              <ul className="m-0 pl-4 mb-[var(--space-sm)]">
                {item.items.map((line) => <li key={line}>{line}</li>)}
              </ul>
              <p className="type-body text-[var(--color-text-muted)] leading-relaxed">{item.gap}</p>
            </article>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-lg)]">
          <div>
            <p className="font-bold text-[#24633E] mb-[var(--space-sm)]">Competitor limitations</p>
            <div className="flex flex-col gap-3">
              {limits.map((item, index) => (
                <div key={item.title} className="flex items-center gap-4 rounded-2xl px-4 py-3 bg-[#FBEBD3]">
                  <span className="w-14 h-14 shrink-0 rounded-full border border-dashed border-[#E9A77A] bg-[#FDF3D8] flex items-center justify-center text-[#D9763A]">
                    <Icon name={item.icon} className="w-9 h-9" />
                  </span>
                  <div>
                    <p className="m-0 font-semibold text-[#24633E] leading-tight">
                      <span className="inline-flex w-5 h-5 mr-2 rounded bg-[#F2B455] text-white text-[0.75rem] items-center justify-center align-[2px]">{index + 1}</span>
                      {item.title}
                    </p>
                    <p className="m-0 mt-1 text-[0.9rem] text-[#5A5244]">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-bold text-[#24633E] mb-[var(--space-sm)]">Our design opportunities</p>
            <div className="flex flex-col gap-3">
              {opportunities.map((item, index) => (
                <div key={item.n} className="flex items-center gap-4 rounded-2xl px-4 py-3 bg-[#F7EBC4]">
                  <Badge name={oppStyle[index].icon} bg={oppStyle[index].bg} fg="#FFFFFF" ring={`${oppStyle[index].bg}33`} />
                  <div>
                    <p className="m-0 font-semibold leading-tight" style={{ color: oppStyle[index].bg }}>
                      <span className="inline-flex w-5 h-5 mr-2 rounded text-white text-[0.75rem] items-center justify-center align-[2px]" style={{ background: oppStyle[index].bg }}>{item.n}</span>
                      {item.title}
                    </p>
                    <p className="m-0 mt-1 text-[0.9rem] text-[#5A5244]">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Block>

      <Block title="Information architecture">
        <div className="overflow-x-auto rounded-3xl bg-[#FFF8F1] px-2 py-4">
          <Architecture />
        </div>
      </Block>

      <Block title="Persona">
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-[var(--space-lg)] items-start mb-[var(--space-xl)]">
          <img src="./pullback/pieces/portrait.png" alt="Chen Yuxuan writing at a desk" className="w-full rounded-2xl object-cover" style={{ aspectRatio: '1 / 1' }} />
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
        <div className="mb-[var(--space-lg)] overflow-x-auto rounded-3xl bg-[#FFF8F1] px-2 py-4">
          <DayLine />
        </div>
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
        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-[var(--space-lg)] items-center mb-[var(--space-md)]">
          <TimerRing />
          <p className="max-w-3xl leading-relaxed">
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
        <div className="flex gap-[var(--space-lg)] overflow-x-auto items-start pb-2 mb-[var(--space-xl)]">
          {screens.map((screen, index) => (
            <figure key={screen.label} className="m-0 shrink-0" style={{ marginTop: index % 2 === 0 ? 0 : 36 }}>
              <img src={screen.src} alt={screen.label} className="w-[168px] h-auto" />
              <figcaption className="type-caption mt-3 max-w-[10rem]">{screen.label}</figcaption>
            </figure>
          ))}
        </div>
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
