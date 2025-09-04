'use client';

import React, { useEffect, useState } from 'react';
import { useYunoStore } from '../store/useYunoStore';
import { Profile } from '../data/types';

function deriveBands(age: number, region: string) {
  const region_code = region === '서울' ? '11' : '41';
  const age_band = age <= 18 ? '15-18' : age <= 24 ? '19-24' : '25-29';
  return { region_code, age_band };
}

export function OnboardingModal() {
  const profile = useYunoStore((s) => s.profile);
  const setProfile = useYunoStore((s) => s.setProfile);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Profile | null>(profile);

  useEffect(() => {
    if (!profile) setOpen(true);
  }, [profile]);

  useEffect(() => {
    if (!form) {
      setForm({
        age: 22,
        region: '서울',
        education_level: '대학생',
        income_tier: '하위',
        employment_status: '학생',
        interests: ['장학금', '대외활동'],
        ...deriveBands(22, '서울'),
      });
    }
  }, [form]);

  if (!open || !form) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="온보딩">
      <div className="w-full max-w-lg rounded-lg bg-white p-4 shadow-lg">
        <h3 className="text-lg font-semibold">Yuno 시작하기</h3>
        <p className="mt-1 text-sm text-gray-600">
          프로필을 간단히 설정하면 더 정확한 추천을 드려요.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="text-sm">
            <span className="text-xs text-gray-600">나이</span>
            <input
              type="number"
              value={form.age}
              onChange={(e) =>
                setForm({
                  ...form,
                  age: Number(e.target.value),
                  ...deriveBands(Number(e.target.value), form.region),
                })
              }
              className="mt-1 w-full rounded border px-2 py-1"
            />
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-600">지역</span>
            <select
              value={form.region}
              onChange={(e) =>
                setForm({
                  ...form,
                  region: e.target.value,
                  ...deriveBands(form.age, e.target.value),
                })
              }
              className="mt-1 w-full rounded border px-2 py-1">
              <option>서울</option>
              <option>경기</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-600">학력</span>
            <select
              value={form.education_level}
              onChange={(e) =>
                setForm({ ...form, education_level: e.target.value })
              }
              className="mt-1 w-full rounded border px-2 py-1">
              <option>대학생</option>
              <option>고등학생</option>
              <option>졸업</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="text-xs text-gray-600">소득</span>
            <select
              value={form.income_tier}
              onChange={(e) =>
                setForm({ ...form, income_tier: e.target.value })
              }
              className="mt-1 w-full rounded border px-2 py-1">
              <option>하위</option>
              <option>중위</option>
              <option>상위</option>
            </select>
          </label>
          <div className="col-span-2">
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
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="rounded-md border px-3 py-1.5 text-sm"
            onClick={() => setOpen(false)}>
            나중에
          </button>
          <button
            className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white"
            onClick={() => {
              setProfile(form);
              setOpen(false);
            }}>
            저장하고 시작하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default OnboardingModal;
