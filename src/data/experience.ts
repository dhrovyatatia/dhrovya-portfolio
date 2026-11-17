/**
 * Timeline entries for "Beyond the Classroom".
 * Listed in the order they happened — oldest first, so the thread reads as a journey.
 */
export interface ExperienceEntry {
  position: string
  organization: string
  duration: string
  /** Small label shown under the date */
  tag?: string
  points: string[]
}

export const experience: ExperienceEntry[] = [
  {
    position: 'Olympiads',
    organization: 'SOF & SilverZone',
    duration: 'Elementary – High School',
    tag: 'Academics',
    points: ['Earned multiple school, national and international level awards.'],
  },
  {
    position: 'First Runner-Up Overall',
    organization: 'Sangam Fest (National Cultural Festival), Bhilwara',
    duration: '2023',
    tag: 'Culture',
    points: ['Won First Place in Story Writing and represented the school across drama, story enactment, dance and music.'],
  },
  {
    position: 'Storyboard Artist & Co-Writer',
    organization: "'Tadka' Music Video",
    duration: '2024',
    tag: 'Creative',
    points: [
      'Co-wrote lyrics and contributed to set design, lighting and production planning with a professional director and videographers.',
    ],
  },
  {
    position: 'Best Caricaturist, International Press Committee',
    organization: 'Civitas MUN, Jodhpur',
    duration: '2024',
    tag: 'Award',
    points: ['Created global-awareness posters, caricatures and comic scripts as part of the press team.'],
  },
  {
    position: 'Youth Parliament',
    organization: 'Mayoor Chopasni School, Jodhpur',
    duration: '2025',
    tag: 'Leadership',
    points: [
      'Served as Scribe on the Judging Panel and on the organising committee; hosted committee sessions and supported event planning and on-ground execution.',
    ],
  },
  {
    position: 'National Case Competitions',
    organization: 'CDPG DigiYatra 2026 & Case Consilium 2026',
    duration: 'Oct 2026',
    tag: 'Competition',
    points: ['Analysed real-world business problems and developed structured solutions in two national case competitions.'],
  },
  {
    position: 'Chairperson, UNESCO Committee',
    organization: 'MCSMUN',
    duration: 'Nov 2026',
    tag: 'Leadership',
    points: [
      'Chaired a committee of 50+ delegates, moderating debate and steering the flow of discussion across sessions.',
      'Trained Executive Board members and participating delegates ahead of the conference.',
    ],
  },
]
