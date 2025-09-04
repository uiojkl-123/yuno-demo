'use client';
import React from 'react';
import { useYunoStore } from '../../store/useYunoStore';
import { api } from '../../lib/mockApi';
import { Policy } from '../../data/types';
import CalendarView, { CalendarEvent } from '../../components/CalendarView';
import {
  buildPolicyEventTitle,
  calcDDay,
  downloadICS,
  generateMultipleEventsICS,
} from '../../lib/ics';

export default function CalendarPage() {
  const states = useYunoStore((s) => s.states);
  const addToast = useYunoStore((s) => s.addToast);
  const [list, setList] = React.useState<Policy[]>([]);

  React.useEffect(() => {
    api
      .listPolicies({ sort: 'score' })
      .then(setList)
      .catch(() =>
        addToast({ message: '목록을 불러오지 못했어요', type: 'error' })
      );
  }, []);

  const savedIds = Object.keys(states);
  const savedPolicies = list.filter((p) => savedIds.includes(p.id));
  const events: CalendarEvent[] = [];
  for (const p of savedPolicies) {
    if (p.startDate)
      events.push({
        id: p.id,
        title: `${p.title}`,
        date: p.startDate,
        type: 'start',
      });
    if (p.deadlineDate)
      events.push({
        id: p.id,
        title: `${p.title}`,
        date: p.deadlineDate,
        type: 'deadline',
      });
    if (p.resultDate)
      events.push({
        id: p.id,
        title: `${p.title}`,
        date: p.resultDate,
        type: 'result',
      });
  }

  const onExportICS = () => {
    const ics = generateMultipleEventsICS(
      events
        .filter((e) => e.type === 'deadline')
        .map((e) => ({ title: e.title, date: e.date, description: e.title }))
    );
    downloadICS('yuno-events.ics', ics);
    addToast({ message: '전체 캘린더를 내려받았어요', type: 'success' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">달력</h1>
        <button
          onClick={onExportICS}
          className="rounded-md border px-3 py-1.5 text-sm">
          ICS 내보내기
        </button>
      </div>
      <CalendarView events={events} />
      <div>
        <h2 className="mt-6 text-sm font-semibold text-gray-600">리스트</h2>
        <ul className="mt-2 space-y-1 text-sm">
          {events.map((e) => (
            <li
              key={e.id + e.type}
              className="flex items-center justify-between rounded border bg-white px-2 py-1">
              <span>
                {e.title} - {e.date} ({e.type})
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
