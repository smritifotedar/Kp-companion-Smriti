'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  loadEvents, addEvent, removeEvent, resolveAll, formatCountdown, newId,
  type SavedEvent, type EventType, type ResolvedEvent,
} from '@/lib/events';
import { downloadICS } from '@/lib/ics';
import {
  notificationPermission, requestNotificationPermission, showNotification,
  alreadyNotified, markNotified,
} from '@/lib/notify';
import { WishCard } from '@/components/ui/WishCard';
import { CalendarPlus, Bell, BellRing, Trash2, Gift, Heart, Star, Cake, PartyPopper } from 'lucide-react';

const TYPE_META: Record<EventType, { label: string; icon: typeof Gift; dateLabel: string }> = {
  birthday: { label: 'Birthday', icon: Cake, dateLabel: 'Date of Birth' },
  anniversary: { label: 'Anniversary', icon: Heart, dateLabel: 'Anniversary Date' },
  custom: { label: 'Other Event', icon: Star, dateLabel: 'Event Date' },
};

function fmtDate(d: Date): string {
  return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function EventsPage() {
  const [events, setEvents] = useState<SavedEvent[]>([]);
  const [resolved, setResolved] = useState<ResolvedEvent[]>([]);
  const [perm, setPerm] = useState<NotificationPermission | 'unsupported'>('default');
  const [wishFor, setWishFor] = useState<ResolvedEvent | null>(null);

  // form state
  const [type, setType] = useState<EventType>('birthday');
  const [name, setName] = useState('');
  const [relation, setRelation] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [byPanchang, setByPanchang] = useState(true);
  const [yearly, setYearly] = useState(true);
  const [reminderDays, setReminderDays] = useState(1);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');

  const refresh = useCallback(() => {
    setEvents(loadEvents());
    setResolved(resolveAll());
  }, []);

  useEffect(() => {
    refresh();
    setPerm(notificationPermission());
    const h = () => refresh();
    window.addEventListener('kp-events-changed', h);
    return () => window.removeEventListener('kp-events-changed', h);
  }, [refresh]);

  // Fire in-app reminders for anything due within its reminder window.
  useEffect(() => {
    if (perm !== 'granted') return;
    for (const r of resolved) {
      if (!r.nextDate) continue;
      if (r.daysUntil >= 0 && r.daysUntil <= r.event.reminderDays) {
        const key = r.nextDate.toISOString().slice(0, 10);
        if (!alreadyNotified(r.event.id, key)) {
          const when = formatCountdown(r.daysUntil).toLowerCase();
          showNotification(
            `${TYPE_META[r.event.type].label}: ${r.event.name}`,
            `${r.daysUntil === 0 ? 'Today' : when[0].toUpperCase() + when.slice(1)} — ${fmtDate(r.nextDate)}`,
          );
          markNotified(r.event.id, key);
        }
      }
    }
  }, [resolved, perm]);

  const enableReminders = async () => setPerm(await requestNotificationPermission());

  const pickType = (t: EventType) => {
    setType(t);
    if (t === 'custom') { setByPanchang(false); setYearly(false); }
    else { setByPanchang(true); setYearly(true); }
  };

  const submit = () => {
    setError('');
    if (!name.trim() || !date) { setError('Please enter a name/title and a date.'); return; }
    const ev: SavedEvent = {
      id: newId(), type, name: name.trim(), relation: relation.trim() || undefined,
      date, time: time || undefined,
      byPanchang: type === 'custom' ? false : byPanchang,
      yearly: type === 'custom' ? yearly : true,
      reminderDays, note: note.trim() || undefined, createdAt: Date.now(),
    };
    addEvent(ev);
    setName(''); setRelation(''); setDate(''); setTime(''); setNote('');
    refresh();
  };

  const addToCalendar = (r: ResolvedEvent) => {
    if (!r.nextDate) return;
    const e = r.event;
    const desc = [
      e.relation ? `${e.relation}` : '',
      e.byPanchang ? `By Kashmiri Pandit Panchang (Janma Tithi)` : '',
      r.birthInfo ? `Tithi: ${r.birthInfo.paksha} ${r.birthInfo.tithi}, Nakshatra: ${r.birthInfo.nakshatra}` : '',
      e.note || '',
    ].filter(Boolean).join(' — ');
    downloadICS({
      title: `${TYPE_META[e.type].label}: ${e.name}`,
      description: desc || undefined,
      date: r.nextDate,
      // Panchang birthdays shift each year, so export a single dated reminder (the app
      // recomputes next year). Fixed Gregorian yearly events recur natively.
      yearlyRecurring: !e.byPanchang && e.yearly,
      reminderDaysBefore: e.reminderDays,
    });
  };

  const del = (id: string) => { removeEvent(id); refresh(); };

  const meta = TYPE_META[type];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <div className="font-devanagari text-saffron-500 text-xl mb-2">स्मृति दिवस</div>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-earth-900 mb-3 flex items-center justify-center gap-2">
          <PartyPopper className="text-saffron-500" size={28} /> Events &amp; Reminders
        </h1>
        <p className="text-earth-600 max-w-2xl mx-auto">
          Save birthdays, anniversaries and special days for family &amp; friends. Birthdays are tracked by the
          <strong> Kashmiri Pandit Panchang</strong> (your Janma Tithi), and you get reminders as the day approaches —
          plus a one-tap calendar reminder and a personalised wish card.
        </p>
      </div>

      {/* Reminder permission banner */}
      <div className={`rounded-2xl border p-4 mb-6 flex items-center gap-3 ${perm === 'granted' ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
        {perm === 'granted' ? <BellRing className="text-green-600 shrink-0" size={22} /> : <Bell className="text-amber-600 shrink-0" size={22} />}
        <div className="flex-1 text-sm">
          {perm === 'granted' && <span className="text-green-800">Browser reminders are on. You&apos;ll be alerted when an event is near (while this site is open).</span>}
          {perm === 'default' && <span className="text-amber-800">Turn on browser reminders to get an alert as each event approaches. For reminders even when the site is closed, use <strong>Add to Calendar</strong> on any event.</span>}
          {perm === 'denied' && <span className="text-amber-800">Browser notifications are blocked. You can still use <strong>Add to Calendar</strong> on any event so your phone reminds you natively.</span>}
          {perm === 'unsupported' && <span className="text-amber-800">This browser doesn&apos;t support notifications — use <strong>Add to Calendar</strong> on any event for native reminders.</span>}
        </div>
        {perm === 'default' && <button onClick={enableReminders} className="btn-primary text-sm px-4 py-2 shrink-0">Enable</button>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Add form ── */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-earth-100 shadow-premium p-5 h-fit">
          <h2 className="font-display font-bold text-lg text-earth-900 mb-4">Add an Event</h2>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {(Object.keys(TYPE_META) as EventType[]).map((t) => {
              const Icon = TYPE_META[t].icon;
              return (
                <button key={t} onClick={() => pickType(t)}
                  className={`flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-medium transition-all ${type === t ? 'border-saffron-500 bg-saffron-50 text-saffron-700' : 'border-earth-200 text-earth-500 hover:border-saffron-300'}`}>
                  <Icon size={18} /> {TYPE_META[t].label}
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            <input value={name} onChange={(e) => setName(e.target.value)}
              placeholder={type === 'custom' ? 'Event title (e.g., Kheer Bhawani trip)' : 'Name (e.g., Aanya, Father)'}
              className="w-full px-4 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100" />

            {type !== 'custom' && (
              <input value={relation} onChange={(e) => setRelation(e.target.value)} placeholder="Relation (optional) — Father, Sister, Friend…"
                className="w-full px-4 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100" />
            )}

            <div>
              <label className="block text-xs font-semibold text-earth-600 mb-1">{meta.dateLabel}</label>
              <div className="grid grid-cols-2 gap-2">
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100" />
                {type !== 'custom' && byPanchang && (
                  <input type="time" value={time} onChange={(e) => setTime(e.target.value)} title="Birth time (optional)"
                    className="w-full px-3 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100" />
                )}
              </div>
            </div>

            {type !== 'custom' && (
              <div className="rounded-xl bg-earth-50 border border-earth-100 p-3">
                <span className="block text-xs font-semibold text-earth-600 mb-2">Observe by</span>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setByPanchang(true)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border ${byPanchang ? 'border-saffron-500 bg-white text-saffron-700' : 'border-earth-200 text-earth-500'}`}>
                    KP Panchang (Tithi)
                  </button>
                  <button onClick={() => setByPanchang(false)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border ${!byPanchang ? 'border-saffron-500 bg-white text-saffron-700' : 'border-earth-200 text-earth-500'}`}>
                    Calendar date
                  </button>
                </div>
                <p className="text-[11px] text-earth-400 mt-2">
                  {byPanchang ? 'The Janma Tithi birthday — shifts each year with the lunar calendar.' : 'The same Gregorian date every year.'}
                </p>
              </div>
            )}

            {type === 'custom' && (
              <label className="flex items-center gap-2 text-sm text-earth-600">
                <input type="checkbox" checked={yearly} onChange={(e) => setYearly(e.target.checked)} className="accent-saffron-500" />
                Repeats every year
              </label>
            )}

            <div>
              <label className="block text-xs font-semibold text-earth-600 mb-1">Remind me</label>
              <select value={reminderDays} onChange={(e) => setReminderDays(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100">
                <option value={0}>On the day</option>
                <option value={1}>1 day before</option>
                <option value={3}>3 days before</option>
                <option value={7}>1 week before</option>
              </select>
            </div>

            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Note (optional)"
              className="w-full px-4 py-2.5 rounded-xl border border-earth-200 focus:border-saffron-400 focus:outline-none focus:ring-2 focus:ring-saffron-100 text-sm" />

            {error && <p className="text-sm text-red-600">{error}</p>}
            <button onClick={submit} className="btn-primary w-full py-3">Save Event</button>
            <p className="text-[11px] text-earth-400 text-center">Saved on this device only — private, no account needed.</p>
          </div>
        </div>

        {/* ── Upcoming list ── */}
        <div className="lg:col-span-3">
          <h2 className="font-display font-bold text-lg text-earth-900 mb-4">Upcoming ({resolved.length})</h2>

          {resolved.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-earth-200 p-10 text-center text-earth-400">
              <Gift size={36} className="mx-auto mb-3 opacity-40" />
              No events yet. Add your family &amp; friends&apos; birthdays to never miss one.
            </div>
          ) : (
            <div className="space-y-3">
              {resolved.map((r) => {
                const e = r.event;
                const Icon = TYPE_META[e.type].icon;
                const soon = r.daysUntil >= 0 && r.daysUntil <= Math.max(e.reminderDays, 2);
                return (
                  <div key={e.id} className={`rounded-2xl border p-4 shadow-sm transition-all ${soon ? 'border-saffron-300 bg-gradient-to-br from-saffron-50 to-amber-50' : 'border-earth-100 bg-white'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 ${soon ? 'bg-saffron-500 text-white' : 'bg-earth-100 text-earth-500'}`}>
                        <Icon size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display font-bold text-earth-900">{e.name}</span>
                          {e.relation && <span className="text-xs text-earth-400">· {e.relation}</span>}
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.daysUntil === 0 ? 'bg-red-500 text-white' : soon ? 'bg-saffron-200 text-saffron-800' : 'bg-earth-100 text-earth-500'}`}>
                            {formatCountdown(r.daysUntil)}
                          </span>
                        </div>
                        {r.nextDate && <div className="text-sm text-earth-600 mt-0.5">{fmtDate(r.nextDate)}</div>}
                        {r.birthInfo && (
                          <div className="text-xs text-earth-400 mt-1">
                            {r.birthInfo.paksha} {r.birthInfo.tithi} · {r.birthInfo.nakshatra} (Pada {r.birthInfo.pada}) · {r.birthInfo.rashi}
                            {r.exact === false && <span className="text-amber-500"> · nearest tithi</span>}
                          </div>
                        )}
                        {e.note && <div className="text-xs text-earth-500 mt-1 italic">{e.note}</div>}

                        <div className="flex flex-wrap gap-2 mt-3">
                          <button onClick={() => addToCalendar(r)} className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border border-earth-200 text-earth-600 hover:border-saffron-300 hover:text-saffron-700">
                            <CalendarPlus size={13} /> Add to Calendar
                          </button>
                          {e.type === 'birthday' && (
                            <button onClick={() => setWishFor(r)} className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full bg-gradient-to-r from-saffron-500 to-amber-500 text-white hover:shadow-glow-saffron">
                              <Gift size={13} /> Wish Card
                            </button>
                          )}
                          <button onClick={() => del(e.id)} className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-full border border-earth-200 text-earth-400 hover:border-red-300 hover:text-red-500 ml-auto">
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {wishFor && wishFor.nextDate && (
        <WishCard
          name={wishFor.event.name}
          dateLabel={fmtDate(wishFor.nextDate)}
          birthInfo={wishFor.birthInfo}
          onClose={() => setWishFor(null)}
        />
      )}
    </div>
  );
}
