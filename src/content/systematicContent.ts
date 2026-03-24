export type SpineItem = {
  title: string;
  outcome: string;
  role: string;
  href: string;
};

export type CaseStudy = {
  id: string;
  title: string;
  role: string;
  link: string;
  problem: string;
  constraints: string[];
  approach: string[];
  iterations: string[];
};

export type InteractiveProject = {
  id: string;
  title: string;
  chapter: 'Browser Lab' | 'Unity / AR';
  purpose: string;
  tests: string;
  inputsOutputs: string[];
  interaction: string;
  buildNotes: string[];
  implementation: string[];
  links: { demo: string; repo: string };
};

export type ResearchEntry = {
  id: string;
  date: string;
  title: string;
  summary: string;
  body: string[];
  tags: string[];
  links: { label: string; href: string }[];
};

export const sectionMeta = [
  { id: 'page-00', label: 'Home' },
  { id: 'page-01', label: 'About' },
  { id: 'page-03', label: 'UI Systems' },
  { id: 'page-03a', label: 'UI Case' },
  { id: 'page-housing', label: 'Housing' },
  { id: 'page-04', label: 'Interactive' },
  { id: 'page-04a', label: 'Int Project' },
  { id: 'page-05', label: 'Research' },
  { id: 'page-06', label: 'Spatial' },
  { id: 'page-06a', label: 'Study' },
  { id: 'page-08', label: 'Resume' },
] as const;

export const home = {
  name: 'Ryan Yu',
  descriptor: 'UI systems, interactive prototypes, spatial studies.',
  pathStart: 'Follow the folding path to unfold projects and notes.',
  featuredSpines: ['UI Systems', 'Interactive Systems', 'Research Log'],
};

export const about = {
  bio: [
    'I design and build interface systems that are precise, testable, and readable.',
    'My work connects product UI thinking with experimental interaction prototypes.',
    'I use structured process, constrained visual language, and measurable outcomes.',
    'Current practice spans browser labs, Unity/AR studies, and spatial coding.',
  ],
  focus: [
    'Design-system-first UI architecture',
    'Interaction model prototyping in browser and AR',
    'Tooling and reusable component logic',
    'Documentation for handoff and evaluation',
  ],
  tools: ['Figma', 'React', 'Houdini', 'Unity', 'p5.js', 'ml5.js', 'TouchDesigner'],
  links: [
    { label: 'Resume', href: '#page-08' },
    { label: 'Email', href: 'mailto:hryanyu@gmail.com' },
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  ],
  fold: {
    education: 'PRATT BFA Digital Arts Art & Technology focused on creative technology and interaction systems.',
    exhibitions: '',
    paperReport: 'Published and in-progress papers, reports, and written documentation.',
    otherWorks: 'Additional projects, collaborations, and side work outside main tracks.',
  },
};

export const workIndex = {
  ui: [
    { title: 'Transit UI Refresh', outcome: 'Reduced interaction steps for trip planning.', role: 'UI System', href: '#page-03a' },
    { title: 'Housing Solutions', outcome: 'Tools and Insights for a Smoother Housing Searching Experiences', role: 'UI System + UX', href: '#page-housing', thumb: './housing-hero.png' },
  ],
  interactive: [
    { title: 'Gesture Type Lab', outcome: 'Mapped body input to kinetic typography states.', role: 'Prototype', href: '#page-04a' },
    { title: 'AR Wayfinding Mock', outcome: 'Tested spatial cue readability in motion.', role: 'Unity/AR', href: '#page-04a' },
  ],
  research: [
    { title: 'Fold Path Study', outcome: 'Defined spine-based navigation behavior.', role: 'Research', href: '#page-05' },
    { title: 'Contrast Audit', outcome: 'Established AA-safe neutral palette rules.', role: 'Audit', href: '#page-05' },
  ],
};

