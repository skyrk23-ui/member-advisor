'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Member } from '@/lib/types';
import { getMember } from '@/lib/storage';
import ChatInterface from '@/components/ChatInterface';

const MBTI_COLORS: Record<string, string> = {
  INTJ: 'bg-purple-100 text-purple-700',
  INTP: 'bg-blue-100 text-blue-700',
  ENTJ: 'bg-red-100 text-red-700',
  ENTP: 'bg-orange-100 text-orange-700',
  INFJ: 'bg-green-100 text-green-700',
  INFP: 'bg-teal-100 text-teal-700',
  ENFJ: 'bg-pink-100 text-pink-700',
  ENFP: 'bg-yellow-100 text-yellow-700',
  ISTJ: 'bg-gray-100 text-gray-700',
  ISFJ: 'bg-lime-100 text-lime-700',
  ESTJ: 'bg-amber-100 text-amber-700',
  ESFJ: 'bg-rose-100 text-rose-700',
  ISTP: 'bg-cyan-100 text-cyan-700',
  ISFP: 'bg-emerald-100 text-emerald-700',
  ESTP: 'bg-indigo-100 text-indigo-700',
  ESFP: 'bg-violet-100 text-violet-700',
};

function getAvatarColor(id: string): string {
  const colors = [
    'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-rose-500',
    'bg-orange-500', 'bg-amber-500', 'bg-teal-500', 'bg-cyan-500',
  ];
  return colors[id.charCodeAt(0) % colors.length];
}

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [member, setMember] = useState<Member | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const m = getMember(id);
    if (!m) { router.push('/'); return; }
    setMember(m);
  }, [id, router]);

  if (!member) return null;

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 flex-shrink-0">
        <div className="px-4 py-3 flex items-center gap-3">
          <Link href="/" className="text-gray-400 hover:text-gray-600 transition flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>

          {/* Avatar */}
          <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${getAvatarColor(member.id)}`}>
            {member.name.slice(0, 2)}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-gray-900 truncate">{member.name}</h1>
            {member.role && <p className="text-xs text-gray-500">{member.role}</p>}
          </div>

          {/* Profile button */}
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition"
            title="プロフィール"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>

          <Link
            href={`/members/${member.id}/edit`}
            className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition"
            title="編集"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </Link>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebarOpen && (
          <aside className="w-72 bg-white border-r border-gray-100 flex-shrink-0 overflow-y-auto p-4">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">メンバー情報</h2>
            <div className="space-y-3 text-sm">
              {member.role && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">役職</p>
                  <p className="text-gray-800">{member.role}</p>
                </div>
              )}
              {member.mbti && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">MBTI</p>
                  <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${MBTI_COLORS[member.mbti] ?? 'bg-gray-100 text-gray-600'}`}>
                    {member.mbti}
                  </span>
                </div>
              )}
              {member.birthday && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">誕生日</p>
                  <p className="text-gray-800">{new Date(member.birthday).toLocaleDateString('ja-JP')}</p>
                </div>
              )}
              {member.personality && (
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">性格・特徴</p>
                  <p className="text-gray-800 whitespace-pre-wrap">{member.personality}</p>
                </div>
              )}
            </div>
          </aside>
        )}

        {/* Chat */}
        <div className="flex-1 overflow-hidden bg-gray-50">
          <ChatInterface member={member} />
        </div>
      </div>
    </div>
  );
}
