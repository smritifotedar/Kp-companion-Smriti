// Lightweight browser notifications for event reminders.
// Note: web notifications only fire while a tab is open. For reminders when the site
// is closed, the events page also offers "Add to Calendar" (.ics) with a built-in alarm
// so the user's own phone/Google/Apple calendar reminds them natively.

export function notificationsSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

export function notificationPermission(): NotificationPermission | 'unsupported' {
  if (!notificationsSupported()) return 'unsupported';
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!notificationsSupported()) return 'denied';
  try {
    return await Notification.requestPermission();
  } catch {
    return 'denied';
  }
}

export function showNotification(title: string, body: string): void {
  if (!notificationsSupported() || Notification.permission !== 'granted') return;
  try {
    new Notification(title, { body, icon: '/favicon.ico', tag: title });
  } catch {
    /* ignore */
  }
}

// Fire a reminder at most once per event per day (deduped in localStorage).
const SEEN_KEY = 'kp-events-notified';

export function alreadyNotified(eventId: string, dateKey: string): boolean {
  try {
    const seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '{}');
    return seen[`${eventId}|${dateKey}`] === true;
  } catch {
    return false;
  }
}

export function markNotified(eventId: string, dateKey: string): void {
  try {
    const seen = JSON.parse(localStorage.getItem(SEEN_KEY) || '{}');
    seen[`${eventId}|${dateKey}`] = true;
    localStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  } catch {
    /* ignore */
  }
}
