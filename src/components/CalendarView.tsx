import React from 'react';

export type CalendarEvent = {
  id: string;
  title: string;
  date: string;
  type: 'start' | 'deadline' | 'result';
};

function color(type: CalendarEvent['type']) {
  switch (type) {
    case 'start':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'deadline':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'result':
      return 'bg-green-100 text-green-700 border-green-200';
  }
}

export function CalendarView({ events }: { events: CalendarEvent[] }) {
  const byDate = events.reduce<Record<string, CalendarEvent[]>>((acc, e) => {
    acc[e.date] = acc[e.date] || [];
    acc[e.date].push(e);
    return acc;
  }, {});
  const days = Array.from({ length: 35 }).map((_, i) => i + 1);
  const today = new Date();
  const ym = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    '0'
  )}`;
  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((d) => {
        const dateStr = `${ym}-${String(d).padStart(2, '0')}`;
        const list = byDate[dateStr] || [];
        return (
          <div key={d} className="min-h-[90px] rounded border bg-white p-1">
            <div className="text-xs text-gray-500">{d}</div>
            <div className="mt-1 flex flex-col gap-1">
              {list.slice(0, 3).map((e) => (
                <span
                  key={e.id + e.type}
                  className={`truncate rounded border px-1 py-0.5 text-[10px] ${color(
                    e.type
                  )}`}
                  title={`${e.title}`}>
                  {e.type === 'deadline'
                    ? '⏰'
                    : e.type === 'start'
                    ? '🏁'
                    : '✅'}{' '}
                  {e.title}
                </span>
              ))}
              {list.length > 3 && (
                <span className="text-[10px] text-gray-400">
                  +{list.length - 3} 더보기
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default CalendarView;
