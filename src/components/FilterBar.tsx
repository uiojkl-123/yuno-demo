import React from 'react';

export interface FilterValue {
  keyword?: string;
  category?: string;
  region?: string;
  sort?: 'score' | 'deadline' | 'latest' | 'popular';
}

export function FilterBar({
  value,
  onChange,
}: {
  value: FilterValue;
  onChange: (v: FilterValue) => void;
}) {
  return (
    <div className="flex flex-wrap items-end gap-2 rounded-md border bg-white p-3">
      <div className="flex-1 min-w-[180px]">
        <label className="block text-xs text-gray-600" htmlFor="keyword">
          키워드
        </label>
        <input
          id="keyword"
          value={value.keyword || ''}
          onChange={(e) => onChange({ ...value, keyword: e.target.value })}
          className="mt-1 w-full rounded border px-2 py-1 text-sm"
          placeholder="예: 장학금"
        />
      </div>
      <div>
        <label className="block text-xs text-gray-600" htmlFor="category">
          카테고리
        </label>
        <select
          id="category"
          value={value.category || ''}
          onChange={(e) =>
            onChange({ ...value, category: e.target.value || undefined })
          }
          className="mt-1 rounded border px-2 py-1 text-sm">
          <option value="">전체</option>
          <option>장학금</option>
          <option>정부지원</option>
          <option>대외활동</option>
          <option>대회·연구</option>
          <option>대학생활</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-600" htmlFor="region">
          지역
        </label>
        <select
          id="region"
          value={value.region || ''}
          onChange={(e) =>
            onChange({ ...value, region: e.target.value || undefined })
          }
          className="mt-1 rounded border px-2 py-1 text-sm">
          <option value="">전체</option>
          <option value="11">서울</option>
          <option value="26">부산</option>
          <option value="27">대구</option>
          <option value="28">인천</option>
          <option value="41">경기</option>
          <option value="47">경북</option>
          <option value="48">경남</option>
        </select>
      </div>
      <div>
        <label className="block text-xs text-gray-600" htmlFor="sort">
          정렬
        </label>
        <select
          id="sort"
          value={value.sort || 'score'}
          onChange={(e) =>
            onChange({
              ...value,
              sort: e.target.value as
                | 'score'
                | 'deadline'
                | 'latest'
                | 'popular',
            })
          }
          className="mt-1 rounded border px-2 py-1 text-sm">
          <option value="score">관련도</option>
          <option value="deadline">마감임박</option>
          <option value="latest">최신</option>
          <option value="popular">인기</option>
        </select>
      </div>
    </div>
  );
}

export default FilterBar;
