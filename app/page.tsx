'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Member } from '@/lib/types';
import { getMembers } from '@/lib/storage';
import MemberCard from '@/components/MemberCard';

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
