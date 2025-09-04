'use client';
import React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '../../lib/mockApi';
import { Policy } from '../../data/types';
import { useYunoStore } from '../../store/useYunoStore';
import PolicyCard from '../../components/PolicyCard';
import FilterBar, { FilterValue } from '../../components/FilterBar';

function paramsToFilter(sp: URLSearchParams): FilterValue {
  return {
    keyword: sp.get('q') || undefined,
    category: sp.get('cat') || undefined,
    region: sp.get('rg') || undefined,
    sort:
      (sp.get('sort') as 'score' | 'deadline' | 'latest' | 'popular') ||
      'score',
  };
}

export default function ExplorePage() {
  const sp = useSearchParams();
  const router = useRouter();
  const [list, setList] = React.useState<Policy[]>([]);
  const states = useYunoStore((s) => s.states);
  const addToast = useYunoStore((s) => s.addToast);
  const setState = useYunoStore((s) => s.setState);

  const value = React.useMemo(() => paramsToFilter(sp), [sp]);

  React.useEffect(() => {
    api
      .listPolicies({
        keyword: value.keyword,
        category: value.category,
        region: value.region,
        sort: value.sort || 'score',
      })
      .then(setList)
      .catch(() =>
        addToast({ message: '목록을 불러오지 못했어요', type: 'error' })
      );
  }, [value.keyword, value.category, value.region, value.sort]);

  const onChange = (v: FilterValue) => {
    const next = new URLSearchParams();
    if (v.keyword) next.set('q', v.keyword);
    if (v.category) next.set('cat', v.category);
    if (v.region) next.set('rg', v.region);
    if (v.sort) next.set('sort', v.sort);
    router.replace(`/explore?${next.toString()}`);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">탐색</h1>
      <FilterBar value={value} onChange={onChange} />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
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
    </div>
  );
}
