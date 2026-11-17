import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/noto-serif-display/wdth.css'
import '@fontsource-variable/instrument-sans/wght.css'
import './styles/resume.css'
import './styles/resume-print.css'
import { ResumeSheet } from './components/resume/ResumeSheet'

/** Standalone page used only to print the resume PDF. */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ResumeSheet />
  </StrictMode>,
)
