'use client';
import React from 'react';
import { useParams } from 'next/navigation';
import { api } from '../../../lib/mockApi';
import { Policy, SummaryJSON, StateTag } from '../../../data/types';
import SummarySheet from '../../../components/SummarySheet';
import StatusPill from '../../../components/StatusPill';
import { useYunoStore } from '../../../store/useYunoStore';
import {
  buildPolicyEventTitle,
  calcDDay,
  downloadICS,
  generateSingleEventICS,
} from '../../../lib/ics';

export default function PolicyDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id as string;
  const [policy, setPolicy] = React.useState<Policy | null>(null);
  const [summary, setSummary] = React.useState<SummaryJSON | null>(null);
  const states = useYunoStore((s) => s.states);
  const setState = useYunoStore((s) => s.setState);
  const addToast = useYunoStore((s) => s.addToast);

  React.useEffect(() => {
    api
      .getPolicy(id)
      .then((p) => setPolicy(p || null))
      .catch(() =>
        addToast({ message: '상세를 불러오지 못했어요', type: 'error' })
      );
    api
      .getSummary(id)
      .then((s) => setSummary(s || null))
      .catch(() => setSummary(null));
  }, [id]);

  if (!policy) return <div>로딩중...</div>;

  const dday = calcDDay(policy.deadlineDate);
  const onICS = () => {
    if (!policy.deadlineDate)
      return addToast({ message: '마감일이 없어요', type: 'error' });
    const ics = generateSingleEventICS(
      buildPolicyEventTitle(policy, dday),
      policy.deadlineDate,
      policy.title
    );
    downloadICS(`${policy.id}.ics`, ics);
    addToast({ message: '캘린더 파일을 내려받았어요', type: 'success' });
  };

  const state = states[id] as StateTag | undefined;

  return (
    <div className="space-y-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{policy.title}</h1>
          <div className="mt-1 text-sm text-gray-600">
            대상: {policy.eligibilityRaw}
          </div>
          <div className="mt-1 text-sm text-gray-600">
            혜택: {policy.benefitsRaw}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {state && <StatusPill state={state} />}
          {policy.deadlineDate && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
              D-{dday}
            </span>
          )}
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <a
          href={policy.applicationUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white">
          신청하기
        </a>
        <button
          onClick={onICS}
          className="rounded-md border px-3 py-1.5 text-sm">
          캘린더에 추가
        </button>
        <select
          value={state || ''}
          onChange={(e) =>
            setState(id, (e.target.value || 'saved') as StateTag)
          }
          className="rounded-md border px-2 py-1 text-sm"
          aria-label="상태 변경">
          <option value="">상태 변경</option>
          <option value="saved">저장</option>
          <option value="applying">신청중</option>
          <option value="review">심사중</option>
          <option value="result">결과</option>
        </select>
      </div>

      <SummarySheet
        summary={summary}
        sourceUrl={policy.sourceUrl}
        updatedAt={policy.updatedAt}
      />
    </div>
  );
}
