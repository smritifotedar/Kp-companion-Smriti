// Minimal iCalendar (.ics) generation + download — runs entirely client-side.

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function toICSDate(d: Date): string {
  // All-day event date in YYYYMMDD (floating, local)
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

function escapeICS(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export interface ICSEvent {
  title: string;
  description?: string;
  date: Date;            // event day (all-day)
  yearlyRecurring?: boolean;
  location?: string;
}

export function buildICS(ev: ICSEvent): string {
  const dt = new Date(ev.date);
  const next = new Date(dt);
  next.setDate(next.getDate() + 1); // DTEND is exclusive for all-day events
  const uid = `${toICSDate(dt)}-${Math.random().toString(36).slice(2)}@kp-companion`;
  const stamp = new Date();
  const stampStr =
    `${stamp.getUTCFullYear()}${pad(stamp.getUTCMonth() + 1)}${pad(stamp.getUTCDate())}T` +
    `${pad(stamp.getUTCHours())}${pad(stamp.getUTCMinutes())}${pad(stamp.getUTCSeconds())}Z`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KP Digital Companion//Panchang//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${stampStr}`,
    `DTSTART;VALUE=DATE:${toICSDate(dt)}`,
    `DTEND;VALUE=DATE:${toICSDate(next)}`,
    `SUMMARY:${escapeICS(ev.title)}`,
  ];
  if (ev.description) lines.push(`DESCRIPTION:${escapeICS(ev.description)}`);
  if (ev.location) lines.push(`LOCATION:${escapeICS(ev.location)}`);
  if (ev.yearlyRecurring) lines.push('RRULE:FREQ=YEARLY');
  lines.push('BEGIN:VALARM', 'TRIGGER:-P1D', 'ACTION:DISPLAY', `DESCRIPTION:${escapeICS(ev.title)}`, 'END:VALARM');
  lines.push('END:VEVENT', 'END:VCALENDAR');

  return lines.join('\r\n');
}

export function downloadICS(ev: ICSEvent): void {
  const ics = buildICS(ev);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${ev.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
