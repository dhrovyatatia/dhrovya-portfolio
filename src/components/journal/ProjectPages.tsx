import { memo } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '../../data/projects'
import { site } from '../../data/site'
import { ProjectArt } from './ProjectArt'

const pad = (n: number) => String(n).padStart(2, '0')

/** Left-hand page of a spread: the plate (visual). */
export const PlatePage = memo(function PlatePage({ project, index }: { project: Project; index: number }) {
  return (
    <div className="jpage is-left" data-spread={index} data-side="left">
      <div className="absolute inset-0 flex flex-col px-[8cqw] pb-[6cqw] pt-[7cqw]">
        <div className="cq-meta flex items-center justify-between text-ink/55">
          <span>Plate {pad(index + 1)}</span>
          <span>{project.category}</span>
        </div>

        <div className="relative mt-[4cqw] flex-1 border border-forest/70 p-[1.6cqw]">
          <div className="relative h-full w-full overflow-hidden bg-forest" data-art>
            <div className="spread-art" data-art-inner>
              {project.image ? (
                <img src={project.image} alt="" className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <ProjectArt kind={project.art} />
              )}
            </div>
          </div>
          <span className="absolute -left-[1px] -top-[1px] h-[3cqw] w-[3cqw] border-l-2 border-t-2 border-forest" />
          <span className="absolute -bottom-[1px] -right-[1px] h-[3cqw] w-[3cqw] border-b-2 border-r-2 border-forest" />
        </div>

        <div className="mt-[4cqw] flex items-end justify-between gap-[4cqw]">
          {project.note ? (
            <p className="t-hand max-w-[78%] -rotate-2 text-[max(14px,4.8cqw)] leading-[1.05] text-botanical" data-anim>
              {project.note}
            </p>
          ) : (
            <span />
          )}
          <span className="cq-meta shrink-0 text-ink/45">{pad(index * 2 + 4)}</span>
        </div>
      </div>
    </div>
  )
})

/** Right-hand page of a spread: the words. */
export const NotesPage = memo(function NotesPage({ project, index }: { project: Project; index: number }) {
  return (
    <div className="jpage is-right" data-spread={index} data-side="right">
      <div className="absolute inset-0 flex flex-col px-[8.5cqw] pb-[6cqw] pt-[7cqw]">
        <div className="cq-meta flex items-center justify-between text-ink/55" data-anim>
          <span>{project.category}</span>
          <span>No. {pad(index + 1)}</span>
        </div>

        <div className="mt-[5cqw] flex items-end gap-[3cqw]" data-anim>
          <span className="t-italic text-[11cqw] leading-[0.7] text-botanical">{pad(index + 1)}</span>
          <span className="mb-[1cqw] h-px flex-1 bg-ink/20" />
        </div>

        <h3 className="t-title mt-[4cqw] text-[10cqw] uppercase text-forest" data-anim>
          {project.title}
        </h3>
        {project.tagline && (
          <p className="t-italic mt-[2cqw] text-[max(13px,4.4cqw)] leading-snug text-botanical" data-anim>
            {project.tagline}
          </p>
        )}

        <p className="cq-body mt-[3.5cqw] text-ink/80" data-anim>
          {project.description}
        </p>

        <dl className="mt-auto flex flex-col gap-[3cqw] border-t border-ink/15 pt-[3.5cqw]" data-anim>
          <div>
            <dt className="cq-meta text-botanical">Role</dt>
            <dd className="t-serif mt-[0.6cqw] text-[max(12px,3.6cqw)] leading-snug">{project.role}</dd>
          </div>
          <div>
            <dt className="cq-meta text-botanical">{project.listLabel ?? 'Skills'}</dt>
            <dd className="mt-[1.4cqw] flex flex-wrap gap-[1.2cqw]">
              {project.technologies.map((t) => (
                <span key={t} className="cq-meta rounded-full border border-ink/25 px-[2cqw] py-[0.5cqw] !tracking-[0.1em] text-ink/75">
                  {t}
                </span>
              ))}
            </dd>
          </div>
        </dl>

        <div className="mt-[4cqw] flex items-center justify-between" data-anim>
          {project.link ? (
            <a
              href={project.link}
              target={project.link.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className="btn-pill cq-meta !h-auto !gap-[2cqw] !px-[4cqw] !py-[2.2cqw] text-forest [--hover-ink:var(--color-ivory)]"
            >
              {project.linkLabel ?? 'View more'} <ArrowUpRight size={12} strokeWidth={1.6} />
            </a>
          ) : (
            <span className="t-hand text-[max(13px,4cqw)] leading-none text-ink/45">rabbit hole no. {pad(index + 1)}</span>
          )}
          <span className="cq-meta text-ink/45">{pad(index * 2 + 5)}</span>
        </div>
      </div>
    </div>
  )
})

/** The green cloth cover with an embossed title. */
export function CoverFront({ count }: { count: number }) {
  return (
    <div className="cover-front absolute inset-0">
      <div className="absolute inset-[6cqw] border border-ivory/20">
        <div className="absolute inset-[1.6cqw] border border-ivory/10" />
      </div>
      <div className="relative flex h-full flex-col items-center justify-between px-[12cqw] py-[14cqw] text-center">
        <p className="cq-meta-cover emboss">A collection of rabbit holes</p>
        <div>
          <svg viewBox="0 0 60 60" className="mx-auto mb-[6cqw] h-[11cqw] w-[11cqw] text-ivory/60" aria-hidden>
            <path
              d="M30 30 L52 22 A24 24 0 1 1 46 12 Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path d="M30 30 L14 44 M30 30 L10 26 M30 30 L22 8 M30 30 L42 50" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
          </svg>
          <p className="t-display t-fit-c emboss text-[24cqw] leading-[0.82]">
            The
            <br />
            Journal
          </p>
          <p className="t-italic emboss mt-[5cqw] text-[6cqw] opacity-80">of things made & half-made</p>
        </div>
        <div className="flex w-full items-center justify-between">
          <span className="cq-meta-cover emboss">{site.name}</span>
          <span className="cq-meta-cover emboss">{pad(count)} entries</span>
          <span className="cq-meta-cover emboss">{site.edition}</span>
        </div>
      </div>
    </div>
  )
}

/** Inside of the cover — mostly hidden beneath the first page. */
export function CoverBack() {
  return <div className="cover-back absolute inset-0" />
}
