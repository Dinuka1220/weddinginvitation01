import React, { useState, useEffect, useRef } from 'react';
import { FloralTopRight, FloralBottomLeft, BranchDivider, FloralAccent } from './FloralSVG';
import Gallery from './Gallery';
import RSVPModal from './RSVPModal';
import WeddingTimeline from './WeddingTimeline';
import RSVPSection from './RSVPSection';
import confetti from 'canvas-confetti';
import flowervine from '../assets/flowervine.png'
import flowerright from '../assets/landing flower 2.png'
import flowerleft from '../assets/landing flower1.png'
import flowertop from '../assets/flowertop.png'

/* ─── tiny scroll-reveal hook ─────────────────────────────── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
      { threshold: 0.15 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

/* ─── countdown helper ─────────────────────────────────────── */
function useCountdown(target) {
  const [t, setT] = useState({});
  useEffect(() => {
    const tick = () => {
      const diff = new Date(target) - new Date();
      if (diff <= 0) { setT({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setT({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return t;
}

/* ─── main component ──────────────────────────────────────── */
export default function InvitationDetails() {
  useReveal();
  const t = useCountdown('2026-07-24T08:30:00');
  const [showGallery, setShowGallery] = useState(false);
  const [showRSVP, setShowRSVP] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  /* auto-play on first interaction */
  useEffect(() => {
    const tryPlay = () => {
      audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => { });
      window.removeEventListener('click', tryPlay);
    };
    window.addEventListener('click', tryPlay);
    return () => window.removeEventListener('click', tryPlay);
  }, []);

  const toggleAudio = (e) => {
    e.stopPropagation();
    if (isPlaying) { audioRef.current?.pause(); setIsPlaying(false); }
    else { audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => { }); }
  };

  /* Google Calendar link */
  const gcal = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Yashara & Anuruddha Wedding')}&dates=20260724T083000/20260724T180000&location=${encodeURIComponent("All Saints' Church, Galle, Sri Lanka")}`;

  return (
    <div className="w-full bg-[#FAF3F0] min-h-screen relative overflow-x-hidden">
      <audio ref={audioRef} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" loop />

      {/* ═══════════════════════════════════════════════
          SECTION 1 — HERO COUPLE PHOTO
      ═══════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden">
        {/* Floral corners over image */}
        <FloralTopRight className="absolute top-0 right-0 w-44 md:w-64 z-20 pointer-events-none" />
        <div className="absolute top-0 left-0 w-44 md:w-64 z-20 pointer-events-none"
          style={{ transform: 'scaleX(-1)' }}>
          <FloralTopRight className="w-full" />
        </div>

        {/* Couple image */}
        <div className="relative w-full" style={{ maxHeight: '100vh', minHeight: '70vh' }}>
          <img
            src="/couple_hug.png"
            alt="Yashara and Anuruddha"
            className="w-full h-full object-cover"
            style={{ maxHeight: '100vh', minHeight: '70vh', display: 'block' }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF3F0]/30 via-transparent to-[#FAF3F0]/90" />

          {/* Music play button on image */}
          <button
            onClick={toggleAudio}
            className="absolute top-1/2 right-6 md:right-10 -translate-y-1/2 z-30 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90"
            style={{ background: 'rgba(255,253,249,0.85)', border: '1.5px solid rgba(216,155,132,.5)' }}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-blush-dark"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-blush-dark"><path d="M8 5v14l11-7z" /></svg>
            )}
          </button>
        </div>

        {/* Bible verse */}
        <div className="absolute bottom-4 left-0 right-0 px-6 text-center z-10 reveal">
          <p className="font-serif text-xs md:text-sm italic text-brown-deep/80 leading-relaxed max-w-xs mx-auto">
            "So they are no longer two, but one flesh. Therefore what God has joined together, let no one separate."
          </p>
          <p className="font-sans text-[10px] text-blush-dark mt-1 tracking-wider">— Matthew 19:6</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 2 — NAMES + BLESSINGS
      ═══════════════════════════════════════════════ */}
      <section className="py-14 px-6 text-center relative overflow-hidden bg-[#FFFDF9]">
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <FloralAccent className="w-64 h-64 absolute top-0 left-1/2 -translate-x-1/2" />
        </div>

        {/* Big cursive names */}
        <div className="reveal">
          <h1
            className="leading-tight"
            style={{ fontFamily: "'Alex Brush', cursive", fontSize: 'clamp(3rem, 12vw, 6rem)', color: '#A46752' }}
          >
            Yashara &amp;
          </h1>
          <h1
            className="leading-none mt-[-0.25em]"
            style={{ fontFamily: "'Alex Brush', cursive", fontSize: 'clamp(3rem, 12vw, 6rem)', color: '#A46752' }}
          >
            Anuruddha
          </h1>
        </div>

        <img
          src={flowervine}
          alt="Flower Vine"
          className="w-56 md:w-72 mx-auto my-6 reveal"
        />

        {/* Blessing line */}
        <p className="font-serif text-sm md:text-base text-brown-deep/70 italic mb-6 reveal">
          With the blessings of God and their families
        </p>

        {/* Parents */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 max-w-sm mx-auto text-center reveal">
          <div>
            <p className="font-sans text-xs text-blush-dark font-semibold">Sunil Perera</p>
            <p className="font-sans text-xs text-brown-deep/60">&amp; Rani Perera</p>
          </div>
          <div>
            <p className="font-sans text-xs text-blush-dark font-semibold">Nihal Silva</p>
            <p className="font-sans text-xs text-brown-deep/60">&amp; Priyanthi Silva</p>
          </div>
        </div>

        <p className="font-serif text-sm md:text-base text-brown-deep/70 italic mt-8 mb-2 reveal">
          Joyfully invite you to their wedding celebration
        </p>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 3 — DATE & VENUE
      ═══════════════════════════════════════════════ */}
      <section className="py-10 px-6 text-center bg-[#FAF3F0] relative">
        {/* Watercolour floral corners */}
        <img
          src={flowerleft}
          alt="Floral Decoration"
          className="absolute top-0 right-0 w-52 md:w-72 pointer-events-none opacity-90"
        />

        <img
          src={flowerright}
          alt="Floral Decoration"
          className="absolute bottom-0 left-0 w-52 md:w-72 pointer-events-none opacity-90"
        />
        {/* Big date */}
        <div className="reveal">
          <p
            className="font-serif font-bold leading-none"
            style={{ fontSize: 'clamp(3.5rem, 18vw, 8rem)', color: '#A46752', letterSpacing: '0.04em' }}
          >
            24 <span style={{ color: '#D89B84' }}>|</span> 07 <span style={{ color: '#D89B84' }}>|</span> 26
          </p>
          <p
            className="font-cursive mt-1"
            style={{ fontFamily: "'Alex Brush', cursive", fontSize: 'clamp(1.4rem, 5vw, 2.2rem)', color: '#A46752' }}
          >
            at eight thirty in the morning
          </p>
        </div>

        <img
          src={flowervine}
          alt="Flower Vine"
          className="w-56 md:w-72 mx-auto my-6 reveal"
        />

        {/* Venue */}
        <div className="reveal space-y-1">
          <p className="font-serif text-lg md:text-xl font-semibold text-brown-deep">
            All Saints' Church
          </p>
          <p className="font-sans text-xs text-brown-deep/60 max-w-[240px] mx-auto">
            Church Street, Galle Fort, Galle, Sri Lanka
          </p>
        </div>

        <BranchDivider className="w-36 mx-auto my-5 reveal" />

        <div className="reveal space-y-1">
          <p className="font-serif text-sm md:text-base italic text-brown-deep/80">
            Following the ceremony, the couple will welcome guests at
          </p>
          <p className="font-serif text-base md:text-lg font-semibold text-blush-dark">
            Lejour Festas Event Space
          </p>
          <p className="font-sans text-xs text-brown-deep/60">Lighthouse Street, Galle Fort, Sri Lanka</p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 4 — COUNTDOWN
      ═══════════════════════════════════════════════ */}
      <section className="py-12 px-6" style={{ background: 'linear-gradient(135deg, #F5E8E4, #FAF3F0)' }}>
        <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-blush text-center mb-6 reveal">
          The Celebration Begins In
        </p>
        <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto reveal">
          {[['d', 'Days'], ['h', 'Hrs'], ['m', 'Min'], ['s', 'Sec']].map(([k, label]) => (
            <div key={k} className="flex flex-col items-center bg-[#FFFDF9] rounded-lg py-4 shadow-sm border border-blush/20">
              <span className="font-serif text-2xl md:text-3xl font-bold text-blush-dark leading-none">{t[k] ?? '0'}</span>
              <span className="font-sans text-[9px] uppercase tracking-widest text-brown-deep/50 mt-1">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 5 — WEDDING DAY TIMELINE  ← NEW
      ═══════════════════════════════════════════════ */}
      <WeddingTimeline />

      {/* ═══════════════════════════════════════════════
          SECTION 6 — COUPLE WALKING PHOTO
      ═══════════════════════════════════════════════ */}
      <section className="relative w-full overflow-hidden">
        <img
          src="/couple_walk.png"
          alt="Couple walking in garden"
          className="w-full object-cover reveal"
          style={{ maxHeight: '80vh', minHeight: '55vh', display: 'block' }}
        />
        {/* Floral overlays on photo */}
        <FloralBottomLeft className="absolute bottom-0 left-0 w-44 md:w-60 pointer-events-none z-10" />
        <div className="absolute bottom-0 right-0 w-44 md:w-60 pointer-events-none z-10" style={{ transform: 'scaleX(-1)' }}>
          <FloralBottomLeft className="w-full" />
        </div>
        {/* Fade to cream at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#FAF3F0] to-transparent z-10" />
        {/* Overlay text */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="bg-white/70 backdrop-blur-sm rounded-full px-5 py-2.5 text-center shadow">
            <p className="font-cursive text-xl text-blush-dark" style={{ fontFamily: "'Alex Brush', cursive" }}>
              Tap the icons below
            </p>
            <p className="font-sans text-[9px] uppercase tracking-widest text-brown-deep/60">to interact</p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 7 — INTERACTIVE ACTION BUTTONS
      ═══════════════════════════════════════════════ */}
      <section
        className="relative py-14 px-6"
        style={{ background: 'linear-gradient(to bottom, #EDD5C8, #D4A090)' }}
      >
        {/* Floral top bouquet */}
        <div className="flex justify-center mb-8 reveal">
          <img
  src={flowertop}
  alt="Floral Accent"
  className=" h-36 md:w- md:h-44 drop-shadow-md animate-float"
/>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-3.5 max-w-xs mx-auto reveal">
          {/* Ceremony Location */}
          <a
            href="https://maps.google.com/?q=All+Saints+Church+Galle+Sri+Lanka"
            target="_blank" rel="noreferrer"
            className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-xl px-5 py-3.5 shadow-md border border-white/60 hover:bg-white transition-all active:scale-95"
          >
            <span className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#EDD5C8' }}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-blush-dark"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
            </span>
            <span className="font-sans text-sm font-semibold text-brown-deep tracking-wide">Ceremony Location</span>
          </a>

          {/* Reception Location */}
          <a
            href="https://maps.google.com/?q=Lighthouse+Street+Galle+Sri+Lanka"
            target="_blank" rel="noreferrer"
            className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-xl px-5 py-3.5 shadow-md border border-white/60 hover:bg-white transition-all active:scale-95"
          >
            <span className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#EDD5C8' }}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-blush-dark"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
            </span>
            <span className="font-sans text-sm font-semibold text-brown-deep tracking-wide">Reception Location</span>
          </a>

          {/* RSVP — scrolls to inline section */}
          <button
            onClick={() => document.getElementById('rsvp')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-xl px-5 py-3.5 shadow-md border border-white/60 hover:bg-white transition-all active:scale-95 w-full text-left"
          >
            <span className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#EDD5C8' }}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-blush-dark"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            </span>
            <span className="font-sans text-sm font-semibold text-brown-deep tracking-wide">Confirm Attendance (RSVP)</span>
          </button>

          {/* Gallery */}
          <button
            onClick={() => setShowGallery(true)}
            className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-xl px-5 py-3.5 shadow-md border border-white/60 hover:bg-white transition-all active:scale-95 w-full text-left"
          >
            <span className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#EDD5C8' }}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-blush-dark"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" /></svg>
            </span>
            <span className="font-sans text-sm font-semibold text-brown-deep tracking-wide">Photo Gallery</span>
          </button>

          {/* Add to Calendar */}
          <a
            href={gcal}
            target="_blank" rel="noreferrer"
            className="flex items-center space-x-4 bg-white/80 backdrop-blur-sm rounded-xl px-5 py-3.5 shadow-md border border-white/60 hover:bg-white transition-all active:scale-95"
          >
            <span className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#EDD5C8' }}>
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-blush-dark"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" /></svg>
            </span>
            <span className="font-sans text-sm font-semibold text-brown-deep tracking-wide">Add to Calendar</span>
          </a>
        </div>

        {/* Bottom message */}
        <div className="flex justify-center mt-10 reveal">
          <p className="font-cursive text-4xl md:text-5xl text-[#FFFDF9]/90" style={{ fontFamily: "'Alex Brush', cursive" }}>
            We look forward to seeing you!
          </p>
        </div>

        <FloralBottomLeft className="absolute bottom-0 left-0 w-44 md:w-60 pointer-events-none opacity-40" />
        <div className="absolute bottom-0 right-0 w-44 md:w-60 pointer-events-none opacity-40" style={{ transform: 'scaleX(-1)' }}>
          <FloralBottomLeft className="w-full" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          SECTION 8 — RSVP INLINE  ← NEW
      ═══════════════════════════════════════════════ */}
      <RSVPSection />

      {/* ═══════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════ */}
      <footer className="py-12 px-6 text-center bg-[#3E2723] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none flex items-center justify-center">
          <span style={{ fontFamily: "'Alex Brush', cursive", fontSize: '20rem', color: '#D89B84' }}>&amp;</span>
        </div>
        <h2 className="font-serif text-2xl text-[#EDD5C8] font-medium tracking-wide relative z-10">
          Yashara &amp; Anuruddha
        </h2>
        <p className="font-serif text-sm text-blush mt-1 relative z-10 tracking-widest">24 · 07 · 2026</p>
        <div className="w-16 h-[1px] mx-auto my-4 bg-blush/30 relative z-10" />
        <p className="font-sans text-[10px] text-[#EDD5C8]/50 uppercase tracking-widest relative z-10">
          With love &amp; gratitude
        </p>
        <p className="font-sans text-[9px] text-[#EDD5C8]/25 tracking-wider mt-3 relative z-10">
          All Saints' Church · Galle Fort · Sri Lanka
        </p>
      </footer>

      {/* ═══════════════════════════════════════════════
          MODALS
      ═══════════════════════════════════════════════ */}
      {showGallery && <Gallery onClose={() => setShowGallery(false)} />}
      {showRSVP && <RSVPModal onClose={() => setShowRSVP(false)} />}
    </div>
  );
}