export const uiCaseStudies: CaseStudy[] = [
  {
    id: 'ui-a',
    title: 'Transit UI Refresh',
    role: 'Product Design + Frontend',
    link: '#page-03a',
    problem: 'Trip planning flows were verbose and visually inconsistent across surfaces.',
    constraints: ['Legacy data schema', 'No backend changes', '2-week delivery'],
    approach: ['Consolidated navigation states', 'Tokenized spacing and type', 'Built fold-out detail interactions'],
    iterations: ['Prototype A removed redundant tabs', 'Prototype B improved card rhythm', 'Final reduced primary actions to 3'],
  },
  {
    id: 'ui-b',
    title: 'Control Panel IA',
    role: 'UX Architecture',
    link: '#page-03a',
    problem: 'Operators needed faster anomaly scanning and clearer system status cues.',
    constraints: ['Dense data tables', 'Multiple user roles', 'Desktop-first environment'],
    approach: ['Priority mapping by severity', 'Two-level fold hierarchy', 'Single visual accent policy'],
    iterations: ['Merged duplicate metrics', 'Promoted alert lineage', 'Added keyboard-first actions'],
  },
  {
    id: 'ui-c',
    title: 'Portfolio Spine System',
    role: 'Design Engineering',
    link: '#page-03a',
    problem: 'Portfolio content lacked a coherent, low-noise browsing model.',
    constraints: ['Mixed project types', 'Mobile readability', 'Small maintenance overhead'],
    approach: ['Spine navigation model', 'Accordion disclosure logic', 'Section-by-section narrative'],
    iterations: ['Adjusted fold timing', 'Reduced decorative motion', 'Added active-section indexing'],
  },
];

export const interactiveProjects: InteractiveProject[] = [
  {
    id: 'int-a',
    title: 'Gesture Type Lab',
    chapter: 'Browser Lab',
    purpose: 'Test whether body pose data can drive legible typographic transitions.',
    tests: 'Real-time pose confidence and mapping stability under camera noise.',
    inputsOutputs: ['Input: webcam pose landmarks', 'Output: variable font axis + layout shift'],
    interaction: 'Three-state mapping: idle, reach, hold.',
    buildNotes: ['ml5 pose stream smoothing', 'State machine for jitter control', 'Frame budget under 16ms'],
    implementation: ['ml5.js pose model', 'Canvas render pipeline', 'Event-batched state updates'],
    links: { demo: '#', repo: '#' },
  },
  {
    id: 'int-b',
    title: 'AR Wayfinding Mock',
    chapter: 'Unity / AR',
    purpose: 'Evaluate spatial marker readability while users move in constrained corridors.',
    tests: 'Label occlusion, depth cue legibility, and route confidence.',
    inputsOutputs: ['Input: camera pose + anchor plane', 'Output: route markers + confidence states'],
    interaction: 'Directional arrows adapt by distance and heading delta.',
    buildNotes: ['AR Foundation anchors', 'Distance-based opacity', 'Fallback for low-light tracking'],
    implementation: ['Unity XR stack', 'C# marker controller', 'Stateful route graph'],
    links: { demo: '#', repo: '#' },
  },
  {
    id: 'int-c',
    title: 'Proxy Material Console',
    chapter: 'Browser Lab',
    purpose: 'Prototype tactile-feeling UI controls with strict visual restraint.',
    tests: 'Input latency and perceived control precision.',
    inputsOutputs: ['Input: pointer drag + key shortcuts', 'Output: shader and motion parameter changes'],
    interaction: 'Fine-grained slider control with snap states.',
    buildNotes: ['WebGL shader uniforms', 'Debounced controls', 'Preset serialization'],
    implementation: ['Three.js scene setup', 'Tokenized UI wrappers', 'State snapshot utility'],
    links: { demo: '#', repo: '#' },
  },
];

