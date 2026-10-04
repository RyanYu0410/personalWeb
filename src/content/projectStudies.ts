const mirror = (file: string) =>
  `https://raw.githubusercontent.com/RyanYu0410/unstableMirror/main/docs/images/${file}`;
const note = (file: string) =>
  `https://raw.githubusercontent.com/RyanYu0410/NoteBlock/main/docs/screenshots/${file}`;

export type ProjectStudyData = {
  heroName: string;
  year: string;
  role: string;
  heroImage: string;
  heroAlt: string;
  overview: string;
  statement: string;
  accentLine: string;
  closingLine: string;
  wideImage: string;
  wideAlt: string;
  goals: [string, string];
  nodes: { title: string; lines: string[]; accent?: boolean }[];
  edges: [string, string];
  steps: { head: string; sub: string }[];
  takeaways: { label: string; detail: string }[];
  quote: string;
  features: { label: string; desc: string }[];
  intro: { title: string; text: string; tags: string[] };
  slides: { src: string; alt: string }[];
  reflection: string;
  credits: { team: string; role: string; year: string; tools: string };
  links: { label: string; href: string }[];
};

export const mirrorStudy: ProjectStudyData = {
  heroName: 'Unstable Mirror',
  year: '2026',
  role: 'Interactive installation + AI pipeline',
  heroImage: mirror('frontend-desktop.png'),
  heroAlt: 'Unstable Mirror desktop interface',
  overview:
    'A browser becomes a mirror and a camera becomes the input. A ComfyUI pipeline on a second machine turns the person in front of it into a botanical, unstable reflection — then returns that portrait to a small pool beside the live camera.',
  statement: 'A portrait booth',
  accentLine: 'that grows back',
  closingLine: 'a stranger you still recognize',
  wideImage: mirror('final-result-closeup.png'),
  wideAlt: 'Generated botanical portrait closeup',
  goals: [
    'Keep the face recognizable while the body shifts into flowers, mushrooms, and translucent growth.',
    'Make the interface feel like a ritual, not a settings panel: capture, wait, retrieve, download.',
  ],
  nodes: [
    { title: 'Participant', lines: ['Camera', 'Phone or laptop'] },
    { title: 'Mirror UI', lines: ['Vite + TypeScript', 'Queue + pool'], accent: true },
    { title: 'ComfyUI', lines: ['SD 1.5 + LoRA', 'FaceID + segment'] },
  ],
  edges: ['Capture', 'Generate'],
  steps: [
    { head: 'Bridge the machines', sub: 'Browser capture on one computer,\ngeneration on a stronger one.' },
    { head: 'Stabilize the graph', sub: 'UI workflow converted to API.\nFinal image read from SaveImage.' },
    { head: 'Open it publicly', sub: 'Cloudflare Pages for the mirror.\nA tunnel exposes ComfyUI.' },
  ],
  takeaways: [
    { label: 'Identity stays', detail: 'IPAdapter FaceID keeps the person recognizable inside the botanical transformation.' },
    { label: 'One flight only', detail: 'The frontend refuses to spam the queue. One capture runs, then the next can start.' },
    { label: 'The pool is the work', detail: 'Results are not a dump of files. They sit beside the live mirror until you open and download one.' },
  ],
  quote:
    'The most important shift was treating the frontend not as a control panel, but as the artwork’s surface. The settings disappeared. The generated image became something you retrieve from a pool.',
  features: [
    { label: 'Dark mirror', desc: 'Full-screen camera on phones, with a framed desktop view and a result pool beside it.' },
    { label: 'Capture crop', desc: 'Each frame is cropped to 512×768 before it enters the Plant Mirror graph.' },
    { label: 'Queue + progress', desc: 'ComfyUI’s websocket reports queue depth and generation progress while you wait.' },
    { label: 'Retrieve', desc: 'Tap a pool image to enlarge it, then download the portrait.' },
  ],
  intro: {
    title: 'Unstable Mirror',
    text: 'Stand in front of the camera. The system returns a version of you that looks alive, overgrown, and still yours.',
    tags: ['Camera', 'ComfyUI', 'Installation'],
  },
  slides: [
    { src: mirror('frontend-desktop.png'), alt: 'Desktop mirror with the generated pool' },
    { src: mirror('frontend-mobile.png'), alt: 'Mobile full-screen mirror' },
    { src: mirror('source-portrait.png'), alt: 'Source camera portrait' },
    { src: mirror('mobile-live-interface.png'), alt: 'Live camera beside a generated pool image' },
    { src: mirror('final-result-closeup.png'), alt: 'Final generated portrait' },
    { src: mirror('comfyui-workflow.png'), alt: 'ComfyUI Plant Mirror workflow' },
  ],
  reflection:
    'What began as a technical bridge — camera in, image out — became a small installation: part mirror, part portrait booth, part generative ritual. The heavy model stays on the studio machine. The public page only works as a mirror when that backend is awake.',
  credits: {
    team: 'Ryan Yu',
    role: 'Interface, pipeline, and deployment',
    year: '2026',
    tools: 'Vite, TypeScript, ComfyUI, FaceID, Cloudflare',
  },
  links: [
    { label: 'Live mirror', href: 'https://unstablemirror.pages.dev' },
    { label: 'GitHub', href: 'https://github.com/RyanYu0410/unstableMirror' },
  ],
};

