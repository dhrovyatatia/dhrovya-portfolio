/** Running header at the top of every journal page. */
export function PageFolio({
  left,
  center,
  right,
  tone = 'ink',
}: {
  left: string
  center?: string
  right?: string
  tone?: 'ink' | 'ivory'
}) {
  const line = tone === 'ink' ? 'bg-ink/15' : 'bg-ivory/15'
  const text = tone === 'ink' ? 'text-ink/60' : 'text-sage'
  return (
    <div className={`flex items-center gap-4 ${text}`}>
      <span className="t-meta-sm whitespace-nowrap">{left}</span>
      <span className={`h-px flex-1 ${line}`} />
      {center && (
        <>
          <span className="t-italic hidden whitespace-nowrap text-[15px] normal-case tracking-normal sm:inline">{center}</span>
          <span className={`hidden h-px flex-1 sm:block ${line}`} />
        </>
      )}
      {right && <span className="t-meta-sm whitespace-nowrap">{right}</span>}
    </div>
  )
}
