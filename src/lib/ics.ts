import { Policy } from '../data/types';

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const YYYY = d.getUTCFullYear();
  const MM = String(d.getUTCMonth() + 1).padStart(2, '0');
  const DD = String(d.getUTCDate()).padStart(2, '0');
  return `${YYYY}${MM}${DD}`;
}

export function generateSingleEventICS(
  title: string,
  date: string,
  description: string
): string {
  const dt = formatDate(date);
  const uid = `${Date.now()}@yuno.local`;
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Yuno Demo//EN',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dt}T000000Z`,
    `DTSTART;VALUE=DATE:${dt}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadICS(filename: string, icsContent: string) {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function buildPolicyEventTitle(policy: Policy, dday: number) {
  return `[Yuno] ${policy.title} (D-${dday})`;
}

export function calcDDay(dateStr?: string) {
  if (!dateStr) return 0;
  const now = new Date();
  const d = new Date(dateStr);
  return Math.max(
    0,
    Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );
}

export function generateMultipleEventsICS(
  events: Array<{ title: string; date: string; description?: string }>
): string {
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Yuno Demo//EN',
    'CALSCALE:GREGORIAN',
  ];
  for (const e of events) {
    const dt = formatDate(e.date);
    const uid = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}@yuno.local`;
    lines.push('BEGIN:VEVENT');
    lines.push(`UID:${uid}`);
    lines.push(`DTSTAMP:${dt}T000000Z`);
    lines.push(`DTSTART;VALUE=DATE:${dt}`);
    lines.push(`SUMMARY:${e.title}`);
    if (e.description) lines.push(`DESCRIPTION:${e.description}`);
    lines.push('END:VEVENT');
  }
  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
