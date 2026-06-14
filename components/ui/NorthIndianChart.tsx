'use client';

import type { GrahaPos } from '@/lib/kp-kundli';

// Fixed text-anchor positions for the 12 houses of a North-Indian chart (viewBox 300×300).
// Index 0 = House 1 (top-centre), proceeding anti-clockwise as per convention.
const HOUSE_POS: { x: number; y: number }[] = [
  { x: 150, y: 78 },   // 1 top center
  { x: 78, y: 42 },    // 2 top-left
  { x: 42, y: 78 },    // 3 left-top
  { x: 78, y: 150 },   // 4 left center
  { x: 42, y: 222 },   // 5 left-bottom
  { x: 78, y: 258 },   // 6 bottom-left
  { x: 150, y: 222 },  // 7 bottom center
  { x: 222, y: 258 },  // 8 bottom-right
  { x: 258, y: 222 },  // 9 right-bottom
  { x: 222, y: 150 },  // 10 right center
  { x: 258, y: 78 },   // 11 right-top
  { x: 222, y: 42 },   // 12 top-right
];

// Rashi-number label positions (nudged toward the centre of each region)
const SIGN_POS: { x: number; y: number }[] = [
  { x: 150, y: 60 }, { x: 60, y: 30 }, { x: 30, y: 60 }, { x: 60, y: 150 },
  { x: 30, y: 240 }, { x: 60, y: 270 }, { x: 150, y: 205 }, { x: 240, y: 270 },
  { x: 270, y: 240 }, { x: 240, y: 150 }, { x: 270, y: 60 }, { x: 240, y: 30 },
];

export function NorthIndianChart({
  grahas,
  lagnaRashi,
  title,
}: {
  grahas: GrahaPos[];
  lagnaRashi: number; // 0–11
  title?: string;
}) {
  // Group planets by house (1–12)
  const byHouse: Record<number, string[]> = {};
  for (const g of grahas) {
    (byHouse[g.house] ??= []).push(`${g.abbr}${g.retro ? 'ʳ' : ''}`);
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      {title && <div className="text-center text-xs font-ui font-semibold text-earth-500 uppercase tracking-wide mb-2">{title}</div>}
      <svg viewBox="0 0 300 300" className="w-full h-auto" role="img" aria-label="North Indian birth chart">
        {/* frame + diagonals + inner diamond */}
        <g stroke="#c97828" strokeWidth="1.4" fill="none">
          <rect x="2" y="2" width="296" height="296" rx="6" />
          <line x1="2" y1="2" x2="298" y2="298" />
          <line x1="298" y1="2" x2="2" y2="298" />
          <polygon points="150,2 298,150 150,298 2,150" />
        </g>

        {/* houses: rashi number + planets */}
        {HOUSE_POS.map((pos, i) => {
          const house = i + 1;
          const rashiNum = ((lagnaRashi + i) % 12) + 1; // sign occupying this house
          const planets = byHouse[house] ?? [];
          const sp = SIGN_POS[i];
          return (
            <g key={house}>
              <text x={sp.x} y={sp.y} textAnchor="middle" fontSize="9" fill="#b8611d" fontWeight="700">
                {rashiNum}
              </text>
              {planets.map((p, pi) => (
                <text
                  key={pi}
                  x={pos.x}
                  y={pos.y + pi * 13}
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="600"
                  fill={house === 1 ? '#e06500' : '#3a2418'}
                >
                  {p}
                </text>
              ))}
            </g>
          );
        })}

        {/* Lagna marker in house 1 */}
        <text x="150" y="22" textAnchor="middle" fontSize="9" fill="#e06500" fontWeight="700">La</text>
      </svg>
    </div>
  );
}
