// Experiences page content, in display order. Text matches the Figma design.
// Image paths are relative to src/assets/images (see utils/images.js).

export const jumpLinks = [
  { id: 'competitions', label: 'Competitions' },
  { id: 'awards', label: 'Awards' },
  { id: 'leadership', label: 'Leadership & Involvement' },
  { id: 'learning', label: 'Learning & Development' },
]

export const competitions = [
  {
    id: 'project-panay',
    award: 'People’s Choice Award',
    event: 'Game On! 2023',
    // Rich text so "tsinelas" can be italic, as in Figma
    intro: [
      'Project Panay is a 2D action-adventure game that follows our main character “Junjun” as he battles Philippine Mythical Creatures with his ',
      { italic: 'tsinelas' },
      '. With the guidance of an Albularyo, he is able to navigate and use the power of his 3rd eye.',
    ],
    bullets: [
      'Served as Art Director for a 4-member cross-university team.',
      'Designed characters, sprite animations, setting, and concept art using Aseprite and Clip Studio Paint.',
    ],
    side: [
      { label: 'Game Title', values: ['Project Panay'] },
      { label: 'Role', values: ['Art Director'] },
      { label: 'Date', values: ['November 12, 2023'] },
    ],
    poster: 'experiences/project-panay/poster.jpg',
    images: [
      'experiences/project-panay/present.jpg',
      'experiences/project-panay/gameplay-1.png',
      'experiences/project-panay/venue.jpg',
      'experiences/project-panay/gameplay-2.png',
      'experiences/project-panay/concept.png',
      'experiences/project-panay/gameplay-3.png',
    ],
  },
  {
    id: 'baconawa-and-eggs',
    award: '2nd Runner-Up',
    category: 'Best Game Exhibited',
    event: 'Odyssey Festival 2024',
    intro: [
      '“Baconawa and Eggs” is a 2D PvP party game featuring three protagonists, the Rice Grain People, and the main antagonist, the hungry bacon Baconawa. In this game, the Baconawa’s goal is to consume all seven moon eggs before the timer runs out.',
    ],
    bullets: [
      'Designed characters, sprite animations, setting, concept art, and poster using Aseprite and Clip Studio Paint.',
      'Developed Baconawa’s snake movement and power up logic in Godot.',
    ],
    side: [
      { label: 'Game Title', values: ['Baconawa and Eggs'] },
      { label: 'Roles', values: ['Art Director', 'Developer'] },
      { label: 'Date', values: ['August 11, 2024'] },
    ],
    poster: 'experiences/baconawa-and-eggs/poster.png',
    images: [
      'experiences/baconawa-and-eggs/group-picture.jpg',
      'experiences/baconawa-and-eggs/main-menu.png',
      'experiences/baconawa-and-eggs/concept.jpg',
      'experiences/baconawa-and-eggs/selection.png',
      'experiences/baconawa-and-eggs/instructions.png',
      'experiences/baconawa-and-eggs/gameplay.png',
    ],
  },
]

export const awards = [
  { name: 'Bronze Medal', year: 'A.Y. 2023 – 2024' },
  { name: 'Silver Medal', year: 'A.Y. 2024 – 2025' },
  { name: 'Bronze Medal', year: 'A.Y. 2025 – 2026' },
  { name: 'College Service Award', year: 'A.Y. 2025 – 2026' },
  { name: 'DOST-SEI Scholarship', year: 'A.Y. 2025 – Present' },
]

export const gwaRanges = [
  { tier: 'Gold', range: '1.00 – 1.24' },
  { tier: 'Silver', range: '1.25 – 1.49' },
  { tier: 'Bronze', range: '1.50 – 1.74' },
]

export const awardNotes = [
  {
    label: 'College Service Award Event',
    text: 'The 12th PASUC National Culture and the Arts Festival (NCAF) 2026 – Publication & Documentation',
  },
  {
    label: 'Scholarship Program',
    text: 'Junior Level Science Scholarship (JLSS) – Merit Program',
  },
]

