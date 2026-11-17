/**
 * Site-wide personal content.
 * Everything a visitor reads about you lives in /src/data — edit these files,
 * not the components. Text in [square brackets] is a placeholder to replace.
 */

export const site = {
  name: 'Dhrovya Tatia',
  /** Short form, used where the full name is too long (signatures) */
  firstName: 'Dhrovya',
  monogram: 'D',
  /** Shown under the hero title */
  statement: 'Between spreadsheets, startups and questionable sleep schedules.',
  /** Lower-left hero note */
  intro:
    'A business student, aspiring entrepreneur and finance enthusiast exploring everything from startups to creative experiments.',
  /** Three words under the hero */
  themes: ['Entrepreneurship', 'Finance', 'Creativity'],
  /** Logo mark (transparent PNG in /public) */
  logo: '/logo-mark.png',
  /** Dark-ink version used over the ivory paper pages */
  logoInk: '/logo-mark-ink.png',
  edition: 'Vol. 01',
  year: new Date().getFullYear(),
  location: 'Jodhpur',
  /** Optional short line shown after the city on the contact page */
  availability: '',

  email: 'dhrovya@gmail.com',
  socials: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/dhrovya-amit-tatia-80b040407' },
    { label: 'Instagram', href: 'https://www.instagram.com/dhrovya.tatia?utm_source=ig_web_button_share_sheet&mdxt=ZDNlZDc0MzIxNw==' },
  ],
}

export const navigation = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Journal', href: '#experience' },
  { label: 'Hobbies', href: '#experiments' },
  { label: 'Contact', href: '#contact' },
] as const

export const about = {
  annotation: 'a work in progress, obviously ↗',
  /** Portrait image in /public */
  portrait: '/portrait.jpg',
  portraitCaption: "sry, I haven't unlocked the suited-up LinkedIn profile picture achievement yet",
  entries: [
    {
      label: 'Hello',
      body: "I'm Dhrovya — An ambitious individual with an unhealthy number of side quests.",
      more:
        'I enjoy understanding businesses, exploring ideas and building things. Usually found somewhere between a business strategy, a creative idea and 15 open browser tabs.',
    },
    {
      label: 'Background & interests',
      body:
        "Studying Digital Business & Entrepreneurship at IIM Bangalore and preparing for CFA Level I. I've ventured into startups, SaaS marketing, public speaking, storytelling and creative work. Choosing just one interest seemed unnecessarily restrictive.",
    },
    {
      label: 'Currently exploring',
      body:
        'Co-building Vistara Ateliers, working with an AI-powered SaaS startup and exploring the fascinating intersection of business, finance and technology.',
    },
    {
      label: 'What I want to build',
      body:
        'Businesses that solve real problems, products people love and ideas that make it beyond the brainstorming stage. Something meaningful, something ambitious and hopefully something that outlives my to-do list.',
    },
  ] as { label: string; body: string; more?: string }[],
}
