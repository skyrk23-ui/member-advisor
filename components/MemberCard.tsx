'use client';

import { useRouter } from 'next/navigation';
import { Member } from '@/lib/types';
import { deleteMember } from '@/lib/storage';

interface Props {
  member: Member;
  onDelete: () => void;
}

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

function getInitials(name: string): string {
  return name.slice(0, 2);
}

function getAvatarColor(id: string): string {
  const colors = [
    'bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-rose-500',
    'bg-orange-500', 'bg-amber-500', 'bg-teal-500', 'bg-cyan-500',
  ];
  const idx = id.charCodeAt(0) % colors.length;
  return colors[idx];
}

export default function MemberCard({ member, onDelete }: Props) {
  const router = useRouter();

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    if (confirm(`${member.name} を削除しますか？`)) {
      deleteMember(member.id);
      onDelete();
    }
  }

  function handleEdit(e: React.MouseEvent) {
    e.stopPropagation();
    router.push(`/members/${member.id}/edit`);
  }

  return (
    <div
      onClick={() => router.push(`/members/${member.id}`)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 ${getAvatarColor(member.id)}`}>
          {getInitials(member.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-semibold text-gray-900 truncate">{member.name}</h3>
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleEdit}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                title="編集"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition"
                title="削除"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          {member.role && (
            <p className="text-sm text-gray-500 mt-0.5">{member.role}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {member.mbti && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${MBTI_COLORS[member.mbti] ?? 'bg-gray-100 text-gray-600'}`}>
                {member.mbti}
              </span>
            )}
            {member.birthday && (
              <span className="text-xs text-gray-400">
                {new Date(member.birthday).toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' })}生まれ
              </span>
            )}
          </div>
          {member.personality && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{member.personality}</p>
          )}
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-50">
        <span className="text-xs text-indigo-500 font-medium group-hover:text-indigo-600 transition">
          チャットで相談する →
        </span>
      </div>
    </div>
  );
}
