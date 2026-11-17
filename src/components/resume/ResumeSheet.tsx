import { resume } from '../../data/resume'

/**
 * The resume as a printable sheet. Sizes are in sheet units (1/794 of the
 * sheet width — an A4 page at 96dpi), so the same markup reads on screen
 * and prints to an exact A4 PDF.
 */
export function ResumeSheet({ className = '' }: { className?: string }) {
  return (
    <article className={`rs-sheet ${className}`} aria-label={`Resume of ${resume.name}`}>
      <div className="rs-inner">
        <header className="rs-head">
          <h3 className="rs-name">{resume.name}</h3>
          <p className="rs-tagline">
            {resume.tagline.map((t, i) => (
              <span key={t}>
                {i > 0 && <span className="rs-dot"> · </span>}
                {t}
              </span>
            ))}
          </p>
          <p className="rs-contact">
            {resume.contact.map((c, i) => (
              <span key={c.label} className="rs-contact-item">
                {i > 0 && <span className="rs-bar" aria-hidden> | </span>}
                {c.href ? (
                  <a href={c.href} target={c.href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className={c.href.startsWith('http') ? 'rs-link' : undefined}>
                    {c.label}
                  </a>
                ) : (
                  c.label
                )}
              </span>
            ))}
          </p>
        </header>

        <section className="rs-section">
          <h4 className="rs-h">Profile</h4>
          <p className="rs-profile">{resume.profile}</p>
        </section>

        {resume.sections.map((s) => (
          <section key={s.heading} className="rs-section">
            <h4 className="rs-h">{s.heading}</h4>
            {s.items.map((it) => (
              <div key={it.title} className="rs-item">
                <p className="rs-row">
                  <span className="rs-title">
                    {it.title}
                    {it.note && (
                      <>
                        <span className="rs-bar" aria-hidden>
                          {' '}
                          |{' '}
                        </span>
                        <em className="rs-note">{it.note}</em>
                      </>
                    )}
                  </span>
                  {it.date && <span className="rs-date">{it.date}</span>}
                </p>
                {it.bullets && (
                  <ul className="rs-bullets">
                    {it.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        ))}

        <section className="rs-section">
          <h4 className="rs-h">Skills &amp; Tools</h4>
          <ul className="rs-bullets rs-skills">
            {resume.skills.map((s) => (
              <li key={s.label}>
                <strong>{s.label}:</strong> {s.value}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  )
}
