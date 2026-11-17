/**
 * Journal entries — one spread each.
 * `art` picks one of the illustrated plates in components/journal/ProjectArt.tsx.
 * Set `image` to a path in /public (e.g. '/work/entry-01.jpg') to use a real visual instead.
 */

export type ProjectArtKind = 'strategy' | 'finance' | 'leadership' | 'creative' | 'tools'

export interface Project {
  id: string
  /** Small running label, e.g. "Business & Strategy" */
  category: string
  title: string
  /** One-line italic subtitle under the title */
  tagline?: string
  description: string
  role: string
  /** Heading for the list below — "Skills" or "Tools" */
  listLabel?: string
  technologies: string[]
  /** Optional link — the button only appears when set */
  link?: string
  linkLabel?: string
  art: ProjectArtKind
  image?: string
  /** Handwritten caption on the left-hand page */
  note?: string
}

export const projects: Project[] = [
  {
    id: 'strategy',
    category: 'Business & Strategy',
    title: 'Strategy & Research',
    tagline: 'Connecting dots before connecting the market.',
    description:
      'I enjoy understanding how businesses work, identifying market opportunities and figuring out what makes a product stand out. From market and competitor research to go-to-market planning, I like turning observations into actionable strategies.',
    role: 'Co-founder — Vistara Ateliers / Marketing & Outreach Intern — Stintt',
    listLabel: 'Skills',
    technologies: [
      'Market & Competitor Research',
      'Product Research',
      'Go-to-Market Strategy',
      'Business Strategy',
      'Analytical & Critical Thinking',
    ],
    art: 'strategy',
    note: 'Good ideas need good strategies.',
  },
  {
    id: 'finance',
    category: 'Finance & Analysis',
    title: 'Finance & Analysis',
    tagline: 'Because numbers have stories too.',
    description:
      "Fascinated by how money moves, markets behave and financial decisions shape businesses. I'm building my foundation in financial analysis through CFA Level I preparation, alongside developing my Excel and financial modelling capabilities.",
    role: 'Independent Learning / CFA Level I Candidate',
    listLabel: 'Skills',
    technologies: [
      'Financial Analysis Fundamentals',
      'Financial Modelling (Learning)',
      'Microsoft Excel',
      'Quantitative Thinking',
      'Data Interpretation',
    ],
    art: 'finance',
    note: 'Making cents of everything.',
  },
  {
    id: 'leadership',
    category: 'Communication & Leadership',
    title: 'Words & Leadership',
    tagline: 'Some conversations are worth leading.',
    description:
      "Whether it's moderating a debate, presenting an idea or coordinating a team, I enjoy bringing people together and making conversations count. I've chaired a UNESCO committee of 50+ delegates and contributed to organising and leading student initiatives.",
    role: 'Chairperson — UNESCO Committee, MCSMUN',
    listLabel: 'Skills',
    technologies: ['Public Speaking', 'Debate Moderation', 'Leadership & Coordination', 'Reports & Presentations', 'Communication'],
    art: 'leadership',
    note: 'Talking is easy. Making a point is the skill.',
  },
  {
    id: 'creative',
    category: 'Creative Thinking',
    title: 'The Creative Side',
    tagline: 'Not everything needs a spreadsheet.',
    description:
      'From sketching caricatures and creating visual concepts to writing stories and developing storyboards, creativity has always been another way I enjoy expressing ideas. I like experimenting with different formats and bringing imagination into the real world.',
    role: 'Storyboard Artist & Co-writer / Creative Contributor',
    listLabel: 'Skills',
    technologies: ['Storyboarding', 'Sketching & Illustration', 'Content Writing', 'Storytelling', 'Creative Thinking'],
    art: 'creative',
    note: 'The other side of my brain at work.',
  },
  {
    id: 'tools',
    category: 'Technology & Digital Tools',
    title: 'Tools of the Trade',
    tagline: 'Curiosity, with a little help from technology.',
    description:
      "I enjoy experimenting with tools that make research, analysis and creative work more efficient. From AI-powered productivity tools and Claude Code to working with spreadsheets and exploring the fundamentals of Python and SQL, I'm always looking for something new to learn.",
    role: 'Continuous Learning & Practical Application',
    listLabel: 'Tools',
    technologies: ['Claude & Claude Code', 'AI Research & Productivity Tools', 'Microsoft Excel', 'Python (Basic)', 'SQL (Basic)'],
    art: 'tools',
    note: 'Still learning. Constantly updating.',
  },
]