export const noteBlockStudy: ProjectStudyData = {
  heroName: 'NoteBlock',
  year: '2026',
  role: 'Audiovisual instrument',
  heroImage: note('00-empty-table.png'),
  heroAlt: 'NoteBlock empty clock table',
  overview:
    'A browser instrument built with p5.js and Tone.js. The screen is a clock-faced table. Each fruit is a voice and a Euclidean rhythm. Where you place it decides the pulse count and the volume. Five musical worlds — Mist, Aria, Bloom, Drop, Afterglow — retune the same objects.',
  statement: 'Think in fruit',
  accentLine: 'on a clock',
  closingLine: 'not in tracks',
  wideImage: note('03-bloom.png'),
  wideAlt: 'NoteBlock in Bloom mode',
  goals: [
    'Let a non-musician compose by moving objects, without a grid, a MIDI controller, or a tutorial.',
    'Make the picture the score: rings, sectors, and ripples explain why a sound just happened.',
  ],
  nodes: [
    { title: 'Fruit', lines: ['Color = voice', 'Size = duration'] },
    { title: 'Clock table', lines: ['Angle = pulses', 'Distance = volume'], accent: true },
    { title: 'Tone.js', lines: ['Scale + tempo', 'Reverb + delay'] },
  ],
  edges: ['Place', 'Play'],
  steps: [
    { head: 'Objects, not tracks', sub: 'Drag a fruit onto the table.\nIt becomes a looping voice.' },
    { head: 'Five musical worlds', sub: 'Mist, Aria, Bloom, Drop,\nAfterglow retune every color.' },
    { head: 'Camera as table', sub: 'Real fruit, tracked by color,\nplays the same rules.' },
  ],
  takeaways: [
    { label: 'Euclidean voice', detail: 'Each fruit spreads k pulses across n steps. Position sets k. The icon panel sets n.' },
    { label: 'The table is the mixer', detail: 'Closer to the center is louder. Push a fruit outward and it fades.' },
    { label: 'Same gesture, new world', detail: 'A green fruit is a soft note in Mist and a kick in Drop.' },
  ],
  quote:
    'Most software instruments ask you to think in tracks, grids, and parameters. NoteBlock asks you to think in objects on a table.',
  features: [
    { label: 'Mist · 63', desc: 'Whispered E major pentatonic. Pads, melody, reply, ghost. Almost no percussion.' },
    { label: 'Aria · 84', desc: 'A natural minor with a rim-shot pulse and bright reply melodies.' },
    { label: 'Bloom · 110', desc: 'Fast arpeggios and bell tones over a steady bass.' },
    { label: 'Drop · 150', desc: 'Kick, snare, hats, and sub-bass. Short delay, almost no reverb.' },
    { label: 'Afterglow · 72', desc: 'A long C major drift: pads, ghosts, and soft pulses.' },
    { label: 'Camera', desc: 'HSV blobs from a webcam or iPhone become short-lived voices on the same clock.' },
  ],
  intro: {
    title: 'NoteBlock',
    text: 'Drag a strawberry toward the center and it gets louder. Push a blueberry to the edge and its rhythm thins out.',
    tags: ['p5.js', 'Tone.js', 'Euclidean'],
  },
  slides: [
    { src: note('00-empty-table.png'), alt: 'Empty clock table' },
    { src: note('01-mist.png'), alt: 'Mist mode' },
    { src: note('02-aria.png'), alt: 'Aria mode' },
    { src: note('03-bloom.png'), alt: 'Bloom mode' },
    { src: note('camera-on-fruits.png'), alt: 'Camera mode with detected fruit' },
    { src: note('04-drop.png'), alt: 'Drop mode' },
  ],
  reflection:
    'The camera does not care whether the strawberry is real or drawn. Color, position, and size follow the same musical rules either way. The piece is meant for one screen, fullscreen, in a dark room — or for a table of actual fruit under a webcam.',
  credits: {
    team: 'Ryan Yu',
    role: 'Instrument, visuals, and camera mapping',
    year: '2026',
    tools: 'p5.js, Tone.js, HSV tracking',
  },
  links: [
    { label: 'Play', href: 'https://ryanyu0410.github.io/NoteBlock/' },
    { label: 'GitHub', href: 'https://github.com/RyanYu0410/NoteBlock' },
  ],
};
