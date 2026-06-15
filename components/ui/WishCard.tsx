'use client';

import { useEffect, useRef, useState } from 'react';
import { Download, Share2, Printer, X } from 'lucide-react';
import type { BirthInfo } from '@/lib/events';

interface Theme { name: string; from: string; mid: string; to: string; accent: string; ink: string }
const THEMES: Theme[] = [
  { name: 'Saffron', from: '#fb923c', mid: '#ea580c', to: '#7c2d12', accent: '#ffe9b0', ink: '#fff7ed' },
  { name: 'Temple',  from: '#7c3aed', mid: '#5b21b6', to: '#2e1065', accent: '#fde68a', ink: '#f5f3ff' },
  { name: 'Rose',    from: '#fb7185', mid: '#be123c', to: '#4c0519', accent: '#ffe4e6', ink: '#fff1f2' },
];

const TEMPLATES = [
  'Wishing you a year as radiant as the Herath lamps — health, happiness and the blessings of Sharika Mata always.',
  'On your Janma Tithi, may Lord Shiva and the family deity shower you with long life, prosperity and joy. Happy Birthday!',
  'Many warm wishes on your special day. May this new year of your life bloom like spring in the Valley. 🌸',
];

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? line + ' ' + w : w;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = w; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

function fitFont(ctx: CanvasRenderingContext2D, text: string, maxW: number, start: number, family: string): number {
  let size = start;
  do {
    ctx.font = `bold ${size}px ${family}`;
    if (ctx.measureText(text).width <= maxW) break;
    size -= 4;
  } while (size > 28);
  return size;
}

