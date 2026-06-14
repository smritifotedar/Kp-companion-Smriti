'use client';

// Clean, labelled SVG diagrams that illustrate the ritual setup.
export type DiagramKind = 'puja' | 'havan' | 'thread';

export function PujaDiagram({ kind }: { kind: DiagramKind }) {
  if (kind === 'havan') return <HavanDiagram />;
  if (kind === 'thread') return <ThreadDiagram />;
  return <AltarDiagram />;
}

const labelStyle = { fontSize: 9, fill: '#7b3b1d', fontWeight: 600 } as const;

function AltarDiagram() {
  return (
    <figure className="rounded-2xl border border-saffron-100 bg-gradient-to-br from-amber-50/60 to-white p-3">
      <svg viewBox="0 0 320 240" className="w-full h-auto" role="img" aria-label="Puja altar arrangement (top view)">
        {/* chowki */}
        <rect x="40" y="40" width="240" height="160" rx="10" fill="#fff3e0" stroke="#c97828" strokeWidth="1.5" />
        {/* East marker */}
        <g>
          <line x1="160" y1="14" x2="160" y2="36" stroke="#e06500" strokeWidth="1.5" markerEnd="url(#arr)" />
          <text x="160" y="12" textAnchor="middle" style={{ ...labelStyle, fill: '#e06500' }}>EAST — you face this way</text>
        </g>
        <defs>
          <marker id="arr" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#e06500" /></marker>
        </defs>
        {/* Deity */}
        <circle cx="160" cy="78" r="20" fill="#ffe0b2" stroke="#e06500" strokeWidth="1.5" />
        <text x="160" y="82" textAnchor="middle" style={{ fontSize: 14 }}>🕉</text>
        <text x="160" y="115" textAnchor="middle" style={labelStyle}>Deity / Idol</text>
        {/* Kalash */}
        <circle cx="80" cy="90" r="14" fill="#fff" stroke="#c97828" strokeWidth="1.3" />
        <text x="80" y="94" textAnchor="middle" style={{ fontSize: 12 }}>🪔</text>
        <text x="80" y="118" textAnchor="middle" style={labelStyle}>Kalash</text>
        {/* Diya */}
        <circle cx="240" cy="90" r="14" fill="#fff" stroke="#c97828" strokeWidth="1.3" />
        <text x="240" y="94" textAnchor="middle" style={{ fontSize: 12 }}>🪔</text>
        <text x="240" y="118" textAnchor="middle" style={labelStyle}>Diya (lamp)</text>
        {/* Incense */}
        <circle cx="80" cy="160" r="13" fill="#fff" stroke="#c97828" strokeWidth="1.3" />
        <text x="80" y="164" textAnchor="middle" style={{ fontSize: 11 }}>🌿</text>
        <text x="80" y="186" textAnchor="middle" style={labelStyle}>Incense</text>
        {/* Thali */}
        <circle cx="160" cy="160" r="22" fill="#fff8f0" stroke="#c97828" strokeWidth="1.3" />
        <text x="160" y="164" textAnchor="middle" style={{ fontSize: 13 }}>🍚</text>
        <text x="160" y="194" textAnchor="middle" style={labelStyle}>Offerings thaal</text>
        {/* Flowers */}
        <circle cx="240" cy="160" r="13" fill="#fff" stroke="#c97828" strokeWidth="1.3" />
        <text x="240" y="164" textAnchor="middle" style={{ fontSize: 11 }}>🌸</text>
        <text x="240" y="186" textAnchor="middle" style={labelStyle}>Flowers</text>
        {/* You */}
        <text x="160" y="226" textAnchor="middle" style={{ ...labelStyle, fill: '#3a2418' }}>● You sit here (facing East)</text>
      </svg>
      <figcaption className="text-[10px] text-earth-400 text-center mt-1">Typical altar arrangement (top view) — exact placement varies by family.</figcaption>
    </figure>
  );
}

