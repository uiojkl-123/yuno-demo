import React from 'react';
import { useYunoStore } from '../store/useYunoStore';
import { Profile } from '../data/types';

function deriveBands(age: number, region: string) {
  const region_code = region === '서울' ? '11' : '41';
  const age_band = age <= 18 ? '15-18' : age <= 24 ? '19-24' : '25-29';
  return { region_code, age_band };
}

export function ProfileForm() {
  const profile = useYunoStore((s) => s.profile);
  const setProfile = useYunoStore((s) => s.setProfile);
  const [form, setForm] = React.useState<Profile | null>(profile);

  React.useEffect(() => {
    if (!form)
      setForm({
        age: 22,
        region: '서울',
        education_level: '대학생',
        income_tier: '하위',
        employment_status: '학생',
        interests: ['장학금', '대외활동'],
        ...deriveBands(22, '서울'),
      });
  }, [form]);

  if (!form) return null;

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        setProfile(form);
      }}>
      <div className="grid grid-cols-2 gap-3">
        <label className="text-sm">
          <span className="text-xs text-gray-600">나이</span>
          <input
            type="number"
            className="mt-1 w-full rounded border px-2 py-1"
            value={form.age}
            onChange={(e) =>
              setForm({
                ...form,
                age: Number(e.target.value),
                ...deriveBands(Number(e.target.value), form.region),
              })
            }
          />
        </label>
        <label className="text-sm">
          <span className="text-xs text-gray-600">지역</span>
          <select
            className="mt-1 w-full rounded border px-2 py-1"
            value={form.region}
            onChange={(e) =>
              setForm({
                ...form,
                region: e.target.value,
                ...deriveBands(form.age, e.target.value),
              })
            }>
            <option>서울</option>
            <option>경기</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="text-xs text-gray-600">학력</span>
          <select
            className="mt-1 w-full rounded border px-2 py-1"
            value={form.education_level}
            onChange={(e) =>
              setForm({ ...form, education_level: e.target.value })
            }>
            <option>대학생</option>
            <option>고등학생</option>
            <option>졸업</option>
          </select>
        </label>
        <label className="text-sm">
          <span className="text-xs text-gray-600">소득</span>
          <select
            className="mt-1 w-full rounded border px-2 py-1"
            value={form.income_tier}
            onChange={(e) => setForm({ ...form, income_tier: e.target.value })}>
            <option>하위</option>
            <option>중위</option>
            <option>상위</option>
          </select>
        </label>
      </div>
      <div>
        <span className="text-xs text-gray-600">관심</span>
        <div className="mt-1 flex flex-wrap gap-2">
          {['장학금', '대외활동', '정부지원', '대회·연구', '대학생활'].map(
            (k) => {
              const on = form.interests.includes(k);
              return (
                <button
                  key={k}
                  type="button"
                  onClick={() =>
                    setForm({
                      ...form,
                      interests: on
                        ? form.interests.filter((x) => x !== k)
                        : [...form.interests, k],
                    })
                  }
                  className={`rounded-full border px-2 py-1 text-xs ${
                    on
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700'
                  }`}
                  aria-pressed={on}>
                  {k}
                </button>
              );
            }
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white">
          저장
        </button>
      </div>
    </form>
  );
}

export default ProfileForm;
