import React, { useState } from 'react';
import { SummaryJSON } from '../data/types';

export function SummarySheet({
  summary,
  sourceUrl,
  updatedAt,
}: {
  summary: SummaryJSON | null;
  sourceUrl: string;
  updatedAt?: string;
}) {
  const [mode, setMode] = useState<'plain' | 'verbatim'>(
    summary?.reading_level || 'plain'
  );
  if (!summary) {
    return (
      <div className="rounded-lg border bg-white p-4">
        <p className="text-sm text-gray-700">
          요약 데이터를 찾을 수 없습니다. 원문 공고를 확인해 주세요.
        </p>
        <a
          className="mt-2 inline-block rounded-md border px-2 py-1 text-sm hover:bg-gray-50"
          href={sourceUrl}
          target="_blank"
          rel="noreferrer">
          원문 보러가기
        </a>
      </div>
    );
  }
  const { summary_3lines, eligibility, benefits, how_to_apply } = summary;
  return (
    <section className="rounded-lg border bg-white p-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">AI 요약</h4>
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-600" htmlFor="mode">
            표시
          </label>
          <select
            id="mode"
            value={mode}
            onChange={(e) => setMode(e.target.value as 'plain' | 'verbatim')}
            className="rounded border px-2 py-1 text-xs">
            <option value="plain">쉬운 설명</option>
            <option value="verbatim">원문 인용</option>
          </select>
        </div>
      </div>
      <ul className="mt-3 list-disc pl-5 text-sm text-gray-800">
        {summary_3lines.map((l, i) => (
          <li key={i}>{l}</li>
        ))}
      </ul>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <div>
          <div className="text-xs font-semibold text-gray-500">자격</div>
          <p className="text-sm text-gray-800 whitespace-pre-line">
            {mode === 'plain' ? eligibility : eligibility}
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-500">혜택</div>
          <p className="text-sm text-gray-800 whitespace-pre-line">
            {mode === 'plain' ? benefits : benefits}
          </p>
        </div>
        <div>
          <div className="text-xs font-semibold text-gray-500">신청방법</div>
          <p className="text-sm text-gray-800 whitespace-pre-line">
            {mode === 'plain' ? how_to_apply : how_to_apply}
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>
          업데이트: {updatedAt ? new Date(updatedAt).toLocaleString() : '-'}
        </span>
        <a
          className="underline"
          href={sourceUrl}
          target="_blank"
          rel="noreferrer">
          원문 보기
        </a>
      </div>
    </section>
  );
}

export default SummarySheet;
