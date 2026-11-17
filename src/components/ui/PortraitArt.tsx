import { LilyPad } from '../organic/LilyPad'

/**
 * Placeholder "photograph" until a real portrait is added:
 * a small overhead view of the pond, framed like a print.
 */
export function PortraitArt() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(80% 60% at 30% 25%, #2b6249 0%, transparent 60%), radial-gradient(70% 60% at 80% 80%, #174e3d 0%, transparent 70%), linear-gradient(160deg, #103f32, #071d17)',
        }}
      />
      <LilyPad size={200} tone="fresh" seed={41} notch={-20} flower className="absolute left-[-14%] top-[8%] h-[72%] w-[72%]" />
      <LilyPad size={200} tone="deep" seed={42} notch={120} className="absolute bottom-[-10%] right-[-12%] h-[58%] w-[58%]" />
      <LilyPad size={200} tone="young" seed={43} notch={200} droplet className="absolute bottom-[26%] left-[22%] h-[22%] w-[22%]" />
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{ background: 'linear-gradient(180deg, rgba(243,240,227,0.25), transparent 40%, rgba(0,0,0,0.35))' }}
      />
      <span className="t-meta-sm absolute bottom-3 left-3 text-ivory/70">Your portrait here</span>
    </div>
  )
}
