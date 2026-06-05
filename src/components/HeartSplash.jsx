import React, { useEffect, useState } from 'react';
import { FloralTopRight, FloralBottomLeft } from './FloralSVG';

export default function HeartSplash({ onComplete }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  return (
    <div
      onClick={onComplete}
      className="fixed inset-0 bg-[#FAF3F0] flex flex-col justify-center items-center cursor-pointer overflow-hidden z-50"
    >
      {/* Watercolour floral corners */}
      <FloralTopRight className="absolute top-0 right-0 w-52 md:w-72 pointer-events-none opacity-90" />
      <FloralBottomLeft className="absolute bottom-0 left-0 w-52 md:w-72 pointer-events-none opacity-90" />

      {/* Watermark background roses */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
        <span className="font-cursive text-[20rem] text-blush leading-none select-none">&</span>
      </div>

      {/* Main content */}
      <div
        className="relative flex flex-col items-center text-center px-6 z-10"
        style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)', transition: 'opacity 1.2s ease, transform 1.2s ease' }}
      >
        {/* Top cursive line */}
        <p className="font-cursive text-2xl md:text-3xl text-blush-dark mb-4 tracking-wide" style={{ fontFamily: "'Alex Brush', cursive" }}>
          Nosso casamento
        </p>

        {/* Heart SVG with names inside */}
        <div className="relative flex items-center justify-center my-2">
          <svg viewBox="0 0 200 180" className="w-64 h-56 md:w-80 md:h-72 drop-shadow-lg animate-float">
            {/* Heart fill */}
            <path
              d="M100 160 C60 130, 10 100, 10 55 C10 25, 35 10, 60 10 C78 10, 92 20, 100 32 C108 20, 122 10, 140 10 C165 10, 190 25, 190 55 C190 100, 140 130, 100 160Z"
              fill="#F5E8E4"
              stroke="#D89B84"
              strokeWidth="2.5"
            />
            {/* Inner heart ring */}
            <path
              d="M100 145 C68 118, 28 92, 28 55 C28 33, 48 26, 62 26 C78 26, 91 35, 100 48 C109 35, 122 26, 138 26 C152 26, 172 33, 172 55 C172 92, 132 118, 100 145Z"
              fill="none"
              stroke="#D89B84"
              strokeWidth="1"
              opacity="0.4"
            />
            {/* Names */}
            <text x="100" y="80" textAnchor="middle" fontFamily="'Playfair Display', serif" fontSize="16" fill="#A46752" fontWeight="500">Anuruddha</text>
            <text x="100" y="103" textAnchor="middle" fontFamily="'Alex Brush', cursive" fontSize="20" fill="#D89B84">&amp;</text>
            <text x="100" y="126" textAnchor="middle" fontFamily="'Playfair Display', serif" fontSize="16" fill="#A46752" fontWeight="500">Yashara</text>
          </svg>
        </div>

        {/* Bottom names in cursive */}
        <p
          className="font-cursive text-4xl md:text-5xl text-blush-dark mt-3 tracking-wide leading-snug"
          style={{ fontFamily: "'Alex Brush', cursive", animationDelay: '0.4s', opacity: visible ? 1 : 0, transition: 'opacity 1.5s ease 0.4s' }}
        >
          Yashara &amp; Anuruddha
        </p>

        {/* Tap indicator */}
        <div className="mt-10 flex flex-col items-center space-y-2 animate-bounce-slow">
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-blush to-transparent"></div>
          <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-blush/70">Tap to Open</p>
          <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-blush to-transparent"></div>
        </div>
      </div>
    </div>
  );
}