export const researchEntries: ResearchEntry[] = [
  {
    id: 'log-a',
    date: '2026-03-01',
    title: 'Fold Path Navigation Rules',
    summary: 'Defined one-open disclosure behavior and section progression constraints.',
    body: [
      'Tested three disclosure patterns; one-open model had the best scan performance.',
      'Added active section tracking with intersection thresholds.',
      'Reduced animation amplitude to protect readability.',
    ],
    tags: ['UI', 'Notes'],
    links: [{ label: 'Related: Work Index', href: '#page-02' }],
  },
  {
    id: 'log-b',
    date: '2026-02-18',
    title: 'Unity Marker Contrast Tests',
    summary: 'Compared marker visibility across neutral and noisy spatial backgrounds.',
    body: [
      'Orange accent remained visible without overwhelming scene context.',
      'Added minimum stroke width and opacity floor for distance states.',
      'Documented failures in over-bright surfaces.',
    ],
    tags: ['Unity', 'AR'],
    links: [{ label: 'Related: AR Wayfinding Mock', href: '#page-04a' }],
  },
  {
    id: 'log-c',
    date: '2026-01-20',
    title: 'Token Spacing Audit',
    summary: 'Validated 8px baseline and reduced exceptions across pages.',
    body: [
      'Removed ad-hoc spacing values and normalized section rhythm.',
      'Kept mobile reductions proportional to baseline changes.',
      'Created final spacing map for future additions.',
    ],
    tags: ['UI', 'Hardware'],
    links: [{ label: 'Related: About', href: '#page-01' }],
  },
];

export const housingProject = {
  title: 'Housing Solutions',
  subtitle: 'Tools and Insights for a Smoother Housing Searching Experience',
  year: '2025 Oct. to Dec.',
  role: 'UI System + UX Research',
  team: ['Ryan Yu', 'Donald Zhang'],
  institution: '',
  program: '',
  summary:
    'A research-driven design project addressing friction in the housing search process. Through user interviews, competitive analysis, and iterative prototyping, the project delivers a set of interface tools that help renters compare listings, understand neighborhoods, and make confident decisions with less cognitive load.',
  problemSpace: [
    'Overwhelming volume of listings across fragmented platforms',
    'Lack of structured comparison tools for non-expert renters',
    'Hidden costs and inconsistent listing quality erode trust',
    'Emotional stress and time pressure in housing decisions',
    'Poor mobile experiences for on-the-go searching',
  ],
  designGoals: [
    'Reduce cognitive load during listing comparison',
    'Surface neighborhood context alongside unit details',
    'Build trust through transparent data presentation',
    'Support mobile-first search workflows',
    'Create a calm, non-overwhelming visual experience',
  ],
  solutionDescription:
    'The system introduces a structured comparison view, neighborhood insight cards, and a personalized shortlist that syncs across devices. Each feature was designed to reduce decision fatigue and bring relevant context forward at the moment of need.',
  interactionPrinciples: [
    'Progressive disclosure of listing details',
    'Side-by-side comparison with highlighted differences',
    'Map-integrated neighborhood context',
    'Saved search with smart notification thresholds',
    'Accessible, high-contrast interface components',
  ],
  processSteps: [
    'User interviews & pain-point mapping',
    'Competitive audit of 8 housing platforms',
    'Information architecture & flow diagrams',
    'Low-fidelity wireframes & concept testing',
    'High-fidelity prototypes in Figma',
    'Usability testing with 5 participants',
  ],
  experienceScenarios: [
    'A first-time renter filters by commute time and compares three shortlisted apartments side by side.',
    'A relocating professional reviews neighborhood safety scores and nearby amenities before scheduling tours.',
    'A couple collaborates on a shared shortlist, each adding notes and ratings from their own device.',
  ],
  credits: {
    team: ['Ryan Yu', 'Donald Zhang'],
    role: 'UI System + UX Research',
    year: '2025 Oct. to Dec.',
    tools: ['Figma', 'React', 'User Interviews', 'Usability Testing'],
  },
  galleryCount: 6,
};

export const spatialStudies = {
  installation: [
    {
      title: 'Ambient Signal Room',
      intent: 'Translate live sensor data into restrained light and type behaviors.',
      medium: 'Projection + sensor array',
      tools: 'TouchDesigner, Arduino',
    },
    {
      title: 'Path Resonance',
      intent: 'Explore movement traces as structured spatial notation.',
      medium: 'Interactive projection',
      tools: 'Unity, OSC',
    },
  ],
  coding: [
    {
      title: 'Fold Grammar Engine',
      intent: 'Generate compositional path variants with fixed readability constraints.',
      medium: 'Browser sketch',
      tools: 'p5.js, Houdini',
    },
    {
      title: 'Receipt Log Renderer',
      intent: 'Render timestamped process records as expandable strips.',
      medium: 'Web app component',
      tools: 'React, CSS',
    },
  ],
};
