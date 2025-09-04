import React from 'react';
import { StateTag } from '../data/types';

const colorMap: Record<StateTag, string> = {
  saved: 'bg-gray-100 text-gray-700 border-gray-300',
  applying: 'bg-blue-100 text-blue-700 border-blue-300',
  review: 'bg-amber-100 text-amber-700 border-amber-300',
  result: 'bg-green-100 text-green-700 border-green-300',
};

export function StatusPill({ state }: { state: StateTag }) {
  const label: Record<StateTag, string> = {
    saved: '저장됨',
    applying: '신청중',
    review: '심사중',
    result: '결과확인',
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${colorMap[state]}`}
      aria-label={`상태: ${label[state]}`}>
      {label[state]}
    </span>
  );
}

export default StatusPill;
