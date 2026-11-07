// Projects page content, in display order. Text matches the Figma design.
// carousel: settings for components/ui/Carousel (sizes in rem = px / 16). Phone and web
// carousels are 1.18x the Figma size to fill the pinned black band; the portfolio one
// is smaller than Figma so it fits on the screen.
// bullets: plain strings, or { text, nowrap: true } for lines Figma keeps on one line

export const projectGroups = [
  { label: 'Developed Projects', ids: ['aibrecare', 'tibiao', 'cozytask'] },
  { label: 'Figma Prototypes', ids: ['lagawta', 'agrilinko'] },
  { label: 'This Website', ids: ['portfolio'] },
]

export const projects = [
  {
    id: 'aibrecare',
    name: 'AiBreCare',
    tags: ['2025 – 2026', 'Mobile Application', 'Full-Stack'],
    intro:
      'An AI-powered mobile application utilizing voice recognition, image recognition, and natural language processing (NLP) with a focus to aid students in practicing and assessing competency in their clinical skills laboratory.',
    bullets: [
      'Collaborated with a team of 5 following an iterative & incremental methodology.',
      'Designed the application’s relational database schema.',
      'Integrated cloud database management using Supabase and cloud services including Gemini AI, AWS Lambda, AWS S3, and AssemblyAI.',
      'Managed the application’s version control via GitHub.',
    ],
    context: 'Undergraduate Thesis',
    roles: ['Lead Developer', 'Repository Maintainer', 'DevOps Engineer'],
    scope: ['Mobile App Development', 'AI Integration', 'Cloud Services Integration'],
    images: 'projects/aibrecare',
    carousel: { perSlide: 4, width: '92.75rem', height: '44.25rem', accent: 'var(--color-aibrecare)' },
  },
  {
    id: 'tibiao',
    name: 'Tibiao Bakery Web',
    tags: ['2026', 'Web Application', 'UI/UX Design'],
    intro:
      'A web application for Tibiao Bakery Corporation, designed to replace the manual system with a more efficient and reliable platform. It manages customer orders, tracks products, handles production batch assignments, and supports Packaging and Quality Control operations.',
    bullets: [
      'Collaborated with a team of 6 following a Kanban methodology.',
      'Designed the UI/UX using Figma and built the frontend with React.js.',
      { text: 'Designed the system’s Unified Modeling Language (UML) diagrams.', nowrap: true },
      { text: 'Conducted testing and QA across the four subsystems before deployment.', nowrap: true },
      'Managed the system’s version control via GitHub.',
    ],
    context: 'CIT 214 – Software Engineering',
    roles: ['UI/UX Designer', 'Frontend Developer', 'Quality Assurance'],
    scope: ['Web App Development', 'Database Integration', 'Inventory Management'],
    images: 'projects/tibiao-web',
    // One screen per slide, with the neighbors peeking in
    carousel: {
      perSlide: 1,
      width: '81.125rem',
      height: '36.875rem',
      slideWidth: '66.125rem',
      accent: 'var(--color-tibiao)',
    },
  },
  {
    id: 'cozytask',
    name: 'CozyTask',
    tags: ['2025', 'Mobile Application', 'Backend'],
    intro:
      'A mobile application developed to enhance task management and organizational efficiency for students and working professionals. It provides a centralized digital platform where users can create tasks, set deadlines, classify responsibilities, track progress, and receive timely reminders.',
    bullets: [
      'Collaborated with a team of 7 following an agile methodology.',
      'Led the development of the mobile application using Flutter.',
      'Designed the application’s relational database schema.',
      'Integrated SQLite for local storage.',
      'Managed the application’s version control via GitHub.',
    ],
    context: 'CIT 206 – Applications Development and Emerging Technologies',
    roles: ['Lead Developer', 'Repository Maintainer', 'Database Design'],
    scope: ['Mobile App Development', 'Database Integration'],
    images: 'projects/cozytask',
    carousel: { perSlide: 3, width: '68.625rem', height: '44.25rem', accent: 'var(--color-cozytask)' },
  },
  {
    id: 'lagawta',
    name: 'LagawTa',
    tags: ['2025', 'Mobile Prototype', 'UI/UX Design'],
    intro:
      'An application that provides an inclusive solution to the inaccessibility faced by people with physical disabilities and senior citizens during their travel. Its features are specially designed for travelers, promoting a more accessible and seamless travel experience.',
    bullets: [
      'Collaborated with a team of 5 using Figma.',
      'Designed the layout of the Home, Navigation, and Travel pages.',
      'Designed the prototype connections and flow between screens.',
      'Conducted QA across all features and pages of the app.',
    ],
    context: 'CIT 213 – Human Computer Interactions 2',
    roles: ['UI/UX Designer', 'Quality Assurance'],
    scope: ['Mobile UI/UX Design', 'AI Chatbot', 'Augmented Reality'],
    images: 'projects/lagawta',
    carousel: { perSlide: 4, width: '92.75rem', height: '44.25rem', accent: 'var(--color-lagawta)' },
  },
  {
    id: 'agrilinko',
    name: 'AgriLinko',
    tags: ['2025', 'Mobile Prototype', 'UI/UX Design'],
    intro:
      'An AI-powered recipe maker that suggests nutritious meals based on your budget, uses blockchain to identify the nearest, most affordable, verified Agri-Fishery suppliers, and guarantees every ingredient recommendation is fresh, safe, and traceable.',
    bullets: [
      'Collaborated with a team of 3 using Figma.',
      'Designed the Logo and UI/UX of the application.',
      'Designed the prototype connections and flow between screens.',
    ],
    context: 'BA 234 – Technopreneurship',
    contextCompact: true, // 30px in Figma so it stays on one line
    roles: ['Lead UI/UX Designer', 'Quality Assurance'],
    scope: ['Mobile UI/UX Design', 'Blockchain Technology'],
    images: 'projects/agrilinko',
    carousel: { perSlide: 3, width: '72rem', height: '47.9375rem', accent: 'var(--color-agrilinko)' },
  },
  {
    id: 'portfolio',
    name: '2026 Portfolio',
    tags: ['2026', 'Website', 'Frontend'],
    intro:
      'A personal portfolio website showcasing featured projects, designs, and experience. Designed from scratch in Figma and built with React.js. It serves as a central hub for my work as I pursue OJT opportunities in software development.',
    bullets: [
      'Designed the full UI/UX in Figma across 4 pages: Home, Projects, About Me, and Experiences.',
      'Built the site with React.js using reusable components.',
      'Implemented responsive layouts for desktop and mobile.',
      'Managed the website’s version control via GitHub.',
    ],
    context: 'Personal Project',
    roles: ['UI/UX Designer', 'Frontend Developer', 'Quality Assurance'],
    scope: ['UI/UX Design', 'Web Development'],
    images: 'projects/portfolio',
    // Two page mockups side by side, then the wide one on its own
    carousel: { perSlide: 2, width: '71.8125rem', height: '48rem', fit: 'width' },
  },
]
