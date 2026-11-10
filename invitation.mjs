export const eventList = [
  { id: 'shubh-lagn', title: 'Shubh Lagn', start: '2026-12-01T11:00:00+05:30', location: '', description: 'The auspicious wedding ceremony of Abhishek Sharma and Megha Sharma.' },
  { id: 'baraat', title: 'Baraat', start: '2026-12-01T19:00:00+05:30', location: 'Kanak Preet Garden, Near TDI City, Opposite Ganpati World, Fatehabad Road, Agra', description: 'The Baraat departs from the family residence for Kanak Preet Garden at 6:00 PM.' },
  { id: 'pritibhoj', title: 'Pritibhoj', start: '2026-12-01T19:00:00+05:30', location: 'Kanak Preet Garden, Near TDI City, Opposite Ganpati World, Fatehabad Road, Agra', description: 'Wedding feast and reception celebrating Abhishek and Megha.' },
  { id: 'vadhu-aagaman', title: 'Vadhu Aagaman', start: '2026-12-02', location: '', description: 'Arrival of the bride. Morning hours; an exact time has not been specified.' },
];

const escapeText = (value) => String(value).replaceAll('\\', '\\\\').replace(/\r?\n/g, '\\n').replaceAll(';', '\\;').replaceAll(',', '\\,');

function foldLine(line) {
  const encoder = new TextEncoder();
  let current = '';
  const lines = [];
  for (const character of line) {
    if (encoder.encode(current + character).length > 75) {
      lines.push(current);
      current = ' ';
    }
    current += character;
  }
  return [...lines, current].join('\r\n');
}

function calendarDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) throw new Error('Invalid calendar date');
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    if (date.toISOString().slice(0, 10) !== value) throw new Error('Invalid calendar date');
    return `;VALUE=DATE:${value.replaceAll('-', '')}`;
  }
  return `:${date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')}`;
}

export function createCalendar(events) {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Abhishek and Megha//Wedding Invitation//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH'];
  for (const event of events) {
    lines.push('BEGIN:VEVENT', `UID:${escapeText(event.id)}@abhishek-megha.invitation`, 'DTSTAMP:20261110T000000Z', `DTSTART${calendarDate(event.start)}`);
    if (event.end) lines.push(`DTEND${calendarDate(event.end)}`);
    lines.push(`SUMMARY:${escapeText(event.title)}`);
    if (event.location) lines.push(`LOCATION:${escapeText(event.location)}`);
    lines.push(`DESCRIPTION:${escapeText(event.description)}`, 'END:VEVENT');
  }
  return [...lines, 'END:VCALENDAR'].map(foldLine).join('\r\n') + '\r\n';
}

export function getCountdown(date, now) {
  const difference = new Date(date).getTime() - now.getTime();
  if (!Number.isFinite(difference)) throw new Error('Invalid countdown date');
  const remaining = Math.max(0, Math.floor(difference / 1000));
  return {
    days: Math.floor(remaining / 86400),
    hours: Math.floor(remaining % 86400 / 3600),
    minutes: Math.floor(remaining % 3600 / 60),
    seconds: remaining % 60,
    ended: difference <= 0,
  };
}