export function WishCard({
  name, dateLabel, birthInfo, onClose,
}: { name: string; dateLabel: string; birthInfo?: BirthInfo; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [themeIdx, setThemeIdx] = useState(0);
  const [message, setMessage] = useState(TEMPLATES[0]);
  const W = 1080, H = 1350;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const t = THEMES[themeIdx];

    // Background gradient
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, t.from); g.addColorStop(0.55, t.mid); g.addColorStop(1, t.to);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

    // Soft texture dots
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    for (let i = 0; i < 60; i++) {
      const x = (i * 173) % W, y = (i * 397) % H;
      ctx.beginPath(); ctx.arc(x, y, ((i * 7) % 5) + 1, 0, Math.PI * 2); ctx.fill();
    }

    // Golden border
    ctx.strokeStyle = t.accent; ctx.lineWidth = 5;
    roundRect(ctx, 50, 50, W - 100, H - 100, 36); ctx.stroke();
    ctx.globalAlpha = 0.45; ctx.lineWidth = 2;
    roundRect(ctx, 72, 72, W - 144, H - 144, 26); ctx.stroke();
    ctx.globalAlpha = 1;

    // Sun / mandala motif
    const cx = W / 2, cy = 235;
    ctx.strokeStyle = t.accent; ctx.fillStyle = t.accent;
    ctx.lineWidth = 4;
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * 64, cy + Math.sin(a) * 64);
      ctx.lineTo(cx + Math.cos(a) * 92, cy + Math.sin(a) * 92);
      ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(cx, cy, 50, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = t.mid; ctx.font = 'bold 54px Georgia, serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('ॐ', cx, cy + 4); // ॐ (Om) — falls back gracefully

    // Heading
    ctx.fillStyle = t.accent;
    ctx.font = 'bold 40px Georgia, serif';
    ctx.fillText('H A P P Y   B I R T H D A Y', cx, 380);

    // Name (auto-fit)
    ctx.fillStyle = t.ink;
    const ns = fitFont(ctx, name || 'Friend', W - 220, 110, 'Georgia, serif');
    ctx.font = `bold ${ns}px Georgia, serif`;
    ctx.fillText(name || 'Friend', cx, 480);

    // Divider
    ctx.strokeStyle = t.accent; ctx.lineWidth = 3; ctx.globalAlpha = 0.8;
    ctx.beginPath(); ctx.moveTo(cx - 140, 545); ctx.lineTo(cx + 140, 545); ctx.stroke();
    ctx.globalAlpha = 1;

    // Date
    ctx.fillStyle = t.ink; ctx.font = '38px Georgia, serif';
    ctx.fillText(dateLabel, cx, 605);

    // Panchang details
    if (birthInfo) {
      ctx.fillStyle = t.accent; ctx.font = '600 28px Arial, sans-serif';
      ctx.fillText(`Tithi  ${birthInfo.paksha} ${birthInfo.tithi}`, cx, 668);
      ctx.fillText(`Nakshatra  ${birthInfo.nakshatra} (Pada ${birthInfo.pada})  ·  Rashi  ${birthInfo.rashi}`, cx, 712);
    }

    // Message
    ctx.fillStyle = t.ink; ctx.font = 'italic 36px Georgia, serif';
    const lines = wrap(ctx, message, W - 260);
    let y = birthInfo ? 820 : 770;
    for (const ln of lines.slice(0, 6)) { ctx.fillText(ln, cx, y); y += 52; }

    // Footer
    ctx.fillStyle = t.accent; ctx.globalAlpha = 0.85; ctx.font = '600 26px Arial, sans-serif';
    ctx.fillText('Kashmiri Pandit Digital Companion  ·  Sapta Rishi Samvat', cx, H - 95);
    ctx.globalAlpha = 1;
  }, [name, dateLabel, birthInfo, message, themeIdx]);

  const download = () => {
    canvasRef.current?.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `birthday-${(name || 'wish').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.png`;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  };

  const share = () => {
    canvasRef.current?.toBlob(async (blob) => {
      if (!blob) return;
      const file = new File([blob], 'birthday-card.png', { type: 'image/png' });
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
      if (nav.canShare && nav.canShare({ files: [file] })) {
        try { await navigator.share({ files: [file], title: `Happy Birthday, ${name}!`, text: message }); } catch { /* cancelled */ }
      } else {
        download();
      }
    }, 'image/png');
  };

  const printCard = () => {
    const dataUrl = canvasRef.current?.toDataURL('image/png');
    if (!dataUrl) return;
    const w = window.open('', '_blank');
    if (!w) return;
    w.document.write(`<img src="${dataUrl}" style="width:100%" onload="window.print()"/>`);
    w.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-premium-lg max-w-lg w-full my-8 overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-earth-100">
          <h3 className="font-display font-bold text-earth-900">Birthday Wish Card</h3>
          <button onClick={onClose} className="text-earth-400 hover:text-earth-700"><X size={20} /></button>
        </div>

        <div className="p-4 bg-earth-50">
          <canvas ref={canvasRef} width={W} height={H} className="w-full h-auto rounded-2xl shadow-premium" />
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-ui font-semibold text-earth-500 uppercase tracking-wide">Theme</span>
            {THEMES.map((t, i) => (
              <button key={t.name} onClick={() => setThemeIdx(i)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${i === themeIdx ? 'border-saffron-500 bg-saffron-50 text-saffron-700' : 'border-earth-200 text-earth-500 hover:border-saffron-300'}`}>
                {t.name}
              </button>
            ))}
          </div>

          <div>
            <label className="block text-xs font-ui font-semibold text-earth-500 uppercase tracking-wide mb-1">Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={3}
              className="w-full px-3 py-2 rounded-xl border border-earth-200 text-sm focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100" />
            <div className="flex flex-wrap gap-1.5 mt-2">
              {TEMPLATES.map((t, i) => (
                <button key={i} onClick={() => setMessage(t)} className="text-[11px] px-2 py-1 rounded-full bg-earth-100 text-earth-600 hover:bg-saffron-100">
                  Template {i + 1}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <button onClick={download} className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 text-sm"><Download size={15} /> Download</button>
            <button onClick={share} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-full border border-earth-200 text-earth-700 hover:border-saffron-300"><Share2 size={15} /> Share</button>
            <button onClick={printCard} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-full border border-earth-200 text-earth-700 hover:border-saffron-300"><Printer size={15} /> Print</button>
          </div>
        </div>
      </div>
    </div>
  );
}
