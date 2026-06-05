// Reusable floral SVG decorations
import React from 'react';

// Top-right rose cluster (large)
export function FloralTopRight({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Large rose center */}
      <circle cx="190" cy="60" r="38" fill="#D89B84" opacity="0.8"/>
      <circle cx="190" cy="60" r="26" fill="#C4877B" opacity="0.9"/>
      <circle cx="190" cy="60" r="14" fill="#A46752" opacity="1"/>
      {/* Petals */}
      <ellipse cx="190" cy="22" rx="12" ry="22" fill="#EEC9B9" opacity="0.75" transform="rotate(-10 190 22)"/>
      <ellipse cx="228" cy="40" rx="12" ry="20" fill="#D89B84" opacity="0.7" transform="rotate(40 228 40)"/>
      <ellipse cx="230" cy="78" rx="10" ry="18" fill="#EEC9B9" opacity="0.65" transform="rotate(90 230 78)"/>
      <ellipse cx="210" cy="100" rx="11" ry="19" fill="#D89B84" opacity="0.7" transform="rotate(135 210 100)"/>
      <ellipse cx="170" cy="98" rx="10" ry="18" fill="#EEC9B9" opacity="0.65" transform="rotate(200 170 98)"/>
      <ellipse cx="152" cy="70" rx="11" ry="20" fill="#D89B84" opacity="0.7" transform="rotate(250 152 70)"/>
      {/* Small roses */}
      <circle cx="130" cy="30" r="22" fill="#D89B84" opacity="0.65"/>
      <circle cx="130" cy="30" r="13" fill="#C4877B" opacity="0.8"/>
      <circle cx="130" cy="30" r="7" fill="#A46752" opacity="1"/>
      <circle cx="240" cy="120" r="18" fill="#EEC9B9" opacity="0.7"/>
      <circle cx="240" cy="120" r="10" fill="#D89B84" opacity="0.85"/>
      {/* Leaves/branches */}
      <path d="M80 180 Q120 120 180 80" stroke="#B5977A" strokeWidth="2" fill="none" opacity="0.5"/>
      <ellipse cx="100" cy="158" rx="18" ry="9" fill="#C8A882" opacity="0.5" transform="rotate(-30 100 158)"/>
      <ellipse cx="130" cy="135" rx="16" ry="8" fill="#B5977A" opacity="0.45" transform="rotate(-50 130 135)"/>
      <ellipse cx="160" cy="108" rx="14" ry="7" fill="#C8A882" opacity="0.4" transform="rotate(-65 160 108)"/>
      <path d="M200 140 Q230 160 250 190" stroke="#B5977A" strokeWidth="1.5" fill="none" opacity="0.4"/>
      <ellipse cx="218" cy="152" rx="13" ry="7" fill="#C8A882" opacity="0.4" transform="rotate(20 218 152)"/>
      {/* Small buds */}
      <circle cx="60" cy="120" r="10" fill="#EEC9B9" opacity="0.6"/>
      <circle cx="60" cy="120" r="5" fill="#D89B84" opacity="0.8"/>
      <circle cx="250" cy="50" r="8" fill="#EEC9B9" opacity="0.55"/>
    </svg>
  );
}

// Bottom-left rose cluster
export function FloralBottomLeft({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg" style={{transform:'scaleX(-1) scaleY(-1)'}}>
      <circle cx="190" cy="60" r="38" fill="#D89B84" opacity="0.8"/>
      <circle cx="190" cy="60" r="26" fill="#C4877B" opacity="0.9"/>
      <circle cx="190" cy="60" r="14" fill="#A46752"/>
      <ellipse cx="190" cy="22" rx="12" ry="22" fill="#EEC9B9" opacity="0.75" transform="rotate(-10 190 22)"/>
      <ellipse cx="228" cy="40" rx="12" ry="20" fill="#D89B84" opacity="0.7" transform="rotate(40 228 40)"/>
      <ellipse cx="230" cy="78" rx="10" ry="18" fill="#EEC9B9" opacity="0.65" transform="rotate(90 230 78)"/>
      <ellipse cx="210" cy="100" rx="11" ry="19" fill="#D89B84" opacity="0.7" transform="rotate(135 210 100)"/>
      <ellipse cx="170" cy="98" rx="10" ry="18" fill="#EEC9B9" opacity="0.65" transform="rotate(200 170 98)"/>
      <circle cx="130" cy="30" r="22" fill="#D89B84" opacity="0.65"/>
      <circle cx="130" cy="30" r="13" fill="#C4877B" opacity="0.8"/>
      <circle cx="130" cy="30" r="7" fill="#A46752"/>
      <circle cx="240" cy="120" r="18" fill="#EEC9B9" opacity="0.7"/>
      <circle cx="240" cy="120" r="10" fill="#D89B84" opacity="0.85"/>
      <path d="M80 180 Q120 120 180 80" stroke="#B5977A" strokeWidth="2" fill="none" opacity="0.5"/>
      <ellipse cx="100" cy="158" rx="18" ry="9" fill="#C8A882" opacity="0.5" transform="rotate(-30 100 158)"/>
      <ellipse cx="130" cy="135" rx="16" ry="8" fill="#B5977A" opacity="0.45" transform="rotate(-50 130 135)"/>
      <ellipse cx="160" cy="108" rx="14" ry="7" fill="#C8A882" opacity="0.4" transform="rotate(-65 160 108)"/>
      <circle cx="60" cy="120" r="10" fill="#EEC9B9" opacity="0.6"/>
      <circle cx="60" cy="120" r="5" fill="#D89B84" opacity="0.8"/>
    </svg>
  );
}

