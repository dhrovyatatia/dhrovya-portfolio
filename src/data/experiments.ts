/**
 * "A life in fragments" — hobbies, in order of priority.
 * Images live in /public/hobbies. `position` sets the crop focus (CSS object-position).
 * Without an image, `art` draws a procedural visual from components/lab/ExperimentArt.tsx.
 */
export type ExperimentArtKind = 'ripples' | 'glyphs' | 'grid' | 'bloom' | 'orbit' | 'stems'

export interface Experiment {
  id: string
  title: string
  caption: string
  image?: string
  /** Alt text for the image */
  alt?: string
  position?: string
  link?: string
  art: ExperimentArtKind
}

export const experiments: Experiment[] = [
  {
    id: 'sketching',
    title: 'Sketching',
    caption: 'usually game and movie characters',
    image: '/hobbies/sketching.jpg',
    alt: 'An ink and marker sketch sheet of game characters, held up outdoors',
    position: '50% 45%',
    art: 'stems',
  },
  {
    id: 'billiards',
    title: 'Billiards',
    caption: 'so fun so fun so fun',
    image: '/hobbies/billiards.jpg',
    alt: 'Lining up a shot on a red billiards table in an arcade',
    position: '62% 55%',
    art: 'orbit',
  },
  {
    id: 'reading',
    title: 'Reading',
    caption: 'i read anything except self help books',
    image: '/hobbies/reading.jpg',
    alt: 'A shelf of colourful Goodnight Punpun manga volumes',
    position: '40% 50%',
    art: 'glyphs',
  },
  {
    id: 'exploring-ai',
    title: 'Exploring AI',
    caption: 'hanging with gpt rn, ttyl',
    image: '/hobbies/exploring-ai.jpg',
    alt: 'A selfie with a friendly robot',
    position: '50% 40%',
    art: 'grid',
  },
  {
    id: 'music',
    title: 'Music',
    caption: 'i enjoy rock and metal... and pretty much everything else',
    image: '/hobbies/music.jpg',
    alt: 'A halftone print of a Buddha statue wearing headphones',
    position: '50% 40%',
    art: 'ripples',
  },
  {
    id: 'photography',
    title: 'Photography',
    caption: 'i love to capture cool things',
    image: '/hobbies/photography.jpg',
    alt: 'A graffiti-covered stairwell glowing in warm light',
    position: '50% 50%',
    art: 'bloom',
  },
]
