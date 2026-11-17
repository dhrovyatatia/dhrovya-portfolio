import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Typefaces — self-hosted, variable.
// Noto Serif Display with its width axis: extra-condensed (62.5%) at weight 900
// gives the tall, heavy, sharp-serifed PERCH-style display face.
import '@fontsource-variable/noto-serif-display/wdth.css'
import '@fontsource-variable/cormorant-garamond/wght.css'
import '@fontsource-variable/cormorant-garamond/wght-italic.css'
import '@fontsource-variable/instrument-sans/wght.css'
import '@fontsource-variable/caveat/wght.css'
import 'lenis/dist/lenis.css'
import './styles/index.css'

import App from './App'

if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
