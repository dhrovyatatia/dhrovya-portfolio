/**
 * Resume content — rendered on the site (Hobbies chapter) and printed to
 * /public/Dhrovya-Tatia-Resume.pdf by `npm run resume:pdf`.
 */

export interface ResumeItem {
  title: string
  /** Muted italic note after the title */
  note?: string
  date?: string
  bullets?: string[]
}

export interface ResumeSection {
  heading: string
  items: ResumeItem[]
}

export const resume = {
  name: 'Dhrovya Amit Tatia',
  tagline: ['Business Student', 'Finance & Entrepreneurship'],
  contact: [
    { label: '+91 98290 16977', href: 'tel:+919829016977' },
    { label: 'dhrovya@gmail.com', href: 'mailto:dhrovya@gmail.com' },
    { label: 'Jodhpur, Rajasthan' },
    { label: 'linkedin.com/in/dhrovya-amit-tatia-80b040407', href: 'https://www.linkedin.com/in/dhrovya-amit-tatia-80b040407' },
  ] as { label: string; href?: string }[],
  profile:
    'BBA (Digital Business & Entrepreneurship) student at IIM Bangalore and CFA Level I candidate with a strong interest in finance and entrepreneurship. Co-founder of a handicraft marketplace startup and Marketing & Outreach Intern at an AI-powered SaaS company, with hands-on experience in go-to-market strategy, market research and outreach. A confident communicator with MUN leadership experience, eager to create impact in a fast-paced startup environment.',
  sections: [
    {
      heading: 'Experience',
      items: [
        {
          title: 'Co-Founder — Vistara Ateliers',
          note: 'Handicraft marketplace startup',
          date: 'Aug 2026 – Present',
          bullets: [
            'Drive marketing, outreach and creative direction for a marketplace connecting handicraft artisans with buyers.',
            'Design go-to-market strategies to build a presence in local and national handicraft circuits.',
            "Provide consulting and build relationships with artisans, sellers and buyers to expand the marketplace's network.",
          ],
        },
        {
          title: 'Marketing & Outreach Intern — Stintt',
          note: 'AI-powered SaaS startup',
          date: 'Sep 2026 – Present',
          bullets: [
            'Drive marketing and outreach for an AI-powered product that automates timesheets from calendar data.',
            'Support prospect outreach, content creation and go-to-market execution within a fast-moving early-stage team.',
          ],
        },
      ],
    },
    {
      heading: 'Education',
      items: [
        { title: 'BBA (Digital Business & Entrepreneurship) — IIM Bangalore', note: 'Distance programme', date: '2026 – 2029' },
        { title: 'Class XII (CBSE) — Mayoor Chopasni School, Jodhpur', note: 'Commerce with Mathematics & IP · 97%', date: '2026' },
        { title: 'Class X (CBSE) — Mayoor Chopasni School, Jodhpur', note: '92.40%', date: '2024' },
        { title: 'CFA Level I — CFA Institute', note: 'Currently preparing', date: 'Nov 2027 attempt' },
      ],
    },
    {
      heading: 'Leadership & Achievements',
      items: [
        {
          title: 'Chairperson, UNESCO Committee — MCSMUN',
          date: 'Nov 2026',
          bullets: [
            'Chaired a committee of 50+ delegates, moderating debate and steering the flow of discussion across sessions.',
            'Trained Executive Board members and participating delegates ahead of the conference.',
          ],
        },
        {
          title: 'National Case Competitions — CDPG DigiYatra 2026 & Case Consilium 2026',
          date: 'Oct 2026',
          bullets: ['Analysed real-world business problems and developed structured solutions in two national case competitions.'],
        },
        {
          title: 'Youth Parliament — Mayoor Chopasni School, Jodhpur',
          date: '2025',
          bullets: [
            'Served as Scribe on the Judging Panel and on the organising committee; hosted committee sessions and supported event planning and on-ground execution.',
          ],
        },
        {
          title: 'Best Caricaturist, International Press Committee — Civitas MUN, Jodhpur',
          date: '2024',
          bullets: ['Created global-awareness posters, caricatures and comic scripts as part of the press team.'],
        },
        {
          title: "Storyboard Artist & Co-Writer — 'Tadka' Music Video",
          date: '2024',
          bullets: [
            'Co-wrote lyrics and contributed to set design, lighting and production planning with a professional director and videographers.',
          ],
        },
        {
          title: 'First Runner-Up Overall — Sangam Fest (National Cultural Festival), Bhilwara',
          date: '2023',
          bullets: ['Won First Place in Story Writing and represented the school across drama, story enactment, dance and music.'],
        },
        {
          title: 'Olympiads — SOF & SilverZone',
          date: 'Elementary – High School',
          bullets: ['Earned multiple school, national and international level awards.'],
        },
      ],
    },
    {
      heading: 'Certifications & Programs',
      items: [
        {
          title: 'McKinsey.org Forward Program — McKinsey & Company',
          date: '2026 (In progress)',
          bullets: [
            '10-week programme building structured problem solving, effective communication, adaptability and digital & AI skills, with live sessions led by McKinsey leaders.',
          ],
        },
        {
          title: 'Data Science & Artificial Intelligence — IIT Madras School Connect Program',
          date: '2025',
          bullets: ['Completed an 8-week certified course in data science and AI fundamentals.'],
        },
      ],
    },
  ] as ResumeSection[],
  skills: [
    { label: 'Business & Strategy', value: 'Market, product & competitor research · Go-to-market strategy · Business strategy · Analytical & critical thinking' },
    { label: 'Finance', value: 'Financial analysis fundamentals (CFA Level I prep) · Financial modelling in Excel (learning)' },
    { label: 'Communication & Leadership', value: 'Public speaking · Debate moderation · Reports & presentations · Bilingual' },
    { label: 'Creative', value: 'Storyboarding · Sketching · Content & story writing' },
    { label: 'Tools', value: 'Claude / Claude Code · AI research & productivity tools · Microsoft Excel · Python & SQL (basic)' },
  ],
  pdf: '/Dhrovya-Tatia-Resume.pdf',
}
