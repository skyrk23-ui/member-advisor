'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Member } from '@/lib/types';
import { getMembers } from '@/lib/storage';
import MemberCard from '@/components/MemberCard';

const MBTI_COLORS: Record<string, string> = {
  INTJ: 'bg-purple-500', INTP: 'bg-blue-500', ENTJ: 'bg-red-500', ENTP: 'bg-orange-500',
  INFJ: 'bg-green-500', INFP: 'bg-teal-500', ENFJ: 'bg-pink-500', ENFP: 'bg-yellow-500',
  ISTJ: 'bg-gray-500', ISFJ: 'bg-lime-500', ESTJ: 'bg-amber-500', ESFJ: 'bg-rose-500',
  ISTP: 'bg-cyan-500', ISFP: 'bg-emerald-500', ESTP: 'bg-indigo-500', ESFP: 'bg-violet-500',
};

function TeamStats({ members }: { members: Member[] }) {
  const withMbti = members.filter((m) => m.mbti);
  if (withMbti.length === 0) return null;

  const total = withMbti.length;

  const dims = [
    { label: 'E / I', left: 'E（外向）', right: 'I（内向）', leftCount: withMbti.filter((m) => m.mbti.startsWith('E')).length },
    { label: 'N / S', left: 'N（直感）', right: 'S（感覚）', leftCount: withMbti.filter((m) => m.mbti[1] === 'N').length },
    { label: 'T / F', left: 'T（思考）', right: 'F（感情）', leftCount: withMbti.filter((m) => m.mbti[2] === 'T').length },
    { label: 'J / P', left: 'J（判断）', right: 'P（知覚）', leftCount: withMbti.filter((m) => m.mbti[3] === 'J').length },
  ];

  const typeCounts = withMbti.reduce<Record<string, number>>((acc, m) => {
    acc[m.mbti] = (acc[m.mbti] ?? 0) + 1;
    return acc;
  }, {});
  const sortedTypes = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);
  const maxCount = sortedTypes[0]?.[1] ?? 1;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6">
      <h2 className="text-sm font-semibold text-gray-700 mb-4">チーム構成分析</h2>

      {/* Dimension bars */}
      <div className="space-y-3 mb-5">
        {dims.map((d) => {
          const leftPct = Math.round((d.leftCount / total) * 100);
          const rightPct = 100 - leftPct;
          return (
            <div key={d.label}>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{d.left} <span className="font-semibold text-gray-700">{d.leftCount}人</span></span>
                <span><span className="font-semibold text-gray-700">{total - d.leftCount}人</span> {d.right}</span>
              </div>
              <div className="flex h-3 rounded-full overflow-hidden bg-gray-100">
                {leftPct > 0 && (
                  <div className="bg-indigo-400 transition-all" style={{ width: `${leftPct}%` }} />
                )}
                {rightPct > 0 && (
                  <div className="bg-gray-300 transition-all" style={{ width: `${rightPct}%` }} />
                )}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                <span>{leftPct}%</span>
                <span>{rightPct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Type distribution */}
      <div>
        <p className="text-xs text-gray-400 mb-2">タイプ別分布</p>
        <div className="space-y-1.5">
          {sortedTypes.map(([type, count]) => (
            <div key={type} className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-600 w-10">{type}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${MBTI_COLORS[type] ?? 'bg-gray-400'}`}
                  style={{ width: `${(count / maxCount) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-8 text-right">{count}人</span>
            </div>
          ))}
        </div>
      </div>

      {withMbti.length < members.length && (
        <p className="text-xs text-gray-400 mt-3">※ MBTI未設定 {members.length - withMbti.length}人 を除く</p>
      )}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);

  function load() {
    setMembers(getMembers().sort((a, b) => a.name.localeCompare(b.name, 'ja')));
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">メンバー相談ボット</h1>
            <p className="text-xs text-gray-500 mt-0.5">メンバーへの声の掛け方をAIに相談</p>
          </div>
          <button
            onClick={() => router.push('/members/new')}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 text-sm font-medium transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            メンバー追加
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-700 mb-2">メンバーがいません</h2>
            <p className="text-sm text-gray-500 mb-6">まずメンバーを追加して、声の掛け方を相談しましょう</p>
            <button
              onClick={() => router.push('/members/new')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-3 text-sm font-medium transition"
            >
              最初のメンバーを追加する
            </button>
          </div>
        ) : (
          <>
            <TeamStats members={members} />
            <p className="text-sm text-gray-500 mb-4">{members.length}人のメンバー</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {members.map((member) => (
                <MemberCard key={member.id} member={member} onDelete={load} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
