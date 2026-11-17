/**
 * "The learning curve" — education, qualifications and programmes.
 * Each group is a column; each entry is one institution or milestone.
 */
export interface LearningEntry {
  /** Institution or milestone, set in bold serif */
  heading: string
  /** Optional second bold line (e.g. the class or board) */
  sub?: string
  /** Regular lines. A line starting with a score (e.g. "97% · 2026") gets the score set large. */
  lines?: string[]
  /** Small footnote */
  small?: string
}

export interface LearningGroup {
  index: string
  title: string
  /** Handwritten margin note */
  note: string
  entries: LearningEntry[]
}

export const skills: LearningGroup[] = [
  {
    index: 'I',
    title: 'Schooling & Foundations',
    note: 'where it all began',
    entries: [
      {
        heading: 'Mayoor Chopasni School',
        sub: 'Class XII — CBSE',
        lines: ['97% · 2026', 'Commerce · Mathematics · Informatics Practices'],
      },
      {
        heading: 'Class X — CBSE',
        lines: ['92.40% · 2024'],
      },
    ],
  },
  {
    index: 'II',
    title: 'Undergraduate',
    note: 'the business of learning',
    entries: [
      {
        heading: 'Indian Institute of Management Bangalore',
        lines: ['BBA — Digital Business & Entrepreneurship', '2026–2029'],
        small: 'Distance Programme',
      },
    ],
  },
  {
    index: 'III',
    title: 'Professional Qualification',
    note: 'numbers, markets & everything between',
    entries: [
      {
        heading: 'CFA Institute',
        lines: ['CFA Level I Candidate', 'Currently Preparing'],
        small: 'November 2027 Attempt',
      },
    ],
  },
  {
    index: 'IV',
    title: 'Programs & Certifications',
    note: 'learning beyond the syllabus',
    entries: [
      {
        heading: 'McKinsey & Company',
        lines: ['McKinsey.org Forward Program', '10-week programme · 2026 · In Progress'],
      },
      {
        heading: 'IIT Madras',
        lines: ['Data Science & Artificial Intelligence', '8-week certified course · 2025'],
      },
    ],
  },
]

/** The outlined words that slide along the bottom of the page */
export const tickerWords = ['Commerce', 'Business', 'Finance', 'Tech']
