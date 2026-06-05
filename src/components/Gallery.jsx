import React, { useState } from 'react';
import { FloralTopRight } from './FloralSVG';

const photos = [
  { src: '/couple_hug.png',   caption: 'A Love Story Begins' },
  { src: '/couple_walk.png',  caption: 'Walking Into Forever' },
  { src: '/gallery_1.png',    caption: 'Rings of Promise' },
  { src: '/couple.png',       caption: 'Our Special Day' },
  { src: '/groom.png',        caption: 'The Groom' },
  { src: '/bride.png',        caption: 'The Bride' },
];

export default function Gallery({ onClose }) {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto"
      style={{ background: '#FAF3F0' }}
    >
      {/* Header */}
      <div className="relative flex items-center justify-between px-5 py-4 border-b border-blush/20 bg-[#FFFDF9] flex-shrink-0">
        <FloralTopRight className="absolute top-0 right-0 w-32 pointer-events-none opacity-70" />
        <div>
          <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-blush">Our Memories</p>
          <h2
            className="font-cursive text-3xl text-blush-dark"
            style={{ fontFamily: "'Alex Brush', cursive" }}
          >
            Galeria de Fotos
          </h2>
        </div>
        <button
          onClick={onClose}
          className="relative z-10 w-9 h-9 rounded-full flex items-center justify-center bg-blush/15 hover:bg-blush/30 transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#A46752" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      {/* Grid */}
      <div className="flex-1 p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
          {photos.map((p, i) => (
            <div
              key={i}
              onClick={() => setLightbox(p)}
              className="relative rounded-xl overflow-hidden cursor-pointer group shadow-md border border-blush/20"
              style={{
                aspectRatio: '3/4',
                animationDelay: `${i * 0.08}s`,
                animation: 'fadeInUp 0.6s ease-out forwards',
                opacity: 0,
              }}
            >
              <img
                src={p.src}
                alt={p.caption}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                <p className="font-serif text-xs text-white/90 italic">{p.caption}</p>
              </div>
              {/* Floral corner badge */}
              <div className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg viewBox="0 0 24 24" className="w-6 h-6 drop-shadow" fill="none">
                  <circle cx="12" cy="12" r="10" fill="rgba(255,253,249,.8)"/>
                  <path d="M12 5c-1 2-3 3-4 5 1 2 3 3 4 5 1-2 3-3 4-5-1-2-3-3-4-5z" fill="#D89B84"/>
                </svg>
              </div>
            </div>
          ))}
        </div>

        {/* Closing flourish */}
        <div className="text-center mt-10 mb-4">
          <p
            className="font-cursive text-3xl text-blush-dark"
            style={{ fontFamily: "'Alex Brush', cursive" }}
          >
            Yashara &amp; Anuruddha
          </p>
          <p className="font-sans text-[9px] uppercase tracking-[0.25em] text-blush mt-1">24 · 07 · 2026</p>
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-lg w-full rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            <img src={lightbox.src} alt={lightbox.caption} className="w-full object-contain max-h-[80vh]" />
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#3E2723]/80 p-4 text-center">
              <p className="font-serif text-sm italic text-white/90">{lightbox.caption}</p>
            </div>
            <button
              onClick={() => setLightbox(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="white" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