export const linkExe = {
  name: 'LINK.exe',
  tags: ['Event Documentation', 'Media', '2025 – Present'],
  intro: 'A WVSU-CICT special interest organization that aims to utilize ICT across multi-disciplinary fields.',
  bullets: [
    'Selected photos for event highlights and bulk posts.',
    'Color-graded images from different photographers and camera types.',
    'Reviewed edits for quality and consistency before publishing.',
    'Received a College Service Award for PASUC NCAF 2026',
  ],
  side: [
    { label: 'Roles', values: ['Senior Sorter & Colorist', 'Quality Assurance Committee Member'] },
    {
      label: 'National Events',
      small: true,
      values: [
        '12th PASUC National Culture and the Arts Festival',
        '12th National Research Conference in Science and Mathematics Education – DOST',
        '44th National Folk Dance Workshop',
      ],
    },
  ],
  // File names are column-row: 1-x is the tall left column, 2-x to 4-x the 3×3 grid
  tall: ['experiences/link-exe/1-1.jpg', 'experiences/link-exe/1-2.jpg'],
  grid: [
    'experiences/link-exe/2-1.jpg',
    'experiences/link-exe/3-1.jpg',
    'experiences/link-exe/4-1.jpg',
    'experiences/link-exe/2-2.jpg',
    'experiences/link-exe/3-2.jpg',
    'experiences/link-exe/4-2.jpg',
    'experiences/link-exe/2-3.jpg',
    'experiences/link-exe/3-3.jpg',
    'experiences/link-exe/4-3.jpg',
  ],
  credit: 'Color grading by me · Photos by LINK.EXE Media Team',
}

export const webinarCoHost = {
  name: 'Webinar Co-Host',
  tags: ['Webinar', 'OBS Streaming'],
  intro:
    'A webinar entitled “Exploring Opportunities: Your IT Career Doesn’t Have to Start with Code” with the topic “From Student to IT Professional: Building Your Career in the Tech Industry” featuring an IT professional sharing their experiences, insights, and knowledge about working in the industry. This webinar aims to help students better understand the skills, challenges, career opportunities, and expectations they may encounter as they enter the IT profession.',
  bullets: [
    'Managed the live broadcast, including slides, audio, scene transitions, and overall flow, using OBS Studio and Google Meet.',
    'Co-organized the webinar with a team of 5.',
    'Partnered with WVSU – Spark Hub, WVSU – Cipher, LINK.exe, CICT Student Council, ICON Publication, ISATU Educator’s Guild, and ISATU Technical Teacher Education Council',
  ],
  side: [
    {
      label: 'Title',
      values: ['Exploring Opportunities: Your IT Career Doesn’t Have to Start with Code'],
    },
    { label: 'Context', values: ['CC 209 – Seminars and Field Study'] },
    { label: 'Roles', values: ['Technical Director'] },
    { label: 'Date', values: ['October 9, 2026'] },
  ],
  images: [
    'experiences/webinar-cohost/poster.jpg',
    'experiences/webinar-cohost/title-card.png',
    'experiences/webinar-cohost/setup.png',
  ],
}

export const certificateGroups = [
  {
    title: 'Cisco Networking Academy',
    size: 'lg',
    items: [
      { caption: 'CCNA: Introduction to Networks (2024)', image: 'certificates/cisco/ccna-introduction-to-networks.jpg' },
      {
        caption: 'CCNA: Switching, Routing, and Wireless Essentials (2025)',
        image: 'certificates/cisco/ccna-switching-routing-and-wireless-essentials.jpg',
      },
      { caption: 'Introduction to Cybersecurity (2026)', image: 'certificates/cisco/introduction-to-cybersecurity.jpg' },
      { caption: 'Computer Hardware Basics (2025)', image: 'certificates/cisco/computer-hardware-basics.jpg' },
      { caption: 'Python Essentials 1 (2026)', image: 'certificates/cisco/python-essentials-1.jpg' },
    ],
  },
  {
    title: 'Sololearn – Early Learning',
    size: 'sm',
    items: [
      { caption: 'Introduction to C++ (2023)', image: 'certificates/sololearn/introduction-to-cpp.png' },
      { caption: 'C++ Intermediate (2023)', image: 'certificates/sololearn/cpp-intermediate.png' },
      { caption: 'Introduction to HTML (2023)', image: 'certificates/sololearn/introduction-to-html.png' },
      { caption: 'Introduction to C# (2025)', image: 'certificates/sololearn/introduction-to-csharp.png' },
    ],
  },
  {
    title: 'Webinars Attended',
    size: 'md',
    items: [
      { label: 'Modern Web Development', image: 'certificates/webinar/modern-web-development.jpg' },
      { label: 'Tech Talks', image: 'certificates/webinar/tech-talks.jpg' },
      { label: 'Cybersecurity Essentials', image: 'certificates/webinar/cybersecurity-essentials.jpg' },
      { label: 'Decentralization & Security', image: 'certificates/webinar/decentralization-and-security.jpg' },
      { label: 'Ethics of AI', image: 'certificates/webinar/ethics-of-ai.jpg' },
      {
        label: 'Navigating a Web Development Career',
        image: 'certificates/webinar/navigating-a-web-development-career.jpg',
      },
    ],
  },
]
