import React from 'react';
import { Policy, StateTag } from '../data/types';
import StatusPill from './StatusPill';

function dday(deadline?: string) {
  if (!deadline) return null;
  const now = new Date();
  const d = new Date(deadline);
  const diff = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

function ddayColor(n: number) {
  if (n <= 0) return 'bg-red-100 text-red-700';
  if (n <= 3) return 'bg-orange-100 text-orange-700';
  return 'bg-gray-100 text-gray-700';
}

export function PolicyCard({
  policy,
  state,
  onSave,
  onOpenSummary,
}: {
  policy: Policy;
  state?: StateTag;
  onSave: () => void;
  onOpenSummary: () => void;
}) {
  const dn = dday(policy.deadlineDate);
  return (
    <article
      className="group rounded-lg border bg-white p-4 shadow-sm focus-within:ring-2 focus-within:ring-blue-500"
      tabIndex={0}
      aria-label={`${policy.title} 카드`}>
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug line-clamp-2">
          {policy.title}
        </h3>
        <div className="flex items-center gap-2">
          {state && <StatusPill state={state} />}
          {typeof dn === 'number' && (
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${ddayColor(
                dn
              )}`}
              aria-label={`마감 D-${Math.max(0, dn)}`}>
              D-{Math.max(0, dn)}
            </span>
          )}
        </div>
      </div>
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">
        대상: {policy.eligibilityRaw}
      </p>
      <p className="mt-1 text-sm text-gray-600 line-clamp-2">
        혜택: {policy.benefitsRaw}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          onClick={onOpenSummary}
          className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
          aria-label="요약 보기">
          요약
        </button>
        <button
          onClick={onSave}
          className="rounded-md bg-blue-600 px-2 py-1 text-sm text-white hover:bg-blue-700"
          aria-label="저장">
          저장
        </button>
        <a
          href={policy.applicationUrl}
          target="_blank"
          rel="noreferrer"
          className="rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
          aria-label="신청하기">
          신청하기
        </a>
      </div>
    </article>
  );
}

export default PolicyCard;