// Slim branch divider
export function BranchDivider({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 320 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 20 Q80 8 160 20 Q240 32 310 20" stroke="#D89B84" strokeWidth="1.5" fill="none" opacity="0.6"/>
      <ellipse cx="60" cy="14" rx="10" ry="5" fill="#C8A882" opacity="0.5" transform="rotate(-20 60 14)"/>
      <ellipse cx="110" cy="10" rx="9" ry="4" fill="#D89B84" opacity="0.45" transform="rotate(-10 110 10)"/>
      <ellipse cx="210" cy="30" rx="9" ry="4" fill="#C8A882" opacity="0.45" transform="rotate(10 210 30)"/>
      <ellipse cx="260" cy="26" rx="10" ry="5" fill="#D89B84" opacity="0.5" transform="rotate(20 260 26)"/>
      <circle cx="160" cy="20" r="4" fill="#D89B84" opacity="0.7"/>
    </svg>
  );
}

// Envelope floral emboss (for envelope face)
export function EnvelopeFloral({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 180 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main branch */}
      <path d="M20 80 Q60 40 100 60 Q140 80 160 40" stroke="#C4877B" strokeWidth="1.2" fill="none" opacity="0.45"/>
      {/* Leaves */}
      <ellipse cx="45" cy="58" rx="14" ry="6" fill="#C8A882" opacity="0.35" transform="rotate(-40 45 58)"/>
      <ellipse cx="75" cy="50" rx="13" ry="5" fill="#C4877B" opacity="0.3" transform="rotate(-20 75 50)"/>
      <ellipse cx="110" cy="62" rx="12" ry="5" fill="#C8A882" opacity="0.3" transform="rotate(15 110 62)"/>
      <ellipse cx="140" cy="52" rx="12" ry="5" fill="#C4877B" opacity="0.28" transform="rotate(-25 140 52)"/>
      {/* Mini roses */}
      <circle cx="30" cy="74" r="9" fill="#D89B84" opacity="0.35"/>
      <circle cx="30" cy="74" r="5" fill="#C4877B" opacity="0.45"/>
      <circle cx="100" cy="58" r="7" fill="#D89B84" opacity="0.3"/>
      <circle cx="100" cy="58" r="3.5" fill="#C4877B" opacity="0.4"/>
      <circle cx="155" cy="42" r="8" fill="#EEC9B9" opacity="0.35"/>
      <circle cx="155" cy="42" r="4" fill="#D89B84" opacity="0.4"/>
      {/* Extra tiny buds */}
      <circle cx="60" cy="42" r="5" fill="#EEC9B9" opacity="0.3"/>
      <circle cx="125" cy="70" r="4" fill="#D89B84" opacity="0.3"/>
    </svg>
  );
}

// Small floral accent
export function FloralAccent({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="16" fill="#D89B84" opacity="0.7"/>
      <circle cx="40" cy="40" r="10" fill="#C4877B" opacity="0.85"/>
      <circle cx="40" cy="40" r="5" fill="#A46752"/>
      <ellipse cx="40" cy="20" rx="7" ry="13" fill="#EEC9B9" opacity="0.7" transform="rotate(0 40 20)"/>
      <ellipse cx="57" cy="28" rx="7" ry="12" fill="#D89B84" opacity="0.65" transform="rotate(45 57 28)"/>
      <ellipse cx="60" cy="47" rx="6" ry="11" fill="#EEC9B9" opacity="0.6" transform="rotate(90 60 47)"/>
      <ellipse cx="48" cy="62" rx="7" ry="12" fill="#D89B84" opacity="0.65" transform="rotate(135 48 62)"/>
      <ellipse cx="32" cy="62" rx="6" ry="11" fill="#EEC9B9" opacity="0.6" transform="rotate(200 32 62)"/>
      <ellipse cx="20" cy="48" rx="7" ry="12" fill="#D89B84" opacity="0.65" transform="rotate(250 20 48)"/>
    </svg>
  );
}
