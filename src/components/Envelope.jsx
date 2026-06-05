import React, { useState, useEffect } from 'react';
import { FloralTopRight, FloralBottomLeft, EnvelopeFloral } from './FloralSVG';

export default function Envelope({ onOpen }) {
  const [phase, setPhase] = useState('closed'); // closed → flapOpening → cardRising → done
  const [visible, setVisible] = useState(false);

  useEffect(() => { setTimeout(() => setVisible(true), 150); }, []);

  const handleTap = () => {
    if (phase !== 'closed') return;
    setPhase('flapOpening');
    setTimeout(() => setPhase('cardRising'), 1200);
    setTimeout(() => onOpen(), 3500);
  };

  const isFlapOpen = phase === 'flapOpening' || phase === 'cardRising' || phase === 'done';
  const isCardUp   = phase === 'cardRising' || phase === 'done';

  return (
    <div
      className="fixed inset-0 w-screen h-screen flex flex-col items-center justify-center overflow-hidden z-40 cursor-pointer"
      style={{ background: '#FAF3F0' }}
      onClick={handleTap}
    >
      {/* ── watercolour floral corners ── */}
      <FloralTopRight className="absolute top-0 right-0 w-48 md:w-72 pointer-events-none opacity-95 z-30" />
      <FloralBottomLeft className="absolute bottom-0 left-0 w-48 md:w-72 pointer-events-none opacity-95 z-30" />

      {/* ── top cursive label ── */}
      <p
        className="relative z-20 font-cursive text-2xl md:text-3xl text-blush-dark mb-4 md:mb-6 tracking-wide"
        style={{
          fontFamily: "'Alex Brush', cursive",
          opacity: phase !== 'closed' ? 0 : visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-20px)',
          transition: 'opacity 0.5s ease, transform 1s ease',
          pointerEvents: phase !== 'closed' ? 'none' : 'auto',
        }}
      >
        Nosso casamento
      </p>

      {/* ══════════ ENVELOPE CONTAINER ══════════
          This is the key: overflow:hidden clips the card
          when it's sitting inside. The card rises OUT of
          this container when phase = cardRising.
      ══════════════════════════════════════════ */}
      <div
        className="relative z-10"
        style={{
          width: 'min(88vw, 440px)',
          height: 'min(60vw, 300px)',
          perspective: '1600px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'scale(1)' : 'scale(0.9)',
          transition: 'opacity 1s ease 0.2s, transform 1s ease 0.2s',
        }}
      >

        {/* ── Z-LAYER 1: Envelope back body ── */}
        <div
          className="absolute inset-0 rounded-sm"
          style={{
            background: '#C9967E',
            boxShadow: '0 20px 60px rgba(164,103,82,.35), 0 4px 16px rgba(0,0,0,.12)',
            zIndex: 1,
          }}
        >
          {/* Subtle floral emboss on the body */}
          <EnvelopeFloral className="absolute inset-0 w-full h-full pointer-events-none" />
        </div>

        {/* ── Z-LAYER 2: WHITE CARD (starts hidden inside, slides up) ──
            When closed: translated down so it sits inside the envelope body,
            fully covered by all flaps above it.
            When open: slides up above the envelope, becoming visible. */}
        <div
          className="absolute left-[6%] right-[6%]"
          style={{
            height: '88%',
            zIndex: 2,
            bottom: '6%',
            transition: 'transform 1.6s cubic-bezier(0.16,1,0.3,1)',
            transform: isCardUp ? 'translateY(-65%)' : 'translateY(0%)',
          }}
        >
          <div
            className="w-full h-full rounded-sm flex flex-col items-center justify-center p-5"
            style={{
              background: '#FFFDF9',
              boxShadow: isCardUp ? '0 8px 40px rgba(0,0,0,.2)' : 'none',
              border: '1.5px solid rgba(216,155,132,.2)',
            }}
          >
            {/* Inner decorative border */}
            <div className="w-full h-full border border-blush/15 rounded-sm flex flex-col items-center justify-center p-3">
              <p className="font-sans text-[8px] uppercase tracking-[0.22em] text-blush/70 mb-1">Save the Date</p>
              <h2 className="font-serif text-lg md:text-2xl text-blush-dark font-semibold tracking-wide">Anuruddha</h2>
              <span className="font-cursive text-2xl md:text-3xl text-blush my-0.5" style={{ fontFamily: "'Alex Brush', cursive" }}>&amp;</span>
              <h2 className="font-serif text-lg md:text-2xl text-blush-dark font-semibold tracking-wide">Yashara</h2>
              <div className="w-10 h-[1px] bg-blush/30 my-2" />
              <p className="font-serif text-xs italic text-blush/70">24 · 07 · 2026</p>
            </div>
          </div>
        </div>

        {/* ── Z-LAYER 5: LEFT flap (covers the card) ── */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: 'polygon(0 0, 0 100%, 50% 50%)',
            background: 'linear-gradient(135deg, #D4A48E 0%, #C49078 100%)',
            zIndex: 5,
          }}
        />

        {/* ── Z-LAYER 5: RIGHT flap (covers the card) ── */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: 'polygon(100% 0, 100% 100%, 50% 50%)',
            background: 'linear-gradient(225deg, #D4A48E 0%, #C49078 100%)',
            zIndex: 5,
          }}
        />

        {/* ── Z-LAYER 6: BOTTOM flap (covers lower portion) ── */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: 'polygon(0 100%, 100% 100%, 50% 50%)',
            background: 'linear-gradient(to top, #BA7E68 0%, #C9967E 100%)',
            zIndex: 6,
          }}
        />

        {/* ── Z-LAYER 8: TOP FLAP (rotates open from bottom edge) ──
            transformOrigin: bottom center — the flap hinges from 
            the center intersection point, opening upward. */}
        <div
          className="absolute inset-x-0 top-0"
          style={{
            height: '50%',
            transformOrigin: 'bottom center',
            transformStyle: 'preserve-3d',
            transition: 'transform 1.1s cubic-bezier(0.16,1,0.3,1)',
            transform: isFlapOpen ? 'rotateX(-180deg)' : 'rotateX(0deg)',
            zIndex: isFlapOpen ? 3 : 8,
          }}
        >
          {/* front face (visible when closed) */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              background: 'linear-gradient(to bottom, #BA7E68 0%, #C9967E 100%)',
              backfaceVisibility: 'hidden',
            }}
          />
          {/* back face (visible when open — darker lining) */}
          <div
            className="absolute inset-0"
            style={{
              clipPath: 'polygon(50% 0, 0 100%, 100% 100%)',
              background: 'linear-gradient(to bottom, #9E6655 0%, #8B5544 100%)',
              backfaceVisibility: 'hidden',
              transform: 'rotateX(180deg)',
            }}
          />
        </div>

        {/* ── Z-LAYER 10: WAX SEAL ──
            Positioned exactly at the center intersection of all flaps. */}
        <div
          className="absolute z-10"
          style={{
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            transition: 'opacity 0.6s ease, transform 0.6s ease',
            opacity: isFlapOpen ? 0 : 1,
            pointerEvents: isFlapOpen ? 'none' : 'auto',
          }}
        >
          <div
            className="flex items-center justify-center"
            style={{
              width: 'clamp(52px, 14vw, 72px)',
              height: 'clamp(52px, 14vw, 72px)',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 38% 35%, #E8C4A0, #B88050, #8B5E35)',
              boxShadow: '0 6px 22px rgba(0,0,0,.3), inset 0 3px 6px rgba(255,255,255,.3), inset 0 -3px 6px rgba(0,0,0,.35)',
              animation: phase === 'closed' ? 'bounceSlow 2.5s ease-in-out infinite' : 'none',
            }}
          >
            {/* Inner seal detail */}
            <svg viewBox="0 0 60 60" style={{ width: '65%', height: '65%' }}>
              <circle cx="30" cy="30" r="20" fill="none" stroke="rgba(255,253,249,.3)" strokeWidth="1.5"/>
              <circle cx="30" cy="30" r="14" fill="none" stroke="rgba(255,253,249,.15)" strokeWidth="0.8"/>
              <text x="30" y="28" textAnchor="middle" fontFamily="'Playfair Display', serif" fontSize="10" fill="#FFFDF9" fontWeight="700">A</text>
              <text x="30" y="40" textAnchor="middle" fontFamily="'Playfair Display', serif" fontSize="10" fill="#FFFDF9" fontWeight="700">Y</text>
              {/* Decorative leaves around ring */}
              {[0,45,90,135,180,225,270,315].map((deg, i) => {
                const rad = (deg * Math.PI) / 180;
                const cx = 30 + 22 * Math.cos(rad);
                const cy = 30 + 22 * Math.sin(rad);
                return (
                  <ellipse
                    key={i} cx={cx} cy={cy} rx="2.8" ry="1.3"
                    fill="rgba(255,253,249,.25)"
                    transform={`rotate(${deg} ${cx} ${cy})`}
                  />
                );
              })}
            </svg>
          </div>
        </div>

      </div>
      {/* ══════════ END ENVELOPE ══════════ */}

      {/* ── bottom cursive names ── */}
      <p
        className="relative z-20 font-cursive text-3xl md:text-4xl text-blush-dark mt-5 md:mt-7 tracking-wide"
        style={{
          fontFamily: "'Alex Brush', cursive",
          opacity: visible ? 1 : 0,
          transition: 'opacity 1.2s ease 0.5s',
        }}
      >
        Yashara &amp; Anuruddha
      </p>

      {/* tap hint */}
      <p
        className={`absolute bottom-7 left-0 right-0 text-center font-sans text-[10px] uppercase tracking-[0.28em] text-brown-deep/50 transition-opacity duration-500 z-20 ${phase !== 'closed' ? 'opacity-0' : 'opacity-100'}`}
      >
        Tap to <span className="text-blush font-semibold">Open</span> Your Invitation
      </p>
    </div>
  );
}
