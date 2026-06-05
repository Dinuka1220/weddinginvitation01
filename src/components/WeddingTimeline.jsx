import React, { useEffect } from 'react';
import { FloralTopRight, FloralBottomLeft, BranchDivider } from './FloralSVG';

const EVENTS = [
  {
    time: '8:30 AM',
    title: 'Expected Arrival of Guests',
    desc: 'Find your designated place to witness our union.',
    side: 'left',
    action: null,
  },
  {
    time: '8:45 AM',
    title: "Groom's Arrival",
    desc: 'The groom will arrive at the church.',
    side: 'right',
    action: null,
  },
  {
    time: '8:55 AM',
    title: "Bride's Arrival",
    desc: 'The bride will arrive at the church.',
    side: 'left',
    action: null,
  },
  {
    time: '9:00 AM',
    title: 'Wedding Service',
    desc: 'Join us in prayer and song.',
    side: 'right',
    action: { label: 'View Program', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14l4-4h12c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z' },
  },
  {
    time: '10:10 AM',
    title: 'Wedding Registration',
    desc: 'Two hearts, two traditions, one lifelong journey.',
    side: 'left',
    action: null,
  },
  {
    time: '10:20 AM',
    title: 'Wedding March',
    desc: 'The ceremony ends with smiles, blessings, and the joyful beginning of married life.',
    side: 'right',
    action: null,
  },
  {
    time: '10:30 AM',
    title: 'Blessings for the Couple',
    desc: 'Give your wishes to the couple and take a photo.',
    side: 'left',
    action: null,
  },
];

/* Gold dot for the spine */
function GoldDot() {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 z-10 flex-shrink-0">
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #E8D5A0, #C5A447, #8C6D1F)',
          boxShadow: '0 2px 8px rgba(197,164,71,.45)',
        }}
      />
    </div>
  );
}

export default function WeddingTimeline() {
  /* re-run reveal on mount */
  useEffect(() => {
    const els = document.querySelectorAll('.tl-reveal');
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('tl-visible'); }),
      { threshold: 0.2 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section
      className="relative py-20 px-4 overflow-hidden"
      style={{ background: '#FAF3F0' }}
    >
      {/* ── Corner florals ── */}
      <FloralTopRight className="absolute top-0 right-0 w-40 md:w-56 pointer-events-none opacity-50" />
      <FloralBottomLeft className="absolute bottom-0 left-0 w-40 md:w-56 pointer-events-none opacity-50" />

      {/* ── Section header ── */}
      <div className="text-center mb-14 tl-reveal">
        <p
          className="font-sans text-[10px] uppercase tracking-[0.28em] mb-3"
          style={{ color: '#C5A447' }}
        >
          Our Celebration
        </p>
        <h2
          className="font-serif font-semibold"
          style={{ fontSize: 'clamp(2rem, 7vw, 3rem)', color: '#3E2723' }}
        >
          Timeline
        </h2>
        <BranchDivider className="w-48 mx-auto mt-5" />
      </div>

      {/* ── Timeline body ── */}
      <div className="relative max-w-2xl mx-auto">
        {/* Vertical spine line */}
        <div
          className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px"
          style={{ background: 'linear-gradient(to bottom, transparent, #D89B84 8%, #D89B84 92%, transparent)' }}
        />

        {EVENTS.map((ev, i) => (
          <div
            key={i}
            className="relative flex items-start mb-12 tl-reveal"
            style={{ '--tl-delay': `${i * 0.12}s` }}
          >
            {/* Gold dot on spine */}
            <GoldDot />

            {/* Left content */}
            <div
              className={`w-[calc(50%-28px)] pr-6 text-right ${ev.side === 'left' ? 'opacity-100' : 'opacity-0 pointer-events-none select-none'}`}
            >
              {ev.side === 'left' && (
                <>
                  <p
                    className="font-sans text-xs font-semibold mb-1"
                    style={{ color: '#C5A447' }}
                  >
                    {ev.time}
                  </p>
                  <p className="font-serif font-semibold text-sm md:text-base text-[#3E2723] leading-snug">
                    {ev.title}
                  </p>
                  <p className="font-sans text-xs text-[#3E2723]/55 mt-1 leading-relaxed">
                    {ev.desc}
                  </p>
                  {ev.action && (
                    <button
                      className="mt-2 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest border rounded-full px-3 py-1.5 transition-all hover:bg-[#FAF3F0]"
                      style={{ borderColor: '#C5A447', color: '#8C6D1F' }}
                    >
                      <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                        <path d={ev.action.icon} />
                      </svg>
                      {ev.action.label}
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Spacer (dot width) */}
            <div className="w-14 flex-shrink-0" />

            {/* Right content */}
            <div
              className={`w-[calc(50%-28px)] pl-6 text-left ${ev.side === 'right' ? 'opacity-100' : 'opacity-0 pointer-events-none select-none'}`}
            >
              {ev.side === 'right' && (
                <>
                  <p
                    className="font-sans text-xs font-semibold mb-1"
                    style={{ color: '#C5A447' }}
                  >
                    {ev.time}
                  </p>
                  <p className="font-serif font-semibold text-sm md:text-base text-[#3E2723] leading-snug">
                    {ev.title}
                  </p>
                  <p className="font-sans text-xs text-[#3E2723]/55 mt-1 leading-relaxed">
                    {ev.desc}
                  </p>
                  {ev.action && (
                    <button
                      className="mt-2 inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest border rounded-full px-3 py-1.5 transition-all hover:bg-[#FAF3F0]"
                      style={{ borderColor: '#C5A447', color: '#8C6D1F' }}
                    >
                      <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
                        <path d={ev.action.icon} />
                      </svg>
                      {ev.action.label}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .tl-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity .7s ease calc(var(--tl-delay, 0s)), transform .7s ease calc(var(--tl-delay, 0s));
        }
        .tl-reveal.tl-visible {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
}
