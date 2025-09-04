'use client';
import React from 'react';
import { api } from '../lib/mockApi';
import { useYunoStore } from '../store/useYunoStore';
import { Policy } from '../data/types';
import { finalScore } from '../lib/scoring';
import PolicyCard from '../components/PolicyCard';

export default function Home() {
  const [list, setList] = React.useState<Policy[]>([]);
  const profile = useYunoStore((s) => s.profile);
  const states = useYunoStore((s) => s.states);
  const addToast = useYunoStore((s) => s.addToast);
  const setState = useYunoStore((s) => s.setState);

  React.useEffect(() => {
    api
      .listPolicies({ sort: 'score' })
      .then(setList)
      .catch(() =>
        addToast({ message: '목록을 불러오지 못했어요', type: 'error' })
      );
  }, [profile]);

  const popular = React.useMemo(
    () =>
      [...list]
        .sort(
          (a, b) =>
            (b.metrics?.views || 0) +
            (b.metrics?.saves || 0) -
            ((a.metrics?.views || 0) + (a.metrics?.saves || 0))
        )
        .slice(0, 5),
    [list]
  );
  const urgent = React.useMemo(
    () =>
      [...list]
        .filter((p) => p.deadlineDate)
        .sort(
          (a, b) =>
            new Date(a.deadlineDate!).getTime() -
            new Date(b.deadlineDate!).getTime()
        )
        .slice(0, 5),
    [list]
  );
  const recommended = React.useMemo(
    () =>
      [...list]
        .sort((a, b) => finalScore(profile, b) - finalScore(profile, a))
        .slice(0, 5),
    [list, profile]
  );

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-lg font-semibold">오늘의 추천</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recommended.map((p) => (
            <PolicyCard
              key={p.id}
              policy={p}
              state={states[p.id]}
              onOpenSummary={() => {
                location.href = `/policy/${p.id}`;
              }}
              onSave={() => {
                setState(p.id, 'saved');
                addToast({ message: '저장했어요', type: 'success' });
              }}
            />
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold">인기 TOP5</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((p) => (
            <PolicyCard
              key={p.id}
              policy={p}
              state={states[p.id]}
              onOpenSummary={() => {
                location.href = `/policy/${p.id}`;
              }}
              onSave={() => {
                setState(p.id, 'saved');
                addToast({ message: '저장했어요', type: 'success' });
              }}
            />
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-lg font-semibold">마감 임박</h2>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {urgent.map((p) => (
            <PolicyCard
              key={p.id}
              policy={p}
              state={states[p.id]}
              onOpenSummary={() => {
                location.href = `/policy/${p.id}`;
              }}
              onSave={() => {
                setState(p.id, 'saved');
                addToast({ message: '저장했어요', type: 'success' });
              }}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
