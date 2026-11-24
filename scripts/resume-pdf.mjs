/**
 * Prints resume.html (a static page sharing css/resume.css with the site) to public/Dhrovya-Tatia-Resume.pdf.
 * Needs the dev server running (npm run dev) and a local Chrome or Edge.
 *   npm run resume:pdf
 * Override with RESUME_URL=…, RESUME_OUT=… or CHROME_PATH=… if needed.
 */
import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const url = process.env.RESUME_URL ?? 'http://localhost:5173/resume.html'
const out = process.env.RESUME_OUT ?? fileURLToPath(new URL('../public/Dhrovya-Tatia-Resume.pdf', import.meta.url))
const candidates = [
  process.env.CHROME_PATH,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
].filter(Boolean)
const executablePath = candidates.find((p) => existsSync(p))
if (!executablePath) throw new Error('No Chrome/Edge found — set CHROME_PATH')

const browser = await chromium.launch({ executablePath })
const page = await browser.newPage()
await page.goto(url, { waitUntil: 'networkidle' })
await page.emulateMedia({ media: 'print' })
await page.evaluate(() => document.fonts.ready)
const height = await page.evaluate(() => document.querySelector('.rs-inner').getBoundingClientRect().height)
const a4 = 1122.5
console.log(`sheet height ${height}px of ${a4}px (${height <= a4 ? 'fits one page' : 'OVERFLOWS one page'})`)
await page.pdf({ path: out, format: 'A4', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }, preferCSSPageSize: true })
await browser.close()
console.log(`wrote ${out}`)