function HavanDiagram() {
  return (
    <figure className="rounded-2xl border border-saffron-100 bg-gradient-to-br from-amber-50/60 to-white p-3">
      <svg viewBox="0 0 320 240" className="w-full h-auto" role="img" aria-label="Havan kund setup">
        {/* compass */}
        <text x="160" y="14" textAnchor="middle" style={{ ...labelStyle, fill: '#e06500' }}>N</text>
        <text x="306" y="124" textAnchor="middle" style={labelStyle}>E</text>
        <text x="160" y="234" textAnchor="middle" style={labelStyle}>S</text>
        <text x="14" y="124" textAnchor="middle" style={labelStyle}>W</text>
        {/* kund (inverted pyramid, top view as squares) */}
        <rect x="120" y="80" width="80" height="80" fill="#fde2c0" stroke="#b8611d" strokeWidth="1.5" />
        <rect x="132" y="92" width="56" height="56" fill="#fbcd9a" stroke="#b8611d" strokeWidth="1.2" />
        <rect x="144" y="104" width="32" height="32" fill="#f7b267" stroke="#b8611d" strokeWidth="1" />
        {/* samidha logs crossed */}
        <line x1="138" y1="100" x2="182" y2="140" stroke="#8b5a2b" strokeWidth="3" />
        <line x1="182" y1="100" x2="138" y2="140" stroke="#8b5a2b" strokeWidth="3" />
        {/* flame */}
        <text x="160" y="126" textAnchor="middle" style={{ fontSize: 16 }}>🔥</text>
        <text x="160" y="174" textAnchor="middle" style={labelStyle}>Havan Kund</text>
        {/* sruva + samagri */}
        <text x="250" y="96" textAnchor="middle" style={{ fontSize: 14 }}>🥄</text>
        <text x="250" y="116" textAnchor="middle" style={labelStyle}>Sruva</text>
        <text x="250" y="150" textAnchor="middle" style={{ fontSize: 13 }}>🫕</text>
        <text x="250" y="170" textAnchor="middle" style={labelStyle}>Ghee / Samagri</text>
        {/* yajamana */}
        <circle cx="60" cy="120" r="14" fill="#ffe0b2" stroke="#e06500" strokeWidth="1.3" />
        <text x="60" y="124" textAnchor="middle" style={{ fontSize: 12 }}>🧎</text>
        <text x="60" y="150" textAnchor="middle" style={labelStyle}>You (face East →)</text>
      </svg>
      <figcaption className="text-[10px] text-earth-400 text-center mt-1">Sit on the west side facing East; feed the fire steadily through the yajna.</figcaption>
    </figure>
  );
}

function ThreadDiagram() {
  return (
    <figure className="rounded-2xl border border-saffron-100 bg-gradient-to-br from-amber-50/60 to-white p-3">
      <svg viewBox="0 0 320 200" className="w-full h-auto" role="img" aria-label="Wearing the sacred thread">
        {[{ x: 90, label: 'Savya (normal)', sub: 'over LEFT shoulder', flip: false },
          { x: 230, label: 'Apasavya', sub: 'over RIGHT (pitru karya)', flip: true }].map((c) => (
          <g key={c.label}>
            <circle cx={c.x} cy={50} r={16} fill="#ffe0b2" stroke="#c97828" strokeWidth="1.3" />
            <rect x={c.x - 14} y={66} width={28} height={54} rx={8} fill="#fff3e0" stroke="#c97828" strokeWidth="1.3" />
            {/* thread diagonal */}
            <line x1={c.flip ? c.x + 16 : c.x - 16} y1={42} x2={c.flip ? c.x - 16 : c.x + 16} y2={118} stroke="#e06500" strokeWidth="2.5" />
            <text x={c.x} y={142} textAnchor="middle" style={{ ...labelStyle, fill: '#3a2418' }}>{c.label}</text>
            <text x={c.x} y={156} textAnchor="middle" style={{ fontSize: 8, fill: '#7b3b1d' }}>{c.sub}</text>
          </g>
        ))}
      </svg>
      <figcaption className="text-[10px] text-earth-400 text-center mt-1">Sacred thread: over the left shoulder for normal rites; over the right for ancestral (pitru) rites.</figcaption>
    </figure>
  );
}
