import { NextRequest, NextResponse } from 'next/server';
import { computeDayPanchang } from '@/lib/kp-calendar';

// Live "today" in the Kashmiri Pandit Panchang, computed in IST.
function todayKPContext(): string {
  // Get the current calendar day in IST regardless of server timezone
  const istNow = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  istNow.setHours(0, 0, 0, 0);
  const p = computeDayPanchang(istNow);
  const greg = istNow.toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  return `

LIVE DATE CONTEXT (authoritative — use this whenever the user asks about "today", "now", "current", "this week", or upcoming/past timing):
- Today is ${greg} (Gregorian).
- Kashmiri Pandit Panchang (Sapta Rishi Samvat): ${p.tithiName}, ${p.pakshaLabel} Paksha (tithi ${p.tithiNumber}).
- Nakshatra: ${p.nakshatra} (pada ${p.nakshatraPada}); Yoga: ${p.yoga}; Karana: ${p.karana}; Vara: ${p.vara.name}.
- Lunar month: ${p.kpLunarMonthName} (${p.kpLunarMonthKashmiri}); Solar month: ${p.kpMonthName}.
- Sapta Rishi Samvat year: ${p.samvatYear}.
Always state the current Samvat year as ${p.samvatYear} when asked what year it is in the KP calendar.`;
}

const KP_SYSTEM_PROMPT = `You are the Kashmiri Pandit Digital Companion Knowledge Guide — a knowledgeable, respectful, and authentic guide for the Kashmiri Pandit (KP) community.

CRITICAL INSTRUCTIONS:
1. You ONLY use the Kashmiri Pandit Panchang — specifically the Sapta Rishi Samvat (also called Laukika Samvat).
2. Sapta Rishi Samvat year = Gregorian year + 3076 approximately.
3. Herath = KP Shivaratri on Chaturdashi of Krishna Paksha of Phalguna per KP Panchang.
4. Navreh = KP New Year on Pratipada of Shukla Paksha of Chaitra per Sapta Rishi Samvat.
5. Zyeth Atham = Ashtami of Shukla Paksha in Jyeshtha — worship of Sharika Devi.

KNOWLEDGE AREAS:
- KP festivals: Navreh, Herath, Zyeth Atham, Khetsrimavas, Sharika Ashtami
- KP rituals: Devgon, Lagan, Vyah, Yagnopavit, Mundan, Shraddha, Havan
- KP Panchang: Sapta Rishi Samvat, Laukika Samvat, KP month names
- Kashmir Shaivism, KP history, Gotras, Kuldevtas
- Sacred sites: Hari Parbat, Kheer Bhawani, Mattan Martand, Sharda Peeth

TONE: Respectful, warm, authentic. 2-4 paragraphs. Always suggest consulting a KP scholar for major decisions.`;

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is missing from .env.local — please add it and restart the server (Ctrl+C then npm run dev)' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          { role: 'system', content: KP_SYSTEM_PROMPT + todayKPContext() },
          ...messages.slice(-10).map((m: { role: string; content: string }) => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content,
          })),
        ],
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    console.log('Groq status:', response.status);

    if (!response.ok) {
      console.error('Groq error:', JSON.stringify(data, null, 2));
      return NextResponse.json(
        { error: `Groq error: ${data?.error?.message || JSON.stringify(data)}` },
        { status: 500 }
      );
    }

    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      return NextResponse.json({ error: 'Empty response. Please try again.' }, { status: 500 });
    }

    return NextResponse.json({ content: text });

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('AI Guide error:', message);
    return NextResponse.json({ error: `Server error: ${message}` }, { status: 500 });
  }
}
